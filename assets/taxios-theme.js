/**
 * TAXiOS x SuiteDash theme loader
 * Version: 1.0.0
 *
 * Change THEME_CSS_URL after Netlify deployment.
 */
(function () {
  "use strict";

  var THEME_CSS_URL = "/assets/taxios-theme.css";
  var THEME_CLASS = "taxios-theme";
  var LINK_ID = "taxios-suitedash-theme-css";

  function isAbsolute(url) {
    return /^https?:\/\//i.test(url);
  }

  function resolveCssUrl() {
    if (isAbsolute(THEME_CSS_URL)) return THEME_CSS_URL;

    // When this file is served from Netlify, resolve CSS from the same site.
    var currentScript = document.currentScript;
    if (currentScript && currentScript.src) {
      try {
        var scriptUrl = new URL(currentScript.src, window.location.href);
        return new URL(THEME_CSS_URL, scriptUrl.origin).href;
      } catch (e) {}
    }

    return THEME_CSS_URL;
  }

  function addThemeClass() {
    document.documentElement.classList.add(THEME_CLASS);
    if (document.body) document.body.classList.add(THEME_CLASS);
  }

  function injectCss() {
    if (document.getElementById(LINK_ID)) return;

    var link = document.createElement("link");
    link.id = LINK_ID;
    link.rel = "stylesheet";
    link.href = resolveCssUrl();
    link.setAttribute("data-taxios-theme", "1");
    document.head.appendChild(link);
  }

  function setThemeColor() {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    meta.content = "#0D0D0F";
  }

  function boot() {
    addThemeClass();
    injectCss();
    setThemeColor();

    // SuiteDash can update page content without a full page reload.
    // Keep the theme class present after UI changes.
    if (window.MutationObserver && document.body) {
      var observer = new MutationObserver(function () {
        if (!document.documentElement.classList.contains(THEME_CLASS)) {
          document.documentElement.classList.add(THEME_CLASS);
        }
        if (!document.body.classList.contains(THEME_CLASS)) {
          document.body.classList.add(THEME_CLASS);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }

  // Emergency browser-console rollback:
  // window.TAXIOS_THEME.disable()
  window.TAXIOS_THEME = {
    enable: function () {
      addThemeClass();
      injectCss();
    },
    disable: function () {
      document.documentElement.classList.remove(THEME_CLASS);
      if (document.body) document.body.classList.remove(THEME_CLASS);
      var link = document.getElementById(LINK_ID);
      if (link) link.remove();
    }
  };
})();