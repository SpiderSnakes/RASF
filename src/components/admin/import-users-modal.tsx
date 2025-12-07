"use client";

// =============================================================================
// Modal d'import en masse des utilisateurs
// =============================================================================

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

interface ImportUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ImportResult {
  created: number;
  skipped: number;
  errors: { row: number; email: string; error: string }[];
  users: { email: string; activationToken: string }[];
}

export function ImportUsersModal({ isOpen, onClose, onSuccess }: ImportUsersModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);

  const parseCSV = (text: string): Record<string, string>[] => {
    const lines = text.trim().split("\n");
    if (lines.length < 2) return [];

    // Première ligne = en-têtes
    const headers = lines[0].split(";").map((h) => h.trim().toLowerCase());

    // Mapper les en-têtes français vers les clés attendues
    const headerMap: Record<string, string> = {
      email: "email",
      "e-mail": "email",
      prénom: "firstName",
      prenom: "firstName",
      firstname: "firstName",
      nom: "lastName",
      lastname: "lastName",
      "numéro compte": "canteenAccountNumber",
      "numero compte": "canteenAccountNumber",
      "n° compte": "canteenAccountNumber",
      "compte cantine": "canteenAccountNumber",
      canteenaccountnumber: "canteenAccountNumber",
      rôle: "role",
      role: "role",
    };

    const mappedHeaders = headers.map((h) => headerMap[h] || h);

    // Convertir les lignes en objets
    return lines.slice(1).map((line) => {
      const values = line.split(";").map((v) => v.trim());
      const obj: Record<string, string> = {};
      mappedHeaders.forEach((header, index) => {
        if (values[index]) {
          obj[header] = values[index];
        }
      });
      return obj;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith(".csv")) {
        setError("Veuillez sélectionner un fichier CSV");
        return;
      }
      setFile(selectedFile);
      setError(null);
      setResult(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Veuillez sélectionner un fichier");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const text = await file.text();
      const users = parseCSV(text);

      if (users.length === 0) {
        throw new Error("Le fichier est vide ou mal formaté");
      }

      const res = await fetch("/api/users/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ users, skipExisting: true }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'import");
      }

      setResult(data.data);

      if (data.data.created > 0) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setError(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Import en masse
            </h2>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-500">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Instructions */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Format du fichier CSV</h3>
            <p className="text-sm text-gray-600 mb-2">
              Le fichier doit contenir les colonnes suivantes (séparateur : point-virgule) :
            </p>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              <li><strong>Email</strong> - Adresse email de l&apos;agent</li>
              <li><strong>Prénom</strong> - Prénom de l&apos;agent</li>
              <li><strong>Nom</strong> - Nom de famille</li>
              <li><strong>Numéro compte</strong> - Numéro de compte cantine</li>
              <li><strong>Rôle</strong> (optionnel) - AGENT, GESTIONNAIRE ou ADMIN</li>
            </ul>
            <p className="text-xs text-gray-500 mt-2">
              Exemple : Email;Prénom;Nom;Numéro compte;Rôle
            </p>
          </div>

          {error && (
            <Alert variant="error" className="mb-4">
              {error}
            </Alert>
          )}

          {result && (
            <div className="mb-4 space-y-2">
              <Alert variant={result.errors.length > 0 ? "warning" : "success"}>
                {result.created} utilisateur(s) créé(s), {result.skipped} ignoré(s)
                {result.errors.length > 0 && `, ${result.errors.length} erreur(s)`}
              </Alert>

              {result.errors.length > 0 && (
                <div className="max-h-32 overflow-y-auto p-2 bg-red-50 rounded text-sm">
                  {result.errors.map((err, i) => (
                    <div key={i} className="text-red-700">
                      Ligne {err.row} ({err.email}): {err.error}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fichier CSV
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-rasf-50 file:text-rasf-700 hover:file:bg-rasf-100"
              />
              {file && (
                <p className="mt-1 text-sm text-gray-500">
                  Fichier sélectionné : {file.name}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="secondary" onClick={handleClose} className="flex-1">
                Fermer
              </Button>
              <Button type="submit" isLoading={isLoading} className="flex-1" disabled={!file}>
                Importer
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

