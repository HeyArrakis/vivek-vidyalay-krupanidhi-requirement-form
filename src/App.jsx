import { useEffect, useMemo, useRef, useState } from 'react'
import { CLIENT } from './config.js'
import { CORE, LEVELS, SITES, coreSections } from './services.js'
import { calculateEstimate, formatPrice, priceLabel, pricesConfigured } from './lib/pricing.js'
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
          <p className="intro__copy">
            Core development covers both websites. Below it, tick any extra features or services you’d like for each website.
          </p>
          <CorePackage />
          <nav className="sites" aria-label="Websites in this checklist">
            {SITES.map((site) => (
              <a key={site.id} className="sites__card" href={`#site-${site.id}`}>
                <span className="mono sites__num">{site.number}</span>
                <span className="sites__text">
                  <span className="mono muted">{site.kind}</span>
                  <span className="sites__name">{site.name}</span>
                </span>
                <span className="mono sites__count">{siteCount(site.id)} extras ticked</span>
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
              <p className="site__core">
                <CheckMark /> {site.pages.length} website pages, {site.basic.length} basic features and the UI/UX design are included in core
                development.
              </p>

              {site.sections.map((sec) => (
                <section key={sec.id} className="group" aria-labelledby={`grp-${sec.id}`}>
                  <div className="group__title">
                    <span className="mono group__letter" aria-hidden="true">{sec.letter}</span>
                    <h3 id={`grp-${sec.id}`} className="group__name">{sec.title}</h3>
                  </div>
                  {sec.intro && <p className="group__intro">{sec.intro}</p>}
                  {sec.included && (
                    <Included title={sec.included.title} label={sec.included.label} items={site[sec.included.items]} />
                  )}
                  {sec.complimentary && (
                    <Included
                      title={sec.complimentary.title}
                      label={sec.complimentary.label}
                      text={sec.complimentary.text}
                      notes={sec.complimentary.notes}
                    />
                  )}
                  {sec.groups.some((g) => g.level) ? (
                    LEVELS.map(({ level, title, label }) => {
                      const groups = sec.groups.filter((g) => g.level === level)
                      if (!groups.length) return null
                      return (
                        <div key={level} className="tier">
                          <p className="tier__head">
                            <span className="tier__title">{title}</span>
                            <span className="mono tier__label">{label}</span>
                          </p>
                          <ul className="list">
                            {groups.map((g) => (
                              <ChecklistGroup key={g.id} group={g} checked={!!selection[g.id]} onToggle={toggle} />
                            ))}
                          </ul>
                        </div>
                      )
                    })
                  ) : (
                    <ul className="list">
                      {sec.groups.map((g) => (
                        <ChecklistGroup key={g.id} group={g} checked={!!selection[g.id]} onToggle={toggle} />
                      ))}
                    </ul>
                  )}
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
                This is an initial estimate based on your selected requirements. Services marked “Quoted separately” are not
                included in the total. Final pricing will be confirmed after reviewing your requirements.
              </p>
            )}
            <div className="submit__row">
              <button type="submit" className="btn btn--primary">
                Submit checklist <span aria-hidden="true">→</span>
              </button>
              <span className="mono muted">Core + {count} {count === 1 ? 'extra' : 'extras'} ticked</span>
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

/** The core package: price up front, everything it covers in an expandable list. */
function CorePackage() {
  return (
    <div className="core">
      <div className="core__head">
        <div>
          <p className="mono core__kicker">Included</p>
          <h2 className="core__title">{CORE.title}</h2>
          <p className="core__subtitle">{CORE.subtitle}</p>
        </div>
        {priceLabel('coreWebsite') && <p className="core__price">{priceLabel('coreWebsite')}</p>}
      </div>
      <p className="core__summary">{CORE.summary}</p>
      <details className="core__details">
        <summary className="core__toggle mono">
          <span className="core__toggle-open">See everything included</span>
          <span className="core__toggle-close">Hide the list</span>
        </summary>
        <div className="core__body">
          {coreSections().map((sec) => (
            <div key={sec.title} className="core__section">
              <p className="core__section-title mono">{sec.title}</p>
              <ul className="core__list">
                {sec.items.map((i) => (
                  <li key={i.name}>
                    <CheckMark />
                    <span>
                      <span className="core__item">{i.name}</span>
                      {i.description && <span className="core__desc"> — {i.description}</span>}
                    </span>
                  </li>
                ))}
              </ul>
              {sec.notes?.map((n) => (
                <p key={n} className="row__note">{n}</p>
              ))}
            </div>
          ))}
        </div>
      </details>
    </div>
  )
}

/** A non-selectable block: something already included or complimentary. */
function Included({ title, label, text, items, notes = [] }) {
  return (
    <div className="comp">
      <p className="comp__head">
        <span className="row__title">{title}</span>
        <span className="comp__tag mono">{label}</span>
      </p>
      {text && <p className="row__desc">{text}</p>}
      {items && (
        <ul className="comp__list">
          {items.map((i) => (
            <li key={i.name} className="row__include">
              <strong>{i.name}</strong> — {i.description}
            </li>
          ))}
        </ul>
      )}
      {notes.map((n) => (
        <p key={n} className="row__note">{n}</p>
      ))}
    </div>
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
          {estimate.showCore && <span className="pricebar__core">Core {formatPrice(estimate.coreAmount)} + </span>}
          {count} {count === 1 ? 'extra' : 'extras'}
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
        <p className="success__core"><CheckMark /> {CORE.title} — both websites</p>
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
