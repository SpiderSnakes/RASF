// =============================================================================
// API Route - Duplication de semaine de menus
// POST /api/menus/duplicate - Dupliquer les menus d'une semaine vers une autre
// =============================================================================

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, requireGestionnaireOrAdmin, parseBody } from "@/lib/api-utils";
import { parseISO, addDays, startOfDay } from "date-fns";

interface DuplicateBody {
  sourceWeekStart: string; // Format YYYY-MM-DD (lundi de la semaine source)
  targetWeekStart: string; // Format YYYY-MM-DD (lundi de la semaine cible)
  overwrite?: boolean;     // Si true, écrase les menus existants
}

export async function POST(request: NextRequest) {
  const { session, error } = await requireGestionnaireOrAdmin();
  if (error) return error;

  const body = await parseBody<DuplicateBody>(request);
  if (!body) {
    return errorResponse("Corps de requête invalide");
  }

  const { sourceWeekStart, targetWeekStart, overwrite = false } = body;

  // Validation
  if (!sourceWeekStart || !targetWeekStart) {
    return errorResponse("Les dates de début de semaine sont requises");
  }

  const sourceStart = startOfDay(parseISO(sourceWeekStart));
  const targetStart = startOfDay(parseISO(targetWeekStart));

  // Récupérer les menus de la semaine source (5 jours)
  const sourceMenus = await prisma.menu.findMany({
    where: {
      date: {
        gte: sourceStart,
        lte: addDays(sourceStart, 4),
      },
    },
    include: {
      options: true,
    },
  });

  if (sourceMenus.length === 0) {
    return errorResponse("Aucun menu trouvé pour la semaine source");
  }

  // Calculer le décalage en jours entre les deux semaines
  const daysDiff = Math.round(
    (targetStart.getTime() - sourceStart.getTime()) / (1000 * 60 * 60 * 24)
  );

  let created = 0;
  let skipped = 0;

  for (const sourceMenu of sourceMenus) {
    // Calculer la nouvelle date
    const targetDate = addDays(sourceMenu.date, daysDiff);

    // Vérifier si un menu existe déjà pour cette date
    const existingMenu = await prisma.menu.findUnique({
      where: { date: targetDate },
    });

    if (existingMenu) {
      if (overwrite) {
        // Supprimer l'ancien menu
        await prisma.menu.delete({
          where: { id: existingMenu.id },
        });
      } else {
        skipped++;
        continue;
      }
    }

    // Créer le nouveau menu avec ses options
    await prisma.menu.create({
      data: {
        date: targetDate,
        sideDishes: sourceMenu.sideDishes,
        notes: sourceMenu.notes,
        isPublished: false, // Les menus dupliqués sont en brouillon par défaut
        options: {
          create: sourceMenu.options.map((option) => ({
            courseType: option.courseType,
            name: option.name,
            description: option.description,
            maxCapacity: option.maxCapacity,
            sortOrder: option.sortOrder,
          })),
        },
      },
    });

    created++;
  }

  // Log de l'action
  await prisma.auditLog.create({
    data: {
      performedById: session!.user.id,
      action: "MENU_CREATED",
      entityType: "Menu",
      details: {
        action: "duplicate_week",
        sourceWeekStart,
        targetWeekStart,
        created,
        skipped,
        overwrite,
      },
    },
  });

  return successResponse(
    { created, skipped },
    `${created} menu(s) créé(s), ${skipped} ignoré(s)`
  );
}

