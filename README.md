# RASF Cantine

Application web de reservation de repas pour le Restaurant Administratif de Saint-Pierre (RASF).

## Fonctionnalites

### Pour les Agents
- Consultation des menus de la semaine
- Reservation de repas (sur place ou a emporter)
- Choix de l'entree, du plat principal et du dessert
- Modification/annulation jusqu'a l'heure limite
- Historique des reservations
- Application installable (PWA)

### Pour les Gestionnaires RASF
- Gestion des menus quotidiens
- Ajout des entrees, plats, desserts
- Duplication de semaines types
- Suivi des reservations en temps reel
- Marquage "Servi" / "Non venu"
- Export CSV des reservations

### Pour les Administrateurs
- Gestion des utilisateurs (creation, import CSV)
- Configuration des parametres globaux
- Heure limite de reservation
- Jours d'ouverture
- Capacite maximale

## Stack technique

- **Frontend/Backend** : Next.js 14 (App Router) + TypeScript
- **Base de donnees** : PostgreSQL
- **ORM** : Prisma
- **Authentification** : NextAuth.js v4
- **UI** : Tailwind CSS
- **PWA** : @serwist/next

## Prerequis

- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

## Installation

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd Cantine
```

### 2. Installer les dependances

```bash
npm install
```

### 3. Configurer les variables d'environnement

```bash
cp env.example .env
```

Editer `.env` avec vos valeurs :

```env
# Base de donnees PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/rasf_cantine?schema=public"

# NextAuth
NEXTAUTH_SECRET="votre-secret-genere-avec-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Initialiser la base de donnees

```bash
# Generer le client Prisma
npm run db:generate

# Appliquer le schema
npm run db:push

# (Optionnel) Creer des donnees de test
npm run db:seed
```

### 5. Lancer le serveur de developpement

```bash
npm run dev
```

L'application est accessible sur http://localhost:3000

## Scripts disponibles

| Script | Description |
|--------|-------------|
| `npm run dev` | Serveur de developpement |
| `npm run build` | Build de production |
| `npm run start` | Lancer le build de production |
| `npm run lint` | Linter ESLint |
| `npm run db:generate` | Generer le client Prisma |
| `npm run db:push` | Appliquer le schema a la BDD |
| `npm run db:migrate` | Creer une migration |
| `npm run db:studio` | Interface Prisma Studio |
| `npm run db:seed` | Peupler la BDD avec des donnees de test |
| `npm run icons:generate` | Regenerer les icones PWA |

## Structure du projet

```
src/
├── app/                    # Routes Next.js (App Router)
│   ├── (protected)/        # Pages authentifiees
│   │   ├── admin/          # Interface administrateur
│   │   ├── dashboard/      # Dashboard agent
│   │   └── gestion/        # Interface gestionnaire
│   ├── (public)/           # Pages publiques
│   │   └── legal/          # Mentions legales, confidentialite
│   ├── api/                # API Routes
│   │   ├── auth/           # Authentification
│   │   ├── export/         # Exports CSV
│   │   ├── menus/          # CRUD menus
│   │   ├── reservations/   # CRUD reservations
│   │   ├── settings/       # Parametres
│   │   └── users/          # CRUD utilisateurs
│   └── auth/               # Pages auth (login, etc.)
├── components/             # Composants React
│   ├── admin/              # Composants admin
│   ├── export/             # Boutons d'export
│   ├── layout/             # Navbar, PageHeader
│   ├── menu/               # Modals menu
│   ├── pwa/                # Prompt installation
│   ├── reservation/        # Modal reservation
│   └── ui/                 # Composants UI generiques
├── hooks/                  # Hooks React personnalises
└── lib/                    # Utilitaires (auth, db, etc.)

prisma/
├── schema.prisma           # Schema de la BDD
└── seed.ts                 # Script de seed

public/
├── icons/                  # Icones PWA
└── manifest.json           # Manifest PWA

docs/
├── plan_de_projet.md       # Suivi d'avancement
└── journal_dev.md          # Journal de developpement
```

## Deploiement

Voir [docs/deploiement.md](docs/deploiement.md) pour les instructions detaillees.

### Docker (recommande)

```bash
# Build
docker build -t rasf-cantine .

# Run
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e NEXTAUTH_SECRET="..." \
  -e NEXTAUTH_URL="https://votre-domaine.com" \
  rasf-cantine
```

## Comptes par defaut (seed)

Apres `npm run db:seed` :

| Email | Mot de passe | Role |
|-------|--------------|------|
| admin@rasf.re | admin123 | Administrateur |
| gestionnaire@rasf.re | gestionnaire123 | Gestionnaire |
| agent@rasf.re | agent123 | Agent |

⚠️ **Changez ces mots de passe en production !**

## Licence

Projet interne RASF - Tous droits reserves.
