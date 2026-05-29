import { SITE } from '../data/site'
import { differentiators } from '../data/case-studies'
import { RouteHead } from '../components/SEO/RouteHead'
import { META } from '../lib/seo'
import { IconKey, IconCode, IconShieldCheck, IconLock } from '../components/icons'
import { PageHeader } from '../components/PageHeader/PageHeader'

const DIFF_ICONS = [IconKey, IconCode, IconShieldCheck, IconLock]
const DIFF_ICON_CLASSES = ['icon-gold', 'icon-blue', 'icon-green', 'icon-navy'] as const
const DIFF_EYEBROWS = ['Ownership', 'Engineering', 'Discipline', 'Privacy'] as const

export default function About() {
  return (
    <>
      <RouteHead {...META['/about']} />

      <PageHeader>
        <header className="masthead">
          <p className="overline">Dev Studio · {SITE.founder.location}</p>
          <h1><em>Founder-led,</em> Denver-based.</h1>
          <p className="subtitle">
            {SITE.name} — run by {SITE.founder.name}.
            One builder from interface to deploy.
          </p>
          <p className="date-line">About the studio</p>
        </header>
      </PageHeader>

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

        {differentiators.map((d, i) => {
          const DiffIcon = DIFF_ICONS[i]
          return (
            <div key={d.title} className="feature-item">
              <div className={`feature-icon ${DIFF_ICON_CLASSES[i]}`}>
                <DiffIcon size={20} />
              </div>
              <div className="feature-body">
                <span className="feature-eyebrow">{DIFF_EYEBROWS[i]}</span>
                <h3 className="feature-title">{d.title}</h3>
                <p>{d.description}</p>
              </div>
            </div>
          )
        })}

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
