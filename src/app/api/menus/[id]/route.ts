// =============================================================================
// API Routes - Menu par ID
// GET /api/menus/[id] - Détails d'un menu
// PATCH /api/menus/[id] - Modifier un menu
// DELETE /api/menus/[id] - Supprimer un menu
// =============================================================================

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  requireGestionnaireOrAdmin,
  parseBody,
} from "@/lib/api-utils";
import { CourseType } from "@prisma/client";

// Forcer la génération dynamique pour refléter immédiatement les modifications
export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// =============================================================================
// GET - Détails d'un menu
// =============================================================================

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  const menu = await prisma.menu.findUnique({
    where: { id },
    include: {
      options: {
        orderBy: [{ courseType: "asc" }, { sortOrder: "asc" }],
        include: {
          _count: {
            select: {
              reservationsAsMain: true,
              reservationsAsStarter: true,
              reservationsAsDessert: true,
            },
          },
        },
      },
    },
  });

  if (!menu) {
    return notFoundResponse("Menu non trouvé");
  }

  // Grouper les options
  const menuWithGroups = {
    ...menu,
    starters: menu.options.filter((o) => o.courseType === CourseType.STARTER),
    mains: menu.options.filter((o) => o.courseType === CourseType.MAIN),
    desserts: menu.options.filter((o) => o.courseType === CourseType.DESSERT),
  };

  return successResponse(menuWithGroups);
}

// =============================================================================
// PATCH - Modifier un menu
// =============================================================================

interface UpdateMenuOptionInput {
  id?: string; // Si présent, mise à jour ; sinon, création
  courseType: CourseType;
  name: string;
  description?: string;
  maxCapacity?: number;
  sortOrder?: number;
}

interface UpdateMenuBody {
  sideDishes?: string;
  notes?: string;
  isPublished?: boolean;
  options?: UpdateMenuOptionInput[];
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { session, error } = await requireGestionnaireOrAdmin();
  if (error) return error;

  const { id } = await params;
  const body = await parseBody<UpdateMenuBody>(request);

  if (!body) {
    return errorResponse("Corps de requête invalide");
  }

  // Vérifier que le menu existe
  const existingMenu = await prisma.menu.findUnique({
    where: { id },
    include: { options: true },
  });

  if (!existingMenu) {
    return notFoundResponse("Menu non trouvé");
  }

  // Si options fournies, gérer les mises à jour
  if (body.options) {
    // Vérifier qu'il y a au moins un plat principal
    const hasMain = body.options.some((o) => o.courseType === CourseType.MAIN);
    if (!hasMain) {
      return errorResponse("Au moins un plat principal est requis");
    }

    // Identifier les options à supprimer
    const newOptionIds = body.options.filter((o) => o.id).map((o) => o.id);
    const optionsToDelete = existingMenu.options
      .filter((o) => !newOptionIds.includes(o.id))
      .map((o) => o.id);

    // Vérifier que les options à supprimer n'ont pas de réservations (pour les plats principaux)
    for (const optionId of optionsToDelete) {
      const option = existingMenu.options.find((o) => o.id === optionId);
      if (option?.courseType === CourseType.MAIN) {
        const reservationCount = await prisma.reservation.count({
          where: { mainOptionId: optionId },
        });
        if (reservationCount > 0) {
          return errorResponse(
            `Impossible de supprimer "${option.name}" : ${reservationCount} réservation(s) associée(s)`,
            400
          );
        }
      }
    }

    // Transaction pour la mise à jour atomique
    await prisma.$transaction(async (tx) => {
      // Supprimer les options retirées
      if (optionsToDelete.length > 0) {
        await tx.menuOption.deleteMany({
          where: { id: { in: optionsToDelete } },
        });
      }

      // Mettre à jour ou créer les options
      for (const option of body.options!) {
        if (option.id) {
          // Mise à jour
          await tx.menuOption.update({
            where: { id: option.id },
            data: {
              courseType: option.courseType,
              name: option.name,
              description: option.description,
              maxCapacity: option.maxCapacity,
              sortOrder: option.sortOrder,
            },
          });
        } else {
          // Création
          await tx.menuOption.create({
            data: {
              menuId: id,
              courseType: option.courseType,
              name: option.name,
              description: option.description,
              maxCapacity: option.maxCapacity,
              sortOrder: option.sortOrder ?? 0,
            },
          });
        }
      }

      // Mettre à jour le menu
      await tx.menu.update({
        where: { id },
        data: {
          ...(body.sideDishes !== undefined && { sideDishes: body.sideDishes }),
          ...(body.notes !== undefined && { notes: body.notes }),
          ...(body.isPublished !== undefined && { isPublished: body.isPublished }),
        },
      });
    });
  } else {
    // Mise à jour simple sans options
    await prisma.menu.update({
      where: { id },
      data: {
        ...(body.sideDishes !== undefined && { sideDishes: body.sideDishes }),
        ...(body.notes !== undefined && { notes: body.notes }),
        ...(body.isPublished !== undefined && { isPublished: body.isPublished }),
      },
    });
  }

  // Récupérer le menu mis à jour
  const updatedMenu = await prisma.menu.findUnique({
    where: { id },
    include: {
      options: {
        orderBy: [{ courseType: "asc" }, { sortOrder: "asc" }],
      },
    },
  });

  // Log de l'action
  await prisma.auditLog.create({
    data: {
      performedById: session!.user.id,
      action: "MENU_MODIFIED",
      entityType: "Menu",
      entityId: id,
    },
  });

  return successResponse(updatedMenu, "Menu mis à jour");
}

// =============================================================================
// DELETE - Supprimer un menu
// =============================================================================

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { session, error } = await requireGestionnaireOrAdmin();
  if (error) return error;

  const { id } = await params;

  // Vérifier que le menu existe
  const existingMenu = await prisma.menu.findUnique({
    where: { id },
    include: {
      options: {
        include: {
          _count: {
            select: { reservationsAsMain: true },
          },
        },
      },
    },
  });

  if (!existingMenu) {
    return notFoundResponse("Menu non trouvé");
  }

  // Vérifier qu'il n'y a pas de réservations
  const hasReservations = existingMenu.options.some(
    (o) => o._count.reservationsAsMain > 0
  );

  if (hasReservations) {
    return errorResponse(
      "Impossible de supprimer ce menu : des réservations sont associées",
      400
    );
  }

  // Supprimer (cascade sur les options)
  await prisma.menu.delete({
    where: { id },
  });

  // Log de l'action
  await prisma.auditLog.create({
    data: {
      performedById: session!.user.id,
      action: "MENU_DELETED",
      entityType: "Menu",
      entityId: id,
      details: { date: existingMenu.date.toISOString() },
    },
  });

  return successResponse({ id }, "Menu supprimé");
}

