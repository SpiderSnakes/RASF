// =============================================================================
// Page Politique de Confidentialite (RGPD)
// =============================================================================

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialite",
  description: "Politique de confidentialite et protection des donnees personnelles",
};

export default function PrivacyPage() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Politique de confidentialite
      </h1>

      <div className="prose prose-gray max-w-none">
        <p className="text-gray-600 mb-6">
          Le Restaurant Administratif de Saint-Pierre (RASF) s&apos;engage a proteger 
          la vie privee des utilisateurs de son application de reservation de repas. 
          Cette politique de confidentialite explique comment nous collectons, utilisons 
          et protegeons vos donnees personnelles conformement au Reglement General sur 
          la Protection des Donnees (RGPD).
        </p>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            1. Responsable du traitement
          </h2>
          <p className="text-gray-600">
            Le responsable du traitement des donnees est :<br />
            <strong>Restaurant Administratif de Saint-Pierre (RASF)</strong><br />
            [Adresse complete]<br />
            97410 Saint-Pierre, La Reunion<br />
            Email : [email DPO ou contact]
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            2. Donnees collectees
          </h2>
          <p className="text-gray-600 mb-3">
            Dans le cadre de l&apos;utilisation de l&apos;application, nous collectons 
            les donnees suivantes :
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>
              <strong>Donnees d&apos;identification</strong> : nom, prenom, adresse email professionnelle
            </li>
            <li>
              <strong>Donnees de compte</strong> : numero de compte cantine, role (agent, gestionnaire, administrateur)
            </li>
            <li>
              <strong>Donnees de reservation</strong> : date, choix de menu, mode de consommation (sur place/a emporter)
            </li>
            <li>
              <strong>Donnees techniques</strong> : logs de connexion, adresse IP (pour la securite)
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            3. Finalites du traitement
          </h2>
          <p className="text-gray-600 mb-3">
            Vos donnees sont utilisees pour les finalites suivantes :
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Gestion de votre compte utilisateur</li>
            <li>Traitement de vos reservations de repas</li>
            <li>Communication relative a vos reservations</li>
            <li>Statistiques internes (anonymisees) sur la frequentation</li>
            <li>Securite et prevention des fraudes</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            4. Base legale du traitement
          </h2>
          <p className="text-gray-600">
            Le traitement de vos donnees est fonde sur :
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2">
            <li>
              <strong>L&apos;execution d&apos;un contrat</strong> : la gestion de vos reservations
            </li>
            <li>
              <strong>L&apos;interet legitime</strong> : la securite de l&apos;application et la prevention des fraudes
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            5. Destinataires des donnees
          </h2>
          <p className="text-gray-600">
            Vos donnees sont accessibles uniquement :
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2">
            <li>Au personnel habilite du RASF (gestionnaires, administrateurs)</li>
            <li>A notre hebergeur technique (dans le cadre strict de l&apos;hebergement)</li>
          </ul>
          <p className="text-gray-600 mt-3">
            Vos donnees ne sont jamais vendues ni transmises a des tiers a des fins commerciales.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            6. Duree de conservation
          </h2>
          <p className="text-gray-600">
            Vos donnees sont conservees :
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2">
            <li>
              <strong>Donnees de compte</strong> : pendant toute la duree de votre activite 
              au sein de l&apos;etablissement, puis 1 an apres la desactivation du compte
            </li>
            <li>
              <strong>Donnees de reservation</strong> : 2 ans a compter de la date de reservation 
              (a des fins statistiques et de facturation)
            </li>
            <li>
              <strong>Logs de connexion</strong> : 1 an (obligation legale)
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            7. Securite des donnees
          </h2>
          <p className="text-gray-600">
            Nous mettons en oeuvre des mesures techniques et organisationnelles 
            appropriees pour proteger vos donnees :
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2">
            <li>Chiffrement des mots de passe (hashage bcrypt)</li>
            <li>Connexion securisee (HTTPS)</li>
            <li>Controle d&apos;acces par role</li>
            <li>Journalisation des actions sensibles</li>
            <li>Hebergement securise</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            8. Vos droits
          </h2>
          <p className="text-gray-600 mb-3">
            Conformement au RGPD, vous disposez des droits suivants :
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>
              <strong>Droit d&apos;acces</strong> : obtenir une copie de vos donnees personnelles
            </li>
            <li>
              <strong>Droit de rectification</strong> : corriger des donnees inexactes
            </li>
            <li>
              <strong>Droit a l&apos;effacement</strong> : demander la suppression de vos donnees 
              (sous reserve des obligations legales de conservation)
            </li>
            <li>
              <strong>Droit a la limitation</strong> : limiter le traitement de vos donnees
            </li>
            <li>
              <strong>Droit a la portabilite</strong> : recevoir vos donnees dans un format structure
            </li>
            <li>
              <strong>Droit d&apos;opposition</strong> : vous opposer a certains traitements
            </li>
          </ul>
          <p className="text-gray-600 mt-3">
            Pour exercer ces droits, contactez-nous a : <strong>[email DPO]</strong>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            9. Cookies
          </h2>
          <p className="text-gray-600">
            Cette application utilise uniquement des cookies strictement necessaires 
            au fonctionnement du service (authentification, session). Ces cookies sont 
            exempts de consentement conformement aux recommandations de la CNIL.
          </p>
          <p className="text-gray-600 mt-2">
            Aucun cookie de tracking, publicitaire ou analytique n&apos;est utilise.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            10. Reclamation
          </h2>
          <p className="text-gray-600">
            Si vous estimez que le traitement de vos donnees constitue une violation 
            du RGPD, vous avez le droit d&apos;introduire une reclamation aupres de la CNIL :
          </p>
          <p className="text-gray-600 mt-2">
            <strong>Commission Nationale de l&apos;Informatique et des Libertes (CNIL)</strong><br />
            3 Place de Fontenoy, TSA 80715<br />
            75334 Paris Cedex 07<br />
            Site web : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-rasf-600 hover:text-rasf-700">www.cnil.fr</a>
          </p>
        </section>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
        Derniere mise a jour : Decembre 2024
      </div>
    </div>
  );
}

