"use client";

// =============================================================================
// Page d'activation de compte
// =============================================================================

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";

function ActivateForm() {
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
      setError("Token d'activation manquant");
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
      const res = await fetch("/api/auth/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'activation");
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
            Lien d&apos;activation invalide. Vérifiez le lien reçu par email ou contactez l&apos;administrateur.
          </Alert>
          <div className="mt-4 text-center">
            <Link href="/auth/login" className="text-rasf-600 hover:text-rasf-700">
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
          <Alert variant="success" title="Compte activé !">
            Votre compte a été activé avec succès. Vous allez être redirigé vers la page de connexion...
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
          <p className="text-gray-600">Activation de votre compte</p>
        </div>

        <Card variant="elevated">
          <h2 className="text-xl font-semibold text-gray-900 mb-2 text-center">
            Définissez votre mot de passe
          </h2>
          <p className="text-sm text-gray-600 mb-6 text-center">
            Choisissez un mot de passe sécurisé pour accéder à votre compte.
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
              Activer mon compte
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default function ActivatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rasf-50 to-rasf-100">
          <div className="w-8 h-8 border-4 border-rasf-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ActivateForm />
    </Suspense>
  );
}

