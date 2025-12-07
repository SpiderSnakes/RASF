# Journal de développement – Application RASF

Ce fichier trace l'avancement du projet, les décisions prises et les points en suspens.

---

## 07/12/2024 – Étape 12 – Documentation finale

### Objectif
Creer la documentation complete du projet (README, deploiement, guide utilisateur).

### Actions realisees
- **README.md** :
  - Presentation des fonctionnalites par role
  - Stack technique
  - Instructions d'installation
  - Scripts disponibles
  - Structure du projet
  - Comptes par defaut (seed)
- **docs/deploiement.md** :
  - Deploiement avec Coolify (recommande)
  - Deploiement Docker manuel
  - Configuration docker-compose
  - Configuration Nginx reverse proxy
  - Variables d'environnement
  - Procedure de mise a jour
  - Sauvegardes et restauration
  - Monitoring et depannage
  - Checklist securite production
- **docs/guide-utilisateur.md** :
  - Guide connexion et premiere utilisation
  - Installation PWA
  - Guide Agent (reservation, modification, historique)
  - Guide Gestionnaire (menus, reservations, exports)
  - Guide Administrateur (utilisateurs, parametres)
  - FAQ

### Fichiers crees
- `README.md`
- `docs/deploiement.md`
- `docs/guide-utilisateur.md`

### Points en suspens / questions
- Remplacer les placeholders dans les pages legales avec les vraies informations
- Configurer l'envoi d'emails pour l'activation et le reset de mot de passe

---

## 07/12/2024 – Étape 11 – Securite, RGPD & parametres globaux

### Objectif
Finaliser les aspects securite, creer les pages legales et verifier les parametres globaux.

### Audit de securite - Elements en place
- **Hashage des mots de passe** : bcrypt dans toutes les API d'authentification
- **Sessions securisees** : NextAuth.js avec JWT
- **Headers de securite** : X-Frame-Options (DENY), X-Content-Type-Options (nosniff), Referrer-Policy
- **Controle d'acces** : Middleware de verification des roles par route
- **Journalisation** : AuditLog pour les actions sensibles

### Actions realisees
- **Layout public** pour les pages legales (avec header/footer)
- **Page Mentions legales** (`/legal/mentions`) :
  - Editeur du site
  - Hebergement
  - Propriete intellectuelle
  - Responsabilite
  - Droit applicable
- **Page Politique de confidentialite** (`/legal/privacy`) :
  - Responsable du traitement
  - Donnees collectees
  - Finalites du traitement
  - Base legale (RGPD)
  - Destinataires des donnees
  - Duree de conservation
  - Mesures de securite
  - Droits des utilisateurs
  - Cookies (aucun tracking)
  - Reclamation CNIL
- **Footer** ajoute dans le layout protege avec liens vers les pages legales

### Fichiers crees
- `src/app/(public)/layout.tsx`
- `src/app/(public)/legal/mentions/page.tsx`
- `src/app/(public)/legal/privacy/page.tsx`

### Fichiers modifies
- `src/app/(protected)/layout.tsx` (ajout footer)

### Points en suspens / questions
- Les placeholders [Adresse], [Email], [Nom] doivent etre remplaces avec les vraies informations

---

## 07/12/2024 – Étape 10 – PWA (Progressive Web App)

### Objectif
Configurer l'application comme une PWA installable sur mobile avec cache offline.

### Actions realisees
- **Installation et configuration next-pwa** :
  - Utilisation de @ducanh2912/next-pwa (version maintenue)
  - Configuration du service worker avec strategies de cache
  - Cache des fonts, images, assets statiques
  - NetworkFirst pour les API dynamiques
- **Manifest.json** :
  - Nom, description, icones
  - Display standalone, orientation portrait
  - Theme color bleu RASF
- **Generation des icones** :
  - Script `scripts/generate-icons.mjs` avec sharp
  - Toutes tailles requises (72, 96, 128, 144, 152, 192, 384, 512)
  - Apple touch icon et favicon
- **Composant InstallPrompt** :
  - Detection beforeinstallprompt
  - Prompt d'installation avec boutons
  - Memorisation du refus pendant 7 jours
  - Animation slide-up

### Fichiers crees
- `public/manifest.json`
- `public/icons/icon.svg` (source)
- `public/icons/icon-*.png` (generes)
- `public/apple-touch-icon.png`
- `public/favicon.png`
- `scripts/generate-icons.mjs`
- `src/components/pwa/install-prompt.tsx`

### Fichiers modifies
- `next.config.mjs` (configuration PWA)
- `src/app/layout.tsx` (meta tags)
- `src/app/(protected)/layout.tsx` (InstallPrompt)
- `src/app/globals.css` (animation slide-up)
- `package.json` (script icons:generate)

### Decisions prises
- PWA desactive en dev pour eviter les problemes de cache
- Cache NetworkFirst pour les API (donnees fraiches prioritaires)
- Prompt d'installation apres 3 secondes (pas immediatement)

### Points en suspens / questions
- Notifications email et push a implementer plus tard si necessaire

---

## 07/12/2024 – Étape 9 – Exports CSV/Excel

### Objectif
Ajouter les fonctionnalites d'export des donnees en CSV pour le gestionnaire et l'administrateur.

### Actions realisees
- **API Export reservations** `/api/export/reservations` :
  - Export detaille (une ligne par reservation)
  - Export synthese (totaux par jour et par plat)
  - Parametre `period` : jour ou semaine
  - Parametre `type` : detail ou summary
  - Format CSV compatible Excel (BOM UTF-8, separateur ;)
- **API Export utilisateurs** `/api/export/users` :
  - Export de tous les utilisateurs
  - Filtres optionnels par role et statut
- **Composant ExportButton** :
  - Bouton avec menu deroulant
  - Telechargement automatique du fichier
  - Gestion du loading et des erreurs
- **Integration dans les pages** :
  - Page reservations : 4 options d'export (jour/semaine x detail/synthese)
  - Page utilisateurs : export de la liste complete

### Fichiers crees
- `src/app/api/export/reservations/route.ts`
- `src/app/api/export/users/route.ts`
- `src/components/export/export-button.tsx`

### Fichiers modifies
- `src/app/(protected)/gestion/reservations/page.tsx`
- `src/app/(protected)/admin/users/page.tsx`

### Decisions prises
- Separateur `;` pour compatibilite Excel FR
- BOM UTF-8 pour accents dans Excel
- Dates au format dd/MM/yyyy

---

## 07/12/2024 – Étape 8 – Réservations avancées (UX et heure limite)

### Objectif
Améliorer l'UX des réservations avec affichage de l'heure limite, indicateurs visuels clairs et historique.

### Actions réalisées
- **Hook useSettings** :
  - Récupération des paramètres globaux
  - Fonction `canModifyForDate()` pour vérifier si on peut encore réserver
  - Fonction `isOpenDay()` pour vérifier les jours d'ouverture
- **Dashboard amélioré** :
  - Bandeau avec heure limite bien visible
  - Décompte du temps restant pour aujourd'hui
  - Indicateur "🔒 Verrouillé" après l'heure limite
  - Message "⏰ Réservez vite !" avec temps restant
  - Stats de la semaine (total, sur place, à emporter)
- **Modal de réservation améliorée** :
  - Alerte contextuelle si peu de temps restant
  - Affichage du temps restant avant heure limite
- **Page historique** `/dashboard/history` :
  - Navigation par mois
  - Stats du mois (total, sur place, à emporter, servis)
  - Liste des réservations avec détails

### Fichiers créés
- `src/hooks/use-settings.ts`
- `src/components/reservation/deadline-indicator.tsx`
- `src/app/(protected)/dashboard/history/page.tsx`

### Fichiers modifiés
- `src/app/(protected)/dashboard/page.tsx`
- `src/components/reservation/reservation-modal.tsx`

### Décisions prises
- Mise à jour du décompte toutes les 30 secondes
- Alerte ambre quand moins d'1h avant l'heure limite
- Verrouillage visuel clair (icône 🔒 + opacité réduite)

### Points en suspens / questions
- Prochaine étape : exports CSV/Excel

---

## 07/12/2024 – Étape 7 – Gestion des menus & duplication de semaines

### Objectif
Créer l'interface de gestion des menus pour le gestionnaire RASF avec création, modification et duplication de semaines.

### Actions réalisées
- **Page de gestion des menus** `/gestion/menus` :
  - Vue par semaine avec navigation
  - Affichage de tous les menus avec entrées/plats/desserts
  - Indicateur de statut (publié/brouillon)
  - Actions rapides (modifier, publier, supprimer)
- **Modal de création/modification** :
  - Ajout dynamique d'entrées, plats, desserts
  - Champ accompagnements communs
  - Champ notes optionnel
  - Option de publication directe
- **Duplication de semaine** :
  - Sélection de la semaine source (8 dernières semaines)
  - Sélection de la semaine cible (4 prochaines)
  - Option d'écrasement des menus existants
  - API `/api/menus/duplicate`

### Fichiers créés
- `src/app/(protected)/gestion/menus/page.tsx`
- `src/components/menu/menu-form-modal.tsx`
- `src/components/menu/duplicate-week-modal.tsx`
- `src/app/api/menus/duplicate/route.ts`

### Décisions prises
- Les menus dupliqués sont créés en brouillon par défaut
- La duplication peut écraser ou ignorer les menus existants
- Interface responsive avec vue carte pour chaque jour

### Points en suspens / questions
- Prochaine étape : vérification heure limite, exports

---

## 07/12/2024 – Étape 6 – Gestion des comptes & rôles

### Objectif
Implémenter l'activation de compte, la réinitialisation de mot de passe et l'import en masse des utilisateurs.

### Actions réalisées
- **Routes API créées** :
  - `POST /api/auth/activate` : Activation de compte avec token
  - `POST /api/auth/forgot-password` : Demande de reset (génère token)
  - `POST /api/auth/reset-password` : Reset du mot de passe avec token
  - `POST /api/users/import` : Import en masse depuis CSV
- **Pages créées** :
  - `/auth/activate` : Définition du mot de passe après pré-inscription
  - `/auth/forgot-password` : Demande de réinitialisation
  - `/auth/reset-password` : Nouveau mot de passe
- **Composants** :
  - `ImportUsersModal` : Import CSV avec preview des erreurs
- **Fonctionnalités** :
  - Token d'activation valide 30 jours
  - Token de reset valide 1 heure
  - Import CSV jusqu'à 500 utilisateurs
  - Gestion des doublons (skipExisting)
  - Mode développement : affichage des tokens dans la console

### Fichiers créés
- `src/app/api/auth/activate/route.ts`
- `src/app/api/auth/forgot-password/route.ts`
- `src/app/api/auth/reset-password/route.ts`
- `src/app/api/users/import/route.ts`
- `src/app/auth/activate/page.tsx`
- `src/app/auth/forgot-password/page.tsx`
- `src/app/auth/reset-password/page.tsx`
- `src/components/admin/import-users-modal.tsx`

### Décisions prises
- Token de 64 caractères aléatoires
- En mode dev, le token de reset est retourné dans la réponse pour faciliter les tests
- Format CSV avec séparateur point-virgule (;) et en-têtes français

### Points en suspens / questions
- Envoi réel des emails (TODO: intégrer un service SMTP)
- Prochaine étape : gestion des menus

---

## 07/12/2024 – Étape 5 – Structure du frontend (pages / vues / navigation)

### Objectif
Créer les pages et composants pour l'interface utilisateur complète.

### Actions réalisées
- **Composants UI** :
  - `Button` : variantes (primary, secondary, danger, ghost, outline), tailles, loading
  - `Input` : avec label, erreur, helper text
  - `Select` : avec options, placeholder
  - `Card` : avec CardHeader, CardTitle, CardContent
  - `Badge` : variantes + ConsumptionBadge, StatusBadge
  - `Alert` : info, success, warning, error
- **Layout et navigation** :
  - `Navbar` : navigation responsive avec menu mobile
  - `PageHeader` : en-tête de page avec titre, description, actions
  - Layout protégé avec SessionProvider
- **Pages d'authentification** :
  - `/auth/login` : connexion avec formulaire
- **Dashboard agent** :
  - Vue semaine avec les 5 jours
  - Affichage des menus et réservations
  - Navigation entre semaines
  - Modal de réservation complète
- **Interface gestionnaire RASF** :
  - `/gestion` : tableau de bord avec stats
  - `/gestion/reservations` : liste des réservations du jour avec filtres
  - Suivi servi/non venu
- **Interface admin** :
  - `/admin` : tableau de bord
  - `/admin/users` : liste des utilisateurs, création
  - `/admin/settings` : paramètres globaux

### Fichiers créés
- `src/components/ui/*.tsx` (6 composants)
- `src/components/layout/*.tsx` (2 composants)
- `src/components/reservation/reservation-modal.tsx`
- `src/components/admin/create-user-modal.tsx`
- `src/components/providers.tsx`
- `src/app/auth/login/page.tsx`
- `src/app/auth/layout.tsx`
- `src/app/(protected)/layout.tsx`
- `src/app/(protected)/dashboard/page.tsx`
- `src/app/(protected)/gestion/page.tsx`
- `src/app/(protected)/gestion/reservations/page.tsx`
- `src/app/(protected)/admin/page.tsx`
- `src/app/(protected)/admin/users/page.tsx`
- `src/app/(protected)/admin/settings/page.tsx`

### Décisions prises
- Utilisation de Suspense pour les pages avec useSearchParams
- Design responsive mobile-first
- Palette de couleurs RASF (vert) avec variantes pour sur place (bleu) et à emporter (ambre)

### Points en suspens / questions
- Page d'activation de compte à créer
- Page de reset de mot de passe à créer
- Gestion des menus côté gestionnaire à créer

---

## 07/12/2024 – Étape 4 – Structure du backend (API / routes / auth)

### Objectif
Mettre en place l'authentification avec NextAuth.js et créer les routes API pour les utilisateurs, menus et réservations.

### Actions réalisées
- **NextAuth.js** configuré avec credentials provider
  - Session JWT (24h)
  - Callbacks pour inclure les infos utilisateur (rôle, id, etc.)
  - Pages personnalisées (/auth/login)
- **Utilitaires créés** :
  - `src/lib/auth.ts` : config NextAuth, hashPassword, generateToken, vérification rôles
  - `src/lib/utils.ts` : formatage dates, gestion heure limite, jours d'ouverture
  - `src/lib/api-utils.ts` : helpers pour réponses API, validation, middlewares
- **Routes API créées** :
  - `/api/auth/[...nextauth]` : authentification NextAuth
  - `/api/users` : liste, création (pré-inscription), modification, désactivation
  - `/api/menus` : CRUD menus avec options (entrées/plats/desserts)
  - `/api/reservations` : création, modification, annulation, changement de statut
  - `/api/settings` : paramètres globaux (heure limite, jours, etc.)
- **Middleware** : protection des routes par rôle (agent, gestionnaire, admin)

### Fichiers créés
- `src/lib/auth.ts`
- `src/lib/utils.ts`
- `src/lib/api-utils.ts`
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/app/api/users/route.ts`
- `src/app/api/users/[id]/route.ts`
- `src/app/api/menus/route.ts`
- `src/app/api/menus/[id]/route.ts`
- `src/app/api/reservations/route.ts`
- `src/app/api/reservations/[id]/route.ts`
- `src/app/api/settings/route.ts`
- `src/middleware.ts`

### Décisions prises
- Utilisation de NextAuth v4 (stable) avec JWT
- Soft delete pour les utilisateurs (status DISABLED)
- Vérification automatique de l'heure limite dans les API
- Audit log pour toutes les actions importantes

### Points en suspens / questions
- Prochaine étape : création des pages frontend

---

## 07/12/2024 – Étape 3 – Initialisation du projet Next.js + Prisma

### Objectif
Créer la structure complète du projet avec Next.js 14, Prisma, Docker, et toutes les configurations de base.

### Actions réalisées
- Création du projet Next.js 14.2.15 avec TypeScript
- Configuration de Prisma 5.22.0 avec le schéma validé (v2)
- Configuration de Tailwind CSS avec palette personnalisée RASF
- Mise en place de Docker :
  - `Dockerfile` optimisé multi-stage pour production
  - `docker-compose.yml` pour développement local
  - `.dockerignore` configuré
- Structure des dossiers créée :
  - `src/app/` - Pages Next.js (App Router)
  - `src/components/` - Composants React
  - `src/lib/` - Utilitaires (connexion DB)
  - `src/types/` - Types TypeScript
  - `src/hooks/` - Hooks personnalisés
- Script de seed avec données de test (menus, utilisateurs)
- Manifest PWA configuré
- Build de production validé ✅

### Fichiers créés
- `package.json` - Dépendances et scripts
- `tsconfig.json` - Configuration TypeScript
- `next.config.mjs` - Configuration Next.js (standalone pour Docker)
- `tailwind.config.js` - Configuration Tailwind avec couleurs RASF
- `prisma/schema.prisma` - Schéma de base de données v2
- `prisma/seed.ts` - Script de seed
- `src/app/layout.tsx` - Layout principal
- `src/app/page.tsx` - Page d'accueil
- `src/app/globals.css` - Styles globaux
- `src/lib/db.ts` - Client Prisma singleton
- `src/types/index.ts` - Types TypeScript
- `Dockerfile` - Build Docker production
- `docker-compose.yml` - Services pour dev local
- `env.example` - Variables d'environnement
- `README.md` - Documentation du projet

### Décisions techniques
- **Next.js 14.2.15** (version stable, compatible React 18)
- **Prisma 5.22.0** (version stable avec syntaxe classique)
- **ESLint 8** (configuration `next/core-web-vitals`)
- **Police Inter** (remplace Geist non disponible dans cette version)
- **Output standalone** pour optimiser le build Docker

### Points en suspens / questions
- Prochaine étape : API d'authentification avec NextAuth.js

---

## 07/12/2024 – Étape 2 – Modèle de données & schéma de base de données (révision v2)

### Objectif
Concevoir le modèle de données complet avec gestion des choix entrée/plat/dessert et suivi opérationnel.

### Actions réalisées (v2)
- **Refonte du modèle de menu** :
  - `MenuVariant` → `MenuOption` avec `CourseType` (STARTER, MAIN, DESSERT)
  - Choix de l'Option A (modèle générique) pour plus de flexibilité
- **Mise à jour de Reservation** :
  - 3 champs : `starterOptionId`, `mainOptionId` (obligatoire), `dessertOptionId`
  - Ajout de `status` avec enum `ReservationStatus` (BOOKED, SERVED, NO_SHOW)
- **Mise à jour de Settings** :
  - Ajout de `operationalTrackingEnabled` pour activer/désactiver le suivi
- **Ajout de champs utiles** :
  - `Menu.sideDishes` pour les accompagnements communs
  - Actions d'audit : RESERVATION_SERVED, RESERVATION_NO_SHOW

### Fichiers créés/modifiés
- Schéma Prisma v2 (en attente de validation finale)
- `docs/plan_de_projet.md` (mis à jour)
- `docs/journal_dev.md` (mis à jour)

### Décisions prises
- **Option A retenue** : modèle générique `MenuOption` avec `CourseType` plutôt que modèles séparés
- Suivi opérationnel inclus dès la v1 avec toggle d'activation
- Plat principal obligatoire, entrée et dessert optionnels (si un seul choix)

### Points en suspens / questions
1. Validation finale du schéma avant initialisation du projet

---

## 07/12/2024 – Étape 1 – Analyse du cahier des charges & choix de la stack

### Objectif
Analyser le cahier des charges complet et proposer des options de stack technique adaptées au projet.

### Actions réalisées
- Lecture complète du fichier `projet.md` (cahier des charges)
- Résumé des enjeux principaux du projet
- Proposition de 3 options de stack technique :
  1. **Next.js Full-Stack** (recommandée) – Next.js 14 + PostgreSQL + Prisma + NextAuth.js
  2. **React + Node.js séparés** – Vite + Express/NestJS + PostgreSQL + Prisma
  3. **Remix Full-Stack** – Remix + PostgreSQL + Prisma + remix-auth
- Création des fichiers de suivi (`docs/plan_de_projet.md` et `docs/journal_dev.md`)

### Fichiers créés/modifiés
- `docs/plan_de_projet.md` (nouveau)
- `docs/journal_dev.md` (nouveau)

### Décisions prises
- Recommandation de l'option 1 (Next.js Full-Stack) pour sa simplicité et son excellent support PWA
- En attente de validation du client

### Points en suspens / questions
- ✅ **Stack validée** : Next.js Full-Stack (Option 1)
- ✅ **Hébergement validé** : Docker sur VPS avec Coolify
- ✅ **Base de données validée** : PostgreSQL dédié sur VPS

---

<!-- Les prochaines entrées seront ajoutées ci-dessus -->

