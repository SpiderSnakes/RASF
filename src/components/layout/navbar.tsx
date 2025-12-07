"use client";

// =============================================================================
// Composant Navbar - Navigation principale
// =============================================================================

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname.startsWith(path);

  const navigation = [
    { name: "Mes réservations", href: "/dashboard", roles: ["AGENT", "GESTIONNAIRE", "ADMIN"] },
    { name: "Gestion", href: "/gestion", roles: ["GESTIONNAIRE", "ADMIN"] },
    { name: "Administration", href: "/admin", roles: ["ADMIN"] },
  ];

  const filteredNavigation = navigation.filter(
    (item) => session?.user && item.roles.includes(session.user.role)
  );

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo et liens principaux */}
          <div className="flex">
            <Link href="/dashboard" className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-rasf-600 flex items-center justify-center">
                <span className="text-white text-sm font-bold">R</span>
              </div>
              <span className="ml-2 text-lg font-semibold text-gray-900 hidden sm:block">
                RASF
              </span>
            </Link>

            {/* Navigation desktop */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              {filteredNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    inline-flex items-center px-3 py-2 text-sm font-medium rounded-md
                    transition-colors duration-200
                    ${
                      isActive(item.href)
                        ? "bg-rasf-50 text-rasf-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Menu utilisateur */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {session?.user && (
              <>
                <span className="text-sm text-gray-600">
                  {session.user.firstName} {session.user.lastName}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: "/auth/login" })}
                >
                  Déconnexion
                </Button>
              </>
            )}
          </div>

          {/* Bouton menu mobile */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <span className="sr-only">Ouvrir le menu</span>
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-gray-200">
          <div className="pt-2 pb-3 space-y-1">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  block px-4 py-2 text-base font-medium
                  ${
                    isActive(item.href)
                      ? "bg-rasf-50 text-rasf-700 border-l-4 border-rasf-500"
                      : "text-gray-600 hover:bg-gray-50"
                  }
                `}
              >
                {item.name}
              </Link>
            ))}
          </div>
          {session?.user && (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="px-4 mb-3">
                <p className="text-sm font-medium text-gray-900">
                  {session.user.firstName} {session.user.lastName}
                </p>
                <p className="text-xs text-gray-500">{session.user.email}</p>
              </div>
              <div className="px-4">
                <Button
                  variant="ghost"
                  size="sm"
                  fullWidth
                  onClick={() => signOut({ callbackUrl: "/auth/login" })}
                >
                  Déconnexion
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

