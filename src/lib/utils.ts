// =============================================================================
// Utilitaires généraux
// =============================================================================

import {
  format,
  startOfWeek,
  endOfWeek,
  addWeeks,
  addDays,
  isBefore,
  isAfter,
  parseISO,
  setHours,
  setMinutes,
  setSeconds,
  startOfDay,
} from "date-fns";
import { fr } from "date-fns/locale";
import { prisma } from "./db";

// =============================================================================
// Formatage des dates
// =============================================================================

/**
 * Formater une date en français
 */
export function formatDate(date: Date | string, formatStr: string = "dd/MM/yyyy"): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, formatStr, { locale: fr });
}

/**
 * Formater une date pour l'affichage (ex: "Lundi 9 décembre 2024")
 */
export function formatDateLong(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "EEEE d MMMM yyyy", { locale: fr });
}

/**
 * Formater une date pour les inputs HTML (YYYY-MM-DD)
 */
export function formatDateInput(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "yyyy-MM-dd");
}

/**
 * Obtenir le jour de la semaine (0 = Dimanche, 1 = Lundi, etc.)
 */
export function getDayOfWeek(date: Date | string): number {
  const d = typeof date === "string" ? parseISO(date) : date;
  return d.getDay();
}

// =============================================================================
// Gestion des semaines
// =============================================================================

/**
 * Obtenir le lundi de la semaine
 */
export function getMonday(date: Date = new Date()): Date {
  return startOfWeek(date, { weekStartsOn: 1 });
}

/**
 * Obtenir le vendredi de la semaine
 */
export function getFriday(date: Date = new Date()): Date {
  return endOfWeek(date, { weekStartsOn: 1 });
}

/**
 * Obtenir les dates de la semaine (Lundi à Vendredi)
 */
export function getWeekDays(weekStart: Date = getMonday()): Date[] {
  const days: Date[] = [];
  for (let i = 0; i < 5; i++) {
    days.push(addDays(weekStart, i));
  }
  return days;
}

/**
 * Obtenir la plage de semaines disponibles pour réservation
 */
export async function getAvailableWeeks(): Promise<{ start: Date; end: Date }[]> {
  const settings = await prisma.settings.findUnique({
    where: { id: "global" },
  });

  const weeksInAdvance = settings?.weeksInAdvance ?? 2;
  const weeks: { start: Date; end: Date }[] = [];
  const today = new Date();

  for (let i = 0; i < weeksInAdvance; i++) {
    const weekStart = addWeeks(getMonday(today), i);
    const weekEnd = addDays(weekStart, 4); // Vendredi
    weeks.push({ start: weekStart, end: weekEnd });
  }

  return weeks;
}

// =============================================================================
// Gestion de l'heure limite
// =============================================================================

/**
 * Obtenir l'heure limite de réservation depuis les paramètres
 */
export async function getReservationDeadline(): Promise<string> {
  const settings = await prisma.settings.findUnique({
    where: { id: "global" },
  });
  return settings?.reservationDeadline ?? "10:00";
}

/**
 * Parser l'heure limite (format "HH:MM") et créer une Date pour un jour donné
 */
export function getDeadlineDateTime(date: Date, deadlineTime: string): Date {
  const [hours, minutes] = deadlineTime.split(":").map(Number);
  let deadline = startOfDay(date);
  deadline = setHours(deadline, hours);
  deadline = setMinutes(deadline, minutes);
  deadline = setSeconds(deadline, 0);
  return deadline;
}

/**
 * Vérifier si on peut encore réserver/modifier pour une date donnée
 */
export async function canModifyReservation(reservationDate: Date | string): Promise<boolean> {
  const date = typeof reservationDate === "string" ? parseISO(reservationDate) : reservationDate;
  const now = new Date();
  const today = startOfDay(now);
  const targetDay = startOfDay(date);

  // Si la date est passée, on ne peut plus modifier
  if (isBefore(targetDay, today)) {
    return false;
  }

  // Si c'est pour un jour futur (pas aujourd'hui), on peut modifier
  if (isAfter(targetDay, today)) {
    return true;
  }

  // Si c'est pour aujourd'hui, vérifier l'heure limite
  const deadline = await getReservationDeadline();
  const deadlineDateTime = getDeadlineDateTime(date, deadline);

  return isBefore(now, deadlineDateTime);
}

/**
 * Vérifier si un jour est un jour d'ouverture
 */
export async function isOpenDay(date: Date | string): Promise<boolean> {
  const d = typeof date === "string" ? parseISO(date) : date;
  const dayOfWeek = d.getDay();

  const settings = await prisma.settings.findUnique({
    where: { id: "global" },
  });

  const openDays = settings?.openDays ?? [1, 2, 3, 4, 5];
  return openDays.includes(dayOfWeek);
}

// =============================================================================
// Utilitaires divers
// =============================================================================

/**
 * Générer un slug à partir d'un texte
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Capitaliser la première lettre
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Formater un nom complet
 */
export function formatFullName(firstName: string, lastName: string): string {
  return `${capitalize(firstName)} ${lastName.toUpperCase()}`;
}

