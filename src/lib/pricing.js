import { CURRENCY, PRICING } from '../config.js'
import { ALL_GROUPS, COMPLIMENTARY_VALUE, SITES, coreKey } from '../services.js'

const formatter = new Intl.NumberFormat(CURRENCY.locale, {
  style: 'currency',
  currency: CURRENCY.code,
  maximumFractionDigits: 0,
})

export const formatPrice = (amount) => formatter.format(Math.round(amount || 0))

const hasAmount = (p) => p != null && p.amount != null

const QUOTED = 'Quoted separately'
/** Feature bundles (Standard / Advanced / Custom) are quoted separately unless priced. */
const LEVELED = new Set(ALL_GROUPS.filter((g) => g.level).map((g) => g.id))

/** True once at least one price has been filled in — otherwise no prices or totals are shown. */
export const pricesConfigured = (pricing = PRICING) => Object.values(pricing).some(hasAmount)

/** "₹4,000", "From ₹4,000", "₹1,000 / month", or the entry's text label (e.g. "Quoted separately"). */
export function priceLabel(groupId, pricing = PRICING) {
  const p = pricing[groupId]
  if (!hasAmount(p)) return p?.label ?? (LEVELED.has(groupId) ? QUOTED : '')
  const base = `${p.type === 'from' ? 'From ' : ''}${formatPrice(p.amount)}`
  return p.billing === 'monthly' ? `${base} / month` : base
}

/**
 * Estimate from ticked services across both websites.
 *
 * `selection` maps groupId → true when that service is ticked. Each service is
 * one checkbox, so a grouped service (e.g. Logo & Brand Identity) is charged once.
 * Services without an amount add nothing. Each website's core development is always counted,
 * and required services are counted whether or not they are in `selection`.
 */
export function calculateEstimate(selection, { pricing = PRICING, groups = ALL_GROUPS, sites = SITES } = {}) {
  const lines = []
  for (const group of groups) {
    // Required services (e.g. UI/UX design) are always part of the estimate.
    if (!group.required && !selection[group.id]) continue
    const p = pricing[group.id]
    lines.push({
      groupId: group.id,
      siteId: group.siteId,
      required: !!group.required,
      name: group.name,
      amount: hasAmount(p) ? p.amount : null,
      label: p?.label ?? (group.level ? QUOTED : ''),
      type: p?.type ?? 'fixed',
      billing: p?.billing ?? 'one-time',
    })
  }

  const cores = sites.map((s) => pricing[coreKey(s.id)]).filter(hasAmount)
  const coreAmount = cores.reduce((t, c) => t + c.amount, 0)
  const priced = lines.filter((l) => l.amount != null)
  const sum = (ls) => ls.reduce((t, l) => t + l.amount, 0)
  const oneTime = priced.filter((l) => l.billing !== 'monthly')
  const monthly = priced.filter((l) => l.billing === 'monthly')
  // Our usual price minus this price, for every one-time price counted (core included).
  const reduction = [...cores, ...oneTime.map((l) => pricing[l.groupId])].reduce((t, p) => t + Math.max(0, (p.usual ?? p.amount) - p.amount), 0)

  return {
    lines,
    extras: lines.filter((l) => !l.required),
    showCore: cores.length > 0,
    coreAmount,
    addOnsTotal: sum(oneTime),
    oneTimeTotal: coreAmount + sum(oneTime),
    // How far below our usual price this is — shown in the total, never on a service.
    reduction,
    usualTotal: coreAmount + sum(oneTime) + reduction,
    monthlyTotal: sum(monthly),
    // What we pay for (domain, hosting) across every website — shown crossed out, never charged.
    complimentaryValue: COMPLIMENTARY_VALUE * sites.length,
    hasFromPrices: priced.some((l) => l.type === 'from') || cores.some((c) => c.type === 'from'),
  }
}
