import { describe, expect, it } from 'vitest'
import { buildSubmission } from './submission.js'
import { calculateEstimate } from './pricing.js'

describe('complimentary value', () => {
  it('counts the 3-year domain and 1-year hosting for both websites, without charging it', () => {
    const est = calculateEstimate({})
    expect(est.complimentaryValue).toBe((2100 + 10000) * 2)
    expect(est.oneTimeTotal).toBe(70000)
    expect(buildSubmission({}, est)['COMPLIMENTARY VALUE']).toMatch(/^₹24,200 paid by us/)
  })

  it('shows ₹5,000 already reduced from the usual market price', () => {
    const est = calculateEstimate({ school_branding: true })
    expect(est.reduction).toBe(5000)
    expect(est.marketTotal).toBe(est.oneTimeTotal + 5000)
    expect(buildSubmission({}, est)['ALREADY REDUCED']).toBe('₹5,000 below the usual market price of ₹80,000')
  })
})

describe('email payload', () => {
  it('always counts UI/UX design for both websites, even with nothing ticked', () => {
    const est = calculateEstimate({})
    expect(est.oneTimeTotal).toBe(30000 + 30000 + 5000 + 5000)
    expect(est.extras).toHaveLength(0)
    expect(calculateEstimate({ school_uiux: false }).oneTimeTotal).toBe(70000)
  })

  it('lists core first, then each website’s extras and notes', () => {
    const est = calculateEstimate({ school_branding: true, school_portals: true, tuition_demoBooking: true, tuition_localSEO: true })
    const p = buildSubmission({ name: 'Asha Mehta', notes: { tuition: 'Two branches' } }, est)
    expect(p.CLIENT).toBe('Vivek Vidyalay & Krupanidhi English Academy')
    expect(p['FILLED BY']).toBe('Asha Mehta')
    expect(p['School Website — Your Complete Website']).toMatch(/^Included — ₹30,000/)
    expect(p['Tuition Classes Website — Your Complete Website']).toMatch(/^Included — ₹30,000/)
    expect(p['1. SCHOOL WEBSITE — Vivek Vidyalay']).toBe('2 extras ticked')
    expect(p['School Website — Website Look & Design']).toBe('Required — ₹5,000')
    expect(p['Tuition Classes Website — Website Look & Design']).toBe('Required — ₹5,000')
    expect(p['School Website — New Logo & School Colours']).toBe('Yes — ₹5,000')
    expect(p['School Website — Login for Parents, Students & Teachers']).toBe('Yes — Quoted separately')
    expect(p['Tuition Classes Website — Show Up on Google Maps']).toBe('Yes — ₹2,000')
    expect(p['NOTES — School Website']).toBe('—')
    expect(p['NOTES — Tuition Classes Website']).toBe('Two branches')
  })

  it('keeps each website’s core first and the school before the tuition classes', () => {
    const keys = Object.keys(buildSubmission({}, calculateEstimate({ tuition_branding: true, school_branding: true })))
    expect(keys.indexOf('School Website — Your Complete Website')).toBeLessThan(keys.indexOf('School Website — New Logo & School Colours'))
    expect(keys.indexOf('School Website — New Logo & School Colours')).toBeLessThan(keys.indexOf('Tuition Classes Website — New Logo & Academy Colours'))
  })

  it('says core only when nothing extra is ticked', () => {
    expect(buildSubmission({}, calculateEstimate({}))['1. SCHOOL WEBSITE — Vivek Vidyalay']).toMatch(/Core \+ required services only/)
  })

  it('totals core plus each ticked priced service', () => {
    const est = calculateEstimate({ school_branding: true, school_localSEO: true, school_contentWriting: true, tuition_learningPortal: true })
    expect(est.oneTimeTotal).toBe(60000 + 10000 + 5000 + 2000 + 3000)
    expect(buildSubmission({}, est)['ESTIMATED INVESTMENT']).toMatch(/^₹80,000 \(incl\. core development ₹60,000/)
  })

  it('reaches ₹90,000 with every priced service ticked for both websites', () => {
    const all = Object.fromEntries(
      ['school', 'tuition'].flatMap((s) => ['branding', 'contentWriting', 'localSEO', 'advancedSEO', 'supportAfter3Months'].map((k) => [`${s}_${k}`, true])),
    )
    expect(calculateEstimate(all).oneTimeTotal).toBe(90000)
  })
})

describe('sending', () => {
  it('explains a pending FormSubmit activation clearly', async () => {
    const { sendSubmission } = await import('./submission.js')
    const original = globalThis.fetch
    globalThis.fetch = async () =>
      new Response(JSON.stringify({ success: 'false', message: 'This form needs Activation.' }), { status: 200 })
    try {
      await expect(sendSubmission({}, { waits: [] })).rejects.toThrow(/being set up/)
    } finally {
      globalThis.fetch = original
    }
  })
})

describe('request format', () => {
  it('sends a simple form-encoded request (no preflight) with keepalive', async () => {
    const { sendSubmission } = await import('./submission.js')
    const original = globalThis.fetch
    let seen
    globalThis.fetch = async (url, opts) => {
      seen = { url, opts }
      return new Response(JSON.stringify({ success: 'true' }), { status: 200 })
    }
    try {
      await sendSubmission({ CLIENT: 'Vivek Vidyalay & Krupanidhi English Academy', NOTES: '—' })
    } finally {
      globalThis.fetch = original
    }
    expect(seen.url).toBe('https://formsubmit.co/ajax/heyarrakis@gmail.com')
    expect(seen.opts.body).toBeInstanceOf(URLSearchParams)
    expect(seen.opts.body.get('CLIENT')).toBe('Vivek Vidyalay & Krupanidhi English Academy')
    expect(seen.opts.headers).toEqual({ Accept: 'application/json' })
    expect(seen.opts.keepalive).toBe(true)
  })
})

describe('outages', () => {
  it('retries when the email service is down, then succeeds', async () => {
    const { sendSubmission } = await import('./submission.js')
    const original = globalThis.fetch
    let calls = 0
    globalThis.fetch = async () => {
      calls++
      if (calls < 3) return new Response('error code: 521', { status: 521 })
      return new Response(JSON.stringify({ success: 'true' }), { status: 200 })
    }
    try {
      await expect(sendSubmission({}, { waits: [0, 0] })).resolves.toEqual({ success: 'true' })
    } finally {
      globalThis.fetch = original
    }
    expect(calls).toBe(3)
  })

  it('gives a friendly message when the service stays down', async () => {
    const { sendSubmission } = await import('./submission.js')
    const original = globalThis.fetch
    globalThis.fetch = async () => {
      throw new TypeError('Failed to fetch')
    }
    try {
      await expect(sendSubmission({}, { waits: [0] })).rejects.toThrow(/choices are saved/)
    } finally {
      globalThis.fetch = original
    }
  })

  it('builds a WhatsApp link with the checklist, only when a number is set', async () => {
    const { whatsappLink } = await import('./submission.js')
    expect(whatsappLink({ CLIENT: 'X' }, '')).toBe('')
    const link = whatsappLink({ _subject: 'hidden', CLIENT: 'X', NOTES: 'Hi' }, '919800000000')
    expect(link).toMatch(/^https:\/\/wa\.me\/919800000000\?text=/)
    expect(decodeURIComponent(link.split('text=')[1])).toBe('CLIENT: X\nNOTES: Hi')
  })
})
