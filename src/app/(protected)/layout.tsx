// =============================================================================
// Layout pour les pages protegees (authentifiees)
// =============================================================================

import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Providers } from "@/components/providers";
import { InstallPrompt } from "@/components/pwa/install-prompt";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          {children}
        </main>
        <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
              <p>&copy; 2024 RASF - Restaurant Administratif de Saint-Pierre</p>
              <nav className="flex gap-4">
                <Link href="/legal/mentions" className="hover:text-gray-700">
                  Mentions legales
                </Link>
                <Link href="/legal/privacy" className="hover:text-gray-700">
                  Confidentialite
                </Link>
              </nav>
            </div>
          </div>
        </footer>
        <InstallPrompt />
      </div>
    </Providers>
  );
}

