// =============================================================================
// API Routes - Utilisateur par ID
// GET /api/users/[id] - Détails d'un utilisateur
// PATCH /api/users/[id] - Modifier un utilisateur
// DELETE /api/users/[id] - Désactiver un utilisateur
// =============================================================================

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  requireGestionnaireOrAdmin,
  requireAdmin,
  parseBody,
} from "@/lib/api-utils";
import { Role, AccountStatus } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// =============================================================================
// GET - Détails d'un utilisateur
// =============================================================================

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { session, error } = await requireGestionnaireOrAdmin();
  if (error) return error;

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      canteenAccountNumber: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      lastLoginAt: true,
      _count: {
        select: { reservations: true },
      },
    },
  });

  if (!user) {
    return notFoundResponse("Utilisateur non trouvé");
  }

  return successResponse(user);
}

// =============================================================================
// PATCH - Modifier un utilisateur
// =============================================================================

interface UpdateUserBody {
  firstName?: string;
  lastName?: string;
  canteenAccountNumber?: string;
  role?: Role;
  status?: AccountStatus;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const body = await parseBody<UpdateUserBody>(request);
  
  if (!body) {
    return errorResponse("Corps de requête invalide");
  }

  // Vérifier que l'utilisateur existe
  const existingUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!existingUser) {
    return notFoundResponse("Utilisateur non trouvé");
  }

  // Si changement de numéro de compte cantine, vérifier l'unicité
  if (body.canteenAccountNumber && body.canteenAccountNumber !== existingUser.canteenAccountNumber) {
    const existingCanteen = await prisma.user.findUnique({
      where: { canteenAccountNumber: body.canteenAccountNumber },
    });

    if (existingCanteen) {
      return errorResponse("Ce numéro de compte cantine est déjà utilisé", 409);
    }
  }

  // Mettre à jour
  const user = await prisma.user.update({
    where: { id },
    data: {
      ...(body.firstName && { firstName: body.firstName }),
      ...(body.lastName && { lastName: body.lastName }),
      ...(body.canteenAccountNumber && { canteenAccountNumber: body.canteenAccountNumber }),
      ...(body.role && { role: body.role }),
      ...(body.status && { status: body.status }),
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      canteenAccountNumber: true,
      role: true,
      status: true,
    },
  });

  return successResponse(user, "Utilisateur mis à jour");
}

// =============================================================================
// DELETE - Désactiver un utilisateur (soft delete)
// =============================================================================

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  // Vérifier que l'utilisateur existe
  const existingUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!existingUser) {
    return notFoundResponse("Utilisateur non trouvé");
  }

  // Ne pas permettre de se désactiver soi-même
  if (existingUser.id === session!.user.id) {
    return errorResponse("Vous ne pouvez pas désactiver votre propre compte");
  }

  // Désactiver (soft delete)
  await prisma.user.update({
    where: { id },
    data: { status: AccountStatus.DISABLED },
  });

  // Log de l'action
  await prisma.auditLog.create({
    data: {
      userId: id,
      performedById: session!.user.id,
      action: "ACCOUNT_DISABLED",
      entityType: "User",
      entityId: id,
    },
  });

  return successResponse({ id }, "Utilisateur désactivé");
}

