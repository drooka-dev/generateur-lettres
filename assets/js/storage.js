/* ------------------------------------------------------------------
   storage.js — mémorisation locale des coordonnées de l'expéditeur.
   Tolère un localStorage indisponible (navigation privée, fichier local…).
------------------------------------------------------------------ */

window.Prefs = (function () {
  const KEY = 'generateur-lettres:v1';

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '{}') || {};
    } catch (e) {
      return {};
    }
  }

  function save(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {
      /* stockage indisponible : on continue sans mémoriser */
    }
  }

  function clear() {
    try {
      localStorage.removeItem(KEY);
    } catch (e) { /* idem */ }
  }

  return { load, save, clear };
})();
