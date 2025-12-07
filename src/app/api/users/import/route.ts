// =============================================================================
// API Route - Import en masse des utilisateurs
// POST /api/users/import - Importer une liste d'utilisateurs
// =============================================================================

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { generateToken } from "@/lib/auth";
import { successResponse, errorResponse, requireAdmin, parseBody, isValidEmail } from "@/lib/api-utils";
import { Role, AccountStatus } from "@prisma/client";

interface ImportUserRow {
  email: string;
  firstName: string;
  lastName: string;
  canteenAccountNumber: string;
  role?: string;
}

interface ImportBody {
  users: ImportUserRow[];
  skipExisting?: boolean; // Si true, ignore les emails/comptes existants au lieu d'échouer
}

interface ImportResult {
  created: number;
  skipped: number;
  errors: { row: number; email: string; error: string }[];
  users: { email: string; activationToken: string }[];
}

export async function POST(request: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const body = await parseBody<ImportBody>(request);
  if (!body) {
    return errorResponse("Corps de requête invalide");
  }

  const { users, skipExisting = true } = body;

  if (!users || !Array.isArray(users) || users.length === 0) {
    return errorResponse("La liste des utilisateurs est vide");
  }

  if (users.length > 500) {
    return errorResponse("Maximum 500 utilisateurs par import");
  }

  const result: ImportResult = {
    created: 0,
    skipped: 0,
    errors: [],
    users: [],
  };

  // Récupérer tous les emails et numéros de compte existants
  const existingUsers = await prisma.user.findMany({
    select: { email: true, canteenAccountNumber: true },
  });

  const existingEmails = new Set(existingUsers.map((u) => u.email.toLowerCase()));
  const existingAccounts = new Set(
    existingUsers.map((u) => u.canteenAccountNumber).filter(Boolean)
  );

  // Traiter chaque utilisateur
  for (let i = 0; i < users.length; i++) {
    const row = users[i];
    const rowNum = i + 1;

    // Validation basique
    if (!row.email || !row.firstName || !row.lastName || !row.canteenAccountNumber) {
      result.errors.push({
        row: rowNum,
        email: row.email || "N/A",
        error: "Champs obligatoires manquants (email, firstName, lastName, canteenAccountNumber)",
      });
      continue;
    }

    const email = row.email.toLowerCase().trim();

    if (!isValidEmail(email)) {
      result.errors.push({
        row: rowNum,
        email: email,
        error: "Email invalide",
      });
      continue;
    }

    // Vérifier si l'email existe déjà
    if (existingEmails.has(email)) {
      if (skipExisting) {
        result.skipped++;
        continue;
      } else {
        result.errors.push({
          row: rowNum,
          email: email,
          error: "Email déjà utilisé",
        });
        continue;
      }
    }

    // Vérifier si le numéro de compte existe déjà
    if (existingAccounts.has(row.canteenAccountNumber)) {
      if (skipExisting) {
        result.skipped++;
        continue;
      } else {
        result.errors.push({
          row: rowNum,
          email: email,
          error: "Numéro de compte cantine déjà utilisé",
        });
        continue;
      }
    }

    // Déterminer le rôle
    let role: Role = Role.AGENT;
    if (row.role) {
      const upperRole = row.role.toUpperCase();
      if (upperRole === "GESTIONNAIRE") role = Role.GESTIONNAIRE;
      else if (upperRole === "ADMIN") role = Role.ADMIN;
    }

    // Générer le token d'activation
    const activationToken = generateToken();
    const activationExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 jours

    try {
      // Créer l'utilisateur
      await prisma.user.create({
        data: {
          email,
          firstName: row.firstName.trim(),
          lastName: row.lastName.trim(),
          canteenAccountNumber: row.canteenAccountNumber.trim(),
          role,
          status: AccountStatus.PENDING,
          activationToken,
          activationExpires,
        },
      });

      // Ajouter aux sets pour éviter les doublons dans le même import
      existingEmails.add(email);
      existingAccounts.add(row.canteenAccountNumber);

      result.created++;
      result.users.push({ email, activationToken });
    } catch (err) {
      result.errors.push({
        row: rowNum,
        email: email,
        error: err instanceof Error ? err.message : "Erreur de création",
      });
    }
  }

  // Log de l'action
  await prisma.auditLog.create({
    data: {
      performedById: session!.user.id,
      action: "ACCOUNT_CREATED",
      entityType: "User",
      details: {
        importType: "bulk",
        total: users.length,
        created: result.created,
        skipped: result.skipped,
        errors: result.errors.length,
      },
    },
  });

  return successResponse(result, `Import terminé : ${result.created} créés, ${result.skipped} ignorés, ${result.errors.length} erreurs`);
}

