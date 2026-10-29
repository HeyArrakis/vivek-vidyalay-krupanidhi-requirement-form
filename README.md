# Vivek Vidyalay & Krupanidhi English Academy × Sonder — Website Requirement Form

A simple, single-page **website requirement checklist** prepared by
[Sonder AI Agency](https://sonderai.agency/) for one client with two websites:

1. **School website — Vivek Vidyalay**
2. **Tuition classes website — Krupanidhi English Academy**

Each website has its own section with sub-sections: **A** Website Pages, **B** Features &
Modules, **C** Branding, Design & Content, **D** Online Growth, **E** After Launch.
The client ticks the services they want for each website, optionally adds a note per website, and submits.
Prices and an estimated total appear only once prices are filled in (see below). The completed form is emailed to Sonder via
[FormSubmit](https://formsubmit.co) — there is no backend.

- React 19 + Vite 8, plain CSS (Sonder light design tokens), no UI framework
- Optional group-based pricing from one config object (hidden until set)
- One checkbox per service, accessible custom checkboxes, works on mobile
- Deploys to GitHub Pages with the included GitHub Actions workflow

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # pricing + email payload tests
npm run build      # production build → dist/
npm run preview    # serve the production build locally
```

Requires Node 20.19+ or 22.12+.

---

## Configuration — everything lives in `src/config.js`

### 1. Email recipient (FormSubmit)

```js
export const FORM_SUBMIT_EMAIL =
  import.meta.env.VITE_FORM_SUBMIT_EMAIL || 'heyarrakis@gmail.com'
```

Submissions go to `heyarrakis@gmail.com`. To change it, edit this line **or** set a GitHub
repository variable named `FORM_SUBMIT_EMAIL`
(*Settings → Secrets and variables → Actions → Variables*) — the deploy workflow passes it in
at build time.

**One-time FormSubmit activation:** the very first submission to a new address does not get
delivered — FormSubmit emails that address an *“Activate Form”* link instead. Submit one test
entry from the live site, click the link in the activation email, and every submission after
that is delivered. After activation FormSubmit also shows a random alias (e.g.
`a1b2c3d4e5...`) — you can use that instead of the plain email address so it isn't visible
in the page source.

### 2. Prices

Prices are **not set yet**, so the page is a plain checklist (no prices, totals or price bar).
Feature rows show a complexity tag instead (Basic / Standard / Advanced / Custom).
Add amounts in `PRICING` once they're confirmed:

```js
export const PRICING = {
  schoolWebsite: { amount: 30000 },          // base school website
  tuitionWebsite: { amount: 20000 },         // base tuition classes website
  school_page_gallery: { amount: 1500 },
  school_feePayment: { amount: 12000, type: 'from' },
  tuition_lms: { amount: null, label: 'Quoted separately' },
}
```

| Field    | Meaning |
|----------|---------|
| `amount` | Price in rupees, counted in the estimate when ticked. `null` = not counted. |
| `label`  | Text shown instead of a price when `amount` is `null` |
| `type`   | Optional `'from'` to show "From ₹4,000" |
| `rates`  | Optional per-unit rates listed under the service |

The estimate = both base websites + each ticked priced service (once per service).
As soon as any amount is set, prices and the fixed price bar appear.
`src/lib/pricing.test.js` and `src/lib/submission.test.js` cover this.

### 3. Services & copy

Both websites, their sub-sections, every checklist item and the "already included" line are in
`src/services.js`. Service ids are prefixed `school_` or `tuition_` so they stay unique; each id
is the key used in `PRICING`.

### 4. Client details

`CLIENT` in `src/config.js` sets the client name shown on the page and in the email.

---

## The email Sonder receives

FormSubmit's `box` template, in this order: **CLIENT** → **FILLED BY** →
**1. School website** (ticked services, then its notes) → **2. Tuition classes website**
(ticked services, then its notes) → **ESTIMATED INVESTMENT** (only once prices are set).

---

## Deploying to GitHub Pages

The workflow in `.github/workflows/deploy.yml` tests, builds and deploys on every push to
`main`.

1. Push this repository to GitHub.
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push to `main` (or run the workflow manually from the **Actions** tab).
4. The site is published at `https://<github-username>.github.io/vivek-vidyalay-krupanidhi-requirement-form/`.

`vite.config.js` uses `base: './'`, so the build works under any repository name.

---

## Project structure

```
src/
  config.js            ← email, client, prices (edit here)
  services.js          ← both websites' checklists & copy
  App.jsx              ← page, state, validation, submit
  components/          ← checklist rows and form primitives
  lib/pricing.js       ← group-based estimate (+ tests)
  lib/submission.js    ← FormSubmit payload & send (+ tests)
  styles.css           ← Sonder light styles
```

No secrets, API keys or credentials are stored in this repository.
