# Plan de projet – Application RASF

## Vue d'ensemble

Ce document suit l'avancement du projet de réservation de repas pour le RASF (Restaurant Administratif de Saint-Pierre).

**Date de création** : 07/12/2024  
**Dernière mise à jour** : 07/12/2024

### Stack technique validée
- **Frontend/Backend** : Next.js 14 (App Router) + TypeScript
- **Base de données** : PostgreSQL (dédié sur VPS)
- **ORM** : Prisma
- **Authentification** : NextAuth.js (Auth.js v5)
- **UI** : Tailwind CSS + shadcn/ui
- **PWA** : next-pwa ou Serwist
- **Hébergement** : Docker sur VPS avec Coolify

---

## Étapes du projet

### Phase 1 – Initialisation

- [x] **Étape 1** – Analyse du cahier des charges & choix de la stack
  - [x] Lecture du cahier des charges (`projet.md`)
  - [x] Résumé des enjeux principaux
  - [x] Proposition de 3 options de stack technique
  - [x] Validation de la stack par le client
    - ✅ Stack : **Next.js Full-Stack** (Option 1)
    - ✅ Hébergement : **Docker sur VPS avec Coolify**
    - ✅ Base de données : **PostgreSQL dédié sur VPS**

### Phase 2 – Conception

- [x] **Étape 2** – Modèle de données & schéma de base de données ✅
  - [x] Conception du schéma Prisma (v1)
  - [x] Relations entre entités (User, Menu, Reservation, etc.)
  - [x] Révision v2 : choix entrée/plat/dessert (MenuOption + CourseType)
  - [x] Ajout du suivi opérationnel (ReservationStatus, operationalTrackingEnabled)
  - [x] Validation finale du modèle par le client

- [x] **Étape 3** – Initialisation du projet ✅
  - [x] Création du projet Next.js 14 + TypeScript
  - [x] Configuration Prisma avec schéma validé
  - [x] Configuration Tailwind CSS
  - [x] Configuration Docker (Dockerfile + docker-compose)
  - [x] Structure des dossiers
  - [x] Script de seed pour données de test
  - [x] Build de production validé

- [x] **Étape 4** – Structure du backend (API / routes / auth) ✅
  - [x] Configuration NextAuth.js (credentials provider)
  - [x] Utilitaires d'authentification et de dates
  - [x] API /api/users (GET, POST, PATCH, DELETE)
  - [x] API /api/menus (GET, POST, PATCH, DELETE)
  - [x] API /api/reservations (GET, POST, PATCH, DELETE)
  - [x] API /api/settings (GET, PATCH)
  - [x] Middleware de protection des routes par rôle

- [x] **Étape 5** – Structure du frontend (pages / vues / navigation) ✅
  - [x] Composants UI réutilisables (Button, Input, Card, Badge, Alert, Select)
  - [x] Layout avec navigation responsive
  - [x] Page de connexion
  - [x] Dashboard agent (vue semaine avec réservations)
  - [x] Modal de réservation (création/modification/annulation)
  - [x] Interface gestionnaire RASF (tableau de bord, liste des réservations)
  - [x] Interface admin (gestion utilisateurs, paramètres globaux)

### Phase 3 – Développement

- [x] **Étape 6** – Gestion des comptes & rôles (Agent / Gestionnaire RASF / Admin) ✅
  - [x] API activation de compte
  - [x] API mot de passe oublié / reset
  - [x] API import en masse (CSV)
  - [x] Page d'activation de compte
  - [x] Page mot de passe oublié
  - [x] Page reset de mot de passe
  - [x] Modal d'import CSV dans l'admin

- [x] **Étape 7** – Gestion des menus & duplication de semaines ✅
  - [x] Page de liste des menus par semaine
  - [x] Modal création/modification de menu
  - [x] Gestion des entrées, plats, desserts
  - [x] Publication / dépublication
  - [x] API et modal de duplication de semaine

- [x] **Étape 8** – Réservations avancées (UX et heure limite) ✅
  - [x] Hook useSettings pour paramètres globaux
  - [x] Fonction canModifyForDate (vérification heure limite)
  - [x] Indicateur visuel heure limite sur le dashboard
  - [x] Décompte du temps restant en temps réel
  - [x] Verrouillage visuel des jours après heure limite
  - [x] Alerte dans la modal de réservation
  - [x] Page historique des réservations

- [x] **Étape 9** – Exports CSV/Excel ✅
  - [x] API export réservations (détail + synthèse)
  - [x] API export utilisateurs
  - [x] Composant ExportButton avec menu déroulant
  - [x] Export par jour ou par semaine
  - [x] Intégration dans pages gestionnaire et admin

### Phase 4 – Finalisation

- [x] **Étape 10** – PWA (Progressive Web App) ✅
  - [x] Installation @ducanh2912/next-pwa
  - [x] Configuration manifest.json
  - [x] Generation des icones (script + sharp)
  - [x] Service worker avec cache strategies
  - [x] Composant InstallPrompt pour installation
  - [x] Meta tags Apple Web App
  - [ ] Notifications email (optionnel - a implémenter plus tard)
  - [ ] Notifications push (optionnel - a implémenter plus tard)

- [x] **Étape 11** – Securite, RGPD, parametres globaux ✅
  - [x] Hashage des mots de passe (bcrypt)
  - [x] Sessions securisees (NextAuth JWT)
  - [x] Headers de securite (X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
  - [x] Page Mentions legales (/legal/mentions)
  - [x] Page Politique de confidentialite RGPD (/legal/privacy)
  - [x] Footer avec liens legaux dans toutes les pages
  - [x] Page parametres globaux complete (admin/settings)

- [x] **Étape 12** – Documentation ✅
  - [x] README.md complet (installation, structure, scripts)
  - [x] Documentation de deploiement (Docker, Coolify)
  - [x] Guide utilisateur (Agent, Gestionnaire, Admin)
  - [x] env.example a jour
  - [x] Dockerfile optimise

---

## Légende

- [x] Terminé
- [ ] À faire
- 🔄 En cours (sera indiqué dans le titre si applicable)

---

## Notes

- Le cahier des charges de référence est `projet.md` à la racine du projet.
- Toute contradiction avec le cahier des charges doit être signalée et validée.

