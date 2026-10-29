import { describe, expect, it } from 'vitest'
import { buildSubmission } from './submission.js'
import { calculateEstimate } from './pricing.js'

describe('email payload', () => {
  it('groups ticked services under each website with their notes', () => {
    const est = calculateEstimate({ school_page_home: true, school_customFeature: true, tuition_demoBooking: true })
    const p = buildSubmission({ name: 'Asha Mehta', notes: { tuition: 'Two branches' } }, est)
    expect(p.CLIENT).toBe('Vivek Vidyalay & Krupanidhi English Academy')
    expect(p['FILLED BY']).toBe('Asha Mehta')
    expect(p['1. SCHOOL WEBSITE — Vivek Vidyalay']).toBe('2 ticked')
    expect(p['School Website — Home Page']).toBe('Yes')
    expect(p['School Website — Custom School Feature']).toBe('Yes — Quoted separately')
    expect(p['2. TUITION CLASSES WEBSITE — Krupanidhi English Academy']).toBe('1 ticked')
    expect(p['Tuition Classes Website — Demo Class Booking']).toBe('Yes')
    expect(p['NOTES — School Website']).toBe('—')
    expect(p['NOTES — Tuition Classes Website']).toBe('Two branches')
  })

  it('keeps the school before the tuition classes in the email', () => {
    const keys = Object.keys(buildSubmission({}, calculateEstimate({ tuition_page_home: true, school_page_home: true })))
    expect(keys.indexOf('School Website — Home Page')).toBeLessThan(keys.indexOf('Tuition Classes Website — Home Page'))
  })

  it('says when nothing is ticked for a website', () => {
    expect(buildSubmission({}, calculateEstimate({}))['1. SCHOOL WEBSITE — Vivek Vidyalay']).toBe('Nothing ticked')
  })

  it('leaves out the estimate while no prices are set', () => {
    expect(buildSubmission({}, calculateEstimate({ school_page_home: true }))).not.toHaveProperty('ESTIMATED INVESTMENT')
  })

  it('ignores unticked services', () => {
    expect(calculateEstimate({ school_page_home: false }).lines).toHaveLength(0)
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
