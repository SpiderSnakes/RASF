// =============================================================================
// API Route - Activation de compte
// POST /api/auth/activate - Activer un compte avec token
// =============================================================================

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { successResponse, errorResponse, parseBody } from "@/lib/api-utils";
import { AccountStatus } from "@prisma/client";

interface ActivateBody {
  token: string;
  password: string;
}

export async function POST(request: NextRequest) {
  const body = await parseBody<ActivateBody>(request);

  if (!body) {
    return errorResponse("Corps de requête invalide");
  }

  const { token, password } = body;

  // Validation
  if (!token || !password) {
    return errorResponse("Token et mot de passe requis");
  }

  if (password.length < 8) {
    return errorResponse("Le mot de passe doit contenir au moins 8 caractères");
  }

  // Rechercher l'utilisateur avec ce token
  const user = await prisma.user.findUnique({
    where: { activationToken: token },
  });

  if (!user) {
    return errorResponse("Token invalide ou expiré", 400);
  }

  // Vérifier que le token n'est pas expiré
  if (user.activationExpires && user.activationExpires < new Date()) {
    return errorResponse("Le lien d'activation a expiré. Contactez l'administrateur.", 400);
  }

  // Vérifier que le compte est bien en attente
  if (user.status !== AccountStatus.PENDING) {
    return errorResponse("Ce compte a déjà été activé", 400);
  }

  // Hasher le mot de passe
  const passwordHash = await hashPassword(password);

  // Activer le compte
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      status: AccountStatus.ACTIVE,
      activationToken: null,
      activationExpires: null,
    },
  });

  // Log de l'action
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      performedById: user.id,
      action: "ACCOUNT_ACTIVATED",
      entityType: "User",
      entityId: user.id,
    },
  });

  return successResponse(
    { email: user.email },
    "Compte activé avec succès. Vous pouvez maintenant vous connecter."
  );
}

