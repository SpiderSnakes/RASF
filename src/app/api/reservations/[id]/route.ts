// =============================================================================
// API Routes - Réservation par ID
// GET /api/reservations/[id] - Détails d'une réservation
// PATCH /api/reservations/[id] - Modifier une réservation
// DELETE /api/reservations/[id] - Annuler une réservation
// =============================================================================

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  forbiddenResponse,
  unauthorizedResponse,
  getSession,
  parseBody,
} from "@/lib/api-utils";
import { canModifyReservation } from "@/lib/utils";
import { ConsumptionMode, CourseType, ReservationStatus } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// =============================================================================
// GET - Détails d'une réservation
// =============================================================================

export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session) {
    return unauthorizedResponse();
  }

  const { id } = await params;

  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          canteenAccountNumber: true,
        },
      },
      starterOption: { select: { id: true, name: true } },
      mainOption: { select: { id: true, name: true } },
      dessertOption: { select: { id: true, name: true } },
    },
  });

  if (!reservation) {
    return notFoundResponse("Réservation non trouvée");
  }

  // Vérifier l'accès
  const isOwner = reservation.userId === session.user.id;
  const isStaff = session.user.role === "GESTIONNAIRE" || session.user.role === "ADMIN";

  if (!isOwner && !isStaff) {
    return forbiddenResponse();
  }

  return successResponse(reservation);
}

// =============================================================================
// PATCH - Modifier une réservation
// =============================================================================

interface UpdateReservationBody {
  mainOptionId?: string;
  starterOptionId?: string | null;
  dessertOptionId?: string | null;
  consumptionMode?: ConsumptionMode;
  status?: ReservationStatus; // Uniquement pour staff
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session) {
    return unauthorizedResponse();
  }

  const { id } = await params;
  const body = await parseBody<UpdateReservationBody>(request);

  if (!body) {
    return errorResponse("Corps de requête invalide");
  }

  // Récupérer la réservation
  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: {
      mainOption: {
        include: { menu: { include: { options: true } } },
      },
    },
  });

  if (!reservation) {
    return notFoundResponse("Réservation non trouvée");
  }

  const isOwner = reservation.userId === session.user.id;
  const isStaff = session.user.role === "GESTIONNAIRE" || session.user.role === "ADMIN";

  // Gestion du statut (uniquement staff)
  if (body.status !== undefined) {
    if (!isStaff) {
      return forbiddenResponse("Seul le personnel peut modifier le statut");
    }

    await prisma.reservation.update({
      where: { id },
      data: { status: body.status },
    });

    // Log de l'action
    const action =
      body.status === ReservationStatus.SERVED
        ? "RESERVATION_SERVED"
        : body.status === ReservationStatus.NO_SHOW
        ? "RESERVATION_NO_SHOW"
        : "RESERVATION_MODIFIED";

    await prisma.auditLog.create({
      data: {
        userId: reservation.userId,
        performedById: session.user.id,
        action,
        entityType: "Reservation",
        entityId: id,
        details: { newStatus: body.status },
      },
    });

    const updatedReservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        starterOption: { select: { id: true, name: true } },
        mainOption: { select: { id: true, name: true } },
        dessertOption: { select: { id: true, name: true } },
      },
    });

    return successResponse(updatedReservation, "Statut mis à jour");
  }

  // Modification des choix (agent ou staff)
  if (!isOwner && !isStaff) {
    return forbiddenResponse();
  }

  // Vérifier si on peut encore modifier
  const canModify = await canModifyReservation(reservation.date);
  if (!canModify && !isStaff) {
    return errorResponse("L'heure limite de modification est dépassée");
  }

  const menu = reservation.mainOption.menu;

  // Valider le nouveau plat principal si fourni
  if (body.mainOptionId) {
    const mainOption = menu.options.find(
      (o) => o.id === body.mainOptionId && o.courseType === CourseType.MAIN
    );
    if (!mainOption) {
      return errorResponse("Plat principal invalide");
    }
  }

  // Valider la nouvelle entrée si fournie
  if (body.starterOptionId) {
    const starterOption = menu.options.find(
      (o) => o.id === body.starterOptionId && o.courseType === CourseType.STARTER
    );
    if (!starterOption) {
      return errorResponse("Entrée invalide");
    }
  }

  // Valider le nouveau dessert si fourni
  if (body.dessertOptionId) {
    const dessertOption = menu.options.find(
      (o) => o.id === body.dessertOptionId && o.courseType === CourseType.DESSERT
    );
    if (!dessertOption) {
      return errorResponse("Dessert invalide");
    }
  }

  // Mettre à jour
  const updatedReservation = await prisma.reservation.update({
    where: { id },
    data: {
      ...(body.mainOptionId && { mainOptionId: body.mainOptionId }),
      ...(body.starterOptionId !== undefined && { starterOptionId: body.starterOptionId }),
      ...(body.dessertOptionId !== undefined && { dessertOptionId: body.dessertOptionId }),
      ...(body.consumptionMode && { consumptionMode: body.consumptionMode }),
    },
    include: {
      starterOption: { select: { id: true, name: true } },
      mainOption: { select: { id: true, name: true } },
      dessertOption: { select: { id: true, name: true } },
    },
  });

  // Log de l'action
  await prisma.auditLog.create({
    data: {
      userId: reservation.userId,
      performedById: session.user.id,
      action: "RESERVATION_MODIFIED",
      entityType: "Reservation",
      entityId: id,
      details: JSON.parse(JSON.stringify(body)),
    },
  });

  return successResponse(updatedReservation, "Réservation mise à jour");
}

// =============================================================================
// DELETE - Annuler une réservation
// =============================================================================

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session) {
    return unauthorizedResponse();
  }

  const { id } = await params;

  // Récupérer la réservation
  const reservation = await prisma.reservation.findUnique({
    where: { id },
  });

  if (!reservation) {
    return notFoundResponse("Réservation non trouvée");
  }

  const isOwner = reservation.userId === session.user.id;
  const isStaff = session.user.role === "GESTIONNAIRE" || session.user.role === "ADMIN";

  if (!isOwner && !isStaff) {
    return forbiddenResponse();
  }

  // Vérifier si on peut encore annuler
  const canModify = await canModifyReservation(reservation.date);
  if (!canModify && !isStaff) {
    return errorResponse("L'heure limite d'annulation est dépassée");
  }

  // Supprimer
  await prisma.reservation.delete({
    where: { id },
  });

  // Log de l'action
  await prisma.auditLog.create({
    data: {
      userId: reservation.userId,
      performedById: session.user.id,
      action: "RESERVATION_CANCELLED",
      entityType: "Reservation",
      entityId: id,
      details: { date: reservation.date.toISOString() },
    },
  });

  return successResponse({ id }, "Réservation annulée");
}

