import { describe, expect, it } from 'vitest'
import { calculateEstimate, priceLabel } from './pricing.js'

const pricing = {
  schoolWebsite: { amount: 30000 },
  tuitionWebsite: { amount: 20000 },
  school_branding: { amount: 2000 },
  tuition_lms: { amount: 40000, type: 'from' },
  school_customFeature: { amount: null, label: 'Quoted separately' },
}
const groups = [
  { id: 'school_branding', siteId: 'school', name: 'Branding', includes: ['Logo', 'Identity'] },
  { id: 'tuition_lms', siteId: 'tuition', name: 'LMS' },
  { id: 'school_customFeature', siteId: 'school', name: 'Custom' },
]
const sites = [{ id: 'school' }, { id: 'tuition' }]
const est = (selection) => calculateEstimate(selection, { pricing, groups, sites })

describe('pricing', () => {
  it('charges both base websites when nothing is ticked', () => {
    expect(est({}).oneTimeTotal).toBe(50000)
  })

  it('adds each ticked service once and keeps its website', () => {
    const e = est({ school_branding: true, tuition_lms: true })
    expect(e.oneTimeTotal).toBe(50000 + 2000 + 40000)
    expect(e.lines.map((l) => l.siteId)).toEqual(['school', 'tuition'])
    expect(e.hasFromPrices).toBe(true)
  })

  it('lists unpriced services without adding to the total', () => {
    const e = est({ school_customFeature: true })
    expect(e.lines).toHaveLength(1)
    expect(e.oneTimeTotal).toBe(50000)
  })

  it('shows no base price until one is set', () => {
    const e = calculateEstimate({}, { pricing: {}, groups, sites })
    expect(e.showCore).toBe(false)
    expect(e.oneTimeTotal).toBe(0)
  })

  it('formats labels from config', () => {
    expect(priceLabel('school_branding', pricing)).toBe('₹2,000')
    expect(priceLabel('tuition_lms', pricing)).toBe('From ₹40,000')
    expect(priceLabel('school_customFeature', pricing)).toBe('Quoted separately')
    expect(priceLabel('missing', pricing)).toBe('')
  })
})
