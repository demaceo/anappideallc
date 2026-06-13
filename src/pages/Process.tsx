import { processSteps } from '../data/process'
import { RouteHead } from '../components/SEO/RouteHead'
import { META } from '../lib/seo'
import { IconSearch, IconEdit, IconTerminal, IconSend } from '../components/icons'
import { PageHeader } from '../components/PageHeader/PageHeader'

const PROCESS_ICONS = [IconSearch, IconEdit, IconTerminal, IconSend]
const PROCESS_ICON_CLASSES = ['icon-navy', 'icon-purple', 'icon-green', 'icon-orange'] as const

export default function Process() {
  return (
    <>
      <RouteHead {...META['/process']} />

      <PageHeader>
        <header className="masthead">
          <p className="overline">An App Idea LLC · How we work</p>
          <h1>Process</h1>
          <p className="date-line">Discovery → Design → Dev → Launch</p>
        </header>
      </PageHeader>

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
            <span className="stat-label-top">Phase 1: Discovery</span>
            <span className="stat-num medium">1–2 weeks</span>
            <span className="stat-desc">Strategy · architecture · scope</span>
          </div>
          <div className="stat-box neutral">
            <span className="stat-label-top">Phase 2: Design</span>
            <span className="stat-num medium">2–3 weeks</span>
            <span className="stat-desc">Prototypes · design system</span>
          </div>
          <div className="stat-box positive">
            <span className="stat-label-top">Phase 3: Development</span>
            <span className="stat-num medium">4–8 weeks</span>
            <span className="stat-desc">Sprint builds · testing</span>
          </div>
        </div>

        <div className="section-header">
          <span className="section-num">Phases</span>
          <h2>How each phase works</h2>
          <div className="section-rule" />
        </div>

        {processSteps.map((p, i) => {
          const ProcessIcon = PROCESS_ICONS[i]
          return (
            <div key={p.step} className="feature-item">
              <div className={`feature-icon ${PROCESS_ICON_CLASSES[i]}`}>
                <ProcessIcon size={20} />
              </div>
              <div className="feature-body">
                <span className="feature-eyebrow">Phase {p.step} · {p.timeline}</span>
                <h3 className="feature-title">{p.title}</h3>
                <p>{p.description}</p>
                <span className="bubble-subtitle">Steps</span>
                <ul>
                  {p.substeps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <span className="bubble-subtitle">Deliverables</span>
                <ul>
                  {p.deliverables.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })}

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
                <strong>Phase {p.step}: {p.title}</strong>
                {p.timeline} · {p.deliverables.length} deliverables
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </>
  )
}
