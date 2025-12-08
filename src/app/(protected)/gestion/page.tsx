"use client";

// =============================================================================
// Page Gestion RASF - Tableau de bord
// =============================================================================

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { format, startOfWeek, addDays, parseISO, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

interface DayStats {
  date: string;
  total: number;
  surPlace: number;
  aEmporter: number;
  served: number;
  noShow: number;
}

export default function GestionPage() {
  const [weekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [stats, setStats] = useState<DayStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const weekDays = useMemo(
    () => Array.from({ length: 5 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const startDate = format(weekStart, "yyyy-MM-dd");
        const endDate = format(addDays(weekStart, 4), "yyyy-MM-dd");
        
        const res = await fetch(`/api/reservations?startDate=${startDate}&endDate=${endDate}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error);

        // Calculer les stats par jour
        const reservations = data.data || [];
        const dayStats: DayStats[] = weekDays.map((day) => {
          const dayReservations = reservations.filter((r: { date: string }) =>
            isSameDay(parseISO(r.date), day)
          );

          return {
            date: format(day, "yyyy-MM-dd"),
            total: dayReservations.length,
            surPlace: dayReservations.filter((r: { consumptionMode: string }) => r.consumptionMode === "SUR_PLACE").length,
            aEmporter: dayReservations.filter((r: { consumptionMode: string }) => r.consumptionMode === "A_EMPORTER").length,
            served: dayReservations.filter((r: { status: string }) => r.status === "SERVED").length,
            noShow: dayReservations.filter((r: { status: string }) => r.status === "NO_SHOW").length,
          };
        });

        setStats(dayStats);
      } catch (err) {
        setError("Erreur lors du chargement des statistiques");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [weekDays, weekStart]);

  const totalWeek = stats.reduce((acc, s) => acc + s.total, 0);
  const totalSurPlace = stats.reduce((acc, s) => acc + s.surPlace, 0);
  const totalEmporter = stats.reduce((acc, s) => acc + s.aEmporter, 0);

  return (
    <>
      <PageHeader
        title="Gestion RASF"
        description="Tableau de bord et gestion des réservations"
        actions={
          <div className="flex gap-2">
            <Link href="/gestion/menus">
              <Button variant="outline">Gérer les menus</Button>
            </Link>
            <Link href="/gestion/reservations">
              <Button>Voir les réservations</Button>
            </Link>
          </div>
        }
      />

      {error && (
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      )}

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-500">Total semaine</div>
            <div className="text-3xl font-bold text-gray-900 mt-1">
              {loading ? "..." : totalWeek}
            </div>
            <div className="text-sm text-gray-600">réservations</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-500">Sur place</div>
            <div className="text-3xl font-bold text-blue-600 mt-1">
              {loading ? "..." : totalSurPlace}
            </div>
            <div className="text-sm text-gray-600">
              ({totalWeek > 0 ? Math.round((totalSurPlace / totalWeek) * 100) : 0}%)
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-500">À emporter</div>
            <div className="text-3xl font-bold text-amber-600 mt-1">
              {loading ? "..." : totalEmporter}
            </div>
            <div className="text-sm text-gray-600">
              ({totalWeek > 0 ? Math.round((totalEmporter / totalWeek) * 100) : 0}%)
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau par jour */}
      <Card>
        <CardHeader>
          <CardTitle>
            Semaine du {format(weekStart, "d MMMM yyyy", { locale: fr })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Jour
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">
                    Total
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-blue-600">
                    Sur place
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-amber-600">
                    À emporter
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      Chargement...
                    </td>
                  </tr>
                ) : (
                  stats.map((day, index) => (
                    <tr key={day.date} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">
                          {format(weekDays[index], "EEEE", { locale: fr })}
                        </div>
                        <div className="text-sm text-gray-500">
                          {format(weekDays[index], "d MMMM", { locale: fr })}
                        </div>
                      </td>
                      <td className="text-center py-3 px-4 font-semibold text-gray-900">
                        {day.total}
                      </td>
                      <td className="text-center py-3 px-4 text-blue-600 font-medium">
                        {day.surPlace}
                      </td>
                      <td className="text-center py-3 px-4 text-amber-600 font-medium">
                        {day.aEmporter}
                      </td>
                      <td className="text-center py-3 px-4">
                        <Link href={`/gestion/reservations?date=${day.date}`}>
                          <Button variant="ghost" size="sm">
                            Détails
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Exporter les données</h3>
            <p className="text-sm text-gray-600 mb-4">
              Téléchargez les réservations au format CSV ou Excel
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Export CSV
              </Button>
              <Button variant="outline" size="sm">
                Export Excel
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Gérer les menus</h3>
            <p className="text-sm text-gray-600 mb-4">
              Créez et modifiez les menus de la semaine
            </p>
            <Link href="/gestion/menus">
              <Button variant="outline" size="sm">
                Accéder aux menus
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

