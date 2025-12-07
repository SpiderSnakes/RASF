// =============================================================================
// API Route - Export des réservations en CSV
// GET /api/export/reservations - Exporter les réservations
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireGestionnaireOrAdmin } from "@/lib/api-utils";
import { format, parseISO, startOfDay, endOfDay, startOfWeek, endOfWeek, addDays } from "date-fns";
import { fr } from "date-fns/locale";

// Type d'export
type ExportType = "detail" | "summary";
type ExportPeriod = "day" | "week";

export async function GET(request: NextRequest) {
  const { error } = await requireGestionnaireOrAdmin();
  if (error) return error;

  const searchParams = request.nextUrl.searchParams;
  const dateParam = searchParams.get("date"); // Format YYYY-MM-DD
  const typeParam = (searchParams.get("type") || "detail") as ExportType;
  const periodParam = (searchParams.get("period") || "day") as ExportPeriod;

  if (!dateParam) {
    return NextResponse.json({ success: false, error: "Date requise" }, { status: 400 });
  }

  const baseDate = parseISO(dateParam);
  let startDate: Date;
  let endDate: Date;

  if (periodParam === "week") {
    startDate = startOfWeek(baseDate, { weekStartsOn: 1 });
    endDate = endOfWeek(baseDate, { weekStartsOn: 1 });
    // Limiter à 5 jours (lun-ven)
    endDate = addDays(startDate, 4);
  } else {
    startDate = startOfDay(baseDate);
    endDate = endOfDay(baseDate);
  }

  // Récupérer les réservations
  const reservations = await prisma.reservation.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          canteenAccountNumber: true,
        },
      },
      starterOption: { select: { name: true } },
      mainOption: { select: { name: true } },
      dessertOption: { select: { name: true } },
    },
    orderBy: [{ date: "asc" }, { user: { lastName: "asc" } }],
  });

  let csv: string;
  let filename: string;

  if (typeParam === "summary") {
    csv = generateSummaryCSV(reservations, startDate, endDate);
    filename = `rasf_synthese_${format(startDate, "yyyy-MM-dd")}`;
    if (periodParam === "week") {
      filename += `_${format(endDate, "yyyy-MM-dd")}`;
    }
  } else {
    csv = generateDetailCSV(reservations);
    filename = `rasf_reservations_${format(startDate, "yyyy-MM-dd")}`;
    if (periodParam === "week") {
      filename += `_${format(endDate, "yyyy-MM-dd")}`;
    }
  }

  filename += ".csv";

  // Retourner le CSV
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

// =============================================================================
// Génération du CSV détaillé
// =============================================================================

interface ReservationWithDetails {
  id: string;
  date: Date;
  consumptionMode: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    canteenAccountNumber: string | null;
  };
  starterOption: { name: string } | null;
  mainOption: { name: string };
  dessertOption: { name: string } | null;
}

function generateDetailCSV(reservations: ReservationWithDetails[]): string {
  // En-têtes
  const headers = [
    "Date",
    "Jour",
    "Nom",
    "Prénom",
    "N° Compte",
    "Email",
    "Entrée",
    "Plat principal",
    "Dessert",
    "Mode",
    "Statut",
    "Heure réservation",
    "Dernière modification",
  ];

  // Lignes
  const rows = reservations.map((r) => [
    format(r.date, "dd/MM/yyyy"),
    format(r.date, "EEEE", { locale: fr }),
    r.user.lastName.toUpperCase(),
    r.user.firstName,
    r.user.canteenAccountNumber || "",
    r.user.email,
    r.starterOption?.name || "",
    r.mainOption.name,
    r.dessertOption?.name || "",
    r.consumptionMode === "SUR_PLACE" ? "Sur place" : "À emporter",
    getStatusLabel(r.status),
    format(r.createdAt, "dd/MM/yyyy HH:mm"),
    format(r.updatedAt, "dd/MM/yyyy HH:mm"),
  ]);

  return formatCSV(headers, rows);
}

// =============================================================================
// Génération du CSV synthèse
// =============================================================================

function generateSummaryCSV(
  reservations: ReservationWithDetails[],
  startDate: Date,
  endDate: Date
): string {
  // Grouper par jour
  const byDay = new Map<string, ReservationWithDetails[]>();

  // Initialiser tous les jours
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const key = format(currentDate, "yyyy-MM-dd");
    byDay.set(key, []);
    currentDate = addDays(currentDate, 1);
  }

  // Remplir avec les réservations
  for (const r of reservations) {
    const key = format(r.date, "yyyy-MM-dd");
    const existing = byDay.get(key) || [];
    existing.push(r);
    byDay.set(key, existing);
  }

  // Grouper par plat principal
  const mainDishes = new Set<string>();
  for (const r of reservations) {
    mainDishes.add(r.mainOption.name);
  }
  const sortedMainDishes = Array.from(mainDishes).sort();

  // En-têtes
  const headers = [
    "Date",
    "Jour",
    "Total",
    "Sur place",
    "À emporter",
    ...sortedMainDishes,
  ];

  // Lignes
  const rows: string[][] = [];
  
  byDay.forEach((dayReservations, dateKey) => {
    const date = parseISO(dateKey);
    const surPlace = dayReservations.filter((r) => r.consumptionMode === "SUR_PLACE").length;
    const aEmporter = dayReservations.filter((r) => r.consumptionMode === "A_EMPORTER").length;

    // Compter par plat
    const mainCounts: Record<string, number> = {};
    for (const dish of sortedMainDishes) {
      mainCounts[dish] = dayReservations.filter((r) => r.mainOption.name === dish).length;
    }

    rows.push([
      format(date, "dd/MM/yyyy"),
      format(date, "EEEE", { locale: fr }),
      dayReservations.length.toString(),
      surPlace.toString(),
      aEmporter.toString(),
      ...sortedMainDishes.map((dish) => mainCounts[dish].toString()),
    ]);
  });

  // Ligne de totaux
  const totals = [
    "TOTAL",
    "",
    reservations.length.toString(),
    reservations.filter((r) => r.consumptionMode === "SUR_PLACE").length.toString(),
    reservations.filter((r) => r.consumptionMode === "A_EMPORTER").length.toString(),
    ...sortedMainDishes.map(
      (dish) => reservations.filter((r) => r.mainOption.name === dish).length.toString()
    ),
  ];
  rows.push(totals);

  return formatCSV(headers, rows);
}

// =============================================================================
// Utilitaires
// =============================================================================

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    BOOKED: "Réservé",
    SERVED: "Servi",
    NO_SHOW: "Non venu",
  };
  return labels[status] || status;
}

function formatCSV(headers: string[], rows: string[][]): string {
  const escape = (value: string): string => {
    // Échapper les guillemets et encadrer si nécessaire
    if (value.includes(";") || value.includes('"') || value.includes("\n")) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  const headerLine = headers.map(escape).join(";");
  const dataLines = rows.map((row) => row.map(escape).join(";"));

  // Ajouter BOM UTF-8 pour Excel
  return "\uFEFF" + [headerLine, ...dataLines].join("\n");
}

