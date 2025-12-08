"use client";

// =============================================================================
// Page de connexion
// =============================================================================

import { useEffect, useMemo, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";

function LoginForm() {
  const router = useRouter();
  const [callbackUrl, setCallbackUrl] = useState("/dashboard");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Lire les paramètres d'URL une seule fois pour éviter les erreurs d'hydratation
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCallbackUrl(params.get("callbackUrl") || "/dashboard");
    setUrlError(params.get("error"));
  }, []);

  const displayError = useMemo(() => loginError || urlError, [loginError, urlError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setLoginError(result.error);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setLoginError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-rasf-50 to-rasf-100">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-rasf-600 flex items-center justify-center mx-auto shadow-lg">
            <span className="text-white text-2xl font-bold">R</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">RASF</h1>
          <p className="text-gray-600">Restaurant Administratif de Saint-Pierre</p>
        </div>

        <Card variant="elevated">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Connexion
          </h2>

          {/* Messages d'erreur */}
          {displayError && (
            <Alert variant="error" className="mb-4">
              {displayError || "Erreur de connexion. Veuillez réessayer."}
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

            <Input
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />

            <div className="flex items-center justify-end">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-rasf-600 hover:text-rasf-700"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <Button type="submit" fullWidth isLoading={isLoading}>
              Se connecter
            </Button>
          </form>
        </Card>

        <p className="mt-6 text-center text-sm text-gray-600">
          Pas encore de compte ?{" "}
          <Link href="/auth/register" className="text-rasf-600 hover:text-rasf-700 font-medium">
            Contactez le RASF
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <LoginForm />;
}

