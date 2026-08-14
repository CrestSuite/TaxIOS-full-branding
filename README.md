# TAXiOS SuiteDash Theme

A full-platform SuiteDash branding starter using the TAXiOS black, purple, orange, silver and white palette.

## Files

- `assets/taxios-theme.css` — global branded visual theme
- `assets/taxios-theme.js` — safe theme loader
- `assets/taxios-logo.png` — supplied logo
- `index.html` — Netlify preview page
- `netlify.toml` — static hosting/headers

## 1. Put this project on GitHub

Create a new GitHub repository, then upload these files or push the folder with Git.

## 2. Connect GitHub to Netlify

In Netlify, import the GitHub repository as a new project. This is a static site, so no build command is required. Publish directory is `.`.

After deployment, your URLs will look like:

- `https://YOUR-SITE.netlify.app/assets/taxios-theme.js`
- `https://YOUR-SITE.netlify.app/assets/taxios-theme.css`

Open the Netlify site URL first and confirm the preview page works.

## 3. SuiteDash installation — recommended

Go to:

`Flyout Menu > Platform Branding > Advanced`

Turn on Custom JS, then paste:

```js
(function (d) {
  if (d.getElementById("taxios-netlify-loader")) return;

  var s = d.createElement("script");
  s.id = "taxios-netlify-loader";
  s.src = "https://YOUR-SITE.netlify.app/assets/taxios-theme.js?v=1.0.0";
  s.defer = true;
  d.head.appendChild(s);
})(document);
```

Replace `YOUR-SITE` with the Netlify subdomain.

## 4. CSS-only fallback

If you do not want to load external JS, turn on Advanced Custom CSS and paste:

```css
@import url("https://YOUR-SITE.netlify.app/assets/taxios-theme.css?v=1.0.0");
html { color-scheme: dark; }
```

Then also add the class `taxios-theme` through SuiteDash Custom JS:

```js
document.documentElement.classList.add("taxios-theme");
document.addEventListener("DOMContentLoaded", function () {
  document.body.classList.add("taxios-theme");
});
```

## 5. Updating the design

Edit `assets/taxios-theme.css`, commit/push to GitHub, and Netlify will redeploy.

To force browsers to fetch a new version, update the version number in SuiteDash:

`?v=1.0.1`, `?v=1.0.2`, etc.

## 6. Rollback

Fastest rollback: disable Custom JS / Custom CSS in SuiteDash Platform Branding.

Browser console rollback:

```js
window.TAXIOS_THEME && window.TAXIOS_THEME.disable();
```

## Notes

SuiteDash can change internal class names over time. The theme uses the official `.sidebar-nav` selector plus common UI selectors and fallbacks. Test the portal as Super Admin, Staff, and Client before making it your final production theme.