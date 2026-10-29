import { CLIENT, FORM_SUBMIT_EMAIL } from '../config.js'
import { CORE, SITES, coreKey } from '../services.js'
import { formatPrice, priceLabel, pricesConfigured } from './pricing.js'

export const FORM_SUBMIT_ACTION = `https://formsubmit.co/${FORM_SUBMIT_EMAIL}`
const FORM_SUBMIT_AJAX = `https://formsubmit.co/ajax/${FORM_SUBMIT_EMAIL}`

const orDash = (v) => (typeof v === 'string' && v.trim() ? v.trim() : '—')

const priceText = (l) =>
  l.amount == null
    ? l.label ? ` — ${l.label}` : ''
    : ` — ${l.type === 'from' ? 'From ' : ''}${formatPrice(l.amount)}${l.billing === 'monthly' ? ' / month' : ''}`

/**
 * Builds the email payload. Keys are inserted in reading order:
 * CLIENT → per website: its core development, ticked services, then its notes → ESTIMATED INVESTMENT (only if prices are set)
 */
export function buildSubmission(values, estimate) {
  const p = {
    _subject: `Website checklist — ${CLIENT.name} (core + ${estimate.extras.length} extras)`,
    _template: 'box',
    _captcha: 'false',

    CLIENT: CLIENT.name,
    'FILLED BY': orDash(values.name),
  }

  for (const site of SITES) {
    const lines = estimate.lines.filter((l) => l.siteId === site.id)
    const extras = lines.filter((l) => !l.required).length
    const head = `${site.number}. ${site.kind.toUpperCase()} — ${site.name}`
    p[head] = extras ? `${extras} extras ticked` : 'Core + required services only — no extras ticked'
    const core = priceLabel(coreKey(site.id))
    p[`${site.kind} — ${CORE.title}`] = `Included${core ? ` — ${core}` : ''} (all listed pages, basic features, setup & launch; gifts: free domain for the 1st year, free care & support for 3 months)`
    for (const line of lines) {
      p[`${site.kind} — ${line.name}`] = `${line.required ? 'Required' : 'Yes'}${priceText(line)}`
    }
    p[`NOTES — ${site.kind}`] = orDash(values.notes?.[site.id])
  }

  if (pricesConfigured()) {
    p['ESTIMATED INVESTMENT'] = `${estimate.hasFromPrices ? 'From ' : ''}${formatPrice(estimate.oneTimeTotal)}${
      estimate.showCore ? ` (incl. core development ${formatPrice(estimate.coreAmount)} for both websites; “Quoted separately” items not included)` : ''
    }`
    if (estimate.monthlyTotal > 0) p['ESTIMATED INVESTMENT — Monthly'] = `${formatPrice(estimate.monthlyTotal)} / month`
  }

  p['Submitted at'] = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST'
  return p
}

/** Sends the payload to FormSubmit. Resolves on success, throws with a friendly message otherwise. */
export async function sendSubmission(payload) {
  let res
  try {
    // A form-encoded body with only an Accept header is a "simple" CORS request, so the
    // browser skips the extra preflight round trip (FormSubmit can take 10–20 s per request).
    // keepalive lets the request finish even if the visitor closes the tab.
    res = await fetch(FORM_SUBMIT_AJAX, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new URLSearchParams(payload),
      keepalive: true,
    })
  } catch {
    throw new Error('We couldn’t reach the server. Please check your connection and try again.')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok || String(data.success) !== 'true') {
    console.error('[form] FormSubmit response', res.status, data)
    // Until the inbox owner clicks FormSubmit's one-time "Activate Form" email, every
    // submission is answered with an activation notice instead of being delivered.
    if (/activat/i.test(String(data.message ?? ''))) {
      throw new Error('Your checklist couldn’t be delivered yet — the Sonder inbox is still being activated. Please try again in a little while.')
    }
    throw new Error('Something went wrong while sending your checklist. Please try again in a moment.')
  }
  return data
}
