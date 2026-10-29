import { PRICING } from '../config.js'
import { formatPrice, priceLabel } from '../lib/pricing.js'
import { Box } from './ui.jsx'

/** Extra lines under a service: what it includes, per-unit rates from PRICING, then any notes. */
function Extras({ group }) {
  const rates = PRICING[group.id]?.rates ?? []
  const includes = group.includes ?? []
  const notes = group.notes ?? []
  if (!includes.length && !rates.length && !notes.length) return null
  return (
    <span className="row__extras">
      {includes.length > 0 && (
        <span className="row__includes">
          {includes.map((i) => (
            <span key={i} className="row__include">{i}</span>
          ))}
        </span>
      )}
      {rates.length > 0 && (
        <span className="row__rates">
          If we create them: {rates.map((r) => `${formatPrice(r.amount)} ${r.unit}`).join(' · ')}
        </span>
      )}
      {notes.map((n) => (
        <span key={n} className="row__note">{n}</span>
      ))}
    </span>
  )
}

/** One service = one checkbox. Grouped services list what they include and are priced once. */
export default function ChecklistGroup({ group, checked, onToggle }) {
  const id = `svc-${group.id}`
  // "Price after a talk" items sit under that heading, so they only show a label once priced.
  const label = group.level && !PRICING[group.id] ? '' : priceLabel(group.id)
  // A required service is always ticked and can't be unticked.
  const on = group.required || checked
  return (
    <li>
      <label className={`row ${on ? 'is-checked' : ''} ${group.required ? 'is-required' : ''}`} htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          className="sr-only"
          name={`service_${group.id}`}
          checked={on}
          disabled={group.required}
          onChange={() => onToggle(group.id)}
        />
        <Box checked={on} />
        <span className="row__text">
          <span className="row__title">
            {group.icon && <span className="row__icon" aria-hidden="true">{group.icon}</span>}
            {group.name}
            {group.required && <span className="row__required mono">Must have</span>}
          </span>
          <span className="row__desc">{group.description}</span>
          <Extras group={group} />
          {group.bonus && <span className="row__bonus mono">+ {group.bonus}</span>}
        </span>
        {label && <span className="row__price mono">{label}</span>}
      </label>
    </li>
  )
}
