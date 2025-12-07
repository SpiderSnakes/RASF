// =============================================================================
// API Route - Reset de mot de passe
// POST /api/auth/reset-password - Réinitialiser le mot de passe avec token
// =============================================================================

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { successResponse, errorResponse, parseBody } from "@/lib/api-utils";

interface ResetPasswordBody {
  token: string;
  password: string;
}

export async function POST(request: NextRequest) {
  const body = await parseBody<ResetPasswordBody>(request);

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
    where: { resetToken: token },
  });

  if (!user) {
    return errorResponse("Token invalide ou expiré", 400);
  }

  // Vérifier que le token n'est pas expiré
  if (user.resetTokenExpires && user.resetTokenExpires < new Date()) {
    return errorResponse("Le lien de réinitialisation a expiré. Veuillez en demander un nouveau.", 400);
  }

  // Hasher le nouveau mot de passe
  const passwordHash = await hashPassword(password);

  // Mettre à jour le mot de passe
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      resetToken: null,
      resetTokenExpires: null,
    },
  });

  return successResponse(
    { email: user.email },
    "Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter."
  );
}

