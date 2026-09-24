/* ------------------------------------------------------------------
   letter.js — assemblage du texte de la lettre.
   Aucune dépendance au DOM : entrée = données, sortie = chaîne.
------------------------------------------------------------------ */

window.Letter = (function () {
  const DEFAULT_SALUTATION = 'Madame, Monsieur,';
  const DEFAULT_CLOSING =
    "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.";

  /** Date du jour au format « 24 septembre 2026 ». */
  function todayFr() {
    return new Date().toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'long', year: 'numeric',
    });
  }

  /** Renvoie la valeur, ou un repère [ainsi] si elle est vide. */
  function fill(value, placeholder) {
    return value ? value : `[${placeholder}]`;
  }

  /** Résout une propriété de modèle qui peut être une valeur ou une fonction. */
  function resolve(prop, values, fallback) {
    if (prop === null) return '';
    if (prop === undefined) return fallback;
    return typeof prop === 'function' ? prop(values) : prop;
  }

  /**
   * Construit la lettre complète.
   *
   * @param {object} type  modèle issu de LETTER_TYPES. Options reconnues :
   *                       objet / salutation / closing (chaîne, fonction,
   *                       ou null pour supprimer le bloc) et noRecipient.
   * @param {object} data  { sender, address, cityDate, recipient,
   *                         recipientAddress, ref, recommande, details }
   */
  function build(type, data) {
    // Les valeurs de l'en-tête sont exposées aux modèles (ex. « Je soussigné(e) »).
    const v = Object.assign({}, data.details, {
      ref: data.ref,
      sender: data.sender,
      address: data.address,
      recipient: data.recipient,
    });

    const blocks = [];

    blocks.push(`${fill(data.sender, 'Votre nom')}\n${fill(data.address, 'Votre adresse')}`);

    if (!type.noRecipient) {
      blocks.push(
        `${fill(data.recipient, 'Nom du destinataire')}\n${fill(data.recipientAddress, 'Adresse du destinataire')}`
      );
    }

    blocks.push(data.cityDate || `[Ville], le ${todayFr()}`);

    let head = `Objet : ${resolve(type.objet, v, '')}${data.ref ? ` — réf. ${data.ref}` : ''}`;
    if (data.recommande) head += '\nLettre recommandée avec accusé de réception';
    blocks.push(head);

    const salutation = resolve(type.salutation, v, DEFAULT_SALUTATION);
    if (salutation) blocks.push(salutation);

    blocks.push(type.body(v));

    const closing = resolve(type.closing, v, DEFAULT_CLOSING);
    if (closing) blocks.push(closing);

    blocks.push(fill(data.sender, 'Votre nom'));

    return blocks.join('\n\n');
  }

  return { build, todayFr, fill };
})();
