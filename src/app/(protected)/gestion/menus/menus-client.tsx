"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format, startOfWeek, addWeeks, addDays, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { MenuFormModal } from "@/components/menu/menu-form-modal";
import { DuplicateWeekModal } from "@/components/menu/duplicate-week-modal";
import {
  deleteMenuAction,
  togglePublishMenuAction,
} from "@/app/actions/menus";

export type MenuOption = {
  id: string;
  name: string;
  courseType: "STARTER" | "MAIN" | "DESSERT";
};

export type MenuWithCourses = {
  id: string;
  date: string;
  sideDishes: string | null;
  notes: string | null;
  isPublished: boolean;
  starters: MenuOption[];
  mains: MenuOption[];
  desserts: MenuOption[];
};

type MenusClientProps = {
  weekStart: string; // ISO
  weekDays: string[]; // ISO per day (5 days)
  menus: MenuWithCourses[];
};

export function MenusClient({ weekStart, weekDays, menus }: MenusClientProps) {
  const router = useRouter();
  const [today, setToday] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setToday(new Date());
  }, []);

  const menusByDate = useMemo(() => {
    const map = new Map<string, MenuWithCourses>();
    menus.forEach((m) => map.set(new Date(m.date).toDateString(), m));
    return map;
  }, [menus]);

  const currentWeekStart = useMemo(() => startOfWeek(new Date(weekStart), { weekStartsOn: 1 }), [weekStart]);
  const weekDayDates = weekDays.map((d) => new Date(d));

  const getMenuForDate = (date: Date) => {
    return menusByDate.get(date.toDateString());
  };

  const handleDayClick = (date: Date) => {
    const menu = getMenuForDate(date);
    setSelectedDate(date.toISOString());
    setSelectedMenuId(menu?.id ?? null);
  };

  const handleModalClose = () => {
    setSelectedDate(null);
    setSelectedMenuId(null);
  };

  const handleSuccess = () => {
    handleModalClose();
    router.refresh();
  };

  const navigateWeek = (delta: number) => {
    const nextStart = addWeeks(currentWeekStart, delta);
    const param = format(nextStart, "yyyy-MM-dd");
    router.push(`/gestion/menus?week=${param}`);
  };

  const handleTogglePublish = (menu: MenuWithCourses) => {
    startTransition(async () => {
      setError(null);
      try {
        await togglePublishMenuAction(menu.id, !menu.isPublished);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors de la mise à jour");
      }
    });
  };

  const handleDelete = (menu: MenuWithCourses) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce menu ?")) return;
    startTransition(async () => {
      setError(null);
      try {
        await deleteMenuAction(menu.id);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors de la suppression");
      }
    });
  };

  const selectedMenu = selectedMenuId
    ? menus.find((m) => m.id === selectedMenuId) || null
    : null;

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

      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateWeek(-1)}
          disabled={isPending}
        >
          ← Semaine précédente
        </Button>
        <span className="text-sm font-medium text-gray-700">
          Semaine du {format(currentWeekStart, "d MMMM yyyy", { locale: fr })}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateWeek(1)}
          disabled={isPending}
        >
          Semaine suivante →
        </Button>
      </div>

      {error && (
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      )}

      <div className="space-y-4">
        {weekDayDates.map((day) => {
          const menu = getMenuForDate(day);
          const isToday = today ? isSameDay(day, today) : false;

          return (
            <Card
              key={day.toISOString()}
              className={isToday ? "ring-2 ring-rasf-500" : ""}
            >
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
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

                  <div className="flex-1">
                    {menu ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={menu.isPublished ? "success" : "warning"}>
                            {menu.isPublished ? "Publié" : "Brouillon"}
                          </Badge>
                        </div>

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
                          disabled={isPending}
                        >
                          {menu.isPublished ? "Dépublier" : "Publier"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(menu)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          disabled={isPending}
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

      {selectedDate && (
        <MenuFormModal
          isOpen
          onClose={handleModalClose}
          date={new Date(selectedDate)}
          existingMenu={selectedMenu}
          onSuccess={handleSuccess}
        />
      )}

      {showDuplicateModal && (
        <DuplicateWeekModal
          isOpen
          onClose={() => setShowDuplicateModal(false)}
          onSuccess={() => {
            setShowDuplicateModal(false);
            router.refresh();
          }}
        />
      )}
    </>
  );
}

