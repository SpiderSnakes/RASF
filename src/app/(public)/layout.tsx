// =============================================================================
// Layout pour les pages publiques (non authentifiees)
// =============================================================================

import Link from "next/link";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header simple */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-rasf-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-semibold text-gray-900">RASF Cantine</span>
          </Link>
          <Link
            href="/auth/login"
            className="text-sm text-rasf-600 hover:text-rasf-700 font-medium"
          >
            Connexion
          </Link>
        </div>
      </header>

      {/* Contenu */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
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
    </div>
  );
}

