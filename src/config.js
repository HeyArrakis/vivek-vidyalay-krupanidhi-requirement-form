/* ==========================================================================
   PROJECT CONFIGURATION — edit this file to change email, prices or client.
   ========================================================================== */

/**
 * Where completed checklists are delivered (via https://formsubmit.co).
 *
 * The first submission to a new address triggers an "Activate Form" email from
 * FormSubmit — click it once, after which every submission is delivered.
 * (Optional: after activation FormSubmit gives you a random alias string you can
 * paste here instead, to hide the address from the page source.)
 *
 * Can also be overridden at build time with the VITE_FORM_SUBMIT_EMAIL env variable.
 */
export const FORM_SUBMIT_EMAIL =
  import.meta.env.VITE_FORM_SUBMIT_EMAIL || 'heyarrakis@gmail.com'

/** Client details shown across the page and in the email. One client, two websites. */
export const CLIENT = {
  name: 'Vivek Vidyalay & Krupanidhi English Academy',
  shortName: 'Vivek Vidyalay × Krupanidhi',
}

/** Currency formatting for every price on the page. */
export const CURRENCY = {
  code: 'INR',
  locale: 'en-IN',
}

/**
 * PRICING — one entry per selectable service id from src/services.js.
 *
 *   amount — rupees, e.g. 4000. Counted in the estimate when ticked.
 *            null = not counted; shows `label` instead (e.g. "Quoted separately").
 *   type   — optional: 'from' shows "From ₹4,000" (default: fixed price)
 *   label  — text shown when there is no amount
 *   rates  — optional per-unit rates listed under the service
 *
 * Standard / Advanced / Custom feature bundles without an entry show "Quoted separately".
 */
export const PRICING = {
  // Core website development for BOTH websites (always included, not a checkbox):
  // UI/UX design, all listed pages, basic features, technical setup, launch, 6 months support.
  coreWebsite: { amount: 25000 },

  // Branding & content (per website)
  school_branding: { amount: 3000 },
  tuition_branding: { amount: 3000 },
  school_contentWriting: { amount: null, label: '₹200 / section' },
  tuition_contentWriting: { amount: null, label: '₹200 / section' },

  // Online growth (per website)
  school_localSEO: { amount: 1000 },
  tuition_localSEO: { amount: 1000 },
  school_advancedSEO: { amount: null, label: 'Priced on your goals' },
  tuition_advancedSEO: { amount: null, label: 'Priced on your goals' },

  // After launch
  school_supportAfter6Months: { amount: null, label: 'Quoted separately' },
  tuition_supportAfter6Months: { amount: null, label: 'Quoted separately' },
}
