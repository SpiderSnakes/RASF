"use client";

// =============================================================================
// Hook pour récupérer les paramètres globaux
// =============================================================================

import { useState, useEffect } from "react";

interface Settings {
  reservationDeadline: string;
  openDays: number[];
  weeksInAdvance: number;
  maxDailyCapacity: number | null;
  notificationsEnabled: boolean;
  operationalTrackingEnabled: boolean;
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();

        if (!res.ok) throw new Error(data.error);

        setSettings(data.data);
      } catch (err) {
        setError("Erreur lors du chargement des paramètres");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
}

// =============================================================================
// Utilitaires pour vérifier l'heure limite
// =============================================================================

/**
 * Vérifie si on peut encore modifier une réservation pour une date donnée
 */
export function canModifyForDate(
  date: Date,
  deadlineTime: string,
  now: Date = new Date()
): { canModify: boolean; reason?: string; timeLeft?: string } {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  // Si la date est passée
  if (targetDay < today) {
    return { canModify: false, reason: "Date passée" };
  }

  // Si c'est un jour futur
  if (targetDay > today) {
    return { canModify: true };
  }

  // Si c'est aujourd'hui, vérifier l'heure limite
  const [hours, minutes] = deadlineTime.split(":").map(Number);
  const deadline = new Date(today);
  deadline.setHours(hours, minutes, 0, 0);

  if (now >= deadline) {
    return {
      canModify: false,
      reason: `Heure limite dépassée (${deadlineTime})`,
    };
  }

  // Calculer le temps restant
  const diff = deadline.getTime() - now.getTime();
  const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
  const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  let timeLeft = "";
  if (hoursLeft > 0) {
    timeLeft = `${hoursLeft}h${minutesLeft.toString().padStart(2, "0")}`;
  } else {
    timeLeft = `${minutesLeft} min`;
  }

  return { canModify: true, timeLeft };
}

/**
 * Vérifie si un jour est un jour d'ouverture
 */
export function isOpenDay(date: Date, openDays: number[]): boolean {
  return openDays.includes(date.getDay());
}

