/* TAXiOS SuiteDash Theme Controller v3.0.0 */
(function () {
  'use strict';

  if (window.__TAXIOS_THEME_V3__) return;
  window.__TAXIOS_THEME_V3__ = true;

  var root = document.documentElement;
  var STORAGE_KEY = 'taxios-theme-preference';
  var validModes = ['auto', 'light', 'dark'];

  function safeGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  function safeSet(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
  }

  function normalizeMode(mode) {
    return validModes.indexOf(mode) !== -1 ? mode : 'auto';
  }

  function suiteDashDeclaredMode() {
    var body = document.body;
    var blob = [
      root.className,
      root.getAttribute('data-theme'),
      root.getAttribute('data-bs-theme'),
      body ? body.className : '',
      body ? body.getAttribute('data-theme') : '',
      body ? body.getAttribute('data-bs-theme') : ''
    ].filter(Boolean).join(' ').toLowerCase();

    if (/(^|\s|[-_])dark($|\s|[-_])/.test(blob) || /theme-dark|dark-mode|mode-dark/.test(blob)) return 'dark';
    if (/(^|\s|[-_])light($|\s|[-_])/.test(blob) || /theme-light|light-mode|mode-light/.test(blob)) return 'light';
    return null;
  }

  function getPreference() {
    return normalizeMode(safeGet(STORAGE_KEY) || 'auto');
  }

  function applyMode() {
    root.classList.add('taxios-theme');

    var preference = getPreference();
    var declared = suiteDashDeclaredMode();
    var effective = preference === 'auto' && declared ? declared : preference;

    root.setAttribute('data-taxios-mode', effective);
    root.setAttribute('data-taxios-preference', preference);
  }

  function setMode(mode) {
    mode = normalizeMode(mode);
    safeSet(STORAGE_KEY, mode);
    applyMode();
    window.dispatchEvent(new CustomEvent('taxios:themechange', { detail: { mode: mode } }));
  }

  function markFeaturedCards() {
    /* Safe, optional styling hooks based on explicit custom classes only. */
    var featured = document.querySelectorAll('.tx-featured, .taxios-featured');
    featured.forEach(function (el) {
      el.setAttribute('data-taxios-featured', 'true');
    });
  }

  function refresh() {
    applyMode();
    markFeaturedCards();
  }

  function observeSuiteDashThemeChanges() {
    if (!window.MutationObserver) return;

    var observer = new MutationObserver(function (mutations) {
      var preference = getPreference();
      if (preference !== 'auto') return;

      var changed = mutations.some(function (m) {
        return m.type === 'attributes' &&
          (m.attributeName === 'class' || m.attributeName === 'data-theme' || m.attributeName === 'data-bs-theme');
      });

      if (changed) applyMode();
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ['class', 'data-theme', 'data-bs-theme']
    });

    if (document.body) {
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class', 'data-theme', 'data-bs-theme']
      });
    }
  }

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  root.classList.add('taxios-theme');
  applyMode();

  onReady(function () {
    refresh();
    observeSuiteDashThemeChanges();

    /* Refresh styling hooks after SPA navigation / dynamic block updates. */
    if (window.MutationObserver && document.body) {
      var bodyObserver = new MutationObserver(function () {
        markFeaturedCards();
      });
      bodyObserver.observe(document.body, { childList: true, subtree: true });
    }
  });

  window.addEventListener('storage', function (e) {
    if (e.key === STORAGE_KEY) applyMode();
  });

  var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  if (media && media.addEventListener) {
    media.addEventListener('change', function () {
      if (getPreference() === 'auto') applyMode();
    });
  }

  window.TAXiOSTheme = Object.freeze({
    setMode: setMode,
    getMode: getPreference,
    refresh: refresh,
    version: '3.0.0'
  });
})();
