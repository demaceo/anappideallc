import { services } from '../data/services'
import { RouteHead } from '../components/SEO/RouteHead'
import { META } from '../lib/seo'

const SERVICE_ICONS = ['🚀', '⚡', '🌐', '📊'] as const
const SERVICE_COLORS = ['#27ae60', '#2980b9', '#16a085', '#d35400'] as const
const BUBBLE_CLASSES = ['bubble-green', 'bubble-blue', 'bubble-teal', 'bubble-orange'] as const

export default function Services() {
  return (
    <>
      <RouteHead {...META['/services']} />

      <header className="masthead">
        <p className="overline">An App Idea LLC · What I build</p>
        <h1>Services</h1>
        <p className="subtitle">
          From a 6-week MVP to a production-grade interface. Here's what I help
          founders ship.
        </p>
        <p className="date-line">Four service categories</p>
      </header>

      <main className="container">
        <div className="intro-block">
          <p>
            From a 6-week MVP to a production-grade interface, here's what I
            help founders ship.
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

        {services.map((s, i) => (
          <div key={s.id} className="dialogue-entry">
            <div className="speaker-card">
              <div
                className="speaker-icon"
                style={{ background: SERVICE_COLORS[i] }}
              >
                {SERVICE_ICONS[i]}
              </div>
              <div className="speaker-name">{s.metric?.value ?? '—'}</div>
            </div>
            <div className={`speech-bubble ${BUBBLE_CLASSES[i]}`}>
              <h3 className="bubble-title">{s.title}</h3>
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
        ))}
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
                {s.metric ? `${s.metric.value} — ${s.metric.label}` : s.description}
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </>
  )
}
