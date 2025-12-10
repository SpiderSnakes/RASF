"use client";

// =============================================================================
// Modal de duplication de semaine
// =============================================================================

import { useState, useTransition } from "react";
import { format, startOfWeek, addWeeks } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { duplicateWeekAction } from "@/app/actions/menus";

interface DuplicateWeekModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DuplicateWeekModal({ isOpen, onClose, onSuccess }: DuplicateWeekModalProps) {
  const today = new Date();
  const thisWeekStart = startOfWeek(today, { weekStartsOn: 1 });
  
  // Générer les 8 dernières semaines comme sources possibles
  const sourceWeeks = Array.from({ length: 8 }, (_, i) => {
    const weekStart = addWeeks(thisWeekStart, -i - 1);
    return {
      value: format(weekStart, "yyyy-MM-dd"),
      label: `Semaine du ${format(weekStart, "d MMMM", { locale: fr })}`,
      start: weekStart,
    };
  });

  // Générer les 4 prochaines semaines comme destinations
  const targetWeeks = Array.from({ length: 4 }, (_, i) => {
    const weekStart = addWeeks(thisWeekStart, i);
    return {
      value: format(weekStart, "yyyy-MM-dd"),
      label: `Semaine du ${format(weekStart, "d MMMM", { locale: fr })}`,
      start: weekStart,
    };
  });

  const [sourceWeek, setSourceWeek] = useState(sourceWeeks[0].value);
  const [targetWeek, setTargetWeek] = useState(targetWeeks[1].value);
  const [overwrite, setOverwrite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ created: number; skipped: number } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setIsLoading(true);

    startTransition(async () => {
      try {
        const data = await duplicateWeekAction({
          sourceWeekStart: sourceWeek,
          targetWeekStart: targetWeek,
          overwrite,
        });
        setResult({ created: data.created ?? 0, skipped: data.skipped ?? 0 });
        if (data.created > 0) {
          setTimeout(() => {
            onSuccess();
          }, 1200);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      } finally {
        setIsLoading(false);
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Dupliquer une semaine
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <Alert variant="error" className="mb-4">
              {error}
            </Alert>
          )}

          {result && (
            <Alert variant="success" className="mb-4">
              {result.created} menu(s) créé(s), {result.skipped} ignoré(s)
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Semaine source */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Copier depuis
              </label>
              <select
                value={sourceWeek}
                onChange={(e) => setSourceWeek(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rasf-500 focus:border-rasf-500"
              >
                {sourceWeeks.map((week) => (
                  <option key={week.value} value={week.value}>
                    {week.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Flèche */}
            <div className="flex justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>

            {/* Semaine cible */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vers la semaine
              </label>
              <select
                value={targetWeek}
                onChange={(e) => setTargetWeek(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rasf-500 focus:border-rasf-500"
              >
                {targetWeeks.map((week) => (
                  <option key={week.value} value={week.value}>
                    {week.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Option d'écrasement */}
            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
              <input
                type="checkbox"
                id="overwrite"
                checked={overwrite}
                onChange={(e) => setOverwrite(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-rasf-600 focus:ring-rasf-500"
              />
              <label htmlFor="overwrite" className="text-sm text-amber-800">
                Écraser les menus existants
              </label>
            </div>

            {/* Note explicative */}
            <p className="text-xs text-gray-500">
              Les menus de la semaine source seront copiés vers la semaine cible.
              {!overwrite && " Les jours ayant déjà un menu seront ignorés."}
            </p>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
                Annuler
              </Button>
              <Button type="submit" isLoading={isLoading || isPending} className="flex-1">
                Dupliquer
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

