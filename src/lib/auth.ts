// =============================================================================
// Configuration NextAuth.js et utilitaires d'authentification
// =============================================================================

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { Role, AccountStatus } from "@prisma/client";

// Extension des types NextAuth pour inclure nos champs personnalisés
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: Role;
      canteenAccountNumber: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    canteenAccountNumber: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    canteenAccountNumber: string | null;
  }
}

// =============================================================================
// Configuration NextAuth
// =============================================================================

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email et mot de passe requis");
        }

        // Rechercher l'utilisateur
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });

        if (!user) {
          throw new Error("Email ou mot de passe incorrect");
        }

        // Vérifier le statut du compte
        if (user.status === AccountStatus.PENDING) {
          throw new Error("Compte en attente d'activation. Vérifiez vos emails.");
        }

        if (user.status === AccountStatus.DISABLED) {
          throw new Error("Compte désactivé. Contactez l'administrateur.");
        }

        // Vérifier le mot de passe
        if (!user.passwordHash) {
          throw new Error("Compte non activé. Vérifiez vos emails.");
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isValidPassword) {
          throw new Error("Email ou mot de passe incorrect");
        }

        // Mettre à jour la date de dernière connexion
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          canteenAccountNumber: user.canteenAccountNumber,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.role = user.role;
        token.canteenAccountNumber = user.canteenAccountNumber;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        firstName: token.firstName,
        lastName: token.lastName,
        role: token.role,
        canteenAccountNumber: token.canteenAccountNumber,
      };
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 heures
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// =============================================================================
// Utilitaires pour les mots de passe
// =============================================================================

/**
 * Hasher un mot de passe
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * Vérifier un mot de passe
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Générer un token aléatoire (pour activation, reset password)
 */
export function generateToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// =============================================================================
// Vérification des rôles
// =============================================================================

/**
 * Vérifier si l'utilisateur a le rôle requis
 */
export function hasRole(userRole: Role, requiredRoles: Role[]): boolean {
  return requiredRoles.includes(userRole);
}

/**
 * Vérifier si l'utilisateur est admin
 */
export function isAdmin(role: Role): boolean {
  return role === Role.ADMIN;
}

/**
 * Vérifier si l'utilisateur est gestionnaire ou admin
 */
export function isGestionnaireOrAdmin(role: Role): boolean {
  return role === Role.GESTIONNAIRE || role === Role.ADMIN;
}

