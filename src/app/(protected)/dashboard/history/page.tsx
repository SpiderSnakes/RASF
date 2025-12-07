"use client";

// =============================================================================
// Page Historique des réservations
// =============================================================================

import { useState, useEffect, useCallback } from "react";
import { format, subMonths, startOfMonth, endOfMonth, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge, ConsumptionBadge, StatusBadge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";

interface Reservation {
  id: string;
  date: string;
  consumptionMode: "SUR_PLACE" | "A_EMPORTER";
  status: "BOOKED" | "SERVED" | "NO_SHOW";
  starterOption: { name: string } | null;
  mainOption: { name: string };
  dessertOption: { name: string } | null;
  createdAt: string;
}

export default function HistoryPage() {
  const [month, setMonth] = useState(() => new Date());
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    setError(null);

    const startDate = format(startOfMonth(month), "yyyy-MM-dd");
    const endDate = format(endOfMonth(month), "yyyy-MM-dd");

    try {
      const res = await fetch(`/api/reservations?startDate=${startDate}&endDate=${endDate}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      // Trier par date décroissante
      const sorted = (data.data || []).sort(
        (a: Reservation, b: Reservation) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setReservations(sorted);
    } catch (err) {
      setError("Erreur lors du chargement de l'historique");
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  // Stats du mois
  const stats = {
    total: reservations.length,
    surPlace: reservations.filter((r) => r.consumptionMode === "SUR_PLACE").length,
    aEmporter: reservations.filter((r) => r.consumptionMode === "A_EMPORTER").length,
    served: reservations.filter((r) => r.status === "SERVED").length,
  };

  return (
    <>
      <PageHeader
        title="Historique des réservations"
        description="Consultez vos réservations passées"
        actions={
          <Link href="/dashboard">
            <Button variant="outline">← Retour</Button>
          </Link>
        }
      />

      {/* Navigation des mois */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMonth(subMonths(month, 1))}
        >
          ← Mois précédent
        </Button>
        <span className="text-sm font-medium text-gray-700 capitalize">
          {format(month, "MMMM yyyy", { locale: fr })}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMonth(subMonths(month, -1))}
          disabled={format(month, "yyyy-MM") >= format(new Date(), "yyyy-MM")}
        >
          Mois suivant →
        </Button>
      </div>

      {error && (
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      )}

      {/* Stats du mois */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-500">Réservations</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.surPlace}</div>
            <div className="text-sm text-gray-500">Sur place</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">{stats.aEmporter}</div>
            <div className="text-sm text-gray-500">À emporter</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.served}</div>
            <div className="text-sm text-gray-500">Servis</div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des réservations */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Chargement...</div>
          ) : reservations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucune réservation ce mois-ci</p>
              <Link href="/dashboard" className="text-rasf-600 hover:text-rasf-700 text-sm mt-2 inline-block">
                Faire une réservation →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {reservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    {/* Date */}
                    <div className="sm:w-32 flex-shrink-0">
                      <p className="text-sm font-medium text-gray-900">
                        {format(parseISO(reservation.date), "EEEE", { locale: fr })}
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {format(parseISO(reservation.date), "d MMMM", { locale: fr })}
                      </p>
                    </div>

                    {/* Menu */}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {reservation.mainOption.name}
                      </p>
                      <div className="text-sm text-gray-500">
                        {reservation.starterOption && (
                          <span>Entrée : {reservation.starterOption.name}</span>
                        )}
                        {reservation.starterOption && reservation.dessertOption && " • "}
                        {reservation.dessertOption && (
                          <span>Dessert : {reservation.dessertOption.name}</span>
                        )}
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-2">
                      <ConsumptionBadge mode={reservation.consumptionMode} />
                      <StatusBadge status={reservation.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

