import { Link } from 'react-router'
import { SocialLinks } from '../components/SocialLinks/SocialLinks'
import { FooterNav } from '../components/FooterNav/FooterNav'
import { caseStudies } from '../data/case-studies'
import { PROJECT_COLORS } from '../data/project-colors'
import { RouteHead } from '../components/SEO/RouteHead'
import { META } from '../lib/seo'
import { PageHeader } from '../components/PageHeader/PageHeader'
import {
  LogoStlmnt,
  LogoPinpoint,
  LogoPayback,
  LogoRentHarbor,
  LogoFengShui,
  LogoYapUnited,
  LogoDrayage,
  LogoZoori,
  LogoHITLDI,
  LogoUnmasked,
  LogoTimeless,
  LogoPortfolio,
} from '../components/icons'

// Keyed by slug rather than array position. These used to be index-aligned
// with `caseStudies`, so reordering that array — or inserting an entry anywhere
// but the end — silently paired every later study with the wrong logo and
// eyebrow, and a study with no matching index rendered `undefined` as a
// component and crashed the page. That exact failure is recorded in Home.tsx's
// SERVICE_ICONS comment; ProjectDetail.tsx keys by slug for the same reason.
const PROJECT_LOGOS: Record<string, typeof LogoStlmnt> = {
  'stlmnt-settlement-tracker': LogoStlmnt,
  'pinpoint-civic-engagement': LogoPinpoint,
  'payback-consumer-intelligence': LogoPayback,
  'rentharbor-property-management': LogoRentHarbor,
  'feng-shui-room-analysis': LogoFengShui,
  'yap-united-live-translation': LogoYapUnited,
  'drayage-drivers': LogoDrayage,
  'zoori-pet-care': LogoZoori,
  'hitldi-platform': LogoHITLDI,
  'unmasked-coaching': LogoUnmasked,
  'timeless-coach-consult': LogoTimeless,
  'portfolio': LogoPortfolio,
}
const STUDY_LABELS: Record<string, string> = {
  'stlmnt-settlement-tracker': 'Settlements',
  'pinpoint-civic-engagement': 'Civic',
  'payback-consumer-intelligence': 'Privacy',
  'rentharbor-property-management': 'PropTech',
  'feng-shui-room-analysis': 'Spatial',
  'yap-united-live-translation': 'Translation',
  'drayage-drivers': 'Logistics',
  'zoori-pet-care': 'Pet Care',
  'hitldi-platform': 'Platform',
  'unmasked-coaching': 'Coaching',
  'timeless-coach-consult': 'Consulting',
  'portfolio': 'Portfolio',
}

export default function Work() {
  return (
    <>
      <RouteHead {...META['/work']} />

      <PageHeader>
        <header className="masthead">
          <p className="overline">An App Idea LLC · Shipped products</p>
          <h1>Work</h1>
          <p className="date-line">Twelve shipped products</p>
        </header>
      </PageHeader>

      <main className="container" id="main-content" tabIndex={-1}>
        <div className="intro-block">
          <p>
            Twelve products shipped end-to-end: mobile apps, logistics tools,
            data platforms, and client sites. Interface, backend, auth, CI, and
            deploy. Each one solves a real workflow rather than showcasing a trick.
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
            <span className="stat-num large">12</span>
            <span className="stat-desc">Mobile · Web · Data</span>
          </div>
          <div className="stat-box positive">
            <span className="stat-label-top">Longest solo build</span>
            <span className="stat-num medium">12 months</span>
            <span className="stat-desc">The Pinpoint App: civic platform</span>
          </div>
          <div className="stat-box neutral">
            <span className="stat-label-top">Languages supported</span>
            <span className="stat-num large">37</span>
            <span className="stat-desc">The Yap App: live translation</span>
          </div>
        </div>

        <div className="section-header">
          <span className="section-num">Case studies</span>
          <h2>Twelve shipped products</h2>
          <div className="section-rule" />
        </div>

        {caseStudies.map((c) => {
          const ProjectLogo = PROJECT_LOGOS[c.slug] ?? LogoPinpoint
          return (
            <Link key={c.slug} to={`/work/${c.slug}`} className="feature-item feature-item--linked">
              <div
                className={`feature-icon app-mark${c.icon ? ' app-mark--photo' : ''}`}
                style={c.icon ? undefined : { background: PROJECT_COLORS[c.slug] }}
              >
                {c.icon ? (
                  <img src={c.icon} alt="" className="app-mark-img" loading="lazy" />
                ) : (
                  <ProjectLogo size={22} color="white" strokeWidth={1.75} />
                )}
              </div>
              <div className="feature-body">
                <span className="feature-eyebrow">{STUDY_LABELS[c.slug] ?? c.category}</span>
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
                <span className="feature-cta">View case study</span>
              </div>
            </Link>
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
          <FooterNav />
          <SocialLinks />
        </div>
      </footer>
    </>
  )
}
