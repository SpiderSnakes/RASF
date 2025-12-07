export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-rasf-50 to-rasf-100">
      <main className="flex flex-col items-center gap-8 max-w-2xl text-center">
        {/* Logo / Titre */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-rasf-600 flex items-center justify-center shadow-lg">
            <span className="text-white text-3xl font-bold">R</span>
          </div>
          <h1 className="text-4xl font-bold text-rasf-900">
            RASF
          </h1>
          <p className="text-xl text-rasf-700">
            Restaurant Administratif de Saint-Pierre
          </p>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-lg">
          Bienvenue sur l&apos;application de réservation de repas.
          <br />
          Réservez vos repas en quelques clics, consultez les menus de la semaine
          et choisissez entre <span className="badge-surplace">sur place</span> ou{" "}
          <span className="badge-emporter">à emporter</span>.
        </p>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <a
            href="/auth/login"
            className="px-8 py-3 bg-rasf-600 text-white rounded-lg font-medium hover:bg-rasf-700 transition-colors shadow-md hover:shadow-lg"
          >
            Se connecter
          </a>
          <a
            href="/auth/register"
            className="px-8 py-3 bg-white text-rasf-600 border-2 border-rasf-600 rounded-lg font-medium hover:bg-rasf-50 transition-colors"
          >
            Créer un compte
          </a>
        </div>

        {/* Info */}
        <p className="text-sm text-gray-500 mt-8">
          Application en cours de développement
        </p>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-4 text-center text-sm text-gray-500" suppressHydrationWarning>
        © 2024 RASF - Tous droits reserves
      </footer>
    </div>
  );
}

