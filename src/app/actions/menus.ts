 "use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { CourseType } from "@prisma/client";
import { startOfDay, parseISO, addDays } from "date-fns";

type MenuOptionInput = {
  id?: string;
  courseType: CourseType;
  name: string;
  description?: string | null;
  maxCapacity?: number | null;
  sortOrder?: number;
};

type UpsertMenuInput = {
  menuId?: string;
  date: string; // ISO yyyy-MM-dd
  sideDishes?: string | null;
  notes?: string | null;
  isPublished?: boolean;
  options: MenuOptionInput[];
};

const MENU_PATHS_TO_REVALIDATE = ["/gestion/menus", "/dashboard"];

function normalizeOptions(options: MenuOptionInput[]) {
  return options
    .filter((o) => o.name.trim())
    .map((o, index) => ({
      id: o.id,
      courseType: o.courseType,
      name: o.name.trim(),
      description: o.description?.trim() || null,
      maxCapacity: o.maxCapacity ?? null,
      sortOrder: o.sortOrder ?? index,
    }));
}

async function revalidateMenus() {
  for (const path of MENU_PATHS_TO_REVALIDATE) {
    revalidatePath(path);
  }
}

export async function upsertMenuAction(input: UpsertMenuInput) {
  const { menuId, date, sideDishes, notes, isPublished = false, options } = input;

  const parsedDate = startOfDay(parseISO(date));
  const normalizedOptions = normalizeOptions(options);

  if (normalizedOptions.length === 0) {
    throw new Error("Au moins une option de menu est requise");
  }
  if (!normalizedOptions.some((o) => o.courseType === CourseType.MAIN)) {
    throw new Error("Au moins un plat principal est requis");
  }

  if (menuId) {
    // Mise à jour
    const existing = await prisma.menu.findUnique({
      where: { id: menuId },
      include: { options: true },
    });
    if (!existing) throw new Error("Menu introuvable");

    // Ids à supprimer
    const keepIds = normalizedOptions.filter((o) => o.id).map((o) => o.id!) ;
    const toDelete = existing.options
      .filter((o) => !keepIds.includes(o.id))
      .map((o) => o.id);

    await prisma.$transaction(async (tx) => {
      if (toDelete.length > 0) {
        await tx.menuOption.deleteMany({ where: { id: { in: toDelete } } });
      }

      // Upsert options
      for (const opt of normalizedOptions) {
        if (opt.id) {
          await tx.menuOption.update({
            where: { id: opt.id },
            data: {
              courseType: opt.courseType,
              name: opt.name,
              description: opt.description,
              maxCapacity: opt.maxCapacity,
              sortOrder: opt.sortOrder,
            },
          });
        } else {
          await tx.menuOption.create({
            data: {
              menuId,
              courseType: opt.courseType,
              name: opt.name,
              description: opt.description,
              maxCapacity: opt.maxCapacity,
              sortOrder: opt.sortOrder ?? 0,
            },
          });
        }
      }

      await tx.menu.update({
        where: { id: menuId },
        data: {
          date: parsedDate,
          sideDishes: sideDishes?.trim() || null,
          notes: notes?.trim() || null,
          isPublished,
        },
      });
    });
  } else {
    // Création
    const existingDateMenu = await prisma.menu.findUnique({
      where: { date: parsedDate },
    });
    if (existingDateMenu) throw new Error("Un menu existe déjà pour cette date");

    await prisma.menu.create({
      data: {
        date: parsedDate,
        sideDishes: sideDishes?.trim() || null,
        notes: notes?.trim() || null,
        isPublished,
        options: {
          create: normalizedOptions.map((opt, index) => ({
            courseType: opt.courseType,
            name: opt.name,
            description: opt.description,
            maxCapacity: opt.maxCapacity,
            sortOrder: opt.sortOrder ?? index,
          })),
        },
      },
    });
  }

  await revalidateMenus();
  return { success: true };
}

export async function deleteMenuAction(menuId: string) {
  await prisma.menu.delete({ where: { id: menuId } });
  await revalidateMenus();
  return { success: true };
}

export async function togglePublishMenuAction(menuId: string, publish: boolean) {
  await prisma.menu.update({
    where: { id: menuId },
    data: { isPublished: publish },
  });
  await revalidateMenus();
  return { success: true };
}

export async function duplicateWeekAction(opts: {
  sourceWeekStart: string; // yyyy-MM-dd
  targetWeekStart: string; // yyyy-MM-dd
  overwrite?: boolean;
}) {
  const sourceStart = startOfDay(parseISO(opts.sourceWeekStart));
  const targetStart = startOfDay(parseISO(opts.targetWeekStart));
  const overwrite = opts.overwrite ?? false;

  const sourceMenus = await prisma.menu.findMany({
    where: {
      date: {
        gte: sourceStart,
        lte: addDays(sourceStart, 4),
      },
    },
    include: { options: true },
  });

  let created = 0;
  let skipped = 0;

  for (const src of sourceMenus) {
    const targetDate = addDays(targetStart, src.date.getDay() === 0 ? 0 : src.date.getDay() - 1);
    const existing = await prisma.menu.findUnique({ where: { date: targetDate } });
    if (existing && !overwrite) {
      skipped++;
      continue;
    }
    if (existing && overwrite) {
      await prisma.menu.delete({ where: { id: existing.id } });
    }
    await prisma.menu.create({
      data: {
        date: targetDate,
        sideDishes: src.sideDishes,
        notes: src.notes,
        isPublished: false,
        options: {
          create: src.options.map((o) => ({
            courseType: o.courseType,
            name: o.name,
            description: o.description,
            maxCapacity: o.maxCapacity,
            sortOrder: o.sortOrder,
          })),
        },
      },
    });
    created++;
  }

  await revalidateMenus();
  return { success: true, created, skipped };
}

