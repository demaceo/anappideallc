import { caseStudies } from '../data/case-studies'
import { RouteHead } from '../components/SEO/RouteHead'
import { META } from '../lib/seo'
import { SiteNav } from '../components/SiteNav/SiteNav'
import {
  LogoPinpoint,
  LogoPayback,
  LogoRentHarbor,
  LogoFengShui,
  LogoYapUnited,
} from '../components/icons'

const PROJECT_LOGOS = [LogoPinpoint, LogoPayback, LogoRentHarbor, LogoFengShui, LogoYapUnited]
const STUDY_COLORS = ['#2980b9', '#1a3a5c', '#27ae60', '#d35400', '#8e44ad'] as const
const STUDY_LABELS = ['Civic', 'Privacy', 'PropTech', 'Spatial', 'Translation'] as const

export default function Work() {
  return (
    <>
      <RouteHead {...META['/work']} />

      <header className="masthead">
        <p className="overline">An App Idea LLC · Shipped products</p>
        <h1>Work</h1>
        <p className="subtitle">
          Five products shipped end-to-end — interface, backend, auth,
          payments, moderation, and deploy.
        </p>
        <p className="date-line">Five solo builds</p>
      </header>

      <SiteNav />

      <main className="container">
        <div className="intro-block">
          <p>
            Five products shipped end-to-end — interface, backend, auth,
            payments, moderation, and deploy. Each one solves a real workflow
            rather than showcasing a trick.
          </p>
        </div>

        <div className="section-header">
          <span className="section-num">Scale</span>
          <h2>At a glance</h2>
          <div className="section-rule" />
        </div>

        <div className="stats-grid">
          <div className="stat-box neutral">
            <span className="stat-label-top">Products shipped</span>
            <span className="stat-num large">5</span>
            <span className="stat-desc">iOS · Android · Web</span>
          </div>
          <div className="stat-box positive">
            <span className="stat-label-top">Longest solo build</span>
            <span className="stat-num medium">12 months</span>
            <span className="stat-desc">Pinpoint — civic platform</span>
          </div>
          <div className="stat-box neutral">
            <span className="stat-label-top">Languages supported</span>
            <span className="stat-num large">15</span>
            <span className="stat-desc">Yap United — live translation</span>
          </div>
        </div>

        <div className="section-header">
          <span className="section-num">Case studies</span>
          <h2>Five shipped products</h2>
          <div className="section-rule" />
        </div>

        {caseStudies.map((c, i) => {
          const ProjectLogo = PROJECT_LOGOS[i]
          return (
            <div key={c.slug} className="feature-item">
              <div
                className="feature-icon app-mark"
                style={{ background: STUDY_COLORS[i] }}
              >
                <ProjectLogo size={22} color="white" strokeWidth={1.75} />
              </div>
              <div className="feature-body">
                <span className="feature-eyebrow">{STUDY_LABELS[i]}</span>
                <h3 className="feature-title">{c.title}</h3>
                <p>{c.summary}</p>
                <span className="bubble-subtitle">Outcomes</span>
                <ul>
                  {c.outcomes.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
                <div className="stat-row">
                  {c.stats.map((s) => (
                    <span key={s.label} className="stat-pill">
                      <strong>{s.label}:</strong> {s.value}
                    </span>
                  ))}
                </div>
                <span className="mono-meta">Stack: {c.stack.join(' · ')}</span>
                {(c.liveUrl || c.repoUrl) && (
                  <span className="mono-meta">
                    {c.liveUrl && (
                      <a href={c.liveUrl} target="_blank" rel="noopener noreferrer">
                        Live site
                      </a>
                    )}
                    {c.liveUrl && c.repoUrl && ' · '}
                    {c.repoUrl && (
                      <a href={c.repoUrl} target="_blank" rel="noopener noreferrer">
                        Repository
                      </a>
                    )}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </main>

      <footer className="sources-section">
        <div className="container">
          <div className="sources-header">
            <h3>Case studies</h3>
            <div className="sources-header-rule" />
          </div>
          <ul className="source-list">
            {caseStudies.map((c) => (
              <li key={c.slug}>
                <strong>{c.title} — {c.category}</strong>
                {c.summary.slice(0, 80)}…
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </>
  )
}
