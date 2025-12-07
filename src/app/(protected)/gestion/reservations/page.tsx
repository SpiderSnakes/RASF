"use client";

// =============================================================================
// Page Gestion - Liste des réservations du jour
// =============================================================================

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { format, parseISO, startOfWeek, endOfWeek, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConsumptionBadge, StatusBadge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { ExportButton } from "@/components/export/export-button";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  canteenAccountNumber: string | null;
}

interface Reservation {
  id: string;
  date: string;
  consumptionMode: "SUR_PLACE" | "A_EMPORTER";
  status: "BOOKED" | "SERVED" | "NO_SHOW";
  user: User;
  starterOption: { name: string } | null;
  mainOption: { name: string };
  dessertOption: { name: string } | null;
  updatedAt: string;
}

function ReservationsContent() {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");
  
  const [selectedDate, setSelectedDate] = useState(
    dateParam || format(new Date(), "yyyy-MM-dd")
  );
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "SUR_PLACE" | "A_EMPORTER">("all");

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/reservations?date=${selectedDate}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setReservations(data.data || []);
    } catch (err) {
      setError("Erreur lors du chargement des réservations");
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleStatusChange = async (reservationId: string, newStatus: "SERVED" | "NO_SHOW") => {
    try {
      const res = await fetch(`/api/reservations/${reservationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      fetchReservations();
    } catch (err) {
      setError("Erreur lors de la mise à jour du statut");
    }
  };

  const filteredReservations = reservations.filter((r) => {
    if (filter === "all") return true;
    return r.consumptionMode === filter;
  });

  const stats = {
    total: reservations.length,
    surPlace: reservations.filter((r) => r.consumptionMode === "SUR_PLACE").length,
    aEmporter: reservations.filter((r) => r.consumptionMode === "A_EMPORTER").length,
    served: reservations.filter((r) => r.status === "SERVED").length,
    noShow: reservations.filter((r) => r.status === "NO_SHOW").length,
  };

  // Calculer les dates pour les exports semaine
  const weekStart = startOfWeek(parseISO(selectedDate), { weekStartsOn: 1 });
  const weekEnd = addDays(weekStart, 4);
  const weekStartStr = format(weekStart, "yyyy-MM-dd");

  // Options d'export
  const exportOptions = [
    {
      label: `Export detail - ${format(parseISO(selectedDate), "dd/MM", { locale: fr })}`,
      url: `/api/export/reservations?date=${selectedDate}&type=detail&period=day`,
    },
    {
      label: `Export synthese - ${format(parseISO(selectedDate), "dd/MM", { locale: fr })}`,
      url: `/api/export/reservations?date=${selectedDate}&type=summary&period=day`,
    },
    {
      label: `Export detail - Semaine du ${format(weekStart, "dd/MM", { locale: fr })}`,
      url: `/api/export/reservations?date=${weekStartStr}&type=detail&period=week`,
    },
    {
      label: `Export synthese - Semaine du ${format(weekStart, "dd/MM", { locale: fr })}`,
      url: `/api/export/reservations?date=${weekStartStr}&type=summary&period=week`,
    },
  ];

  return (
    <>
      <PageHeader
        title="Reservations du jour"
        description={format(parseISO(selectedDate), "EEEE d MMMM yyyy", { locale: fr })}
        actions={<ExportButton options={exportOptions} label="Exporter CSV" />}
      />

      {/* Selecteur de date et filtres */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full sm:w-auto"
        />
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            Tous ({stats.total})
          </Button>
          <Button
            variant={filter === "SUR_PLACE" ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilter("SUR_PLACE")}
          >
            Sur place ({stats.surPlace})
          </Button>
          <Button
            variant={filter === "A_EMPORTER" ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilter("A_EMPORTER")}
          >
            A emporter ({stats.aEmporter})
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      )}

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-500">Total</div>
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
          ) : filteredReservations.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Aucune réservation pour cette date
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Agent
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      N° Compte
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Menu
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">
                      Mode
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">
                      Statut
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.map((reservation) => (
                    <tr
                      key={reservation.id}
                      className="border-t border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">
                          {reservation.user.lastName.toUpperCase()}{" "}
                          {reservation.user.firstName}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {reservation.user.canteenAccountNumber || "-"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {reservation.mainOption.name}
                          </div>
                          {reservation.starterOption && (
                            <div className="text-gray-500">
                              Entrée: {reservation.starterOption.name}
                            </div>
                          )}
                          {reservation.dessertOption && (
                            <div className="text-gray-500">
                              Dessert: {reservation.dessertOption.name}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <ConsumptionBadge mode={reservation.consumptionMode} />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <StatusBadge status={reservation.status} />
                      </td>
                      <td className="py-3 px-4 text-center">
                        {reservation.status === "BOOKED" && (
                          <div className="flex justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleStatusChange(reservation.id, "SERVED")
                              }
                              title="Marquer comme servi"
                            >
                              ✓
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleStatusChange(reservation.id, "NO_SHOW")
                              }
                              title="Marquer comme non venu"
                            >
                              ✗
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

export default function ReservationsPage() {
  return (
    <Suspense fallback={
      <div className="text-center py-12 text-gray-500">Chargement...</div>
    }>
      <ReservationsContent />
    </Suspense>
  );
}
