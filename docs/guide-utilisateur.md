# Guide utilisateur - RASF Cantine

## Sommaire

1. [Connexion](#connexion)
2. [Agent - Reserver un repas](#agent---reserver-un-repas)
3. [Gestionnaire RASF - Gerer les menus](#gestionnaire-rasf---gerer-les-menus)
4. [Administrateur - Gerer les utilisateurs](#administrateur---gerer-les-utilisateurs)

---

## Connexion

### Premiere connexion

1. Ouvrez l'application dans votre navigateur
2. Entrez votre adresse email professionnelle
3. Si c'est votre premiere connexion, vous recevrez un lien d'activation par email
4. Cliquez sur le lien et definissez votre mot de passe

### Mot de passe oublie

1. Sur la page de connexion, cliquez sur "Mot de passe oublie"
2. Entrez votre adresse email
3. Vous recevrez un lien de reinitialisation par email
4. Cliquez sur le lien et definissez un nouveau mot de passe

### Installer l'application (PWA)

L'application peut etre installee sur votre telephone ou ordinateur :

1. Ouvrez l'application dans votre navigateur
2. Une notification "Installer RASF Cantine" apparaitra
3. Cliquez sur "Installer"
4. L'application sera disponible comme une app native

---

## Agent - Reserver un repas

### Voir les menus de la semaine

1. Apres connexion, vous arrivez sur le tableau de bord
2. Les menus de la semaine sont affiches jour par jour
3. Utilisez les fleches pour naviguer entre les semaines

### Faire une reservation

1. Cliquez sur le jour souhaite (s'il y a un menu disponible)
2. Une fenetre s'ouvre avec les options du jour
3. Selectionnez :
   - Votre **entree** (si plusieurs choix)
   - Votre **plat principal** (obligatoire)
   - Votre **dessert** (si plusieurs choix)
   - Le **mode de consommation** : Sur place ou A emporter
4. Cliquez sur "Reserver"

### Modifier une reservation

1. Cliquez sur le jour ou vous avez deja reserve
2. Modifiez vos choix
3. Cliquez sur "Modifier"

⚠️ **Attention** : Les modifications sont possibles uniquement avant l'heure limite (generalement 10h00 le jour meme).

### Annuler une reservation

1. Cliquez sur le jour ou vous avez reserve
2. Cliquez sur "Annuler la reservation"
3. Confirmez l'annulation

### Consulter l'historique

1. Cliquez sur "Historique" en haut a droite
2. Naviguez par mois pour voir vos reservations passees

---

## Gestionnaire RASF - Gerer les menus

### Acceder a la gestion

1. Connectez-vous avec un compte Gestionnaire
2. Cliquez sur "Gestion" dans le menu

### Creer un menu

1. Allez dans "Gestion" > "Menus"
2. Naviguez jusqu'a la semaine souhaitee
3. Cliquez sur "Creer un menu" sur le jour voulu
4. Remplissez :
   - **Accompagnements** : riz, grains, legumes, etc.
   - **Entrees** : ajoutez autant d'entrees que necessaire
   - **Plats principaux** : au moins un plat obligatoire
   - **Desserts** : ajoutez autant de desserts que necessaire
   - **Notes** : informations supplementaires (optionnel)
5. Cochez "Publier" si le menu est pret
6. Cliquez sur "Enregistrer"

### Modifier un menu

1. Cliquez sur "Modifier" sur le menu concerne
2. Faites vos modifications
3. Enregistrez

### Dupliquer une semaine

Pour gagner du temps, vous pouvez copier les menus d'une semaine vers une autre :

1. Cliquez sur "Dupliquer une semaine"
2. Selectionnez la semaine source (a copier)
3. Selectionnez la semaine cible (ou coller)
4. Cochez "Ecraser les menus existants" si necessaire
5. Cliquez sur "Dupliquer"

Les menus dupliques sont crees en brouillon - pensez a les publier.

### Voir les reservations du jour

1. Allez dans "Gestion" > "Reservations"
2. Selectionnez la date
3. Filtrez par mode (tous, sur place, a emporter)

### Marquer les repas servis

1. Sur la liste des reservations du jour
2. Cliquez sur ✓ pour marquer comme "Servi"
3. Cliquez sur ✗ pour marquer comme "Non venu"

### Exporter les reservations

1. Sur la page des reservations
2. Cliquez sur "Exporter CSV"
3. Choisissez :
   - Export detail (une ligne par reservation)
   - Export synthese (totaux par plat)
   - Jour ou semaine complete

---

## Administrateur - Gerer les utilisateurs

### Acceder a l'administration

1. Connectez-vous avec un compte Administrateur
2. Cliquez sur "Administration" dans le menu

### Creer un utilisateur

1. Allez dans "Administration" > "Utilisateurs"
2. Cliquez sur "+ Nouvel utilisateur"
3. Remplissez :
   - Prenom
   - Nom
   - Email
   - Numero de compte cantine (optionnel)
   - Role (Agent, Gestionnaire ou Admin)
4. Cliquez sur "Creer"

L'utilisateur recevra un email pour activer son compte.

### Importer des utilisateurs en masse

1. Preparez un fichier CSV avec les colonnes :
   ```
   email,firstName,lastName,canteenAccountNumber,role
   jean.dupont@example.com,Jean,DUPONT,12345,AGENT
   marie.martin@example.com,Marie,MARTIN,12346,GESTIONNAIRE
   ```
2. Cliquez sur "Import CSV"
3. Selectionnez votre fichier
4. Verifiez l'apercu
5. Cliquez sur "Importer"

### Desactiver un utilisateur

1. Dans la liste des utilisateurs
2. Cliquez sur "Desactiver" a cote de l'utilisateur

### Configurer les parametres

1. Allez dans "Administration" > "Parametres"
2. Configurez :
   - **Heure limite** : heure limite pour reserver le jour meme
   - **Jours d'ouverture** : jours ou le restaurant est ouvert
   - **Semaines visibles** : nombre de semaines affichees
   - **Capacite maximale** : limite de repas par jour (optionnel)
   - **Suivi operationnel** : activer le marquage servi/non venu
3. Cliquez sur "Enregistrer"

### Exporter la liste des utilisateurs

1. Sur la page des utilisateurs
2. Cliquez sur "Export CSV"

---

## FAQ

### Je ne peux plus modifier ma reservation

La modification est bloquee apres l'heure limite (generalement 10h00). Contactez le gestionnaire RASF si necessaire.

### Je n'ai pas recu l'email d'activation

1. Verifiez vos spams
2. Attendez quelques minutes
3. Demandez a l'administrateur de renvoyer l'email

### L'application ne s'affiche pas correctement

1. Videz le cache de votre navigateur
2. Essayez un autre navigateur
3. Contactez le support technique

### Comment changer mon mot de passe ?

Utilisez la fonction "Mot de passe oublie" sur la page de connexion pour definir un nouveau mot de passe.

---

## Contact support

Pour toute question ou probleme technique, contactez :
- Email : [email support]
- Telephone : [numero]

