// =============================================================================
// API Routes - Paramètres globaux
// GET /api/settings - Obtenir les paramètres
// PATCH /api/settings - Modifier les paramètres (admin)
// =============================================================================

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  successResponse,
  errorResponse,
  requireAdmin,
  getSession,
  parseBody,
} from "@/lib/api-utils";

// =============================================================================
// GET - Obtenir les paramètres
// =============================================================================

export async function GET() {
  const session = await getSession();

  // Récupérer les paramètres (créer s'ils n'existent pas)
  let settings = await prisma.settings.findUnique({
    where: { id: "global" },
  });

  if (!settings) {
    settings = await prisma.settings.create({
      data: { id: "global" },
    });
  }

  // Si pas staff, ne retourner que les paramètres publics
  const isStaff = session?.user.role === "GESTIONNAIRE" || session?.user.role === "ADMIN";

  if (!isStaff) {
    return successResponse({
      reservationDeadline: settings.reservationDeadline,
      openDays: settings.openDays,
      weeksInAdvance: settings.weeksInAdvance,
    });
  }

  return successResponse(settings);
}

// =============================================================================
// PATCH - Modifier les paramètres
// =============================================================================

interface UpdateSettingsBody {
  reservationDeadline?: string;
  openDays?: number[];
  weeksInAdvance?: number;
  maxDailyCapacity?: number | null;
  notificationsEnabled?: boolean;
  operationalTrackingEnabled?: boolean;
}

export async function PATCH(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await parseBody<UpdateSettingsBody>(request);
  if (!body) {
    return errorResponse("Corps de requête invalide");
  }

  // Validation
  if (body.reservationDeadline) {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(body.reservationDeadline)) {
      return errorResponse("Format d'heure invalide (attendu HH:MM)");
    }
  }

  if (body.openDays) {
    if (!Array.isArray(body.openDays)) {
      return errorResponse("openDays doit être un tableau");
    }
    if (body.openDays.some((d) => d < 0 || d > 6)) {
      return errorResponse("Les jours doivent être entre 0 (dimanche) et 6 (samedi)");
    }
  }

  if (body.weeksInAdvance !== undefined) {
    if (body.weeksInAdvance < 1 || body.weeksInAdvance > 8) {
      return errorResponse("weeksInAdvance doit être entre 1 et 8");
    }
  }

  // Mettre à jour
  const settings = await prisma.settings.upsert({
    where: { id: "global" },
    update: {
      ...(body.reservationDeadline && { reservationDeadline: body.reservationDeadline }),
      ...(body.openDays && { openDays: body.openDays }),
      ...(body.weeksInAdvance && { weeksInAdvance: body.weeksInAdvance }),
      ...(body.maxDailyCapacity !== undefined && { maxDailyCapacity: body.maxDailyCapacity }),
      ...(body.notificationsEnabled !== undefined && {
        notificationsEnabled: body.notificationsEnabled,
      }),
      ...(body.operationalTrackingEnabled !== undefined && {
        operationalTrackingEnabled: body.operationalTrackingEnabled,
      }),
    },
    create: {
      id: "global",
      ...body,
    },
  });

  return successResponse(settings, "Paramètres mis à jour");
}

