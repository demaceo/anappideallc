import { Link } from 'react-router'
import { SocialLinks } from '../components/SocialLinks/SocialLinks'
import { services } from '../data/services'
import { RouteHead } from '../components/SEO/RouteHead'
import { META } from '../lib/seo'
import { IconZap, IconLayers, IconGlobe, IconBarChart } from '../components/icons'
import { PageHeader } from '../components/PageHeader/PageHeader'

const SERVICE_ICONS = [IconZap, IconLayers, IconGlobe, IconBarChart]
const SERVICE_ICON_CLASSES = ['icon-green', 'icon-blue', 'icon-teal', 'icon-orange'] as const

export default function Services() {
  return (
    <>
      <RouteHead {...META['/services']} />

      <PageHeader>
        <header className="masthead">
          <p className="overline">An App Idea LLC · What I build</p>
          <h1>Services</h1>
          <p className="date-line">Four ways I can help</p>
        </header>
      </PageHeader>

      <main className="container">
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

        {services.map((s, i) => {
          const ServiceIcon = SERVICE_ICONS[i]
          return (
            <div key={s.id} className="feature-item">
              <div className={`feature-icon ${SERVICE_ICON_CLASSES[i]}`}>
                <ServiceIcon size={20} />
              </div>
              <div className="feature-body">
                {s.metric && (
                  <span className="feature-eyebrow">
                    {s.metric.label} · {s.metric.value}
                  </span>
                )}
                <h3 className="feature-title">{s.title}</h3>
                <p>{s.description}</p>
                <span className="bubble-subtitle">Features</span>
                <ul>
                  {s.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <span className="bubble-subtitle">Deliverables</span>
                <ul>
                  {s.deliverables.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
                <span className="mono-meta">Stack: {s.technologies.join(' · ')}</span>
              </div>
            </div>
          )
        })}

        <div className="chapter-divider">
          <span className="ornament">✦ ✦ ✦</span>
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
