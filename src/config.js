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
 * PRICING — one entry per service id from src/services.js (not per included item).
 *
 * While every amount is null the page is a plain requirement checklist: no prices,
 * no totals, no price bar. Fill in amounts once rates are confirmed.
 *
 *   amount — rupees, e.g. 4000. Counted in the estimate when ticked.
 *            null = not counted; shows `label` instead (e.g. "Quoted separately").
 *   type   — optional: 'from' shows "From ₹4,000" (default: fixed price)
 *   label  — text shown when there is no amount
 *   rates  — optional per-unit rates listed under the service
 *
 * Services without an entry show their complexity tag (Basic / Standard / Advanced / Custom).
 */
export const PRICING = {
  // The base website for each institution (always included, not a checkbox)
  schoolWebsite: { amount: null },
  tuitionWebsite: { amount: null },

  // Examples, once confirmed:
  // school_page_gallery: { amount: 1500 },
  // school_feePayment: { amount: 12000, type: 'from' },
  // tuition_lms: { amount: null, label: 'Quoted separately' },
  school_customFeature: { amount: null, label: 'Quoted separately' },
  school_erp: { amount: null, label: 'Quoted separately' },
  school_advancedSEO: { amount: null, label: 'Priced on your goals' },
  school_supportAfter6Months: { amount: null, label: 'Quoted separately' },
  tuition_customFeature: { amount: null, label: 'Quoted separately' },
  tuition_aiAssistant: { amount: null, label: 'Quoted separately' },
  tuition_advancedSEO: { amount: null, label: 'Priced on your goals' },
  tuition_supportAfter6Months: { amount: null, label: 'Quoted separately' },
}
