# Vivek Vidyalay & Krupanidhi English Academy × Sonder — Website Requirement Form

A simple, single-page **website requirement checklist** prepared by
[Sonder AI Agency](https://sonderai.agency/) for one client with two websites:

1. **School website — Vivek Vidyalay**
2. **Tuition classes website — Krupanidhi English Academy**

Written for a non-technical reader: plain words, icons and big counters instead of long text.
A blue **Complimentary** banner sits at the top (per website, when both are built: domain and cloud hosting for 3 years, shown as crossed-out ₹2,100 and ₹10,000 / year, plus care & support for
3 months, for both websites).

Each website then has, in this order:

1. **Your Complete Website — ₹30,000**: counters (pages, ready-made features, setup jobs,
   complimentary) and a "Tap to See the Full List" dropdown.
2. **A. Must have** — Website Look & Design, ₹5,000, always ticked.
3. **B. Recommended extras** — Logo & colours ₹5,000, writing ₹3,000, Google Maps ₹2,000, with an
   "Add all 3" button.
4. **C. More features — price after a quick talk** — everything quoted separately, last.

The total bar is always visible: ₹70,000 to start, ₹90,000 with every priced extra on both websites.
A "Your Total" summary at the end shows the full value crossed out (including ₹64,200 of domain and
hosting Sonder pays for), then "You Pay".

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

```js
export const PRICING = {
  school_core: { amount: 30000 },                       // core development, per website
  school_uiux: { amount: 5000 },                        // required, always counted
  school_branding: { amount: 5000 },
  school_contentWriting: { amount: 3000 },
  school_localSEO: { amount: 2000 },
  // …same keys with the tuition_ prefix
}
```

| Field    | Meaning |
|----------|---------|
| `amount` | Price in rupees, counted in the estimate when ticked. `null` = not counted. |
| `label`  | Text shown instead of a price when `amount` is `null` |
| `type`   | Optional `'from'` to show "From ₹4,000" |

The estimate = each website's core + required UI/UX + each ticked priced service: ₹70,000 minimum,
₹90,000 with every priced service ticked for both websites. Standard / Advanced / Custom
feature bundles have no entry, so they show under a "Quoted separately" heading and are not
counted; give one an `amount` to price it. `src/lib/pricing.test.js` and
`src/lib/submission.test.js` cover this.

### 3. Services & copy

The core package (`CORE`), each website's pages and basic features, and every selectable bundle are in
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
