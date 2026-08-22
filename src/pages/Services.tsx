import { useState } from 'react'
import { Link } from 'react-router'
import { SocialLinks } from '../components/SocialLinks/SocialLinks'
import { services } from '../data/services'
import { RouteHead } from '../components/SEO/RouteHead'
import { META } from '../lib/seo'
import { PageHeader } from '../components/PageHeader/PageHeader'

export default function Services() {
  // Accordion: one service open at a time; first item open on load so the
  // prerendered page shows real content above the fold. Closed panels stay
  // in the DOM (grid-rows 0fr) so all content remains crawlable, but carry
  // `inert` so they're skipped by keyboard focus and assistive tech.
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <>
      <RouteHead {...META['/services']} />

      <PageHeader>
        <header className="masthead">
          <p className="overline">An App Idea LLC · What I build</p>
          <h1>Services</h1>
          <p className="date-line">Five ways I can help</p>
        </header>
      </PageHeader>

      <main className="container" id="main-content" tabIndex={-1}>
        <div className="intro-block">
          <p>
            Whether you need a six-week MVP or a polished, production-grade
            interface, here's how I help founders ship. Not sure which one
            fits? That's exactly what the first call is for.
          </p>
        </div>

        <div className="section-header">
          <span className="section-num">Metrics</span>
          <h2>By the numbers</h2>
          <div className="section-rule" />
        </div>

        <div className="stats-grid">
          {services.map((s) =>
            s.metric ? (
              <div key={s.id} className="stat-box neutral">
                <span className="stat-label-top">{s.title}</span>
                <span className="stat-num medium">{s.metric.value}</span>
                <span className="stat-desc">{s.metric.label}</span>
              </div>
            ) : null
          )}
        </div>

        <div className="section-header">
          <span className="section-num">Services</span>
          <h2>Full service breakdown</h2>
          <div className="section-rule" />
        </div>

        <ul className="svc-accordion">
          {services.map((s, i) => {
            const open = openIndex === i
            return (
              <li key={s.id} className={`svc-item${open ? ' svc-item--open' : ''}`}>
                <button
                  type="button"
                  className="svc-trigger"
                  aria-expanded={open}
                  aria-controls={`svc-panel-${s.id}`}
                  onClick={() => setOpenIndex(open ? null : i)}
                >
                  <span className="svc-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="svc-name">{s.title}</span>
                  <span className="svc-arrow" aria-hidden="true">+</span>
                </button>
                {/* `grid-template-rows: 0fr` + `overflow: hidden` collapses the
                    panel VISUALLY only — a closed panel's "Start here" link
                    stayed in the tab order and the a11y tree, so keyboard focus
                    disappeared off-screen once per closed service. `inert`
                    removes closed panels from both while keeping their content
                    in the DOM for crawlers. */}
                <div
                  id={`svc-panel-${s.id}`}
                  className="svc-panel"
                  inert={!open}
                >
                  <div className="svc-panel-inner">
                    <div className="svc-panel-content">
                      <div>
                        <p className="svc-desc">{s.description}</p>
                        <span className="svc-sublabel">Features</span>
                        <ul className="svc-sublist">
                          {s.features.map((f) => (
                            <li key={f}>{f}</li>
                          ))}
                        </ul>
                        <span className="svc-meta">
                          Stack: {s.technologies.join(' · ')}
                          {s.metric && ` — ${s.metric.label}: ${s.metric.value}`}
                        </span>
                      </div>
                      <div>
                        <span className="svc-sublabel">Deliverables</span>
                        <ul className="svc-sublist">
                          {s.deliverables.map((d) => (
                            <li key={d}>{d}</li>
                          ))}
                        </ul>
                        <Link to="/contact" className="svc-cta">
                          Start here
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        <div className="chapter-divider">
          <span className="ornament">▸</span>
        </div>

        <div className="verdict-box context">
          <p>
            Wondering why not just have AI build it? Design, security, launch,
            and maintenance each need a dedicated human.{' '}
            <Link to="/why-not-ai">The honest case for working with a person →</Link>
          </p>
        </div>
      </main>

      <footer className="sources-section">
        <div className="container">
          <div className="sources-header">
            <h3>Service categories</h3>
            <div className="sources-header-rule" />
          </div>
          <ul className="source-list">
            {services.map((s) => (
              <li key={s.id}>
                <strong>{s.title}</strong>
                {s.metric ? `${s.metric.value} · ${s.metric.label}` : s.description}
              </li>
            ))}
          </ul>
          <SocialLinks />
        </div>
      </footer>
    </>
  )
}
