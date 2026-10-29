import { useEffect, useMemo, useRef, useState } from 'react'
import { CLIENT } from './config.js'
import { CORE, COMPLIMENTARY, LEVELS, SITES, coreKey, coreSections, coreTotal } from './services.js'
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

  /** Ticks every service in a section, or clears them all if they're already ticked. */
  const toggleAll = (groups) => {
    setSelection((s) => {
      const allOn = groups.every((g) => s[g.id])
      return { ...s, ...Object.fromEntries(groups.map((g) => [g.id, !allOn])) }
    })
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
      setNameError('Please write your name here.')
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

  const count = estimate.extras.length
  const siteCount = (siteId) => estimate.extras.filter((l) => l.siteId === siteId).length

  return (
    <>
      <Header />
      <main className="wrap page">
        <div className="intro">
          <p className="mono muted">{CLIENT.name} × Sonder</p>
          <h1 className="intro__title">Your Website Checklist</h1>
          <p className="intro__copy">Two New Websites — One for the School, One for the Academy</p>
          <ComplimentaryBanner />
          <ol className="steps" aria-label="How to fill this checklist">
            <li><span className="steps__num">1</span><span>See What You Get</span></li>
            <li><span className="steps__num">2</span><span>Tick <span className="steps__tick">✓</span> What You Want</span></li>
            <li><span className="steps__num">3</span><span>Write Your Name & Send</span></li>
          </ol>
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

        <form action={FORM_SUBMIT_ACTION} method="POST" noValidate onSubmit={onSubmit} aria-label="Website checklist">
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

              <CorePackage site={site} />

              {site.sections.map((sec) => {
                const allOn = sec.groups.every((g) => selection[g.id])
                return (
                  <section key={sec.id} className={`group ${sec.recommended ? 'group--recommended' : ''}`} aria-labelledby={`grp-${sec.id}`}>
                    <div className="group__title">
                      <span className="mono group__letter" aria-hidden="true">{sec.letter}</span>
                      <h3 id={`grp-${sec.id}`} className="group__name">{sec.title}</h3>
                    </div>
                    {sec.intro && <p className="group__intro">{sec.intro}</p>}
                    {sec.recommended && (
                      <button type="button" className={`addall ${allOn ? 'is-on' : ''}`} onClick={() => toggleAll(sec.groups)}>
                        {allOn ? `✓ All ${sec.groups.length} Added` : `+ Add All ${sec.groups.length}`}
                      </button>
                    )}
                    {sec.groups.some((g) => g.level) ? (
                      LEVELS.map(({ level, title }) => {
                        const groups = sec.groups.filter((g) => g.level === level)
                        if (!groups.length) return null
                        return (
                          <div key={level} className="tier">
                            <p className="tier__head">{title}</p>
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
                )
              })}

              <div className="group group--notes">
                <Field
                  id={`notes-${site.id}`}
                  label="Anything Else You Want?"
                  optional
                  hint="Write in your own words — English, Hindi or Gujarati is fine."
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
            <Field id="fillerName" label="Your Name" required error={nameError}>
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
                This total is an estimate. Items under “Price After a Quick Talk” are not in it. We’ll confirm the final price when we
                meet.
              </p>
            )}
            <div className="submit__row">
              <button type="submit" className="btn btn--primary">
                Send checklist <span aria-hidden="true">→</span>
              </button>
              <span className="mono muted">{count} {count === 1 ? 'extra' : 'extras'} ticked</span>
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

/** Complimentary from Sonder — blue, at the top, so it's seen straight away. */
function ComplimentaryBanner() {
  return (
    <div className="compbanner" role="note">
      <span className="compbanner__icon" aria-hidden="true">🎁</span>
      <div>
        <p className="compbanner__title">Complimentary From Sonder — For Both Websites</p>
        <ul className="compbanner__list">
          {COMPLIMENTARY.map((g) => (
            <li key={g.name}>✓ {g.name}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/** A website's core package: price, big counters of what it covers, and the full list in a dropdown. */
function CorePackage({ site }) {
  const price = priceLabel(coreKey(site.id))
  const sections = coreSections(site)
  return (
    <div className="core">
      <div className="core__head">
        <div>
          <p className="mono core__kicker">Included</p>
          <h3 className="core__title">{CORE.title}</h3>
        </div>
        {price && <p className="core__price">{price}</p>}
      </div>
      <p className="core__summary">
        <strong>{coreTotal(site)} Things Included</strong> in One Price:
      </p>
      <ul className="counts">
        {sections.map((sec) => (
          <li key={sec.label} className={`counts__item ${sec.complimentary ? 'is-comp' : ''}`}>
            <span className="counts__icon" aria-hidden="true">{sec.icon}</span>
            <span className="counts__value">{sec.count}</span>
            <span className="counts__label">{sec.label}</span>
          </li>
        ))}
      </ul>
      <details className="core__details">
        <summary className="core__toggle">
          <span className="core__toggle-open">👇 Tap to See the Full List</span>
          <span className="core__toggle-close">Hide the List</span>
        </summary>
        <div className="core__body">
          {sections.map((sec) => (
            <div key={sec.label} className={`core__section ${sec.complimentary ? 'is-comp' : ''}`}>
              <p className="core__section-title">
                <span aria-hidden="true">{sec.icon}</span> {sec.count} {sec.label}
              </p>
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

function PriceBar({ estimate, count }) {
  return (
    <div className="pricebar" role="status" aria-live="polite" aria-atomic="true">
      <div className="wrap pricebar__inner">
        <div className="pricebar__left">
          <span className="mono pricebar__label">Total price (estimate)</span>
          {/* key re-mounts the number on every change so the update animation replays */}
          <span key={estimate.oneTimeTotal} className="pricebar__amount">
            {estimate.hasFromPrices ? 'From ' : ''}{formatPrice(estimate.oneTimeTotal)}
            {estimate.monthlyTotal > 0 && <span className="pricebar__monthly"> + {formatPrice(estimate.monthlyTotal)} / month</span>}
          </span>
        </div>
        <span className="mono pricebar__meta">
          {SITES.length} websites{count > 0 && ` + ${count} ${count === 1 ? 'extra' : 'extras'}`}
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
        <h1 className="intro__title" tabIndex={-1} ref={titleRef}>Thank You! We Got Your Checklist.</h1>
        <p className="intro__copy">We’ll look at what you chose and call you soon.</p>
        {SITES.map((site) => {
          const lines = estimate.lines.filter((l) => l.siteId === site.id)
          if (!lines.length) return null
          return (
            <div key={site.id} className="success__site">
              <p className="mono muted">{site.number}. {site.kind} — {site.name}</p>
              <ul className="success__list">
                <li><CheckMark /> {CORE.title}</li>
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
