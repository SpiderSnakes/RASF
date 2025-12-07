// =============================================================================
// Types TypeScript pour l'application RASF
// =============================================================================

import type {
  User,
  Menu,
  MenuOption,
  Reservation,
  Settings,
  Role,
  AccountStatus,
  ConsumptionMode,
  CourseType,
  ReservationStatus,
} from "@prisma/client";

// Re-export des types Prisma
export type {
  User,
  Menu,
  MenuOption,
  Reservation,
  Settings,
  Role,
  AccountStatus,
  ConsumptionMode,
  CourseType,
  ReservationStatus,
};

// =============================================================================
// Types étendus avec relations
// =============================================================================

// Menu avec ses options
export type MenuWithOptions = Menu & {
  options: MenuOption[];
};

// Options groupées par type
export type GroupedMenuOptions = {
  starters: MenuOption[];
  mains: MenuOption[];
  desserts: MenuOption[];
};

// Réservation avec toutes les relations
export type ReservationWithDetails = Reservation & {
  user: Pick<User, "id" | "firstName" | "lastName" | "email" | "canteenAccountNumber">;
  starterOption: MenuOption | null;
  mainOption: MenuOption;
  dessertOption: MenuOption | null;
};

// User sans données sensibles (pour le frontend)
export type SafeUser = Omit<
  User,
  "passwordHash" | "activationToken" | "activationExpires" | "resetToken" | "resetTokenExpires"
>;

// =============================================================================
// Types pour les formulaires
// =============================================================================

// Création de réservation
export interface CreateReservationInput {
  date: string; // ISO date string
  mainOptionId: string;
  starterOptionId?: string;
  dessertOptionId?: string;
  consumptionMode: ConsumptionMode;
}

// Modification de réservation
export interface UpdateReservationInput {
  mainOptionId?: string;
  starterOptionId?: string | null;
  dessertOptionId?: string | null;
  consumptionMode?: ConsumptionMode;
}

// Création de menu
export interface CreateMenuInput {
  date: string;
  sideDishes?: string;
  notes?: string;
  isPublished?: boolean;
  options: CreateMenuOptionInput[];
}

// Option de menu
export interface CreateMenuOptionInput {
  courseType: CourseType;
  name: string;
  description?: string;
  maxCapacity?: number;
  sortOrder?: number;
}

// Pré-inscription d'un agent
export interface PreRegisterAgentInput {
  email: string;
  firstName: string;
  lastName: string;
  canteenAccountNumber: string;
}

// Activation de compte
export interface ActivateAccountInput {
  token: string;
  password: string;
}

// Connexion
export interface LoginInput {
  email: string;
  password: string;
}

// =============================================================================
// Types pour les réponses API
// =============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// =============================================================================
// Types pour les statistiques (suivi opérationnel)
// =============================================================================

export interface DailyStats {
  date: string;
  totalReservations: number;
  surPlace: number;
  aEmporter: number;
  served: number;
  noShow: number;
  byMainOption: Record<string, number>;
}

export interface WeeklyStats {
  weekStart: string;
  weekEnd: string;
  days: DailyStats[];
  totals: {
    totalReservations: number;
    surPlace: number;
    aEmporter: number;
    served: number;
    noShow: number;
  };
}

