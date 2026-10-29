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

/**
 * Backup if the email service is down: a "Send on WhatsApp" button opens WhatsApp with the
 * whole checklist already written. Digits only, with country code, e.g. '919812345678'.
 * Leave empty to hide the button.
 */
export const WHATSAPP_NUMBER = '918320936239'

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
 *   market — optional usual market price. Never shown next to the service; the total shows
 *            the difference as "Already Reduced"
 *   rates  — optional per-unit rates listed under the service
 *
 * "Price after a talk" items (those with a `level`) without an entry are quoted separately.
 */
export const PRICING = {
  // Core website development, per website (always included, not a checkbox):
  // all listed pages, basic features, technical setup, launch, 3 months support.
  // `market` is what this usually costs: ₹2,500 above our price on each website = ₹5,000 reduced.
  school_core: { amount: 30000, market: 32500 },
  tuition_core: { amount: 30000, market: 32500 },

  // Website UI/UX Design — required for every website, always counted (not core)
  school_uiux: { amount: 5000 },
  tuition_uiux: { amount: 5000 },

  // Branding & content (per website)
  school_branding: { amount: 5000 },
  tuition_branding: { amount: 5000 },
  school_contentWriting: { amount: 3000 },
  tuition_contentWriting: { amount: 3000 },

  // Online growth (per website)
  school_localSEO: { amount: 2000 },
  tuition_localSEO: { amount: 2000 },

}
