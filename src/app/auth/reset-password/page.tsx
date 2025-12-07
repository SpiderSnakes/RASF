"use client";

// =============================================================================
// Page Reset de mot de passe
// =============================================================================

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!token) {
      setError("Token de réinitialisation manquant");
      return;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la réinitialisation");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-rasf-50 to-rasf-100">
        <Card variant="elevated" className="max-w-md w-full">
          <Alert variant="error">
            Lien de réinitialisation invalide. Veuillez demander un nouveau lien.
          </Alert>
          <div className="mt-4 text-center space-y-2">
            <Link
              href="/auth/forgot-password"
              className="block text-rasf-600 hover:text-rasf-700"
            >
              Demander un nouveau lien
            </Link>
            <Link href="/auth/login" className="block text-gray-600 hover:text-gray-700">
              Retour à la connexion
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-rasf-50 to-rasf-100">
        <Card variant="elevated" className="max-w-md w-full">
          <Alert variant="success" title="Mot de passe réinitialisé !">
            Votre mot de passe a été modifié avec succès. Vous allez être redirigé vers la page de connexion...
          </Alert>
          <div className="mt-4 text-center">
            <Link href="/auth/login" className="text-rasf-600 hover:text-rasf-700">
              Se connecter maintenant
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-rasf-50 to-rasf-100">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-rasf-600 flex items-center justify-center mx-auto shadow-lg">
            <span className="text-white text-2xl font-bold">R</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">RASF</h1>
          <p className="text-gray-600">Réinitialisation du mot de passe</p>
        </div>

        <Card variant="elevated">
          <h2 className="text-xl font-semibold text-gray-900 mb-2 text-center">
            Nouveau mot de passe
          </h2>
          <p className="text-sm text-gray-600 mb-6 text-center">
            Choisissez un nouveau mot de passe sécurisé.
          </p>

          {error && (
            <Alert variant="error" className="mb-4">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nouveau mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              helperText="Minimum 8 caractères"
              required
              autoComplete="new-password"
            />

            <Input
              label="Confirmer le mot de passe"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />

            <Button type="submit" fullWidth isLoading={isLoading}>
              Réinitialiser le mot de passe
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/auth/login" className="text-sm text-gray-600 hover:text-gray-700">
              ← Retour à la connexion
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rasf-50 to-rasf-100">
          <div className="w-8 h-8 border-4 border-rasf-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

