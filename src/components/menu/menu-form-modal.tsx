"use client";

// =============================================================================
// Modal de création/modification de menu
// =============================================================================

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import type { ApiResponse } from "@/lib/api-utils";

interface MenuOption {
  id?: string;
  name: string;
  courseType: "STARTER" | "MAIN" | "DESSERT";
  description?: string;
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

interface MenuFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  existingMenu: Menu | null;
  onSuccess: (menu: Menu) => void;
}

const normalizeMenu = (menu: Menu): Menu => {
  const options = menu.options || [];
  return {
    ...menu,
    options,
    starters: options.filter((o) => o.courseType === "STARTER"),
    mains: options.filter((o) => o.courseType === "MAIN"),
    desserts: options.filter((o) => o.courseType === "DESSERT"),
  };
};

export function MenuFormModal({
  isOpen,
  onClose,
  date,
  existingMenu,
  onSuccess,
}: MenuFormModalProps) {
  const [sideDishes, setSideDishes] = useState("");
  const [notes, setNotes] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  
  // Options par type
  const [starters, setStarters] = useState<MenuOption[]>([]);
  const [mains, setMains] = useState<MenuOption[]>([{ name: "", courseType: "MAIN" }]);
  const [desserts, setDesserts] = useState<MenuOption[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!existingMenu;

  // Initialiser avec les données existantes
  useEffect(() => {
    if (existingMenu) {
      setSideDishes(existingMenu.sideDishes || "");
      setNotes(existingMenu.notes || "");
      setIsPublished(existingMenu.isPublished);
      setStarters(existingMenu.starters.length > 0 
        ? existingMenu.starters.map(s => ({ ...s, courseType: "STARTER" as const }))
        : []
      );
      setMains(existingMenu.mains.length > 0 
        ? existingMenu.mains.map(m => ({ ...m, courseType: "MAIN" as const }))
        : [{ name: "", courseType: "MAIN" }]
      );
      setDesserts(existingMenu.desserts.length > 0 
        ? existingMenu.desserts.map(d => ({ ...d, courseType: "DESSERT" as const }))
        : []
      );
    } else {
      setSideDishes("");
      setNotes("");
      setIsPublished(false);
      setStarters([]);
      setMains([{ name: "", courseType: "MAIN" }]);
      setDesserts([]);
    }
  }, [existingMenu]);

  // Gestion des options
  const addOption = (type: "STARTER" | "MAIN" | "DESSERT") => {
    const newOption: MenuOption = { name: "", courseType: type };
    if (type === "STARTER") setStarters([...starters, newOption]);
    else if (type === "MAIN") setMains([...mains, newOption]);
    else setDesserts([...desserts, newOption]);
  };

  const removeOption = (type: "STARTER" | "MAIN" | "DESSERT", index: number) => {
    if (type === "STARTER") setStarters(starters.filter((_, i) => i !== index));
    else if (type === "MAIN") setMains(mains.filter((_, i) => i !== index));
    else setDesserts(desserts.filter((_, i) => i !== index));
  };

  const updateOption = (
    type: "STARTER" | "MAIN" | "DESSERT",
    index: number,
    name: string
  ) => {
    if (type === "STARTER") {
      const updated = [...starters];
      updated[index] = { ...updated[index], name };
      setStarters(updated);
    } else if (type === "MAIN") {
      const updated = [...mains];
      updated[index] = { ...updated[index], name };
      setMains(updated);
    } else {
      const updated = [...desserts];
      updated[index] = { ...updated[index], name };
      setDesserts(updated);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    const validMains = mains.filter((m) => m.name.trim());
    if (validMains.length === 0) {
      setError("Au moins un plat principal est requis");
      return;
    }

    setIsLoading(true);

    try {
      // Préparer les options
      const allOptions = [
        ...starters.filter((s) => s.name.trim()).map((s, i) => ({
          id: s.id,
          courseType: "STARTER" as const,
          name: s.name.trim(),
          sortOrder: i,
        })),
        ...validMains.map((m, i) => ({
          id: m.id,
          courseType: "MAIN" as const,
          name: m.name.trim(),
          sortOrder: i,
        })),
        ...desserts.filter((d) => d.name.trim()).map((d, i) => ({
          id: d.id,
          courseType: "DESSERT" as const,
          name: d.name.trim(),
          sortOrder: i,
        })),
      ];

      const payload = {
        date: format(date, "yyyy-MM-dd"),
        sideDishes: sideDishes.trim() || null,
        notes: notes.trim() || null,
        isPublished,
        options: allOptions,
      };

      const url = isEditing ? `/api/menus/${existingMenu.id}` : "/api/menus";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: ApiResponse<Menu> = await res.json();

      if (!res.ok || !data.success) {
        throw new Error((data as { error?: string }).error || "Erreur lors de la sauvegarde");
      }

      onSuccess(normalizeMenu(data.data));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header fixe */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {isEditing ? "Modifier le menu" : "Créer un menu"}
                </h2>
                <p className="text-sm text-gray-600">
                  {format(date, "EEEE d MMMM yyyy", { locale: fr })}
                </p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Contenu */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <Alert variant="error">
                {error}
              </Alert>
            )}

            {/* Accompagnements */}
            <div>
              <Input
                label="Accompagnements"
                value={sideDishes}
                onChange={(e) => setSideDishes(e.target.value)}
                placeholder="Riz, Grains, Légumes vapeur..."
                helperText="Accompagnements communs à tous les plats"
              />
            </div>

            {/* Entrées */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Entrées
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => addOption("STARTER")}
                >
                  + Ajouter
                </Button>
              </div>
              {starters.length === 0 ? (
                <p className="text-sm text-gray-400 italic">Aucune entrée</p>
              ) : (
                <div className="space-y-2">
                  {starters.map((starter, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={starter.name}
                        onChange={(e) => updateOption("STARTER", index, e.target.value)}
                        placeholder="Nom de l'entrée"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOption("STARTER", index)}
                        className="text-red-500"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Plats principaux */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Plats principaux *
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => addOption("MAIN")}
                >
                  + Ajouter
                </Button>
              </div>
              <div className="space-y-2">
                {mains.map((main, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={main.name}
                      onChange={(e) => updateOption("MAIN", index, e.target.value)}
                      placeholder="Nom du plat"
                      className="flex-1"
                      required={index === 0}
                    />
                    {mains.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOption("MAIN", index)}
                        className="text-red-500"
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Desserts */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Desserts
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => addOption("DESSERT")}
                >
                  + Ajouter
                </Button>
              </div>
              {desserts.length === 0 ? (
                <p className="text-sm text-gray-400 italic">Aucun dessert</p>
              ) : (
                <div className="space-y-2">
                  {desserts.map((dessert, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={dessert.name}
                        onChange={(e) => updateOption("DESSERT", index, e.target.value)}
                        placeholder="Nom du dessert"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOption("DESSERT", index)}
                        className="text-red-500"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (optionnel)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Informations supplémentaires..."
                rows={2}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rasf-500 focus:border-rasf-500"
              />
            </div>

            {/* Publication */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isPublished"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-rasf-600 focus:ring-rasf-500"
              />
              <label htmlFor="isPublished" className="text-sm text-gray-700">
                Publier ce menu (visible par les agents)
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
                Annuler
              </Button>
              <Button type="submit" isLoading={isLoading} className="flex-1">
                {isEditing ? "Enregistrer" : "Créer le menu"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

