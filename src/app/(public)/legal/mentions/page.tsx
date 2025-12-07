// =============================================================================
// Page Mentions Legales
// =============================================================================

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions legales",
  description: "Mentions legales de l'application RASF Cantine",
};

export default function MentionsLegalesPage() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mentions legales</h1>

      <div className="prose prose-gray max-w-none">
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            1. Editeur du site
          </h2>
          <p className="text-gray-600 mb-2">
            <strong>Restaurant Administratif de Saint-Pierre (RASF)</strong>
          </p>
          <p className="text-gray-600 mb-2">
            Adresse : [Adresse du RASF]<br />
            97410 Saint-Pierre, La Reunion
          </p>
          <p className="text-gray-600 mb-2">
            Telephone : [Numero de telephone]<br />
            Email : [Email de contact]
          </p>
          <p className="text-gray-600">
            Directeur de la publication : [Nom du responsable]
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            2. Hebergement
          </h2>
          <p className="text-gray-600 mb-2">
            Cette application est hebergee par :
          </p>
          <p className="text-gray-600">
            [Nom de l&apos;hebergeur]<br />
            [Adresse de l&apos;hebergeur]<br />
            [Contact de l&apos;hebergeur]
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            3. Propriete intellectuelle
          </h2>
          <p className="text-gray-600">
            L&apos;ensemble du contenu de ce site (textes, images, logos, icones, 
            elements graphiques) est la propriete exclusive du RASF ou de ses 
            partenaires. Toute reproduction, representation, modification, publication, 
            adaptation de tout ou partie des elements du site, quel que soit le moyen 
            ou le procede utilise, est interdite, sauf autorisation ecrite prealable.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            4. Responsabilite
          </h2>
          <p className="text-gray-600 mb-2">
            Le RASF s&apos;efforce d&apos;assurer au mieux de ses possibilites l&apos;exactitude 
            et la mise a jour des informations diffusees sur ce site. Toutefois, 
            le RASF ne peut garantir l&apos;exactitude, la precision ou l&apos;exhaustivite 
            des informations mises a disposition sur ce site.
          </p>
          <p className="text-gray-600">
            Le RASF decline toute responsabilite pour toute imprecision, inexactitude 
            ou omission portant sur des informations disponibles sur ce site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            5. Donnees personnelles
          </h2>
          <p className="text-gray-600">
            Pour toute information relative a la collecte et au traitement de vos 
            donnees personnelles, veuillez consulter notre{" "}
            <a href="/legal/privacy" className="text-rasf-600 hover:text-rasf-700">
              Politique de confidentialite
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            6. Droit applicable
          </h2>
          <p className="text-gray-600">
            Les presentes mentions legales sont soumises au droit francais. 
            En cas de litige, les tribunaux francais seront seuls competents.
          </p>
        </section>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
        Derniere mise a jour : Decembre 2024
      </div>
    </div>
  );
}

