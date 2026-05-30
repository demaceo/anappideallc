import { useState } from 'react'
import { SITE } from '../data/site'
import { RouteHead } from '../components/SEO/RouteHead'
import { META } from '../lib/seo'
import { IconEdit, IconSearch, IconSend } from '../components/icons'
import { PageHeader } from '../components/PageHeader/PageHeader'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const PROMPTS = [
  {
    icon: IconEdit,
    iconClass: 'icon-gold',
    eyebrow: 'The idea',
    title: 'What it does and who it\'s for',
    body: 'One to three sentences. What problem does it solve? Who\'s the primary user? What\'s the one thing it needs to do well?',
  },
  {
    icon: IconSearch,
    iconClass: 'icon-blue',
    eyebrow: 'Where you are',
    title: 'Stage, timeline, and any existing work',
    body: 'Sketches, wireframes, specs, or existing code — include whatever you have. A rough target date helps too, even if it\'s loose. None of it is required.',
  },
  {
    icon: IconSend,
    iconClass: 'icon-green',
    eyebrow: 'The fit',
    title: 'Budget ballpark, if you have one',
    body: 'A rough range helps scope the engagement. If you don\'t have a number yet, that\'s a normal place to start — just say so and we\'ll figure it out together.',
  },
] as const

export default function Contact() {
  const [fields, setFields] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFields(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <RouteHead {...META['/contact']} />

      <PageHeader>
        <header className="masthead">
          <p className="overline">An App Idea LLC · Denver, Colorado</p>
          <h1>Let's <em>talk.</em></h1>
          <p className="subtitle">
            Got an app or website idea? Send a few sentences.
            I read everything and respond within 1–2 business days.
          </p>
          <p className="date-line">{SITE.email}</p>
        </header>
      </PageHeader>

      <main className="container">
        <div className="intro-block">
          <p>
            Early-stage conversations are welcome. The goal of the first
            exchange is to figure out whether we're a good fit — no deck
            or finished spec required.
          </p>
        </div>

        {status === 'sent' ? (
          <div className="contact-form">
            <span className="contact-form-eyebrow">Message received</span>
            <p className="contact-form-title">Thanks — I'll be in touch.</p>
            <p className="contact-form-sub">
              Expect a reply within 1–2 business days.
            </p>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <span className="contact-form-eyebrow">Send a message</span>
            <p className="contact-form-title">Tell me about your idea.</p>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="cf-name">Name</label>
                <input
                  id="cf-name"
                  className="form-input"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  required
                  value={fields.name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="cf-email">Email</label>
                <input
                  id="cf-email"
                  className="form-input"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  value={fields.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="cf-message">Message</label>
              <textarea
                id="cf-message"
                className="form-textarea"
                name="message"
                placeholder={`What does it do, who's it for, and where are you in the process?`}
                required
                value={fields.message}
                onChange={handleChange}
              />
            </div>

            <div className="form-submit-row">
              <button
                className="form-submit-btn"
                type="submit"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? 'Sending…' : 'Send message'}
              </button>
              {status === 'error' && (
                <span className="form-status error">
                  Something went wrong — try {' '}
                  <a href={`mailto:${SITE.email}`}>emailing directly</a>.
                </span>
              )}
            </div>
          </form>
        )}

        <div className="section-header">
          <span className="section-num">What to include</span>
          <h2>Three things worth mentioning</h2>
          <div className="section-rule" />
        </div>

        {PROMPTS.map((p) => {
          const PromptIcon = p.icon
          return (
            <div key={p.eyebrow} className="feature-item">
              <div className={`feature-icon ${p.iconClass}`}>
                <PromptIcon size={20} />
              </div>
              <div className="feature-body">
                <span className="feature-eyebrow">{p.eyebrow}</span>
                <h3 className="feature-title">{p.title}</h3>
                <p>{p.body}</p>
              </div>
            </div>
          )
        })}

        <div className="section-header">
          <span className="section-num">Location</span>
          <h2>Where I am</h2>
          <div className="section-rule" />
        </div>

        <div className="verdict-box note">
          <p>
            {SITE.founder.location} · Mountain Time (US/Denver).
            I work with founders remotely and have built across US, UK, and
            international time zones without friction.
          </p>
        </div>
      </main>

      <footer className="sources-section">
        <div className="container">
          <div className="sources-header">
            <h3>Contact details</h3>
            <div className="sources-header-rule" />
          </div>
          <ul className="source-list">
            <li>
              <strong>Email</strong>
              {SITE.email}
            </li>
            <li>
              <strong>Location</strong>
              {SITE.founder.location} · Mountain Time
            </li>
            <li>
              <strong>Response time</strong>
              1–2 business days
            </li>
            <li>
              <strong>Studio</strong>
              {SITE.name}
            </li>
          </ul>
        </div>
      </footer>
    </>
  )
}
