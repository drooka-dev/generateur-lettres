/* ------------------------------------------------------------------
   app.js — état de l'application et branchement de l'interface.
   Dépend de : templates.js, letter.js, ui.js, storage.js
------------------------------------------------------------------ */

(function () {
  const { $, el, typeButton, field, toast } = window.UI;
  const TYPES = window.LETTER_TYPES;

  /* ---------------- État ---------------- */

  const SENDER_IDS = ['fName', 'fCityDate', 'fAddress', 'rName', 'rAddress', 'ref'];

  const state = {
    typeKey: TYPES[0].key,
    details: {},        // { [typeKey]: { [fieldId]: valeur } }
    letterText: '',
  };

  const saved = window.Prefs.load();

  /* ---------------- Thème ---------------- */

  function applyTheme(theme) {
    if (theme === 'light' || theme === 'dark') {
      document.documentElement.setAttribute('data-theme', theme);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  function currentTheme() {
    const attr = document.documentElement.getAttribute('data-theme');
    if (attr) return attr;
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  applyTheme(saved.theme);

  /* ---------------- Modèles ---------------- */

  const typeGrid = $('#typeGrid');

  /** Regroupe les modèles par `group`, en conservant l'ordre du catalogue. */
  function groupTypes() {
    const groups = [];
    TYPES.forEach((t) => {
      const name = t.group || 'Modèles';
      let group = groups.find((g) => g.name === name);
      if (!group) groups.push((group = { name, items: [] }));
      group.items.push(t);
    });
    return groups;
  }

  function renderTypes() {
    typeGrid.innerHTML = '';
    groupTypes().forEach((group) => {
      const grid = el('div', { class: 'type-grid' });
      group.items.forEach((t) => {
        grid.appendChild(typeButton(t, t.key === state.typeKey, selectType));
      });
      typeGrid.appendChild(el('section', { class: 'type-group' }, [
        el('h3', { class: 'type-group__title', text: group.name }),
        grid,
      ]));
    });
  }

  function selectType(key) {
    if (key === state.typeKey) return;
    state.typeKey = key;
    typeGrid.querySelectorAll('.type-btn').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset.key === key));
    });
    renderDetails();
    update();
  }

  function activeType() {
    return TYPES.find((t) => t.key === state.typeKey);
  }

  /* ---------------- Champs du modèle ---------------- */

  const detailsEl = $('#typeFields');
  const detailsCount = $('#detailsCount');

  function detailValues() {
    return state.details[state.typeKey] || (state.details[state.typeKey] = {});
  }

  function renderDetails() {
    const type = activeType();
    const values = detailValues();

    detailsEl.innerHTML = '';
    detailsEl.className = 'field-grid' + (type.fields.length > 2 ? ' field-grid--two' : '');

    type.fields.forEach((def) => {
      detailsEl.appendChild(field(def, values[def.id], (id, value) => {
        detailValues()[id] = value;
        update();
      }));
    });

    // Une attestation n'a pas de destinataire : on masque les champs inutiles.
    UI.$$('[data-recipient]').forEach((node) => {
      node.hidden = Boolean(type.noRecipient);
    });

    detailsCount.textContent = type.label;
  }

  /* ---------------- Coordonnées ---------------- */

  SENDER_IDS.forEach((id) => {
    const node = document.getElementById(id);
    if (saved[id]) node.value = saved[id];
    node.addEventListener('input', () => {
      persist();
      update();
    });
  });

  const cityDate = document.getElementById('fCityDate');
  if (!cityDate.value) cityDate.value = `[Ville], le ${window.Letter.todayFr()}`;

  const recommandeEl = document.getElementById('recommande');
  recommandeEl.checked = Boolean(saved.recommande);
  recommandeEl.addEventListener('change', () => {
    persist();
    update();
  });

  function persist() {
    const data = { theme: saved.theme, recommande: recommandeEl.checked };
    SENDER_IDS.forEach((id) => { data[id] = document.getElementById(id).value; });
    saved.theme = data.theme;
    window.Prefs.save(data);
  }

  function val(id) {
    const node = document.getElementById(id);
    return node ? node.value.trim() : '';
  }

  /* ---------------- Aperçu ---------------- */

  const sheet = $('#sheet');
  const statusEl = $('#previewStatus');
  const dotEl = $('#previewDot');

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (c) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
  }

  /** Met en évidence les repères [à compléter] restants. */
  function highlight(text) {
    return escapeHtml(text).replace(
      /\[[^\]\n]+\]/g,
      (m) => `<span class="sheet__placeholder">${m}</span>`
    );
  }

  function update() {
    const type = activeType();

    state.letterText = window.Letter.build(type, {
      sender: val('fName'),
      address: val('fAddress'),
      cityDate: val('fCityDate'),
      recipient: val('rName'),
      recipientAddress: val('rAddress'),
      ref: val('ref'),
      recommande: recommandeEl.checked,
      details: detailValues(),
    });

    sheet.innerHTML = highlight(state.letterText);

    const remaining = (state.letterText.match(/\[[^\]\n]+\]/g) || []).length;
    if (remaining === 0) {
      statusEl.textContent = 'Lettre complète';
      dotEl.style.background = 'var(--green)';
      dotEl.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--green) 20%, transparent)';
    } else {
      statusEl.textContent = remaining === 1
        ? '1 champ à compléter'
        : `${remaining} champs à compléter`;
      dotEl.style.background = 'var(--gold)';
      dotEl.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--gold) 22%, transparent)';
    }
  }

  /* ---------------- Actions ---------------- */

  $('#copyBtn').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(state.letterText);
      toast('Lettre copiée ✓');
    } catch (e) {
      toast('Copie impossible — sélectionne le texte manuellement');
    }
  });

  $('#downloadBtn').addEventListener('click', () => {
    const blob = new Blob([state.letterText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = el('a', { href: url, download: `lettre-${state.typeKey}.txt` });
    a.click();
    URL.revokeObjectURL(url);
    toast('Fichier .txt téléchargé');
  });

  $('#printBtn').addEventListener('click', () => window.print());

  $('#themeBtn').addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    saved.theme = next;
    persist();
  });

  $('#resetBtn').addEventListener('click', () => {
    SENDER_IDS.forEach((id) => { document.getElementById(id).value = ''; });
    recommandeEl.checked = false;
    state.details = {};
    document.getElementById('fCityDate').value = `[Ville], le ${window.Letter.todayFr()}`;
    window.Prefs.clear();
    saved.theme = currentTheme();
    renderDetails();
    update();
    toast('Formulaire réinitialisé');
  });

  /* ---------------- Démarrage ---------------- */

  renderTypes();
  renderDetails();
  update();
})();
