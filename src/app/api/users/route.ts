// =============================================================================
// API Routes - Utilisateurs
// GET /api/users - Liste des utilisateurs (admin/gestionnaire)
// POST /api/users - Créer un utilisateur (admin)
// =============================================================================

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, generateToken } from "@/lib/auth";
import {
  successResponse,
  errorResponse,
  requireGestionnaireOrAdmin,
  requireAdmin,
  parseBody,
  isValidEmail,
} from "@/lib/api-utils";
import { Role, AccountStatus } from "@prisma/client";

// =============================================================================
// GET - Liste des utilisateurs
// =============================================================================

export async function GET(request: NextRequest) {
  // Vérifier les permissions
  const { session, error } = await requireGestionnaireOrAdmin();
  if (error) return error;

  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status") as AccountStatus | null;
  const role = searchParams.get("role") as Role | null;
  const search = searchParams.get("search");

  // Construire les filtres
  const where: {
    status?: AccountStatus;
    role?: Role;
    OR?: { email?: { contains: string; mode: "insensitive" }; firstName?: { contains: string; mode: "insensitive" }; lastName?: { contains: string; mode: "insensitive" } }[];
  } = {};

  if (status) where.status = status;
  if (role) where.role = role;
  if (search) {
    where.OR = [
      { email: { contains: search, mode: "insensitive" } },
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
    ];
  }

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      canteenAccountNumber: true,
      role: true,
      status: true,
      createdAt: true,
      lastLoginAt: true,
    },
    orderBy: { lastName: "asc" },
  });

  return successResponse(users);
}

// =============================================================================
// POST - Créer un utilisateur (pré-inscription)
// =============================================================================

interface CreateUserBody {
  email: string;
  firstName: string;
  lastName: string;
  canteenAccountNumber: string;
  role?: Role;
}

export async function POST(request: NextRequest) {
  // Seul un admin peut créer des utilisateurs
  const { session, error } = await requireAdmin();
  if (error) return error;

  const body = await parseBody<CreateUserBody>(request);
  if (!body) {
    return errorResponse("Corps de requête invalide");
  }

  const { email, firstName, lastName, canteenAccountNumber, role = Role.AGENT } = body;

  // Validation
  if (!email || !firstName || !lastName || !canteenAccountNumber) {
    return errorResponse("Tous les champs sont requis");
  }

  if (!isValidEmail(email)) {
    return errorResponse("Email invalide");
  }

  // Vérifier si l'email existe déjà
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    return errorResponse("Un compte avec cet email existe déjà", 409);
  }

  // Vérifier si le numéro de compte cantine existe déjà
  const existingCanteen = await prisma.user.findUnique({
    where: { canteenAccountNumber },
  });

  if (existingCanteen) {
    return errorResponse("Ce numéro de compte cantine est déjà utilisé", 409);
  }

  // Générer un token d'activation
  const activationToken = generateToken();
  const activationExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 jours

  // Créer l'utilisateur
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      firstName,
      lastName,
      canteenAccountNumber,
      role,
      status: AccountStatus.PENDING,
      activationToken,
      activationExpires,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      canteenAccountNumber: true,
      role: true,
      status: true,
      activationToken: true,
    },
  });

  // Log de l'action
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      performedById: session!.user.id,
      action: "ACCOUNT_CREATED",
      entityType: "User",
      entityId: user.id,
      details: { role, canteenAccountNumber },
    },
  });

  // TODO: Envoyer un email d'activation

  return successResponse(user, "Utilisateur créé. Un email d'activation a été envoyé.", 201);
}

