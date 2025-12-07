"use client";

// =============================================================================
// Indicateur d'heure limite
// =============================================================================

import { useState, useEffect } from "react";
import { canModifyForDate } from "@/hooks/use-settings";

interface DeadlineIndicatorProps {
  date: Date;
  deadlineTime: string;
  className?: string;
}

export function DeadlineIndicator({ date, deadlineTime, className = "" }: DeadlineIndicatorProps) {
  const [status, setStatus] = useState<ReturnType<typeof canModifyForDate> | null>(null);

  useEffect(() => {
    // Vérifier immédiatement
    setStatus(canModifyForDate(date, deadlineTime));

    // Mettre à jour toutes les 30 secondes
    const interval = setInterval(() => {
      setStatus(canModifyForDate(date, deadlineTime));
    }, 30000);

    return () => clearInterval(interval);
  }, [date, deadlineTime]);

  if (!status) return null;

  if (!status.canModify) {
    return (
      <div className={`flex items-center gap-1.5 text-red-600 ${className}`}>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-5V7a4 4 0 118 0v4" />
        </svg>
        <span className="text-xs font-medium">Verrouillé</span>
      </div>
    );
  }

  if (status.timeLeft) {
    // Moins d'une heure = urgent
    const isUrgent = !status.timeLeft.includes("h") || status.timeLeft.startsWith("0h");

    return (
      <div
        className={`flex items-center gap-1.5 ${
          isUrgent ? "text-amber-600" : "text-gray-500"
        } ${className}`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-xs font-medium">
          {isUrgent ? "⚠️ " : ""}Reste {status.timeLeft}
        </span>
      </div>
    );
  }

  return null;
}

// =============================================================================
// Badge de statut de réservation
// =============================================================================

interface ReservationStatusProps {
  date: Date;
  deadlineTime: string;
  hasReservation: boolean;
  consumptionMode?: "SUR_PLACE" | "A_EMPORTER";
}

export function ReservationStatus({
  date,
  deadlineTime,
  hasReservation,
  consumptionMode,
}: ReservationStatusProps) {
  const status = canModifyForDate(date, deadlineTime);

  if (!status.canModify) {
    // Verrouillé
    if (hasReservation) {
      return (
        <div className="text-center">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
            consumptionMode === "SUR_PLACE" 
              ? "bg-blue-100 text-blue-800" 
              : "bg-amber-100 text-amber-800"
          }`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {consumptionMode === "SUR_PLACE" ? "Sur place" : "À emporter"}
          </div>
          <p className="text-xs text-gray-400 mt-1">🔒 Verrouillé</p>
        </div>
      );
    }

    return (
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-500">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Non réservé
        </div>
        <p className="text-xs text-gray-400 mt-1">🔒 Verrouillé</p>
      </div>
    );
  }

  // Peut encore modifier
  if (hasReservation) {
    return (
      <div className="text-center">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
          consumptionMode === "SUR_PLACE" 
            ? "bg-blue-100 text-blue-800" 
            : "bg-amber-100 text-amber-800"
        }`}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {consumptionMode === "SUR_PLACE" ? "Sur place" : "À emporter"}
        </div>
        {status.timeLeft && (
          <p className="text-xs text-gray-500 mt-1">Modifiable ({status.timeLeft})</p>
        )}
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
        Non réservé
      </div>
      {status.timeLeft && (
        <p className="text-xs text-amber-600 mt-1">⏰ Réservez vite ! ({status.timeLeft})</p>
      )}
    </div>
  );
}

