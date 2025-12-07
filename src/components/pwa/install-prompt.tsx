"use client";

// =============================================================================
// Composant de prompt d'installation PWA
// =============================================================================

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Verifier si deja installe
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Ecouter l'evenement beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Afficher le prompt apres un delai (pas immediatement)
      setTimeout(() => {
        // Verifier si l'utilisateur n'a pas deja refuse
        const dismissed = localStorage.getItem("pwa-install-dismissed");
        if (!dismissed) {
          setShowPrompt(true);
        }
      }, 3000);
    };

    // Ecouter l'evenement appinstalled
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
    }

    setShowPrompt(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Se souvenir du refus pendant 7 jours
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
  };

  if (isInstalled || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 animate-slide-up">
      <div className="flex gap-3">
        {/* Icone */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-rasf-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-rasf-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        {/* Contenu */}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm">
            Installer RASF Cantine
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Accedez rapidement a vos reservations depuis votre ecran d&apos;accueil
          </p>

          {/* Boutons */}
          <div className="flex gap-2 mt-3">
            <Button size="sm" onClick={handleInstall}>
              Installer
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDismiss}>
              Plus tard
            </Button>
          </div>
        </div>

        {/* Bouton fermer */}
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600"
          aria-label="Fermer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

