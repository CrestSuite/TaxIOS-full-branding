/*
  TAXiOS SuiteDash Netlify Loader v3.0.0
  This file should be hosted on Netlify.
*/
(function (d) {
  'use strict';

  if (d.getElementById('taxios-theme-css-v3')) return;

  /* Automatically resolve the current Netlify site's base URL. */
  var currentScript = d.currentScript;
  var base = currentScript && currentScript.src
    ? currentScript.src.replace(/\/assets\/taxios-loader\.js(?:\?.*)?$/, '')
    : '';

  if (!base) {
    console.warn('[TAXiOS Theme] Could not determine Netlify base URL.');
    return;
  }

  var css = d.createElement('link');
  css.id = 'taxios-theme-css-v3';
  css.rel = 'stylesheet';
  css.href = base + '/assets/taxios-theme.css?v=3.0.0';
  d.head.appendChild(css);

  var js = d.createElement('script');
  js.id = 'taxios-theme-js-v3';
  js.src = base + '/assets/taxios-theme.js?v=3.0.0';
  js.defer = true;
  d.head.appendChild(js);
})(document);
