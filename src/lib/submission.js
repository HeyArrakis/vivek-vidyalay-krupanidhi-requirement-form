import { CLIENT, FORM_SUBMIT_EMAIL, WHATSAPP_NUMBER } from '../config.js'
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
    p[`${site.kind} — ${CORE.title}`] = `Included${core ? ` — ${core}` : ''} (all listed pages, basic features, setup & launch; complimentary: domain for 3 years, cloud hosting for 3 years, care & support for 3 months)`
    for (const line of lines) {
      p[`${site.kind} — ${line.name}`] = `${line.required ? 'Required' : 'Yes'}${priceText(line)}`
    }
    p[`NOTES — ${site.kind}`] = orDash(values.notes?.[site.id])
  }

  if (pricesConfigured()) {
    p['ESTIMATED INVESTMENT'] = `${estimate.hasFromPrices ? 'From ' : ''}${formatPrice(estimate.oneTimeTotal)}${
      estimate.showCore ? ` (incl. core development ${formatPrice(estimate.coreAmount)} for both websites; “Quoted separately” items not included)` : ''
    }`
    p['COMPLIMENTARY VALUE'] = `${formatPrice(estimate.complimentaryValue)} paid by Sonder (domain + cloud hosting for 3 years, both websites) — not charged`
    if (estimate.monthlyTotal > 0) p['ESTIMATED INVESTMENT — Monthly'] = `${formatPrice(estimate.monthlyTotal)} / month`
  }

  p['Submitted at'] = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST'
  return p
}

const BUSY =
  'Our message service is busy right now. Don’t worry — your choices are saved on this phone. Please tap “Try Again” in a few minutes.'
const NOT_ACTIVE = 'Your checklist couldn’t be delivered yet — the Sonder inbox is still being set up. Please try again in a little while.'

class SendError extends Error {
  constructor(message, { retry }) {
    super(message)
    this.retry = retry
  }
}

async function sendOnce(payload) {
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
    // No connection, or FormSubmit is down (its outage pages carry no CORS headers).
    throw new SendError(BUSY, { retry: true })
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok || String(data.success) !== 'true') {
    console.error('[form] FormSubmit response', res.status, data)
    // Until the inbox owner clicks FormSubmit's one-time "Activate Form" email, every
    // submission is answered with an activation notice instead of being delivered.
    if (/activat/i.test(String(data.message ?? ''))) throw new SendError(NOT_ACTIVE, { retry: false })
    throw new SendError(BUSY, { retry: res.status >= 500 || res.status === 429 })
  }
  return data
}

const pause = (ms) => new Promise((r) => setTimeout(r, ms))

/**
 * Sends the payload to FormSubmit, retrying a short outage a couple of times before giving up.
 * Resolves on success, throws with a friendly message otherwise.
 */
export async function sendSubmission(payload, { waits = [4000, 10000] } = {}) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await sendOnce(payload)
    } catch (err) {
      if (!err.retry || attempt >= waits.length) throw err
      await pause(waits[attempt])
    }
  }
}

/** The checklist as plain text, for the WhatsApp backup. */
export function submissionText(payload) {
  return Object.entries(payload)
    .filter(([k]) => !k.startsWith('_'))
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')
}

/** A WhatsApp link that opens a chat with the checklist already typed, or '' when no number is set. */
export const whatsappLink = (payload, number = WHATSAPP_NUMBER) =>
  number ? `https://wa.me/${number}?text=${encodeURIComponent(submissionText(payload))}` : ''
