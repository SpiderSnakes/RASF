"use client";

// =============================================================================
// Page Admin - Paramètres globaux
// =============================================================================

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";

interface Settings {
  reservationDeadline: string;
  openDays: number[];
  weeksInAdvance: number;
  maxDailyCapacity: number | null;
  notificationsEnabled: boolean;
  operationalTrackingEnabled: boolean;
}

const DAYS_OF_WEEK = [
  { value: 1, label: "Lundi" },
  { value: 2, label: "Mardi" },
  { value: 3, label: "Mercredi" },
  { value: 4, label: "Jeudi" },
  { value: 5, label: "Vendredi" },
  { value: 6, label: "Samedi" },
  { value: 0, label: "Dimanche" },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setSuccess("Paramètres enregistrés avec succès");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const toggleDay = (day: number) => {
    if (!settings) return;

    const newDays = settings.openDays.includes(day)
      ? settings.openDays.filter((d) => d !== day)
      : [...settings.openDays, day].sort();

    setSettings({ ...settings, openDays: newDays });
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-500">
        Chargement des paramètres...
      </div>
    );
  }

  if (!settings) {
    return (
      <Alert variant="error">
        Impossible de charger les paramètres
      </Alert>
    );
  }

  return (
    <>
      <PageHeader
        title="Paramètres globaux"
        description="Configurez les règles de fonctionnement de l'application"
      />

      {error && (
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" className="mb-6">
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Heure limite */}
        <Card>
          <CardHeader>
            <CardTitle>Heure limite de réservation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Heure limite pour réserver, modifier ou annuler une réservation le jour même.
            </p>
            <Input
              type="time"
              value={settings.reservationDeadline}
              onChange={(e) =>
                setSettings({ ...settings, reservationDeadline: e.target.value })
              }
              className="w-32"
            />
          </CardContent>
        </Card>

        {/* Jours d'ouverture */}
        <Card>
          <CardHeader>
            <CardTitle>Jours d&apos;ouverture</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Sélectionnez les jours où le restaurant est ouvert.
            </p>
            <div className="flex flex-wrap gap-2">
              {DAYS_OF_WEEK.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => toggleDay(day.value)}
                  className={`
                    px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors
                    ${
                      settings.openDays.includes(day.value)
                        ? "border-rasf-500 bg-rasf-50 text-rasf-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }
                  `}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Nombre de semaines */}
        <Card>
          <CardHeader>
            <CardTitle>Période de réservation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Nombre de semaines visibles pour les réservations.
            </p>
            <Input
              type="number"
              min="1"
              max="8"
              value={settings.weeksInAdvance}
              onChange={(e) =>
                setSettings({ ...settings, weeksInAdvance: parseInt(e.target.value) })
              }
              className="w-24"
            />
            <p className="text-xs text-gray-500 mt-1">
              Entre 1 et 8 semaines
            </p>
          </CardContent>
        </Card>

        {/* Capacité maximale */}
        <Card>
          <CardHeader>
            <CardTitle>Capacité maximale (optionnel)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Nombre maximum de repas par jour. Laissez vide pour illimité.
            </p>
            <Input
              type="number"
              min="0"
              value={settings.maxDailyCapacity || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  maxDailyCapacity: e.target.value ? parseInt(e.target.value) : null,
                })
              }
              placeholder="Illimité"
              className="w-32"
            />
          </CardContent>
        </Card>

        {/* Suivi opérationnel */}
        <Card>
          <CardHeader>
            <CardTitle>Suivi opérationnel</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Activer le suivi &quot;Servi / Non venu&quot; pour les réservations.
            </p>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.operationalTrackingEnabled}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    operationalTrackingEnabled: e.target.checked,
                  })
                }
                className="w-5 h-5 rounded border-gray-300 text-rasf-600 focus:ring-rasf-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Activer le suivi opérationnel
              </span>
            </label>
          </CardContent>
        </Card>

        {/* Bouton de sauvegarde */}
        <div className="flex justify-end">
          <Button type="submit" isLoading={saving}>
            Enregistrer les paramètres
          </Button>
        </div>
      </form>
    </>
  );
}

