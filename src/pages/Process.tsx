import { processSteps } from '../data/process'
import { SocialLinks } from '../components/SocialLinks/SocialLinks'
import { FooterNav } from '../components/FooterNav/FooterNav'
import { RouteHead } from '../components/SEO/RouteHead'
import { META } from '../lib/seo'
import { IconSearch, IconEdit, IconTerminal, IconSend, IconKey } from '../components/icons'
import { PageHeader } from '../components/PageHeader/PageHeader'
import { VerdictBox } from '../components/VerdictBox/VerdictBox'
import { TimelineScene } from '../components/scenes/TimelineScene'
import { StoryChapter, StoryNext } from '../components/StoryChapter/StoryChapter'
import { NextStep } from '../components/NextStep/NextStep'

// Keyed by ProcessStep.step, which is already a stable discriminator in the
// data, rather than by array position — index-aligned lookups mispair every
// later entry on a reorder and render `undefined` as a component if the list
// grows. Same reason Home.tsx keys SERVICE_ICONS by id.
const PROCESS_META: Record<string, { Icon: typeof IconSearch; iconClass: string }> = {
  '01': { Icon: IconSearch,   iconClass: 'icon-navy'   },
  '02': { Icon: IconEdit,     iconClass: 'icon-purple' },
  '03': { Icon: IconTerminal, iconClass: 'icon-green'  },
  '04': { Icon: IconSend,     iconClass: 'icon-orange' },
  '05': { Icon: IconKey,      iconClass: 'icon-gold'   },
}
const PROCESS_FALLBACK = { Icon: IconSearch, iconClass: 'icon-navy' }

export default function Process() {
  return (
    <>
      <RouteHead {...META['/process']} />

      <PageHeader>
        <header className="masthead">
          <p className="overline">An App Idea LLC · How it works</p>
          <h1>Process</h1>
          <p className="date-line">Talk it through → See it → Build it → Go live → Hand it over</p>
        </header>
      </PageHeader>

      <main className="container" id="main-content" tabIndex={-1}>
        <div className="intro-block">
          <p>
            Five steps, one builder. Every step ends with something you can see
            and react to, so you're never guessing where your project stands.
            The last one makes sure you can run it yourself.
          </p>
        </div>

        <div className="split">
          <StoryChapter id="handoff" />
          <TimelineScene />
        </div>

        <div className="section-header">
          <span className="section-num">Timeline</span>
          <h2>How long it takes</h2>
          <div className="section-rule" />
        </div>

        <div className="stats-grid">
          <div className="stat-box positive">
            <span className="stat-label-top">A business website</span>
            <span className="stat-num medium">3–5 weeks</span>
            <span className="stat-desc">From the first call to launch</span>
          </div>
          <div className="stat-box neutral">
            <span className="stat-label-top">An app or custom build</span>
            <span className="stat-num medium">7–13 weeks</span>
            <span className="stat-desc">To build, plus 1–2 weeks to launch</span>
          </div>
          <div className="stat-box neutral">
            <span className="stat-label-top">Setting up your own site</span>
            <span className="stat-num medium">One session</span>
            <span className="stat-desc">Wix or Squarespace, plus Google Maps</span>
          </div>
        </div>

        <div className="section-header">
          <span className="section-num">Steps</span>
          <h2>How each step works</h2>
          <div className="section-rule" />
        </div>

        <div className="grid-2">
        {processSteps.map((p) => {
          const { Icon: ProcessIcon, iconClass } = PROCESS_META[p.step] ?? PROCESS_FALLBACK
          return (
            <div key={p.step} className="feature-item">
              <div className={`feature-icon ${iconClass}`}>
                <ProcessIcon size={20} />
              </div>
              <div className="feature-body">
                <span className="feature-eyebrow">Step {p.step}</span>
                <h3 className="feature-title">{p.title}</h3>
                <p className="phase-times">
                  <span>Website: {p.siteTimeline}</span>
                  <span>App or custom build: {p.timeline}</span>
                </p>
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
        </div>

        <VerdictBox variant="assessment">
          <p>
            Every step ends with something you can see, so you're never left
            wondering what got done or what comes next. You see all of it,
            without having to check in on me to find out.
          </p>
        </VerdictBox>

        <NextStep
          heading="Step zero is a free call"
          blurb="Before Step 1 starts, we talk it through: what you need, who it's for, and whether I'm the right fit."
        />

        <StoryNext id="handoff" />
      </main>

      <footer className="sources-section">
        <div className="container">
          <div className="sources-header">
            <h3>Process steps</h3>
            <div className="sources-header-rule" />
          </div>
          <ul className="source-list">
            {processSteps.map((p) => (
              <li key={p.step}>
                <strong>Step {p.step}: {p.title}</strong>
                Website: {p.siteTimeline} · App: {p.timeline}
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
