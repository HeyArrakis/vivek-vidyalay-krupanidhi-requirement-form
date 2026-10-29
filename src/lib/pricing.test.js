import { describe, expect, it } from 'vitest'
import { calculateEstimate, priceLabel } from './pricing.js'

const pricing = {
  coreWebsite: { amount: 25000 },
  school_branding: { amount: 3000 },
  tuition_branding: { amount: 3000 },
  school_contentWriting: { amount: null, label: '₹200 / section' },
  school_uiux: { amount: 5000 },
}
const groups = [
  { id: 'school_branding', siteId: 'school', name: 'Logo & Brand Identity' },
  { id: 'tuition_branding', siteId: 'tuition', name: 'Logo & Brand Identity' },
  { id: 'school_contentWriting', siteId: 'school', name: 'Content Writing' },
  { id: 'school_portals', siteId: 'school', name: 'Portals', level: 'Advanced' },
]
const withRequired = [...groups, { id: 'school_uiux', siteId: 'school', name: 'UI/UX', required: true }]
const est = (selection) => calculateEstimate(selection, { pricing, groups })

describe('pricing', () => {
  it('charges core development once when nothing is ticked', () => {
    expect(est({}).oneTimeTotal).toBe(25000)
  })

  it('adds each ticked priced service once and keeps its website', () => {
    const e = est({ school_branding: true, tuition_branding: true })
    expect(e.oneTimeTotal).toBe(25000 + 3000 + 3000)
    expect(e.lines.map((l) => l.siteId)).toEqual(['school', 'tuition'])
  })

  it('lists unpriced services and bundles without adding to the total', () => {
    const e = est({ school_contentWriting: true, school_portals: true })
    expect(e.lines).toHaveLength(2)
    expect(e.lines[1].label).toBe('Quoted separately')
    expect(e.oneTimeTotal).toBe(25000)
  })

  it('always counts required services and keeps them out of extras', () => {
    const e = calculateEstimate({}, { pricing, groups: withRequired })
    expect(e.oneTimeTotal).toBe(25000 + 5000)
    expect(e.lines[0].required).toBe(true)
    expect(e.extras).toHaveLength(0)
  })

  it('shows no core price until one is set', () => {
    const e = calculateEstimate({}, { pricing: {}, groups })
    expect(e.showCore).toBe(false)
    expect(e.oneTimeTotal).toBe(0)
  })

  it('formats labels from config', () => {
    expect(priceLabel('school_branding', pricing)).toBe('₹3,000')
    expect(priceLabel('school_contentWriting', pricing)).toBe('₹200 / section')
    expect(priceLabel('missing', pricing)).toBe('')
  })
})
