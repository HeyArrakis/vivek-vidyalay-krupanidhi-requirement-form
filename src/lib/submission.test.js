import { describe, expect, it } from 'vitest'
import { buildSubmission } from './submission.js'
import { calculateEstimate } from './pricing.js'

describe('email payload', () => {
  it('always counts UI/UX design for both websites, even with nothing ticked', () => {
    const est = calculateEstimate({})
    expect(est.oneTimeTotal).toBe(25000 + 5000 + 5000)
    expect(est.extras).toHaveLength(0)
    expect(calculateEstimate({ school_uiux: false }).oneTimeTotal).toBe(35000)
  })

  it('lists core first, then each website’s extras and notes', () => {
    const est = calculateEstimate({ school_branding: true, school_portals: true, tuition_demoBooking: true, tuition_localSEO: true })
    const p = buildSubmission({ name: 'Asha Mehta', notes: { tuition: 'Two branches' } }, est)
    expect(p.CLIENT).toBe('Vivek Vidyalay & Krupanidhi English Academy')
    expect(p['FILLED BY']).toBe('Asha Mehta')
    expect(p['CORE — Core Website Development']).toMatch(/^Included — ₹25,000/)
    expect(p['1. SCHOOL WEBSITE — Vivek Vidyalay']).toBe('2 extras ticked')
    expect(p['School Website — Website UI/UX Design']).toBe('Required — ₹5,000')
    expect(p['Tuition Classes Website — Website UI/UX Design']).toBe('Required — ₹5,000')
    expect(p['School Website — Logo & Brand Identity']).toBe('Yes — ₹3,000')
    expect(p['School Website — Student, Parent & Teacher Portals']).toBe('Yes — Quoted separately')
    expect(p['Tuition Classes Website — Local SEO & Google Business Profile']).toBe('Yes — ₹1,000')
    expect(p['NOTES — School Website']).toBe('—')
    expect(p['NOTES — Tuition Classes Website']).toBe('Two branches')
  })

  it('keeps core before the school and the school before the tuition classes', () => {
    const keys = Object.keys(buildSubmission({}, calculateEstimate({ tuition_branding: true, school_branding: true })))
    expect(keys.indexOf('CORE — Core Website Development')).toBeLessThan(keys.indexOf('School Website — Logo & Brand Identity'))
    expect(keys.indexOf('School Website — Logo & Brand Identity')).toBeLessThan(keys.indexOf('Tuition Classes Website — Logo & Brand Identity'))
  })

  it('says core only when nothing extra is ticked', () => {
    expect(buildSubmission({}, calculateEstimate({}))['1. SCHOOL WEBSITE — Vivek Vidyalay']).toMatch(/Core \+ required services only/)
  })

  it('totals core plus each ticked priced service', () => {
    const est = calculateEstimate({ school_branding: true, school_localSEO: true, school_contentWriting: true, tuition_learningPortal: true })
    expect(est.oneTimeTotal).toBe(25000 + 5000 + 5000 + 3000 + 1000)
    expect(buildSubmission({}, est)['ESTIMATED INVESTMENT']).toMatch(/^₹39,000 \(incl\. core development ₹25,000/)
  })
})

describe('sending', () => {
  it('explains a pending FormSubmit activation clearly', async () => {
    const { sendSubmission } = await import('./submission.js')
    const original = globalThis.fetch
    globalThis.fetch = async () =>
      new Response(JSON.stringify({ success: 'false', message: 'This form needs Activation.' }), { status: 200 })
    try {
      await expect(sendSubmission({})).rejects.toThrow(/being activated/)
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
