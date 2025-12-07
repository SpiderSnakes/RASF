// =============================================================================
// API Route - Export des utilisateurs en CSV
// GET /api/export/users - Exporter la liste des utilisateurs
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/api-utils";
import { format } from "date-fns";

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const searchParams = request.nextUrl.searchParams;
  const roleFilter = searchParams.get("role");
  const activeFilter = searchParams.get("active");

  // Construire le filtre
  const where: Record<string, unknown> = {};
  
  if (roleFilter) {
    where.role = roleFilter;
  }
  
  if (activeFilter !== null) {
    where.isActive = activeFilter === "true";
  }

  // Recuperer les utilisateurs
  const users = await prisma.user.findMany({
    where,
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });

  // Generer le CSV
  const headers = [
    "Nom",
    "Prenom",
    "Email",
    "Role",
    "N Compte Cantine",
    "Statut",
    "Mot de passe defini",
    "Date de creation",
    "Derniere connexion",
  ];

  const rows = users.map((u) => [
    u.lastName.toUpperCase(),
    u.firstName,
    u.email,
    getRoleLabel(u.role),
    u.canteenAccountNumber || "",
    getStatusLabel(u.status),
    u.passwordHash ? "Oui" : "Non",
    format(u.createdAt, "dd/MM/yyyy HH:mm"),
    u.lastLoginAt ? format(u.lastLoginAt, "dd/MM/yyyy HH:mm") : "",
  ]);

  const csv = formatCSV(headers, rows);
  const filename = `rasf_utilisateurs_${format(new Date(), "yyyy-MM-dd")}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    AGENT: "Agent",
    GESTIONNAIRE: "Gestionnaire RASF",
    ADMIN: "Administrateur",
  };
  return labels[role] || role;
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: "En attente",
    ACTIVE: "Actif",
    DISABLED: "Desactive",
  };
  return labels[status] || status;
}

function formatCSV(headers: string[], rows: string[][]): string {
  const escape = (value: string): string => {
    if (value.includes(";") || value.includes('"') || value.includes("\n")) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  const headerLine = headers.map(escape).join(";");
  const dataLines = rows.map((row) => row.map(escape).join(";"));

  // BOM UTF-8 pour Excel
  return "\uFEFF" + [headerLine, ...dataLines].join("\n");
}

