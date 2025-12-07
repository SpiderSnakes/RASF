// =============================================================================
// API Routes - Menus
// GET /api/menus - Liste des menus
// POST /api/menus - Créer un menu (gestionnaire/admin)
// =============================================================================

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  successResponse,
  errorResponse,
  requireGestionnaireOrAdmin,
  getSession,
  parseBody,
} from "@/lib/api-utils";
import { CourseType } from "@prisma/client";
import { parseISO, startOfDay, endOfDay, addDays } from "date-fns";

// Désactiver le cache ISR pour obtenir les menus à jour immédiatement
export const dynamic = "force-dynamic";

// =============================================================================
// GET - Liste des menus
// =============================================================================

export async function GET(request: NextRequest) {
  const session = await getSession();
  const searchParams = request.nextUrl.searchParams;
  
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const published = searchParams.get("published");

  // Construire les filtres
  const where: {
    date?: { gte?: Date; lte?: Date };
    isPublished?: boolean;
  } = {};

  if (startDate) {
    where.date = { ...where.date, gte: startOfDay(parseISO(startDate)) };
  }
  if (endDate) {
    where.date = { ...where.date, lte: endOfDay(parseISO(endDate)) };
  }

  // Si pas gestionnaire/admin, ne montrer que les menus publiés
  const isStaff = session?.user.role === "GESTIONNAIRE" || session?.user.role === "ADMIN";
  if (!isStaff || published === "true") {
    where.isPublished = true;
  }

  const menus = await prisma.menu.findMany({
    where,
    include: {
      options: {
        orderBy: [{ courseType: "asc" }, { sortOrder: "asc" }],
      },
    },
    orderBy: { date: "asc" },
  });

  // Grouper les options par type
  const menusWithGroupedOptions = menus.map((menu) => ({
    ...menu,
    starters: menu.options.filter((o) => o.courseType === CourseType.STARTER),
    mains: menu.options.filter((o) => o.courseType === CourseType.MAIN),
    desserts: menu.options.filter((o) => o.courseType === CourseType.DESSERT),
  }));

  return successResponse(menusWithGroupedOptions);
}

// =============================================================================
// POST - Créer un menu
// =============================================================================

interface CreateMenuOptionInput {
  courseType: CourseType;
  name: string;
  description?: string;
  maxCapacity?: number;
  sortOrder?: number;
}

interface CreateMenuBody {
  date: string;
  sideDishes?: string;
  notes?: string;
  isPublished?: boolean;
  options: CreateMenuOptionInput[];
}

export async function POST(request: NextRequest) {
  const { session, error } = await requireGestionnaireOrAdmin();
  if (error) return error;

  const body = await parseBody<CreateMenuBody>(request);
  if (!body) {
    return errorResponse("Corps de requête invalide");
  }

  const { date, sideDishes, notes, isPublished = false, options } = body;

  // Validation
  if (!date) {
    return errorResponse("La date est requise");
  }

  if (!options || options.length === 0) {
    return errorResponse("Au moins une option de menu est requise");
  }

  // Vérifier qu'il y a au moins un plat principal
  const hasMain = options.some((o) => o.courseType === CourseType.MAIN);
  if (!hasMain) {
    return errorResponse("Au moins un plat principal est requis");
  }

  const menuDate = startOfDay(parseISO(date));

  // Vérifier si un menu existe déjà pour cette date
  const existingMenu = await prisma.menu.findUnique({
    where: { date: menuDate },
  });

  if (existingMenu) {
    return errorResponse("Un menu existe déjà pour cette date", 409);
  }

  // Créer le menu avec ses options
  const menu = await prisma.menu.create({
    data: {
      date: menuDate,
      sideDishes,
      notes,
      isPublished,
      options: {
        create: options.map((option, index) => ({
          courseType: option.courseType,
          name: option.name,
          description: option.description,
          maxCapacity: option.maxCapacity,
          sortOrder: option.sortOrder ?? index,
        })),
      },
    },
    include: {
      options: {
        orderBy: [{ courseType: "asc" }, { sortOrder: "asc" }],
      },
    },
  });

  // Log de l'action
  await prisma.auditLog.create({
    data: {
      performedById: session!.user.id,
      action: "MENU_CREATED",
      entityType: "Menu",
      entityId: menu.id,
      details: { date: menuDate.toISOString(), optionsCount: options.length },
    },
  });

  return successResponse(menu, "Menu créé avec succès", 201);
}

