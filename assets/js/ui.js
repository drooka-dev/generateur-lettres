/* ------------------------------------------------------------------
   ui.js — fabrication des éléments d'interface et petits utilitaires DOM.
------------------------------------------------------------------ */

window.UI = (function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /** Crée un élément avec attributs et enfants. */
  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    for (const [k, val] of Object.entries(attrs)) {
      if (k === 'class') node.className = val;
      else if (k === 'text') node.textContent = val;
      else if (k.startsWith('on') && typeof val === 'function') {
        node.addEventListener(k.slice(2).toLowerCase(), val);
      } else if (val !== null && val !== undefined && val !== false) {
        node.setAttribute(k, val);
      }
    }
    (Array.isArray(children) ? children : [children])
      .filter(Boolean)
      .forEach((c) => node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
    return node;
  }

  /** Bouton de sélection d'un modèle de lettre. */
  function typeButton(type, isActive, onSelect) {
    return el('button', {
      class: 'type-btn',
      type: 'button',
      'aria-pressed': String(isActive),
      'data-key': type.key,
      onclick: () => onSelect(type.key),
    }, [
      el('span', { class: 'type-btn__icon', 'aria-hidden': 'true', text: type.icon }),
      el('span', {}, [
        el('span', { class: 'type-btn__label', text: type.label }),
        el('span', { class: 'type-btn__desc', text: type.desc }),
      ]),
    ]);
  }

  /** Champ de saisie (input ou textarea) décrit par le modèle. */
  function field(def, value, onInput) {
    const control = el(def.area ? 'textarea' : 'input', {
      id: def.id,
      name: def.id,
      type: def.area ? null : 'text',
      placeholder: def.ph || '',
      rows: def.area ? 3 : null,
      oninput: (e) => onInput(def.id, e.target.value),
    });
    control.value = value || '';

    return el('div', { class: 'field' + (def.area ? ' field--span2' : '') }, [
      el('label', { for: def.id, text: def.label }),
      control,
    ]);
  }

  /** Message éphémère en bas d'écran. */
  let toastTimer = null;
  function toast(message) {
    const node = $('#toast');
    if (!node) return;
    node.textContent = message;
    node.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => node.classList.remove('is-visible'), 1900);
  }

  return { $, $$, el, typeButton, field, toast };
})();
