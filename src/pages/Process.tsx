import { processSteps } from '../data/process'
import { RouteHead } from '../components/SEO/RouteHead'
import { META } from '../lib/seo'

const STEP_ICONS = ['🔍', '🎨', '⚙️', '🚀'] as const
const STEP_COLORS = ['#1a3a5c', '#8e44ad', '#27ae60', '#d35400'] as const
const BUBBLE_CLASSES = ['bubble-navy', 'bubble-purple', 'bubble-green', 'bubble-orange'] as const

export default function Process() {
  return (
    <>
      <RouteHead {...META['/process']} />

      <header className="masthead">
        <p className="overline">An App Idea LLC · How we work</p>
        <h1>Process</h1>
        <p className="subtitle">
          Four phases, one builder. Each step ends with a tangible deliverable
          so you always know where the project stands.
        </p>
        <p className="date-line">Discovery → Design → Dev → Launch</p>
      </header>

      <main className="container">
        <div className="intro-block">
          <p>
            Four phases, one builder. Each step ends with a tangible deliverable
            so you always know where the project stands.
          </p>
        </div>

        <div className="section-header">
          <span className="section-num">Timeline</span>
          <h2>Typical engagement</h2>
          <div className="section-rule" />
        </div>

        <div className="stats-grid">
          <div className="stat-box neutral">
            <span className="stat-label-top">Phase 1 — Discovery</span>
            <span className="stat-num medium">1–2 weeks</span>
            <span className="stat-desc">Strategy · architecture · scope</span>
          </div>
          <div className="stat-box neutral">
            <span className="stat-label-top">Phase 2 — Design</span>
            <span className="stat-num medium">2–3 weeks</span>
            <span className="stat-desc">Prototypes · design system</span>
          </div>
          <div className="stat-box positive">
            <span className="stat-label-top">Phase 3 — Development</span>
            <span className="stat-num medium">4–8 weeks</span>
            <span className="stat-desc">Sprint builds · testing</span>
          </div>
        </div>

        <div className="section-header">
          <span className="section-num">Phases</span>
          <h2>How each phase works</h2>
          <div className="section-rule" />
        </div>

        {processSteps.map((p, i) => (
          <div key={p.step} className="dialogue-entry">
            <div className="speaker-card">
              <div
                className="speaker-icon"
                style={{ background: STEP_COLORS[i] }}
              >
                {STEP_ICONS[i]}
              </div>
              <div className="speaker-name">
                {p.step} · {p.timeline}
              </div>
            </div>
            <div className={`speech-bubble ${BUBBLE_CLASSES[i]}`}>
              <p><strong>{p.title}</strong></p>
              <p>{p.description}</p>
              <ul>
                {p.substeps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        <div className="chapter-divider">
          <span className="ornament">✦ ✦ ✦</span>
        </div>

        <div className="section-header">
          <span className="section-num">Deliverables</span>
          <h2>What you receive</h2>
          <div className="section-rule" />
        </div>

        {processSteps.map((p, i) => (
          <div key={`del-${p.step}`} className="dialogue-entry">
            <div className="speaker-card">
              <div
                className="speaker-icon"
                style={{ background: STEP_COLORS[i] }}
              >
                {STEP_ICONS[i]}
              </div>
              <div className="speaker-name">{p.title.split(' ')[0]}</div>
            </div>
            <div className={`speech-bubble ${BUBBLE_CLASSES[i]}`}>
              <p>
                <strong>Phase {p.step} — {p.title}</strong>
              </p>
              <ul>
                {p.deliverables.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        <div className="verdict-box">
          <p>
            Every phase ends with a concrete deliverable. You'll never be left
            wondering what's been done or what comes next. The process is
            designed for founders who want full visibility without micromanaging.
          </p>
        </div>
      </main>

      <footer className="sources-section">
        <div className="container">
          <div className="sources-header">
            <h3>Process phases</h3>
            <div className="sources-header-rule" />
          </div>
          <ul className="source-list">
            {processSteps.map((p) => (
              <li key={p.step}>
                <strong>Phase {p.step} — {p.title}</strong>
                {p.timeline} · {p.deliverables.length} deliverables
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </>
  )
}
