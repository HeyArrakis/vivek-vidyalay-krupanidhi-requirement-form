import { useEffect, useMemo, useRef, useState } from 'react'
import { CLIENT } from './config.js'
import { SITES } from './services.js'
import { calculateEstimate, coreKey, formatPrice, priceLabel, pricesConfigured } from './lib/pricing.js'
import { FORM_SUBMIT_ACTION, buildSubmission, sendSubmission } from './lib/submission.js'
import ChecklistGroup from './components/Checklist.jsx'
import { CheckMark, Field } from './components/ui.jsx'

const SHOW_PRICES = pricesConfigured()

export default function App() {
  const [selection, setSelection] = useState({})
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')
  const [notes, setNotes] = useState({}) // siteId → text
  const [status, setStatus] = useState('idle') // idle | success
  const [delivery, setDelivery] = useState('idle') // idle | sending | sent | failed
  const [submitError, setSubmitError] = useState('')
  const [sent, setSent] = useState(null)

  const estimate = useMemo(() => calculateEstimate(selection), [selection])

  const toggle = (groupId) => {
    setSelection((s) => ({ ...s, [groupId]: !s[groupId] }))
    setSubmitError('')
  }

  /** Ticks every service in a section, or clears them all if they're already ticked. */
  const toggleAll = (groups) => {
    setSelection((s) => {
      const allOn = groups.every((g) => s[g.id])
      return { ...s, ...Object.fromEntries(groups.map((g) => [g.id, !allOn])) }
    })
    setSubmitError('')
  }

  const hasNotes = Object.values(notes).some((n) => n.trim())

  // Sending runs in the background: the thank-you page shows instantly and reports
  // delivery (with a retry) once FormSubmit answers.
  const deliver = (payload) => {
    setDelivery('sending')
    sendSubmission(payload)
      .then(() => setDelivery('sent'))
      .catch((err) => {
        setDelivery('failed')
        setSubmitError(err.message)
      })
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (status === 'success') return
    if (!name.trim()) {
      setNameError('Please enter your name.')
      const el = document.getElementById('fillerName')
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el?.focus({ preventScroll: true })
      return
    }
    if (estimate.lines.length === 0 && !hasNotes) {
      setSubmitError('Please tick at least one service (or add a note) before submitting.')
      return
    }
    const payload = buildSubmission({ name, notes }, estimate)
    setSubmitError('')
    setSent({ estimate, payload })
    setStatus('success')
    deliver(payload)
  }

  if (status === 'success' && sent) {
    return <Success estimate={sent.estimate} delivery={delivery} error={submitError} onRetry={() => deliver(sent.payload)} />
  }

  const count = estimate.lines.length
  const siteCount = (siteId) => estimate.lines.filter((l) => l.siteId === siteId).length

  return (
    <>
      <Header />
      <main className="wrap page">
        <div className="intro">
          <p className="mono muted">{CLIENT.name} × Sonder</p>
          <h1 className="intro__title">Website requirement checklist</h1>
          <p className="intro__copy">One checklist for both of your websites. Tick everything you’d like included in each.</p>
          <nav className="sites" aria-label="Websites in this checklist">
            {SITES.map((site) => (
              <a key={site.id} className="sites__card" href={`#site-${site.id}`}>
                <span className="mono sites__num">{site.number}</span>
                <span className="sites__text">
                  <span className="mono muted">{site.kind}</span>
                  <span className="sites__name">{site.name}</span>
                </span>
                <span className="mono sites__count">{siteCount(site.id)} ticked</span>
              </a>
            ))}
          </nav>
        </div>

        <form action={FORM_SUBMIT_ACTION} method="POST" noValidate onSubmit={onSubmit} aria-label="Website requirement checklist">
          {SITES.map((site) => (
            <section key={site.id} id={`site-${site.id}`} className="site" aria-labelledby={`site-${site.id}-title`}>
              <div className="site__head">
                <span className="site__num" aria-hidden="true">{site.number}</span>
                <div className="site__heading">
                  <p className="mono site__kind">{site.kind}</p>
                  <h2 id={`site-${site.id}-title`} className="site__name">{site.name}</h2>
                  <p className="site__objective">{site.objective}</p>
                </div>
              </div>
              <div className="intro__note">
                {priceLabel(coreKey(site.id)) && (
                  <p className="intro__core">
                    <span>{site.kind}</span>
                    <span className="mono">{priceLabel(coreKey(site.id))}</span>
                  </p>
                )}
                <p>{site.includedNote}</p>
              </div>

              {site.sections.map((sec) => (
                <section key={sec.id} className="group" aria-labelledby={`grp-${sec.id}`}>
                  <div className="group__title">
                    <span className="mono group__letter" aria-hidden="true">{sec.letter}</span>
                    <h3 id={`grp-${sec.id}`} className="group__name">{sec.title}</h3>
                    {sec.bulk && (
                      <button type="button" className="group__bulk mono" onClick={() => toggleAll(sec.groups)}>
                        {sec.groups.every((g) => selection[g.id]) ? 'Clear all' : 'Tick all'}
                      </button>
                    )}
                  </div>
                  {sec.intro && <p className="group__intro">{sec.intro}</p>}
                  {sec.complimentary && (
                    <div className="comp">
                      <p className="comp__head">
                        <span className="row__title">{sec.complimentary.title}</span>
                        <span className="comp__tag mono">{sec.complimentary.label}</span>
                      </p>
                      <p className="row__desc">{sec.complimentary.text}</p>
                      {sec.complimentary.notes.map((n) => (
                        <p key={n} className="row__note">{n}</p>
                      ))}
                    </div>
                  )}
                  <ul className="list">
                    {sec.groups.map((g) => (
                      <ChecklistGroup key={g.id} group={g} checked={!!selection[g.id]} onToggle={toggle} />
                    ))}
                  </ul>
                </section>
              ))}

              <div className="group group--notes">
                <Field
                  id={`notes-${site.id}`}
                  label={`Anything else for the ${site.kind.toLowerCase()}?`}
                  optional
                  hint="Describe any custom feature, or add other notes for this website."
                >
                  {(a11y) => (
                    <textarea
                      {...a11y}
                      name={`notes_${site.id}`}
                      rows={3}
                      value={notes[site.id] ?? ''}
                      onChange={(e) => setNotes((n) => ({ ...n, [site.id]: e.target.value }))}
                    />
                  )}
                </Field>
              </div>
            </section>
          ))}

          <section className="group group--notes group--final">
            <Field id="fillerName" label="Your name" required error={nameError}>
              {(a11y) => (
                <input
                  {...a11y}
                  name="filled_by"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (nameError && e.target.value.trim()) setNameError('')
                  }}
                />
              )}
            </Field>
          </section>

          <div className="submit">
            {SHOW_PRICES && (
              <p className="submit__note">
                This is an initial estimate based on your selected requirements. Final pricing will be confirmed after
                reviewing your requirements.
              </p>
            )}
            <div className="submit__row">
              <button type="submit" className="btn btn--primary">
                Submit checklist <span aria-hidden="true">→</span>
              </button>
              <span className="mono muted">{count} {count === 1 ? 'service' : 'services'} ticked</span>
            </div>
            <div aria-live="assertive">
              {submitError && <p className="form-error">{submitError}</p>}
            </div>
          </div>
        </form>
      </main>
      <Footer />
      {SHOW_PRICES && <PriceBar estimate={estimate} count={count} />}
    </>
  )
}

/** Fixed to the bottom of the screen so the total is always visible while ticking. */
function PriceBar({ estimate, count }) {
  return (
    <div className="pricebar" role="status" aria-live="polite" aria-atomic="true">
      <div className="wrap pricebar__inner">
        <div className="pricebar__left">
          <span className="mono pricebar__label">Estimated Investment</span>
          {/* key re-mounts the number on every change so the update animation replays */}
          <span key={estimate.oneTimeTotal} className="pricebar__amount">
            {estimate.hasFromPrices ? 'From ' : ''}{formatPrice(estimate.oneTimeTotal)}
            {estimate.monthlyTotal > 0 && <span className="pricebar__monthly"> + {formatPrice(estimate.monthlyTotal)} / month</span>}
          </span>
        </div>
        <span className="mono pricebar__meta">
          {estimate.showCore && <span className="pricebar__core">Websites {formatPrice(estimate.coreAmount)} + </span>}
          {count} {count === 1 ? 'service' : 'services'}
        </span>
      </div>
    </div>
  )
}

function Header() {
  return (
    <header className="header">
      <div className="wrap header__inner">
        <span className="brand" aria-label="Sonder">
          <span className="brand__word">sonder</span>
          <span className="brand__cursor" aria-hidden="true" />
        </span>
        <span className="pill"><span className="pill__dot" aria-hidden="true" />{CLIENT.shortName}</span>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__inner mono muted">
        <span>Prepared for {CLIENT.name}</span>
        <span>© {new Date().getFullYear()} Sonder AI Agency</span>
      </div>
    </footer>
  )
}

function Success({ estimate, delivery, error, onRetry }) {
  const titleRef = useRef(null)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    titleRef.current?.focus({ preventScroll: true })
  }, [])
  return (
    <>
      <Header />
      <main className="wrap page success">
        <div className="success__mark" aria-hidden="true"><CheckMark /></div>
        <h1 className="intro__title" tabIndex={-1} ref={titleRef}>Thank you. We’ve received your requirements.</h1>
        <p className="intro__copy">Our team will review your selections and get back to you with the final scope and proposal.</p>
        {SITES.map((site) => {
          const lines = estimate.lines.filter((l) => l.siteId === site.id)
          if (!lines.length) return null
          return (
            <div key={site.id} className="success__site">
              <p className="mono muted">{site.number}. {site.kind} — {site.name}</p>
              <ul className="success__list">
                {lines.map((l) => (
                  <li key={l.groupId}><CheckMark /> {l.name}</li>
                ))}
              </ul>
            </div>
          )
        })}
        <div className="delivery" aria-live="polite">
          {delivery === 'sending' && (
            <p className="delivery__status mono"><span className="spinner spinner--dark" aria-hidden="true" /> Sending to Sonder…</p>
          )}
          {delivery === 'sent' && <p className="delivery__status delivery__status--ok mono"><CheckMark /> Delivered to Sonder</p>}
          {delivery === 'failed' && (
            <div className="delivery__failed">
              <p className="form-error">{error}</p>
              <button type="button" className="btn btn--primary" onClick={onRetry}>Try again</button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
