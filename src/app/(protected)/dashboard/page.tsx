"use client";

// =============================================================================
// Dashboard Agent - Vue des réservations de la semaine
// =============================================================================

import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import { format, startOfWeek, addDays, addWeeks, isSameDay, parseISO, isToday, isBefore, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { ReservationModal } from "@/components/reservation/reservation-modal";
import { useSettings, canModifyForDate, isOpenDay } from "@/hooks/use-settings";

interface MenuOption {
  id: string;
  name: string;
  courseType: string;
}

interface Menu {
  id: string;
  date: string;
  sideDishes: string | null;
  isPublished: boolean;
  starters: MenuOption[];
  mains: MenuOption[];
  desserts: MenuOption[];
}

interface Reservation {
  id: string;
  date: string;
  consumptionMode: "SUR_PLACE" | "A_EMPORTER";
  starterOption: { id: string; name: string } | null;
  mainOption: { id: string; name: string };
  dessertOption: { id: string; name: string } | null;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const { settings } = useSettings();
  
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [menus, setMenus] = useState<Menu[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [today, setToday] = useState<Date | null>(null);

  const weekDays = Array.from({ length: 5 }, (_, i) => addDays(currentWeekStart, i));
  const deadlineTime = settings?.reservationDeadline || "10:00";
  const openDays = settings?.openDays || [1, 2, 3, 4, 5];

  useEffect(() => {
    setToday(new Date());
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const startDate = format(currentWeekStart, "yyyy-MM-dd");
    const endDate = format(addDays(currentWeekStart, 4), "yyyy-MM-dd");

    try {
      const [menusRes, reservationsRes] = await Promise.all([
        fetch(`/api/menus?startDate=${startDate}&endDate=${endDate}&published=true`, { cache: "no-store" }),
        fetch(`/api/reservations?startDate=${startDate}&endDate=${endDate}`, { cache: "no-store" }),
      ]);

      if (!menusRes.ok || !reservationsRes.ok) {
        throw new Error("Erreur lors du chargement des données");
      }

      const menusData = await menusRes.json();
      const reservationsData = await reservationsRes.json();

      setMenus(menusData.data || []);
      setReservations(reservationsData.data || []);
    } catch (err) {
      setError("Impossible de charger les données. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }, [currentWeekStart]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getMenuForDate = (date: Date): Menu | undefined => {
    return menus.find((m) => isSameDay(parseISO(m.date), date));
  };

  const getReservationForDate = (date: Date): Reservation | undefined => {
    return reservations.find((r) => isSameDay(parseISO(r.date), date));
  };

  const handleDayClick = (date: Date) => {
    const menu = getMenuForDate(date);
    const reservation = getReservationForDate(date);
    const status = canModifyForDate(date, deadlineTime);

    // Si verrouillé, ne rien faire
    if (!status.canModify) return;

    if (menu) {
      setSelectedDate(date);
      setSelectedMenu(menu);
      setSelectedReservation(reservation || null);
    }
  };

  const handleModalClose = () => {
    setSelectedDate(null);
    setSelectedMenu(null);
    setSelectedReservation(null);
  };

  const handleReservationSuccess = () => {
    fetchData();
    handleModalClose();
  };

  // Calculer les stats de la semaine
  const weekStats = {
    total: reservations.length,
    surPlace: reservations.filter((r) => r.consumptionMode === "SUR_PLACE").length,
    aEmporter: reservations.filter((r) => r.consumptionMode === "A_EMPORTER").length,
  };

  return (
    <>
      <PageHeader
        title={`Bonjour ${session?.user.firstName} !`}
        description="Gérez vos réservations de repas pour la semaine"
        actions={
          <Link href="/dashboard/history">
            <Button variant="outline" size="sm">
              Historique
            </Button>
          </Link>
        }
      />

      {/* Bandeau heure limite */}
      <div className="mb-6 p-4 bg-rasf-50 border border-rasf-200 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-rasf-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-rasf-900">
              Heure limite de réservation : <span className="font-bold">{deadlineTime}</span>
            </p>
            <p className="text-xs text-rasf-700">
              Réservez ou modifiez vos repas avant cette heure le jour même.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation des semaines */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentWeekStart(addWeeks(currentWeekStart, -1))}
        >
          ← Semaine précédente
        </Button>
        <div className="text-center">
          <span className="text-sm font-medium text-gray-700">
            Semaine du {format(currentWeekStart, "d MMMM yyyy", { locale: fr })}
          </span>
          {weekStats.total > 0 && (
            <p className="text-xs text-gray-500">
              {weekStats.total} repas réservé{weekStats.total > 1 ? "s" : ""}
              {weekStats.surPlace > 0 && ` • ${weekStats.surPlace} sur place`}
              {weekStats.aEmporter > 0 && ` • ${weekStats.aEmporter} à emporter`}
            </p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentWeekStart(addWeeks(currentWeekStart, 1))}
        >
          Semaine suivante →
        </Button>
      </div>

      {error && (
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      )}

      {/* Grille des jours */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {weekDays.map((day) => {
          const menu = getMenuForDate(day);
          const reservation = getReservationForDate(day);
          const status = canModifyForDate(day, deadlineTime);
          const open = isOpenDay(day, openDays);
          const isTodayFlag = today ? isToday(day) : false;
          const past = today ? isBefore(startOfDay(day), startOfDay(today)) && !isTodayFlag : false;

          return (
            <Card
              key={day.toISOString()}
              className={`
                transition-all duration-200
                ${isTodayFlag ? "ring-2 ring-rasf-500 ring-offset-2" : ""}
                ${past || !status.canModify ? "opacity-60" : ""}
                ${status.canModify && menu ? "cursor-pointer hover:shadow-md" : ""}
                ${reservation ? "bg-rasf-50 border-rasf-200" : ""}
              `}
              onClick={() => status.canModify && menu && handleDayClick(day)}
            >
              <CardContent className="p-4">
                {/* En-tête du jour */}
                <div className="text-center mb-3">
                  <p className="text-xs text-gray-500 uppercase font-medium">
                    {format(day, "EEEE", { locale: fr })}
                  </p>
                  <p className={`text-2xl font-bold ${isTodayFlag ? "text-rasf-600" : "text-gray-900"}`}>
                    {format(day, "d")}
                  </p>
                  {isTodayFlag && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-rasf-100 text-rasf-700 text-xs font-medium rounded-full">
                      Aujourd&apos;hui
                    </span>
                  )}
                </div>

                {loading ? (
                  <div className="h-24 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-rasf-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : !open ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-400">Fermé</p>
                  </div>
                ) : menu ? (
                  <div className="space-y-3">
                    {/* Plats disponibles */}
                    <div className="text-xs text-gray-600 text-center">
                      {menu.mains.map((m) => m.name).join(" / ")}
                    </div>

                    {/* Statut de réservation */}
                    {reservation ? (
                      <div className="text-center space-y-1">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                          reservation.consumptionMode === "SUR_PLACE"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {reservation.consumptionMode === "SUR_PLACE" ? (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                          )}
                          {reservation.consumptionMode === "SUR_PLACE" ? "Sur place" : "À emporter"}
                        </div>
                        <p className="text-xs text-gray-600 font-medium">
                          {reservation.mainOption.name}
                        </p>
                        {!status.canModify ? (
                          <p className="text-xs text-gray-400">🔒 Verrouillé</p>
                        ) : status.timeLeft ? (
                          <p className="text-xs text-gray-500">Modifiable ({status.timeLeft})</p>
                        ) : null}
                      </div>
                    ) : (
                      <div className="text-center space-y-1">
                        <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                          Non réservé
                        </div>
                        {!status.canModify ? (
                          <p className="text-xs text-gray-400">🔒 Verrouillé</p>
                        ) : status.timeLeft ? (
                          <p className="text-xs text-amber-600 font-medium">⏰ {status.timeLeft}</p>
                        ) : null}
                      </div>
                    )}

                    {/* Bouton d'action */}
                    {status.canModify && (
                      <Button
                        variant={reservation ? "outline" : "primary"}
                        size="sm"
                        fullWidth
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDayClick(day);
                        }}
                      >
                        {reservation ? "Modifier" : "Réserver"}
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-400 italic">Pas de menu</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Légende */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Légende</h3>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-rasf-50 border border-rasf-200" />
            <span>Réservé</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-white border border-gray-200" />
            <span>Non réservé</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">Sur place</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">À emporter</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">🔒</span>
            <span>Après {deadlineTime}</span>
          </div>
        </div>
      </div>

      {/* Modal de réservation */}
      {selectedDate && selectedMenu && (
        <ReservationModal
          isOpen={true}
          onClose={handleModalClose}
          date={selectedDate}
          menu={selectedMenu}
          existingReservation={selectedReservation}
          onSuccess={handleReservationSuccess}
        />
      )}
    </>
  );
}
