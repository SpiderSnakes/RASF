"use client";

// =============================================================================
// Modal de création d'utilisateur
// =============================================================================

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateUserModal({ isOpen, onClose, onSuccess }: CreateUserModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    canteenAccountNumber: "",
    role: "AGENT",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la création");
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
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Nouvel utilisateur
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email *"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="agent@exemple.fr"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Prénom *"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Jean"
                required
              />
              <Input
                label="Nom *"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Dupont"
                required
              />
            </div>

            <Input
              label="N° Compte Cantine *"
              value={formData.canteenAccountNumber}
              onChange={(e) => setFormData({ ...formData, canteenAccountNumber: e.target.value })}
              placeholder="AGT001"
              required
            />

            <Select
              label="Rôle"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              options={[
                { value: "AGENT", label: "Agent" },
                { value: "GESTIONNAIRE", label: "Gestionnaire RASF" },
                { value: "ADMIN", label: "Administrateur" },
              ]}
            />

            <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
              Un email d&apos;activation sera envoyé à l&apos;utilisateur pour qu&apos;il définisse son mot de passe.
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
                Annuler
              </Button>
              <Button type="submit" isLoading={isLoading} className="flex-1">
                Créer
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

