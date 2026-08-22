import { processSteps } from '../data/process'
import { SocialLinks } from '../components/SocialLinks/SocialLinks'
import { FooterNav } from '../components/FooterNav/FooterNav'
import { RouteHead } from '../components/SEO/RouteHead'
import { META } from '../lib/seo'
import { IconSearch, IconEdit, IconTerminal, IconSend } from '../components/icons'
import { PageHeader } from '../components/PageHeader/PageHeader'
import { VerdictBox } from '../components/VerdictBox/VerdictBox'

// Keyed by ProcessStep.step, which is already a stable discriminator in the
// data, rather than by array position — index-aligned lookups mispair every
// later entry on a reorder and render `undefined` as a component if the list
// grows. Same reason Home.tsx keys SERVICE_ICONS by id.
const PROCESS_META: Record<string, { Icon: typeof IconSearch; iconClass: string }> = {
  '01': { Icon: IconSearch,   iconClass: 'icon-navy'   },
  '02': { Icon: IconEdit,     iconClass: 'icon-purple' },
  '03': { Icon: IconTerminal, iconClass: 'icon-green'  },
  '04': { Icon: IconSend,     iconClass: 'icon-orange' },
}
const PROCESS_FALLBACK = { Icon: IconSearch, iconClass: 'icon-navy' }

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

      <main className="container" id="main-content" tabIndex={-1}>
        <div className="intro-block">
          <p>
            Four phases, one builder. Every phase ends with something tangible
            you can hold up and react to, so you're never guessing where your
            project stands.
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

        {processSteps.map((p) => {
          const { Icon: ProcessIcon, iconClass } = PROCESS_META[p.step] ?? PROCESS_FALLBACK
          return (
            <div key={p.step} className="feature-item">
              <div className={`feature-icon ${iconClass}`}>
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

        <VerdictBox variant="assessment">
          <p>
            Every phase ends with something concrete, so you're never left
            wondering what got done or what comes next. You get full visibility
            into the build, without having to micromanage to get it.
          </p>
        </VerdictBox>
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
          <FooterNav />
          <SocialLinks />
        </div>
      </footer>
    </>
  )
}
