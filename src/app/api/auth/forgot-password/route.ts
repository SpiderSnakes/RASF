// =============================================================================
// API Route - Mot de passe oublié
// POST /api/auth/forgot-password - Demander un reset de mot de passe
// =============================================================================

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { generateToken } from "@/lib/auth";
import { successResponse, errorResponse, parseBody, isValidEmail } from "@/lib/api-utils";
import { AccountStatus } from "@prisma/client";

interface ForgotPasswordBody {
  email: string;
}

export async function POST(request: NextRequest) {
  const body = await parseBody<ForgotPasswordBody>(request);

  if (!body) {
    return errorResponse("Corps de requête invalide");
  }

  const { email } = body;

  // Validation
  if (!email || !isValidEmail(email)) {
    return errorResponse("Email invalide");
  }

  // Rechercher l'utilisateur
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  // Pour des raisons de sécurité, on retourne toujours un succès
  // même si l'email n'existe pas
  if (!user) {
    return successResponse(
      null,
      "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation."
    );
  }

  // Vérifier que le compte est actif
  if (user.status === AccountStatus.DISABLED) {
    return successResponse(
      null,
      "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation."
    );
  }

  // Générer un token de reset
  const resetToken = generateToken();
  const resetTokenExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 heure

  // Sauvegarder le token
  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken,
      resetTokenExpires,
    },
  });

  // TODO: Envoyer l'email avec le lien de reset
  // En attendant, on log le token pour le développement
  console.log(`[DEV] Reset token for ${email}: ${resetToken}`);
  console.log(`[DEV] Reset URL: ${process.env.APP_URL}/auth/reset-password?token=${resetToken}`);

  return successResponse(
    // En dev, on retourne le token pour faciliter les tests
    process.env.NODE_ENV === "development" ? { resetToken } : null,
    "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation."
  );
}

