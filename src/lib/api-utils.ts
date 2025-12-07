// =============================================================================
// Utilitaires pour les API Routes
// =============================================================================

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { Role } from "@prisma/client";

// =============================================================================
// Types pour les réponses API
// =============================================================================

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// =============================================================================
// Helpers pour les réponses
// =============================================================================

/**
 * Réponse de succès
 */
export function successResponse<T>(data: T, message?: string, status = 200) {
  const response: ApiSuccessResponse<T> = { success: true, data };
  if (message) response.message = message;
  return NextResponse.json(response, { status });
}

/**
 * Réponse d'erreur
 */
export function errorResponse(error: string, status = 400, code?: string) {
  const response: ApiErrorResponse = { success: false, error };
  if (code) response.code = code;
  return NextResponse.json(response, { status });
}

/**
 * Erreur 401 - Non authentifié
 */
export function unauthorizedResponse(message = "Non authentifié") {
  return errorResponse(message, 401, "UNAUTHORIZED");
}

/**
 * Erreur 403 - Non autorisé (rôle insuffisant)
 */
export function forbiddenResponse(message = "Accès non autorisé") {
  return errorResponse(message, 403, "FORBIDDEN");
}

/**
 * Erreur 404 - Non trouvé
 */
export function notFoundResponse(message = "Ressource non trouvée") {
  return errorResponse(message, 404, "NOT_FOUND");
}

/**
 * Erreur 500 - Erreur serveur
 */
export function serverErrorResponse(message = "Erreur interne du serveur") {
  return errorResponse(message, 500, "SERVER_ERROR");
}

// =============================================================================
// Middleware d'authentification pour les API
// =============================================================================

/**
 * Obtenir la session courante
 */
export async function getSession() {
  return getServerSession(authOptions);
}

/**
 * Vérifier que l'utilisateur est authentifié
 * Retourne la session ou null
 */
export async function requireAuth() {
  const session = await getSession();
  return session;
}

/**
 * Vérifier que l'utilisateur a le rôle requis
 */
export async function requireRole(requiredRoles: Role[]) {
  const session = await getSession();

  if (!session) {
    return { session: null, error: unauthorizedResponse() };
  }

  if (!requiredRoles.includes(session.user.role)) {
    return { session, error: forbiddenResponse() };
  }

  return { session, error: null };
}

/**
 * Vérifier que l'utilisateur est admin
 */
export async function requireAdmin() {
  return requireRole([Role.ADMIN]);
}

/**
 * Vérifier que l'utilisateur est gestionnaire ou admin
 */
export async function requireGestionnaireOrAdmin() {
  return requireRole([Role.GESTIONNAIRE, Role.ADMIN]);
}

// =============================================================================
// Validation des données
// =============================================================================

/**
 * Valider un email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valider un mot de passe (minimum 8 caractères)
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

/**
 * Parser et valider le body JSON d'une requête
 */
export async function parseBody<T>(request: Request): Promise<T | null> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

// =============================================================================
// Gestion des erreurs
// =============================================================================

/**
 * Wrapper pour les handlers d'API avec gestion des erreurs
 */
export function withErrorHandler(
  handler: (request: Request, context?: unknown) => Promise<NextResponse>
) {
  return async (request: Request, context?: unknown) => {
    try {
      return await handler(request, context);
    } catch (error) {
      console.error("API Error:", error);
      
      if (error instanceof Error) {
        // Erreur Prisma connue
        if (error.message.includes("Unique constraint")) {
          return errorResponse("Cette entrée existe déjà", 409, "CONFLICT");
        }
        if (error.message.includes("Foreign key constraint")) {
          return errorResponse("Référence invalide", 400, "INVALID_REFERENCE");
        }
        if (error.message.includes("Record to delete does not exist")) {
          return notFoundResponse();
        }
        
        return serverErrorResponse(error.message);
      }
      
      return serverErrorResponse();
    }
  };
}

