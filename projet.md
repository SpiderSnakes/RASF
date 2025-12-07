# Cahier des charges – Application de réservation de repas du RASF

## 1. Présentation du projet

**Intitulé du projet**
Mise en place d’une application de réservation de repas pour le **RASF – Restaurant Administratif de Saint‑Pierre**.

**Contexte**
Actuellement :

* Les menus sont transmis aux agents par mail (généralement le vendredi) pour la semaine suivante.
* Les agents peuvent réserver leur repas du midi **chaque jour avant 10h** par des moyens variés (mail, téléphone, déplacement physique).
* Le RASF doit ensuite consolider manuellement les réservations, ce qui est chronophage et source d’erreurs (oublis, doublons, mauvaise lisibilité des commandes).

**Objectif global**
Mettre en place un **service numérique dédié au RASF** permettant :

* Aux agents de **réserver leurs repas à l’avance**, en quelques clics, depuis un ordinateur ou un téléphone.
* Au RASF d’avoir une **vision claire, structurée et exportable** des réservations, incluant le mode de consommation (**sur place / à emporter**).

L’application sera **distincte des systèmes d’authentification de l’administration** (le RASF étant une association), avec une gestion de comptes propre à ce service.

---

## 2. Objectifs détaillés

1. **Simplifier le parcours agent**

   * Proposer une interface web/mobile simple pour consulter les menus de la semaine.
   * Permettre de réserver rapidement ses repas, en choisissant **sur place** ou **à emporter**.
   * Réduire les oublis via des rappels (notifications / emails, si activés).

2. **Faciliter le travail du RASF**

   * Accéder à une liste des réservations par jour, par type de menu, et par mode (sur place / à emporter).
   * Pouvoir **exporter les réservations** (CSV / Excel) pour anticiper les achats et la production.
   * Disposer d’une interface lisible sur tablette pour suivre les réservations du jour.

3. **Fiabiliser et sécuriser le processus**

   * Associer les réservations à des **comptes agents** identifiés (avec numéro de compte cantine).
   * Assurer une traçabilité minimale (date/heure de réservation, modification, annulation).
   * Protéger les données personnelles dans le respect du RGPD.

---

## 3. Acteurs et rôles

### 3.1. Agent

* Dispose d’un **compte personnel** dans l’application.
* Consulte les menus à venir.
* Réserve ses repas, en choisissant **sur place** ou **à emporter**.
* Peut modifier ou annuler sa réservation avant l’heure limite.

### 3.2. Gestionnaire RASF (cantine)

* Gère les menus (création, modification, duplication de semaines types).
* Consulte les listes de réservations (par jour, par type de menu, par mode).
* Exporte les données pour préparation et suivi.
* (Option) Marque les repas comme « servis / non venus » pour des statistiques internes.

### 3.3. Administrateur (fonctionnel / technique)

* Gère la **liste des comptes agents** (création, pré‑inscription, désactivation…).
* Associe ou modifie le **numéro de compte cantine** pour chaque agent.
* Gère les paramétrages globaux : heures limites de réservation, jours d’ouverture, capacité max, etc.

---

## 4. Gestion des comptes et scénarios d’inscription

L’authentification est gérée directement par l’application, sans lien technique avec les systèmes internes d’authentification (service externe géré pour le compte du RASF).

### 4.1. Données d’un compte agent

Pour chaque agent, l’application stocke au minimum :

* Nom
* Prénom
* Adresse mail professionnelle (ou identifiant choisi)
* **Numéro de compte cantine** (obligatoire, car utilisé en caisse)
* Statut du compte : actif / désactivé
* Hash du mot de passe (jamais le mot de passe en clair)

Le **numéro de compte cantine** est modifiable uniquement par un gestionnaire RASF ou un administrateur.

### 4.2. Scénarios possibles de création de compte

Deux logiques sont envisagées :

#### Option A – Pré‑inscription par le RASF (recommandée)

1. Le RASF dispose d’une liste des agents autorisés (nom, prénom, mail, numéro de compte cantine).
2. Le gestionnaire importe ou saisit ces informations dans l’application, créant des **comptes pré‑enregistrés**.
3. Chaque agent reçoit un mail d’activation avec un lien unique.
4. L’agent clique sur le lien, définit son mot de passe et valide les conditions d’utilisation.
5. Le compte est actif et directement lié au bon numéro de compte cantine.

**Avantages :**

* Seuls les agents autorisés ont accès à l’outil.
* Le numéro de compte cantine est correctement renseigné dès le départ.
* Moins de risque d’erreurs ou d’usurpation.

#### Option B – Inscription libre avec validation

1. L’agent accède à une page « Créer mon compte ».
2. Il saisit : nom, prénom, adresse mail professionnelle, éventuellement son numéro de compte cantine.
3. Une notification est envoyée au RASF / administrateur.
4. Le gestionnaire valide la demande, vérifie et complète le numéro de compte cantine si nécessaire.
5. L’agent reçoit un mail d’activation pour définir son mot de passe.

**Avantages :**

* Moins de saisie initiale côté RASF.
* Gère plus facilement l’arrivée d’agents ponctuels (en déplacement sur le site).

### 4.3. Recommandation

Pour un public limité et clairement identifié (**agents du site ou en déplacement**), ainsi que pour garantir la cohérence avec les numéros de compte cantine, l’**option A (pré‑inscription par le RASF avec activation par l’agent)** est recommandée.
L’option B peut rester disponible comme **flux exceptionnel** pour les cas particuliers (nouvel arrivant, agent externe) avec validation manuelle par le RASF.

---

## 5. Fonctionnalités – Côté agent

### 5.1. Authentification

* Connexion par identifiant (email ou matricule) + mot de passe.
* Fonction « mot de passe oublié » avec envoi d’un lien de réinitialisation par email.
* Déconnexion manuelle + déconnexion automatique après une période d’inactivité.

### 5.2. Consultation des menus

* Vue **par semaine** : présentation des menus du lundi au vendredi.
* Pour chaque jour :

  * Date
  * Titre du menu (plat principal)
  * (Option) Détail : entrée, accompagnement, dessert, options (végétarien, sans porc, etc.).
* Navigation possible vers les semaines suivantes (dans la limite définie : ex. semaine en cours + semaine suivante).

### 5.3. Réservation des repas

Pour chaque jour de la semaine :

* Possibilité de **réserver un repas** (bouton « Réserver » / « Modifier ma réservation »).
* Si plusieurs menus sont proposés : choix du menu (Menu A / Menu B / Végétarien…).
* **Choix obligatoire du mode de consommation :**

  * **Sur place**
  * **À emporter**
* Affichage clair de l’état de la réservation :

  * Non réservé
  * Réservé sur place
  * Réservé à emporter

**Règles de base :**

* Réservation et modification possibles jusqu’à l’heure limite définie (ex. 10h le jour J).
* Au‑delà de l’heure limite, la réservation du jour est verrouillée (lecture seule).

### 5.4. Modification / annulation

* L’agent peut modifier son menu ou basculer de « sur place » à « à emporter » tant que l’heure limite n’est pas passée.
* L’annulation complète du repas est possible avant l’heure limite.

### 5.5. Historique et visibilité

* Affichage des réservations de la **semaine en cours** (statut jour par jour).
* (Option) Historique sur les semaines précédentes à titre consultatif.

### 5.6. Notifications (option)

* Email ou notification (PWA) :

  * Rappel de réservation le matin (ex. 8h30).
  * Confirmation lors de la réservation ou de la modification.

---

## 6. Fonctionnalités – Côté gestionnaire RASF

### 6.1. Gestion des menus

* Création / modification des menus par jour :

  * Date
  * Titre du menu
  * Détails optionnels (entrée, dessert, etc.)
  * Définition des variantes : Menu A / Menu B / Végétarien, etc.
* Possibilité de **dupliquer une semaine type** pour gagner du temps.

### 6.2. Consultation des réservations

Vue principale par jour :

* Liste des réservations du jour avec :

  * Nom / prénom de l’agent
  * Numéro de compte cantine
  * Menu choisi (si plusieurs options)
  * Mode : **sur place** ou **à emporter**
  * Heure de la dernière modification

Filtres possibles :

* Par jour (sélection de la date)
* Par type de menu
* Par mode (sur place / à emporter)

Vue synthétique (tableau de bord) :

* Totaux par jour :

  * Nombre total de repas
  * Nombre de sur place vs à emporter
  * Totaux par type de menu (ex : 50 x Menu A, 30 x Menu B, 20 x Végétarien).

### 6.3. Export des données

* Export **CSV / Excel** des réservations :

  * Par jour
  * Par semaine
* Deux niveaux d’export possibles :

  * **Détail** : une ligne par réservation (avec agent, menu, mode, heure…).
  * **Synthèse** : totaux par menu / mode.

### 6.4. Suivi opérationnel (option)

* Marquer un repas comme **« servi »** au passage en caisse.
* Enregistrer les « non venus » pour analyse interne.
* Statistiques simples :

  * Taux de no-show
  * Fréquentation moyenne par jour.

---

## 7. Fonctionnalités – Administration

* Gestion des **comptes agents** :

  * Création manuelle ou import en masse (fichier CSV).
  * Association / modification du **numéro de compte cantine**.
  * Activation / désactivation des comptes.

* Gestion des **rôles** :

  * Rôle « Agent »
  * Rôle « Gestionnaire RASF »
  * Rôle « Administrateur »

* Paramètres globaux :

  * Heure limite de réservation (par défaut 10h, mais paramétrable).
  * Jours d’ouverture du RASF (ex. du lundi au vendredi).
  * Capacité maximale de service par jour ou par type de menu (option).
  * Activation / désactivation des notifications.

---

## 8. Règles de gestion principales

1. **Heure limite de réservation**

   * Réservation, modification et annulation possibles jusqu’à l’heure définie (ex. 10h le jour J).
   * Au‑delà, la réservation du jour est figée.

2. **Période de réservation**

   * Par défaut, ouverture des réservations pour :

     * la semaine en cours,
     * et éventuellement la semaine suivante (à confirmer).

3. **Capacité maximale (option)**

   * Possibilité de définir une capacité journalière globale ou par type de menu.
   * Une fois la capacité atteinte, les nouveaux agents voient le jour / menu comme « complet ».

4. **Accès limité aux agents autorisés**

   * Seuls les agents disposant d’un compte actif (précédemment pré‑créé ou validé) peuvent se connecter et réserver.

---

## 9. Exigences ergonomiques et design

* Interface **sobre, claire et moderne**, adaptée au contexte professionnel.
* Design **responsive** pour un usage confortable sur :

  * Ordinateur de bureau
  * Smartphone
  * Tablette (ex. en cuisine ou à l’accueil du RASF)
* Parcours utilisateur optimisé :

  * Objectif : permettre à un agent de réserver ses repas pour toute la semaine en moins d’une minute.
* Codification visuelle :

  * Jour non réservé : état neutre
  * Repas réservé sur place : badge / icône spécifique
  * Repas réservé à emporter : badge / icône distincte
* Accessibilité :

  * Contrastes suffisants
  * Taille de texte lisible.

---

## 10. Exigences techniques

* **Type d’application** :

  * Application web responsive.
  * Mise en place d’une **Progressive Web App (PWA)** pour permettre l’ajout sur l’écran d’accueil du téléphone et l’envoi de notifications (si possible dans le contexte technique).

* **Architecture** :

  * Application web + API backend pour la gestion des comptes, menus et réservations.
  * Base de données pour stocker les comptes, numéros de cantine, menus, réservations, logs.

* **Compatibilité** :

  * Navigateurs modernes (Chrome, Firefox, Edge, Safari).
  * Affichage correct sur iOS et Android via le navigateur et/ou PWA.

* **Hébergement** :

  * Sur une infrastructure conforme aux exigences de l’administration et de l’association RASF (à préciser avec le service informatique).

---

## 11. Exigences de sécurité & RGPD

* **Données personnelles traitées** :

  * Nom, prénom
  * Adresse mail professionnelle (ou identifiant)
  * Numéro de compte cantine
  * Informations de réservation (jours, menus, mode sur place / à emporter)

* **Sécurité** :

  * Utilisation du protocole **HTTPS**.
  * Mots de passe stockés de manière chiffrée (hash + sel).
  * Gestion des sessions sécurisée (tokens, expiration, déconnexion automatique).

* **RGPD** :

  * Définir la finalité : gestion des réservations de repas du RASF.
  * Limiter la durée de conservation des données de réservation (ex. 1 an glissant, à confirmer).
  * Informer les agents sur l’utilisation de leurs données (mentions dans l’application).

---

## 12. Évolutions possibles (hors périmètre V1)

Les évolutions ci‑dessous sont **hors périmètre de la première version**, mais peuvent être envisagées ultérieurement :

* Gestion des **crédits / facturation** directement dans l’outil (suivi des repas consommés, soldes, etc.).
* Intégration avec les systèmes de **caisse** ou de **badge** de la cantine.
* Statistiques avancées :

  * Fréquentation mensuelle
  * Prévisionnel de fréquentation par jour de la semaine.
* Extension à d’autres sites ou restaurants administratifs.
* Module de **satisfaction** (notation des menus, commentaires anonymisés).

---

## 13. Conclusion

Ce cahier des charges propose une base structurée pour concevoir une application de réservation de repas adaptée au **RASF** :

* Centrée sur un parcours agent simple et rapide.
* Offrant au RASF une visibilité claire sur les réservations (incluant le mode sur place / à emporter).
* Reposant sur une gestion de comptes maîtrisée (pré‑inscription recommandée, avec numéro de compte cantine).

Les arbitrages finaux (heures limites, période de réservation, scénario de création de compte, périmètre exact de la V1) devront être validés avec le RASF et, le cas échéant, avec le service informatique concerné.
