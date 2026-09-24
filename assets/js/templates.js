/* ------------------------------------------------------------------
   templates.js — catalogue des modèles de lettres.

   Chaque modèle expose :
     key      identifiant unique
     group    intitulé de la section dans le sélecteur
     label    nom affiché sur le bouton
     desc     courte description sous le nom
     icon     emoji illustratif
     objet    ligne « Objet : … » — chaîne ou fonction (v) => chaîne
     fields   champs spécifiques au modèle
              { id, label, ph (placeholder), area (textarea si true) }
     body(v)  corps de la lettre ; v = valeurs saisies, plus v.ref,
              v.sender, v.address et v.recipient issus de l'en-tête

   Options facultatives :
     salutation   remplace « Madame, Monsieur, » (null = pas d'appel)
     closing      remplace la formule de politesse (null = aucune)
     noRecipient  true = pas de bloc destinataire (attestations…)

   Ajouter un modèle = ajouter un objet dans ce tableau, rien d'autre.
   L'ordre du tableau détermine l'ordre des sections et des boutons.
------------------------------------------------------------------ */

window.LETTER_TYPES = [

  /* ================= Contrats & abonnements ================= */

  {
    key: 'resiliation',
    group: 'Contrats & abonnements',
    label: 'Résiliation de contrat',
    desc: 'Mettre fin à un abonnement ou un contrat',
    icon: '✂️',
    objet: 'Résiliation de contrat',
    fields: [
      { id: 't_service', label: 'Nom du service / contrat', ph: 'Abonnement internet Fibre' },
      { id: 't_dateEffet', label: 'Date de résiliation souhaitée', ph: '15/11/2026' },
      { id: 't_motif', label: 'Motif (optionnel)', ph: "Déménagement, changement d'offre…", area: true },
    ],
    body: (v) => `Je vous informe par la présente de ma décision de résilier le contrat "${v.t_service || '[service]'}"${v.ref ? ` (référence : ${v.ref})` : ''} me liant à votre société, à compter du ${v.t_dateEffet || '[date souhaitée]'}.${v.t_motif ? `\n\nCette résiliation fait suite à : ${v.t_motif}.` : ''}

Je vous remercie de bien vouloir prendre en compte cette demande dans les meilleurs délais, de m'en confirmer la bonne réception ainsi que la date effective de résiliation, et de procéder, le cas échéant, au remboursement des sommes indûment perçues après cette date.`,
  },

  {
    key: 'retractation',
    group: 'Contrats & abonnements',
    label: 'Droit de rétractation',
    desc: 'Annuler un achat à distance sous 14 jours',
    icon: '↩️',
    objet: 'Exercice du droit de rétractation',
    fields: [
      { id: 't_commande', label: 'Commande / contrat concerné', ph: 'Commande n° 45123 — casque audio' },
      { id: 't_dateRecep', label: 'Date de réception / de signature', ph: '18/09/2026' },
      { id: 't_montant', label: 'Montant à rembourser (€)', ph: '129,00' },
    ],
    body: (v) => `Conformément à l'article L221-18 du code de la consommation, je vous informe que j'exerce mon droit de rétractation concernant : ${v.t_commande || '[commande concernée]'}${v.ref ? ` (référence : ${v.ref})` : ''}, reçu(e) le ${v.t_dateRecep || '[date de réception]'}.

Cette rétractation intervient dans le délai légal de quatorze jours et n'a pas à être motivée.

Je vous remercie de procéder au remboursement intégral des sommes versées, soit ${v.t_montant || '[montant]'} €, frais de livraison standard compris, dans un délai maximal de quatorze jours à compter de la réception de ce courrier.

Je me tiens à votre disposition pour organiser le retour des articles concernés selon les modalités que vous voudrez bien m'indiquer.`,
  },

  /* ================= Argent & factures ================= */

  {
    key: 'demeure',
    group: 'Argent & factures',
    label: 'Mise en demeure',
    desc: 'Réclamer une somme restée impayée',
    icon: '⚖️',
    objet: 'Mise en demeure de payer',
    fields: [
      { id: 't_montant', label: 'Montant dû (€)', ph: '450' },
      { id: 't_echeance', label: "Date d'échéance dépassée", ph: '01/09/2026' },
      { id: 't_delai', label: 'Délai accordé (jours)', ph: '8' },
    ],
    body: (v) => `Malgré mes précédentes relances, je constate que la somme de ${v.t_montant || '[montant]'} €${v.ref ? ` correspondant à ${v.ref}` : ''} demeure impayée à ce jour, l'échéance étant fixée au ${v.t_echeance || "[date d'échéance]"}.

Par la présente, je vous mets en demeure de procéder au règlement intégral de cette somme dans un délai de ${v.t_delai || '8'} jours à compter de la réception de ce courrier.

À défaut de règlement dans ce délai, je me verrai contraint(e) d'engager toute action utile au recouvrement de cette créance, y compris par voie judiciaire, sans autre avis préalable.`,
  },

  {
    key: 'delai',
    group: 'Argent & factures',
    label: 'Délai de paiement',
    desc: 'Demander un report ou un échelonnement',
    icon: '🗓️',
    objet: 'Demande de délai de paiement',
    fields: [
      { id: 't_montant', label: 'Montant concerné (€)', ph: '320' },
      { id: 't_raison', label: 'Raison de la demande', ph: 'Difficulté financière passagère', area: true },
      { id: 't_proposition', label: 'Échéance ou échelonnement proposé', ph: 'Règlement en 3 fois, dernier versement le 15/12/2026' },
    ],
    body: (v) => `Je fais suite à votre facture concernant la somme de ${v.t_montant || '[montant]'} €${v.ref ? ` (référence : ${v.ref})` : ''}.

En raison de ${v.t_raison || '[raison]'}, je me trouve dans l'impossibilité de régler cette somme dans les délais impartis.

Je vous sollicite donc un délai de paiement supplémentaire et vous propose le règlement suivant : ${v.t_proposition || '[proposition]'}.

Je vous remercie de bien vouloir étudier ma demande avec bienveillance et reste à votre disposition pour tout échange à ce sujet.`,
  },

  {
    key: 'contestation',
    group: 'Argent & factures',
    label: 'Contestation de facture',
    desc: 'Signaler une erreur de facturation',
    icon: '🧾',
    objet: 'Contestation de facture',
    fields: [
      { id: 't_numFacture', label: 'Numéro de facture', ph: 'FAC-2026-00456' },
      { id: 't_montant', label: 'Montant contesté (€)', ph: '89,90' },
      { id: 't_motif', label: 'Motif de la contestation', ph: 'Service non fourni, erreur de tarif…', area: true },
    ],
    body: (v) => `Je conteste par la présente le montant de la facture n° ${v.t_numFacture || '[numéro]'} d'un montant de ${v.t_montant || '[montant]'} €.

Motif de la contestation : ${v.t_motif || '[motif]'}.

Je vous demande de bien vouloir procéder à la révision de cette facture et, le cas échéant, à son annulation ou à sa rectification, dans les meilleurs délais. Dans l'attente, je me réserve le droit de suspendre le règlement du montant contesté.`,
  },

  {
    key: 'remboursement',
    group: 'Argent & factures',
    label: 'Demande de remboursement',
    desc: 'Récupérer une somme versée à tort',
    icon: '💶',
    objet: 'Demande de remboursement',
    fields: [
      { id: 't_objet', label: 'Produit / service concerné', ph: 'Commande n°45123 non livrée' },
      { id: 't_montant', label: 'Montant à rembourser (€)', ph: '129,00' },
      { id: 't_motif', label: 'Motif', ph: 'Produit défectueux, commande annulée…', area: true },
    ],
    body: (v) => `Je vous sollicite par la présente le remboursement de la somme de ${v.t_montant || '[montant]'} € correspondant à : ${v.t_objet || '[objet]'}${v.ref ? ` (référence : ${v.ref})` : ''}.

Motif de la demande : ${v.t_motif || '[motif]'}.

Je vous remercie de bien vouloir procéder à ce remboursement dans les meilleurs délais et de m'en confirmer la bonne exécution.`,
  },

  /* ================= Logement ================= */

  {
    key: 'conge',
    group: 'Logement',
    label: 'Congé du logement',
    desc: 'Donner son préavis au propriétaire',
    icon: '🔑',
    objet: 'Congé du logement — préavis de départ',
    fields: [
      { id: 't_logement', label: 'Adresse du logement', ph: '12 rue des Lilas, 75000 Paris' },
      { id: 't_preavis', label: 'Durée du préavis', ph: '3 mois (1 mois en zone tendue)' },
      { id: 't_dateDepart', label: 'Date de départ des lieux', ph: '31/12/2026' },
      { id: 't_motif', label: 'Motif du préavis réduit (optionnel)', ph: 'Logement en zone tendue, mutation, premier emploi…', area: true },
    ],
    body: (v) => `Conformément à l'article 15 de la loi n° 89-462 du 6 juillet 1989, je vous donne congé du logement situé ${v.t_logement || '[adresse du logement]'}, que j'occupe en qualité de locataire.

Le préavis applicable étant de ${v.t_preavis || '[durée du préavis]'}, je quitterai définitivement les lieux le ${v.t_dateDepart || '[date de départ]'}.${v.t_motif ? `\n\nLa réduction du délai de préavis se justifie par : ${v.t_motif}. Les justificatifs correspondants sont joints à ce courrier.` : ''}

Je vous propose de convenir ensemble d'une date pour l'état des lieux de sortie et la remise des clés.

Je vous remercie de me confirmer la bonne réception de ce congé ainsi que les modalités de restitution du dépôt de garantie.`,
  },

  {
    key: 'reparations',
    group: 'Logement',
    label: 'Demande de réparations',
    desc: 'Signaler un désordre au bailleur',
    icon: '🔧',
    objet: 'Demande de réalisation de travaux',
    fields: [
      { id: 't_logement', label: 'Adresse du logement', ph: '12 rue des Lilas, 75000 Paris' },
      { id: 't_desordres', label: 'Désordres constatés', ph: "Fuite sous l'évier depuis le 03/09, infiltration au plafond de la chambre…", area: true },
      { id: 't_delai', label: 'Délai d\'intervention demandé (jours)', ph: '15' },
    ],
    body: (v) => `Je vous signale les désordres suivants affectant le logement situé ${v.t_logement || '[adresse du logement]'}, que j'occupe en qualité de locataire :

${v.t_desordres || '[description des désordres]'}

Ces réparations ne relèvent pas de l'entretien courant à la charge du locataire : elles incombent au bailleur, tenu de délivrer un logement décent et d'y effectuer les réparations autres que locatives (articles 6 et 7 de la loi n° 89-462 du 6 juillet 1989).

Je vous remercie de bien vouloir faire intervenir une entreprise dans un délai de ${v.t_delai || '15'} jours et de me communiquer la date d'intervention prévue.`,
  },

  /* ================= Travail ================= */

  {
    key: 'candidature',
    group: 'Travail',
    label: 'Candidature',
    desc: 'Lettre de motivation pour un poste',
    icon: '💼',
    objet: (v) => `Candidature au poste de ${v.t_poste || '[intitulé du poste]'}`,
    closing: "Dans l'attente de votre réponse, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations respectueuses.",
    fields: [
      { id: 't_poste', label: 'Intitulé du poste', ph: 'Chargé de communication' },
      { id: 't_source', label: "Origine de la candidature", ph: "Votre annonce parue le 12/09 sur…" },
      { id: 't_atouts', label: 'Parcours et atouts', ph: 'Après cinq ans passés chez…, j\'ai développé…', area: true },
      { id: 't_dispo', label: 'Disponibilité', ph: 'Immédiatement / à compter du 01/12/2026' },
    ],
    body: (v) => `${v.t_source ? `${v.t_source} a retenu toute mon attention, et je vous adresse ma candidature au poste de ${v.t_poste || '[intitulé du poste]'}.` : `Je vous adresse ma candidature au poste de ${v.t_poste || '[intitulé du poste]'} au sein de votre structure.`}

${v.t_atouts || '[votre parcours et ce que vous apportez au poste]'}

Ce poste correspond à ce que je recherche aujourd'hui, et je serais heureux(se) de mettre ces compétences au service de vos projets.

Disponible ${v.t_dispo || '[votre disponibilité]'}, je me tiens à votre disposition pour un entretien au cours duquel je pourrai vous exposer plus précisément ma motivation.`,
  },

  {
    key: 'demission',
    group: 'Travail',
    label: 'Démission',
    desc: 'Quitter son poste en respectant le préavis',
    icon: '📤',
    objet: 'Démission',
    fields: [
      { id: 't_poste', label: 'Poste occupé', ph: 'Chargé de communication' },
      { id: 't_preavis', label: 'Durée du préavis', ph: '1 mois' },
      { id: 't_dateFin', label: 'Dernier jour travaillé', ph: '31/12/2026' },
      { id: 't_demande', label: 'Demande particulière (optionnel)', ph: 'Je sollicite une dispense de préavis à compter du…', area: true },
    ],
    body: (v) => `Je vous informe par la présente de ma décision de démissionner de mon poste de ${v.t_poste || '[poste occupé]'} que j'occupe au sein de votre entreprise.

Conformément à mon contrat de travail et à la convention collective applicable, j'effectuerai un préavis de ${v.t_preavis || '[durée du préavis]'}, mon dernier jour de travail étant ainsi fixé au ${v.t_dateFin || '[dernier jour travaillé]'}.${v.t_demande ? `\n\n${v.t_demande}` : ''}

Je vous remercie de bien vouloir m'adresser, à l'issue de mon contrat, mon certificat de travail, mon attestation destinée à France Travail, mon reçu pour solde de tout compte ainsi que, le cas échéant, les documents relatifs à l'épargne salariale.

Je veillerai d'ici mon départ à assurer la transmission de mes dossiers dans les meilleures conditions.`,
  },

  {
    key: 'conges',
    group: 'Travail',
    label: 'Demande de congés',
    desc: 'Poser des congés payés ou une absence',
    icon: '🌴',
    objet: 'Demande de congés',
    fields: [
      { id: 't_nature', label: 'Nature de l\'absence', ph: 'Congés payés, RTT, congé sans solde…' },
      { id: 't_debut', label: 'Date de début', ph: '22/12/2026' },
      { id: 't_fin', label: 'Date de fin (incluse)', ph: '02/01/2027' },
      { id: 't_jours', label: 'Nombre de jours ouvrés', ph: '8' },
    ],
    body: (v) => `Je souhaite bénéficier de ${v.t_nature || '[nature de l\'absence]'} du ${v.t_debut || '[date de début]'} au ${v.t_fin || '[date de fin]'} inclus, soit ${v.t_jours || '[nombre]'} jours ouvrés.

Je veillerai à ce que mes dossiers en cours soient transmis avant mon départ afin d'assurer la continuité du service pendant cette période.

Je vous remercie de bien vouloir me confirmer votre accord.`,
  },

  /* ================= Litiges & assurance ================= */

  {
    key: 'reclamation',
    group: 'Litiges & assurance',
    label: 'Réclamation / litige',
    desc: 'Signaler un problème et demander réparation',
    icon: '📣',
    objet: 'Réclamation',
    fields: [
      { id: 't_faits', label: 'Description des faits', ph: "Le 12/09/2026, la prestation prévue n'a pas été réalisée…", area: true },
      { id: 't_demande', label: 'Ce que vous demandez', ph: 'Réparation du préjudice, geste commercial…', area: true },
      { id: 't_delai', label: 'Délai de réponse souhaité (jours)', ph: '15' },
    ],
    body: (v) => `Je souhaite porter à votre connaissance la situation suivante${v.ref ? ` (référence : ${v.ref})` : ''} :

${v.t_faits || '[description des faits]'}

Cette situation me cause un préjudice que je vous demande de bien vouloir réparer. Concrètement, je sollicite : ${v.t_demande || '[votre demande]'}.

Je vous remercie de me faire connaître votre position dans un délai de ${v.t_delai || '15'} jours à compter de la réception de ce courrier.`,
  },

  {
    key: 'sinistre',
    group: 'Litiges & assurance',
    label: 'Déclaration de sinistre',
    desc: 'Déclarer un dommage à son assureur',
    icon: '🛡️',
    objet: 'Déclaration de sinistre',
    fields: [
      { id: 't_contrat', label: 'Numéro de contrat', ph: 'MRH-2026-77412' },
      { id: 't_dateLieu', label: 'Date et lieu du sinistre', ph: 'Le 20/09/2026, à mon domicile' },
      { id: 't_circonstances', label: 'Circonstances', ph: "Une rupture de canalisation a provoqué une infiltration…", area: true },
      { id: 't_dommages', label: 'Dommages constatés', ph: 'Parquet gonflé sur 8 m², meuble bas endommagé…', area: true },
    ],
    body: (v) => `Conformément à l'article L113-2 du code des assurances, je vous déclare le sinistre survenu ${v.t_dateLieu || '[date et lieu]'}, relevant du contrat n° ${v.t_contrat || '[numéro de contrat]'}.

Circonstances : ${v.t_circonstances || '[circonstances du sinistre]'}

Dommages constatés : ${v.t_dommages || '[dommages constatés]'}

Je me tiens à votre disposition pour tout complément d'information ainsi que pour la visite éventuelle d'un expert.

Je vous remercie de m'indiquer les pièces justificatives à vous transmettre et les modalités de prise en charge retenues.`,
  },

  /* ================= Attestations & démarches ================= */

  {
    key: 'hebergement',
    group: 'Attestations & démarches',
    label: "Attestation d'hébergement",
    desc: 'Certifier héberger quelqu\'un chez soi',
    icon: '🏠',
    objet: "Attestation d'hébergement",
    noRecipient: true,
    salutation: null,
    closing: 'Fait pour servir et valoir ce que de droit.',
    fields: [
      { id: 't_heberge', label: 'Personne hébergée', ph: 'Madame Claire Martin' },
      { id: 't_naissance', label: 'Né(e) le et à', ph: 'le 04/03/1995 à Nantes' },
      { id: 't_adresse', label: 'Adresse du logement', ph: '12 rue des Lilas, 75000 Paris' },
      { id: 't_depuis', label: 'Hébergé(e) depuis le', ph: '01/06/2026' },
    ],
    body: (v) => `Je soussigné(e) ${v.sender || '[Votre nom]'}, atteste sur l'honneur héberger à mon domicile, situé ${v.t_adresse || '[adresse du logement]'}, ${v.t_heberge || '[personne hébergée]'}, né(e) ${v.t_naissance || '[date et lieu de naissance]'}, depuis le ${v.t_depuis || '[date]'}.

Je certifie l'exactitude des renseignements portés sur la présente attestation et suis informé(e) que toute fausse déclaration m'expose aux sanctions prévues à l'article 441-7 du code pénal.

Une copie de ma pièce d'identité ainsi qu'un justificatif de domicile à mon nom sont joints à cette attestation.`,
  },

  {
    key: 'document',
    group: 'Attestations & démarches',
    label: 'Demande de document',
    desc: 'Réclamer une attestation, un duplicata…',
    icon: '📑',
    objet: 'Demande de document',
    fields: [
      { id: 't_document', label: 'Document demandé', ph: 'Attestation employeur, duplicata de facture, relevé annuel…' },
      { id: 't_motif', label: 'Motif (optionnel)', ph: 'Constitution d\'un dossier de logement', area: true },
      { id: 't_delai', label: 'Délai souhaité (jours)', ph: '15' },
    ],
    body: (v) => `Je vous prie de bien vouloir me faire parvenir le document suivant : ${v.t_document || '[document demandé]'}${v.ref ? ` (référence : ${v.ref})` : ''}.${v.t_motif ? `\n\nCe document m'est nécessaire pour : ${v.t_motif}.` : ''}

Je vous remercie de me l'adresser dans un délai de ${v.t_delai || '15'} jours, par courrier à l'adresse indiquée ci-dessus ou par voie électronique.

Je reste à votre disposition si un justificatif complémentaire vous était nécessaire pour traiter cette demande.`,
  },

];
