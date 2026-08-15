/**
 * TAXiOS x SuiteDash theme loader
 * Version: 2.0.1
 *
 * FIXES IN V2
 * - Captures this script's Netlify URL immediately so relative CSS URLs
 *   always resolve to Netlify, even after DOMContentLoaded.
 * - Loads the global theme + all Dashboard/Portal block theme.
 * - Detects dynamically-rendered SuiteDash blocks after SPA/AJAX updates.
 */
(function () {
  "use strict";

  var VERSION = "2.0.1";
  var THEME_CLASS = "taxios-theme";
  var SELF_SRC = (document.currentScript && document.currentScript.src) || "";

  var STYLES = [
    { id: "taxios-suitedash-theme-css", path: "/assets/taxios-theme.css" },
    { id: "taxios-suitedash-blocks-css", path: "/assets/taxios-blocks.css" }
  ];

  function assetUrl(path) {
    if (/^https?:\/\//i.test(path)) return path;

    if (SELF_SRC) {
      try {
        var scriptUrl = new URL(SELF_SRC, window.location.href);
        var url = new URL(path, scriptUrl.origin);
        url.searchParams.set("v", VERSION);
        return url.href;
      } catch (e) {}
    }

    return path + (path.indexOf("?") === -1 ? "?v=" + VERSION : "");
  }

  function addThemeClass() {
    document.documentElement.classList.add(THEME_CLASS);
    if (document.body) document.body.classList.add(THEME_CLASS);
  }

  function injectStyles() {
    STYLES.forEach(function (item) {
      if (document.getElementById(item.id)) return;

      var link = document.createElement("link");
      link.id = item.id;
      link.rel = "stylesheet";
      link.href = assetUrl(item.path);
      link.setAttribute("data-taxios-theme", "1");
      document.head.appendChild(link);
    });
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

  var BLOCK_SELECTOR = [
    ".card-block",
    ".dashboard-block",
    ".content-block",
    ".sd-block",
    ".portal-block",
    "[data-block-id]",
    "[data-block-type]",
    "[class*='dashboard-block']",
    "[class*='content-block']",
    "[class*='portal-block']"
  ].join(",");

  var FALLBACK_SELECTOR = [
    "div[class*='-block']",
    "section[class*='-block']",
    "article[class*='-block']",
    "div[class*='_block']",
    "section[class*='_block']"
  ].join(",");

  var EXCLUDED_CLASS = /(?:^|\s)(?:btn-block|input-group|form-check|block-toolbar|row-toolbar|block-editor-toolbar)(?:\s|$)/i;

  function classText(el) {
    var value = "";
    try {
      value += " " + (el.className && typeof el.className === "string" ? el.className : "");
      value += " " + (el.id || "");
      value += " " + (el.getAttribute("data-block-type") || "");
      value += " " + (el.getAttribute("data-type") || "");
    } catch (e) {}
    return value.toLowerCase();
  }

  function detectKind(el) {
    var s = classText(el);

    if (/(empty|spacer|separator|divider)/.test(s)) return "separator";
    if (/(invoice|payment|billing)/.test(s)) return "invoice";
    if (/(all.?tasks|my.?tasks|task)/.test(s)) return "task";
    if (/(schedule|calendar|appointment-list)/.test(s)) return "schedule";
    if (/(project)/.test(s)) return "project";
    if (/(announcement|dashboard-anns)/.test(s)) return "announcement";
    if (/(activity|timeline|stream)/.test(s)) return "activity";
    if (/(welcome)/.test(s)) return "welcome";
    if (/(upload|dropzone)/.test(s)) return "upload";
    if (/(download)/.test(s)) return "download";
    if (/(report|metric|stat|chart)/.test(s)) return "reporting";
    if (/(crm.*filter|contact.*filter)/.test(s)) return "crm-filter";
    if (/(staff.*filter|team.*filter)/.test(s)) return "staff-filter";
    if (/(appointment|booking|scheduler|timeslot|time-slot)/.test(s)) return "appointment";
    if (/(progress)/.test(s)) return "progress";
    if (/(iframe|embed|video|image|gallery|carousel|slider|media)/.test(s)) return "media";
    if (/(button|cta)/.test(s)) return "button";
    if (/(custom.?field|form|questionnaire|intake)/.test(s)) return "form";
    if (/(circle)/.test(s)) return "circle";
    if (/(portal.?page|portal-link)/.test(s)) return "portal";
    if (/(file|document|folder)/.test(s)) return "file";
    if (/(text|html|rich.?text|wysiwyg)/.test(s)) return "text";

    return "generic";
  }

  function isGoodFallback(el) {
    if (!el || !el.tagName) return false;
    if (!/^(DIV|SECTION|ARTICLE)$/i.test(el.tagName)) return false;

    var cls = typeof el.className === "string" ? el.className : "";
    if (!cls || EXCLUDED_CLASS.test(cls)) return false;

    // Avoid tagging tiny inline/control wrappers.
    if (el.matches && el.matches("button,a,input,label,span,i,svg")) return false;

    return true;
  }

  function markBlock(el) {
    if (!el || el.nodeType !== 1) return;
    if (EXCLUDED_CLASS.test(typeof el.className === "string" ? el.className : "")) return;

    el.classList.add("taxios-ui-block");
    el.setAttribute("data-taxios-kind", detectKind(el));

    var s = classText(el);
    if (/(empty|spacer)/.test(s)) {
      el.classList.add("taxios-empty-block");
    }
  }

  function scanBlocks(root) {
    if (!root || root.nodeType !== 1) return;

    if (root.matches && root.matches(BLOCK_SELECTOR)) markBlock(root);

    try {
      root.querySelectorAll(BLOCK_SELECTOR).forEach(markBlock);
      root.querySelectorAll(FALLBACK_SELECTOR).forEach(function (el) {
        if (isGoodFallback(el)) markBlock(el);
      });
    } catch (e) {}
  }

  var scanTimer = null;
  function scheduleFullScan() {
    window.clearTimeout(scanTimer);
    scanTimer = window.setTimeout(function () {
      if (document.body) scanBlocks(document.body);
    }, 80);
  }

  function observeDynamicUi() {
    if (!window.MutationObserver || !document.body) return;

    var observer = new MutationObserver(function (mutations) {
      addThemeClass();

      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          if (node && node.nodeType === 1) scanBlocks(node);
        });
      });

      scheduleFullScan();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  function boot() {
    addThemeClass();
    injectStyles();
    setThemeColor();

    if (document.body) {
      scanBlocks(document.body);
      observeDynamicUi();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }

  window.TAXIOS_THEME = {
    version: VERSION,

    enable: function () {
      addThemeClass();
      injectStyles();
      if (document.body) scanBlocks(document.body);
    },

    rescan: function () {
      if (document.body) scanBlocks(document.body);
    },

    disable: function () {
      document.documentElement.classList.remove(THEME_CLASS);
      if (document.body) {
        document.body.classList.remove(THEME_CLASS);
        document.body.querySelectorAll(".taxios-ui-block").forEach(function (el) {
          el.classList.remove("taxios-ui-block", "taxios-empty-block");
          el.removeAttribute("data-taxios-kind");
        });
      }

      STYLES.forEach(function (item) {
        var link = document.getElementById(item.id);
        if (link) link.remove();
      });
    }
  };
})();
