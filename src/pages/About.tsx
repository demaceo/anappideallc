import { SITE } from '../data/site'
import { differentiators } from '../data/case-studies'
import { RouteHead } from '../components/SEO/RouteHead'
import { META } from '../lib/seo'

const DIFFERENTIATOR_ICONS = ['🏗️', '🔧', '🚀', '🔒'] as const
const DIFFERENTIATOR_COLORS = ['#b8860b', '#2980b9', '#27ae60', '#1a3a5c'] as const
const DIFFERENTIATOR_BUBBLES = ['bubble-gold', 'bubble-blue', 'bubble-green', 'bubble-navy'] as const
const DIFFERENTIATOR_LABELS = ['Ownership', 'Engineering', 'Discipline', 'Privacy'] as const

export default function About() {
  return (
    <>
      <RouteHead {...META['/about']} />

      <header className="masthead">
        <p className="overline">Dev Studio · {SITE.founder.location}</p>
        <h1><em>Founder-led,</em> Denver-based.</h1>
        <p className="subtitle">
          {SITE.name} — run by {SITE.founder.name}.
          One builder from interface to deploy.
        </p>
        <p className="date-line">About the studio</p>
      </header>

      <main className="container">
        <div className="intro-block">
          <p>
            {SITE.name} is a dev studio in {SITE.founder.location}, run by{' '}
            {SITE.founder.name}. I help founders take an app or website idea
            from sketch to shipped product — interface, backend, and the
            operational plumbing that makes it credible.
          </p>
        </div>

        <div className="section-header">
          <span className="section-num">Differentiators</span>
          <h2>What sets the work apart</h2>
          <div className="section-rule" />
        </div>

        {differentiators.map((d, i) => (
          <div key={d.title} className="dialogue-entry">
            <div className="speaker-card">
              <div
                className="speaker-icon"
                style={{ background: DIFFERENTIATOR_COLORS[i] }}
              >
                {DIFFERENTIATOR_ICONS[i]}
              </div>
              <div className="speaker-name">{DIFFERENTIATOR_LABELS[i]}</div>
            </div>
            <div className={`speech-bubble ${DIFFERENTIATOR_BUBBLES[i]}`}>
              <h3 className="bubble-title">{d.title}</h3>
              <p>{d.description}</p>
            </div>
          </div>
        ))}

        <div className="chapter-divider">
          <span className="ornament">✦ ✦ ✦</span>
        </div>

        <div className="section-header">
          <span className="section-num">Philosophy</span>
          <h2>How the work gets done</h2>
          <div className="section-rule" />
        </div>

        <div className="pullquote">
          <p>
            "Every build includes CI, secret scanning, monitoring, and release
            processes. The product ships ready for real users, not just a demo
            audience."
          </p>
          <span className="attrib">— {SITE.founder.name}, on shipping discipline</span>
        </div>

        <div className="verdict-box">
          <p>
            You work directly with the person building your product. Interface
            design, database architecture, auth, API security, and deployment
            pipelines — all from the same builder. Nothing gets outsourced or
            glossed over.
          </p>
        </div>
      </main>

      <footer className="sources-section">
        <div className="container">
          <div className="sources-header">
            <h3>Studio</h3>
            <div className="sources-header-rule" />
          </div>
          <ul className="source-list">
            <li>
              <strong>Founder</strong>
              {SITE.founder.name} · {SITE.founder.location}
            </li>
            <li>
              <strong>Studio</strong>
              {SITE.name}
            </li>
            <li>
              <strong>Contact</strong>
              {SITE.email}
            </li>
            <li>
              <strong>Approach</strong>
              Founder-led · end-to-end engineering
            </li>
          </ul>
        </div>
      </footer>
    </>
  )
}
