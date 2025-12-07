"use client";

// =============================================================================
// Modal de réservation / modification
// =============================================================================

import { useState, useEffect } from "react";
import { format, isToday } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { useSettings, canModifyForDate } from "@/hooks/use-settings";

interface MenuOption {
  id: string;
  name: string;
}

interface Menu {
  id: string;
  date: string;
  sideDishes: string | null;
  starters: MenuOption[];
  mains: MenuOption[];
  desserts: MenuOption[];
}

interface Reservation {
  id: string;
  consumptionMode: "SUR_PLACE" | "A_EMPORTER";
  starterOption: { id: string; name: string } | null;
  mainOption: { id: string; name: string };
  dessertOption: { id: string; name: string } | null;
}

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  menu: Menu;
  existingReservation: Reservation | null;
  onSuccess: () => void;
}

export function ReservationModal({
  isOpen,
  onClose,
  date,
  menu,
  existingReservation,
  onSuccess,
}: ReservationModalProps) {
  const { settings } = useSettings();
  const [starterId, setStarterId] = useState<string>("");
  const [mainId, setMainId] = useState<string>("");
  const [dessertId, setDessertId] = useState<string>("");
  const [consumptionMode, setConsumptionMode] = useState<"SUR_PLACE" | "A_EMPORTER">("SUR_PLACE");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!existingReservation;
  const deadlineTime = settings?.reservationDeadline || "10:00";
  const deadlineStatus = canModifyForDate(date, deadlineTime);

  // Initialiser les valeurs avec la réservation existante
  useEffect(() => {
    if (existingReservation) {
      setStarterId(existingReservation.starterOption?.id || "");
      setMainId(existingReservation.mainOption.id);
      setDessertId(existingReservation.dessertOption?.id || "");
      setConsumptionMode(existingReservation.consumptionMode);
    } else {
      // Valeurs par défaut
      setStarterId(menu.starters.length === 1 ? menu.starters[0].id : "");
      setMainId(menu.mains.length === 1 ? menu.mains[0].id : "");
      setDessertId(menu.desserts.length === 1 ? menu.desserts[0].id : "");
      setConsumptionMode("SUR_PLACE");
    }
  }, [existingReservation, menu]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!mainId) {
      setError("Veuillez sélectionner un plat principal");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        date: format(date, "yyyy-MM-dd"),
        mainOptionId: mainId,
        starterOptionId: starterId || undefined,
        dessertOptionId: dessertId || undefined,
        consumptionMode,
      };

      const url = isEditing
        ? `/api/reservations/${existingReservation.id}`
        : "/api/reservations";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la sauvegarde");
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!existingReservation) return;
    if (!confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/reservations/${existingReservation.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'annulation");
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {isEditing ? "Modifier ma réservation" : "Réserver mon repas"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {format(date, "EEEE d MMMM yyyy", { locale: fr })}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Alerte heure limite pour aujourd'hui */}
          {isToday(date) && deadlineStatus.canModify && deadlineStatus.timeLeft && (
            <Alert variant="warning" className="mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  <strong>Attention !</strong> Il vous reste <strong>{deadlineStatus.timeLeft}</strong> pour {isEditing ? "modifier" : "réserver"}.
                  Heure limite : {deadlineTime}.
                </span>
              </div>
            </Alert>
          )}

          {/* Accompagnements */}
          {menu.sideDishes && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 uppercase font-medium">Accompagnements</p>
              <p className="text-sm text-gray-700">{menu.sideDishes}</p>
            </div>
          )}

          {error && (
            <Alert variant="error" className="mb-4">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Entrée (si plusieurs choix) */}
            {menu.starters.length > 1 && (
              <Select
                label="Entrée"
                value={starterId}
                onChange={(e) => setStarterId(e.target.value)}
                options={[
                  { value: "", label: "Aucune entrée" },
                  ...menu.starters.map((s) => ({ value: s.id, label: s.name })),
                ]}
              />
            )}
            {menu.starters.length === 1 && (
              <div>
                <p className="text-sm font-medium text-gray-700">Entrée</p>
                <p className="text-sm text-gray-600">{menu.starters[0].name}</p>
              </div>
            )}

            {/* Plat principal */}
            {menu.mains.length > 1 ? (
              <Select
                label="Plat principal *"
                value={mainId}
                onChange={(e) => setMainId(e.target.value)}
                options={menu.mains.map((m) => ({ value: m.id, label: m.name }))}
                placeholder="Sélectionnez un plat"
                required
              />
            ) : (
              <div>
                <p className="text-sm font-medium text-gray-700">Plat principal</p>
                <p className="text-sm text-gray-600">{menu.mains[0]?.name || "Non disponible"}</p>
              </div>
            )}

            {/* Dessert (si plusieurs choix) */}
            {menu.desserts.length > 1 && (
              <Select
                label="Dessert"
                value={dessertId}
                onChange={(e) => setDessertId(e.target.value)}
                options={[
                  { value: "", label: "Aucun dessert" },
                  ...menu.desserts.map((d) => ({ value: d.id, label: d.name })),
                ]}
              />
            )}
            {menu.desserts.length === 1 && (
              <div>
                <p className="text-sm font-medium text-gray-700">Dessert</p>
                <p className="text-sm text-gray-600">{menu.desserts[0].name}</p>
              </div>
            )}

            {/* Mode de consommation */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Mode de consommation *
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setConsumptionMode("SUR_PLACE")}
                  className={`
                    p-3 rounded-lg border-2 text-center transition-all
                    ${consumptionMode === "SUR_PLACE"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300"
                    }
                  `}
                >
                  <svg className="w-6 h-6 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="text-sm font-medium">Sur place</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConsumptionMode("A_EMPORTER")}
                  className={`
                    p-3 rounded-lg border-2 text-center transition-all
                    ${consumptionMode === "A_EMPORTER"
                      ? "border-amber-500 bg-amber-50 text-amber-700"
                      : "border-gray-200 hover:border-gray-300"
                    }
                  `}
                >
                  <svg className="w-6 h-6 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span className="text-sm font-medium">À emporter</span>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              {isEditing && (
                <Button
                  type="button"
                  variant="danger"
                  onClick={handleDelete}
                  isLoading={isLoading}
                >
                  Annuler
                </Button>
              )}
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
              >
                Fermer
              </Button>
              <Button type="submit" isLoading={isLoading} className="flex-1">
                {isEditing ? "Modifier" : "Réserver"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

