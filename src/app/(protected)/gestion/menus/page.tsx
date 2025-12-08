"use client";

// =============================================================================
// Page Gestion - Liste et création des menus
// =============================================================================

import { useState, useEffect, useCallback, useMemo } from "react";
import { format, startOfWeek, addWeeks, addDays, parseISO, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { MenuFormModal } from "@/components/menu/menu-form-modal";
import { DuplicateWeekModal } from "@/components/menu/duplicate-week-modal";

interface MenuOption {
  id: string;
  name: string;
  courseType: "STARTER" | "MAIN" | "DESSERT";
}

interface Menu {
  id: string;
  date: string;
  sideDishes: string | null;
  notes: string | null;
  isPublished: boolean;
  options: MenuOption[];
  starters: MenuOption[];
  mains: MenuOption[];
  desserts: MenuOption[];
}

export default function MenusPage() {
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [today, setToday] = useState<Date | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modals
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  const weekDays = useMemo(
    () => Array.from({ length: 5 }, (_, i) => addDays(currentWeekStart, i)),
    [currentWeekStart]
  );

  // Eviter les mismatches SSR/CSR (hydratation) en fixant la date apres montage
  useEffect(() => {
    setToday(new Date());
  }, []);

  const fetchMenus = useCallback(async () => {
    setLoading(true);
    setError(null);

    const startDate = format(currentWeekStart, "yyyy-MM-dd");
    const endDate = format(addDays(currentWeekStart, 4), "yyyy-MM-dd");

    try {
      const res = await fetch(`/api/menus?startDate=${startDate}&endDate=${endDate}`, {
        cache: "no-store",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setMenus(data.data || []);
    } catch (err) {
      setError("Erreur lors du chargement des menus");
    } finally {
      setLoading(false);
    }
  }, [currentWeekStart]);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  const getMenuForDate = (date: Date): Menu | undefined => {
    return menus.find((m) => isSameDay(parseISO(m.date), date));
  };

  const handleDayClick = (date: Date) => {
    const menu = getMenuForDate(date);
    setSelectedDate(date);
    setSelectedMenu(menu || null);
  };

  const handleModalClose = () => {
    setSelectedDate(null);
    setSelectedMenu(null);
  };

  const handleSuccess = (menu: Menu) => {
    setMenus((prev) => {
      const existingIndex = prev.findIndex((m) => m.id === menu.id);
      const nextMenus = existingIndex >= 0
        ? prev.map((m, idx) => (idx === existingIndex ? menu : m))
        : [...prev, menu];

      return nextMenus.sort(
        (a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime()
      );
    });

    handleModalClose();
    fetchMenus();
  };

  const handleTogglePublish = async (menu: Menu) => {
    try {
      const res = await fetch(`/api/menus/${menu.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !menu.isPublished }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      setMenus((prev) =>
        prev.map((m) =>
          m.id === menu.id ? { ...m, isPublished: !menu.isPublished } : m
        )
      );
      fetchMenus();
    } catch (err) {
      setError("Erreur lors de la mise à jour");
    }
  };

  const handleDelete = async (menu: Menu) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce menu ?")) return;

    try {
      const res = await fetch(`/api/menus/${menu.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      setMenus((prev) => prev.filter((m) => m.id !== menu.id));
      if (selectedMenu?.id === menu.id) {
        setSelectedMenu(null);
        setSelectedDate(null);
      }
      fetchMenus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression");
    }
  };

  return (
    <>
      <PageHeader
        title="Gestion des menus"
        description="Créez et modifiez les menus de la semaine"
        actions={
          <Button onClick={() => setShowDuplicateModal(true)}>
            Dupliquer une semaine
          </Button>
        }
      />

      {/* Navigation des semaines */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentWeekStart(addWeeks(currentWeekStart, -1))}
        >
          ← Semaine précédente
        </Button>
        <span className="text-sm font-medium text-gray-700">
          Semaine du {format(currentWeekStart, "d MMMM yyyy", { locale: fr })}
        </span>
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
      <div className="space-y-4">
        {weekDays.map((day) => {
          const menu = getMenuForDate(day);
          const isToday = today ? isSameDay(day, today) : false;

          return (
            <Card
              key={day.toISOString()}
              className={isToday ? "ring-2 ring-rasf-500" : ""}
            >
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {/* Date */}
                  <div className="md:w-32 flex-shrink-0">
                    <p className="text-sm text-gray-500 capitalize">
                      {format(day, "EEEE", { locale: fr })}
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {format(day, "d MMMM", { locale: fr })}
                    </p>
                    {isToday && (
                      <Badge variant="info" className="mt-1">Aujourd&apos;hui</Badge>
                    )}
                  </div>

                  {/* Contenu du menu */}
                  <div className="flex-1">
                    {loading ? (
                      <div className="text-gray-400">Chargement...</div>
                    ) : menu ? (
                      <div className="space-y-2">
                        {/* Statut */}
                        <div className="flex items-center gap-2">
                          <Badge variant={menu.isPublished ? "success" : "warning"}>
                            {menu.isPublished ? "Publié" : "Brouillon"}
                          </Badge>
                        </div>

                        {/* Plats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                          {menu.starters.length > 0 && (
                            <div>
                              <p className="text-xs text-gray-500 uppercase font-medium">Entrées</p>
                              <ul className="text-gray-700">
                                {menu.starters.map((s) => (
                                  <li key={s.id}>• {s.name}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <div>
                            <p className="text-xs text-gray-500 uppercase font-medium">Plats</p>
                            <ul className="text-gray-700">
                              {menu.mains.map((m) => (
                                <li key={m.id}>• {m.name}</li>
                              ))}
                            </ul>
                          </div>
                          {menu.desserts.length > 0 && (
                            <div>
                              <p className="text-xs text-gray-500 uppercase font-medium">Desserts</p>
                              <ul className="text-gray-700">
                                {menu.desserts.map((d) => (
                                  <li key={d.id}>• {d.name}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Accompagnements */}
                        {menu.sideDishes && (
                          <p className="text-xs text-gray-500">
                            <span className="font-medium">Accompagnements :</span> {menu.sideDishes}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-400 italic">Pas de menu défini</div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 md:flex-col">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDayClick(day)}
                    >
                      {menu ? "Modifier" : "Créer"}
                    </Button>
                    {menu && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTogglePublish(menu)}
                        >
                          {menu.isPublished ? "Dépublier" : "Publier"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(menu)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Supprimer
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Modal de création/modification */}
      {selectedDate && (
        <MenuFormModal
          isOpen={true}
          onClose={handleModalClose}
          date={selectedDate}
          existingMenu={selectedMenu}
          onSuccess={handleSuccess}
        />
      )}

      {/* Modal de duplication */}
      {showDuplicateModal && (
        <DuplicateWeekModal
          isOpen={true}
          onClose={() => setShowDuplicateModal(false)}
          onSuccess={() => {
            setShowDuplicateModal(false);
            fetchMenus();
          }}
        />
      )}
    </>
  );
}

