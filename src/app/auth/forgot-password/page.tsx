"use client";

// =============================================================================
// Page Mot de passe oublié
// =============================================================================

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [devToken, setDevToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'envoi");
      }

      setSuccess(true);
      
      // En dev, afficher le token pour faciliter les tests
      if (data.data?.resetToken) {
        setDevToken(data.data.resetToken);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-rasf-50 to-rasf-100">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-rasf-600 flex items-center justify-center mx-auto shadow-lg">
              <span className="text-white text-2xl font-bold">R</span>
            </div>
          </div>

          <Card variant="elevated">
            <Alert variant="success" title="Email envoyé !">
              Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.
            </Alert>

            {/* En dev, afficher le lien direct */}
            {devToken && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-800 font-medium mb-2">
                  🔧 Mode développement - Lien de reset :
                </p>
                <Link
                  href={`/auth/reset-password?token=${devToken}`}
                  className="text-xs text-amber-700 hover:text-amber-900 break-all underline"
                >
                  /auth/reset-password?token={devToken}
                </Link>
              </div>
            )}

            <div className="mt-6 text-center">
              <Link href="/auth/login" className="text-rasf-600 hover:text-rasf-700">
                Retour à la connexion
              </Link>
            </div>
          </Card>
        </div>
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
          <p className="text-gray-600">Mot de passe oublié</p>
        </div>

        <Card variant="elevated">
          <h2 className="text-xl font-semibold text-gray-900 mb-2 text-center">
            Réinitialiser votre mot de passe
          </h2>
          <p className="text-sm text-gray-600 mb-6 text-center">
            Entrez votre adresse email pour recevoir un lien de réinitialisation.
          </p>

          {error && (
            <Alert variant="error" className="mb-4">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre.email@exemple.fr"
              required
              autoComplete="email"
            />

            <Button type="submit" fullWidth isLoading={isLoading}>
              Envoyer le lien
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/auth/login" className="text-sm text-rasf-600 hover:text-rasf-700">
              ← Retour à la connexion
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

