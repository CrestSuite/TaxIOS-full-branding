# TAXiOS SuiteDash Theme V2 — Full Platform + All Blocks

This version fixes the Netlify loader and adds a universal theme for SuiteDash Dashboard and Portal Page blocks.

## What V2 covers

### Platform UI
- Main background and page wrappers
- Primary navigation/sidebar
- Top navigation
- Cards, panels, widgets, tables
- Forms, Select2/Chosen, dropdowns
- Modals, alerts, tabs, accordions
- Date/time pickers
- DataTables
- Upload/drop zones
- File manager
- Messages/chat/tickets
- Kanban and pipeline cards
- Calendars
- Invoice/payment surfaces
- Rich-text editor shells
- Toasts and confirmation dialogs
- Mobile styling

### Dashboard / Portal Page blocks
The universal block layer styles `.card-block` and dynamically detects related SuiteDash block wrappers.

Included block-specific handling for:
- Welcome
- Text / HTML
- Button
- Single image / media
- Video
- iFrame / Embed
- Progress Bar
- My Invoices
- My Tasks
- All Tasks
- My Schedule
- Projects
- Announcements
- Activity Stream
- Upload
- Download
- Reporting
- CRM Filter
- Staff Filter
- Appointment / Booking
- Custom Fields / Forms
- Portal Page
- Circle Access
- File / Document blocks
- Separator / Empty Space
- Unknown/new blocks through the generic TAXiOS block fallback

## Important SuiteDash note

SuiteDash Platform Branding CSS is global for the logged-in portal, while Custom Login CSS and Form CSS are configured separately in SuiteDash. For that reason this package contains:

- `assets/taxios-theme.css`
- `assets/taxios-blocks.css`
- `assets/taxios-theme.js`
- `assets/taxios-login.css`
- `assets/taxios-forms.css`

## GitHub + Netlify

Upload this entire folder to GitHub and deploy the repository with Netlify.

No build command is needed.
Publish directory: `.`

## SuiteDash Custom JS

Go to:

`Flyout Menu > Platform Branding > Advanced > Custom JS`

Paste:

```js
(function (d) {
  if (d.getElementById("taxios-netlify-loader")) return;

  var s = d.createElement("script");
  s.id = "taxios-netlify-loader";
  s.src = "https://YOUR-SITE.netlify.app/assets/taxios-theme.js?v=2.0.0";
  s.defer = true;
  d.head.appendChild(s);
})(document);
```

Replace `YOUR-SITE`.

The loader automatically injects:

- `/assets/taxios-theme.css`
- `/assets/taxios-blocks.css`

and rescans SuiteDash blocks after dynamic/AJAX page updates.

## Login page

SuiteDash login CSS is configured separately.

Use the contents of:

`assets/taxios-login.css`

inside your Custom URL & Login CSS area.

## Forms

SuiteDash Form CSS is configured separately.

Use the contents of:

`assets/taxios-forms.css`

inside the Form's Link / Embed custom CSS area or save it as your form theme.

## Updating

Change files in GitHub and push. Netlify redeploys the project.

When you make a major change, bump the query-string version in SuiteDash:

`?v=2.0.1`

## Rollback

Disable the Custom JS in SuiteDash or run:

```js
window.TAXIOS_THEME && window.TAXIOS_THEME.disable();
```

To force a block rescan:

```js
window.TAXIOS_THEME && window.TAXIOS_THEME.rescan();
```

## Safety

The main CSS is scoped under `html.taxios-theme`, and the loader adds/removes this class. External iFrame contents are not recolored.
