// =============================================================================
// API Routes - Réservations
// GET /api/reservations - Liste des réservations
// POST /api/reservations - Créer une réservation
// =============================================================================

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  getSession,
  requireGestionnaireOrAdmin,
  parseBody,
} from "@/lib/api-utils";
import { canModifyReservation, isOpenDay } from "@/lib/utils";
import { ConsumptionMode, CourseType, ReservationStatus } from "@prisma/client";
import { parseISO, startOfDay, endOfDay } from "date-fns";

// =============================================================================
// GET - Liste des réservations
// =============================================================================

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return unauthorizedResponse();
  }

  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get("date");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const userId = searchParams.get("userId");
  const status = searchParams.get("status") as ReservationStatus | null;

  const isStaff = session.user.role === "GESTIONNAIRE" || session.user.role === "ADMIN";

  // Construire les filtres
  const where: {
    date?: { gte?: Date; lte?: Date; equals?: Date };
    userId?: string;
    status?: ReservationStatus;
  } = {};

  // Si pas staff, ne montrer que ses propres réservations
  if (!isStaff) {
    where.userId = session.user.id;
  } else if (userId) {
    where.userId = userId;
  }

  if (date) {
    where.date = { equals: startOfDay(parseISO(date)) };
  } else {
    if (startDate) {
      where.date = { ...where.date, gte: startOfDay(parseISO(startDate)) };
    }
    if (endDate) {
      where.date = { ...where.date, lte: endOfDay(parseISO(endDate)) };
    }
  }

  if (status) {
    where.status = status;
  }

  const reservations = await prisma.reservation.findMany({
    where,
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
      starterOption: {
        select: { id: true, name: true },
      },
      mainOption: {
        select: { id: true, name: true },
      },
      dessertOption: {
        select: { id: true, name: true },
      },
    },
    orderBy: [{ date: "asc" }, { createdAt: "asc" }],
  });

  return successResponse(reservations);
}

// =============================================================================
// POST - Créer une réservation
// =============================================================================

interface CreateReservationBody {
  date: string;
  mainOptionId: string;
  starterOptionId?: string;
  dessertOptionId?: string;
  consumptionMode: ConsumptionMode;
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return unauthorizedResponse();
  }

  const body = await parseBody<CreateReservationBody>(request);
  if (!body) {
    return errorResponse("Corps de requête invalide");
  }

  const { date, mainOptionId, starterOptionId, dessertOptionId, consumptionMode } = body;

  // Validation de base
  if (!date || !mainOptionId || !consumptionMode) {
    return errorResponse("Date, plat principal et mode de consommation requis");
  }

  const reservationDate = startOfDay(parseISO(date));

  // Vérifier si le jour est ouvert
  const isOpen = await isOpenDay(reservationDate);
  if (!isOpen) {
    return errorResponse("Le restaurant est fermé ce jour-là");
  }

  // Vérifier si on peut encore réserver
  const canModify = await canModifyReservation(reservationDate);
  if (!canModify) {
    return errorResponse("L'heure limite de réservation est dépassée");
  }

  // Vérifier qu'il n'y a pas déjà une réservation pour ce jour
  const existingReservation = await prisma.reservation.findUnique({
    where: {
      userId_date: {
        userId: session.user.id,
        date: reservationDate,
      },
    },
  });

  if (existingReservation) {
    return errorResponse("Vous avez déjà une réservation pour ce jour", 409);
  }

  // Vérifier que le menu existe et est publié pour cette date
  const menu = await prisma.menu.findUnique({
    where: { date: reservationDate },
    include: { options: true },
  });

  if (!menu || !menu.isPublished) {
    return errorResponse("Aucun menu disponible pour cette date");
  }

  // Vérifier que le plat principal existe et appartient au menu
  const mainOption = menu.options.find(
    (o) => o.id === mainOptionId && o.courseType === CourseType.MAIN
  );
  if (!mainOption) {
    return errorResponse("Plat principal invalide");
  }

  // Vérifier l'entrée si fournie
  if (starterOptionId) {
    const starterOption = menu.options.find(
      (o) => o.id === starterOptionId && o.courseType === CourseType.STARTER
    );
    if (!starterOption) {
      return errorResponse("Entrée invalide");
    }
  }

  // Vérifier le dessert si fourni
  if (dessertOptionId) {
    const dessertOption = menu.options.find(
      (o) => o.id === dessertOptionId && o.courseType === CourseType.DESSERT
    );
    if (!dessertOption) {
      return errorResponse("Dessert invalide");
    }
  }

  // Créer la réservation
  const reservation = await prisma.reservation.create({
    data: {
      userId: session.user.id,
      date: reservationDate,
      mainOptionId,
      starterOptionId: starterOptionId || null,
      dessertOptionId: dessertOptionId || null,
      consumptionMode,
      status: ReservationStatus.BOOKED,
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
      userId: session.user.id,
      performedById: session.user.id,
      action: "RESERVATION_CREATED",
      entityType: "Reservation",
      entityId: reservation.id,
      details: {
        date: reservationDate.toISOString(),
        mainOption: mainOption.name,
        consumptionMode,
      },
    },
  });

  return successResponse(reservation, "Réservation créée", 201);
}

