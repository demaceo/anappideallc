import { Link } from 'react-router'
import { caseStudies } from '../data/case-studies'
import { RouteHead } from '../components/SEO/RouteHead'
import { META } from '../lib/seo'
import { PageHeader } from '../components/PageHeader/PageHeader'
import {
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

const PROJECT_LOGOS = [
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
]
const STUDY_COLORS = [
  '#2980b9',
  '#1a3a5c',
  '#2563EB', // RentHarbor — proptech blue
  '#C44536', // Feng Shui — sumi-e cinnabar
  '#8e44ad',
  '#c0392b',
  '#F4533C', // Zoori — coral
  '#2c3e50',
  '#8B4C99', // Unmasked — silk purple
  '#2D4A3E', // Timeless — forest
  '#2980b9',
] as const
const STUDY_LABELS = [
  'Civic',
  'Privacy',
  'PropTech',
  'Spatial',
  'Translation',
  'Logistics',
  'Pet Care',
  'Platform',
  'Coaching',
  'Consulting',
  'Portfolio',
] as const

export default function Work() {
  return (
    <>
      <RouteHead {...META['/work']} />

      <PageHeader>
        <header className="masthead">
          <p className="overline">An App Idea LLC · Shipped products</p>
          <h1>Work</h1>
          <p className="date-line">Eleven shipped products</p>
        </header>
      </PageHeader>

      <main className="container">
        <div className="intro-block">
          <p>
            Eleven products shipped end-to-end: mobile apps, logistics tools,
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
            <span className="stat-num large">11</span>
            <span className="stat-desc">Mobile · Web · Data</span>
          </div>
          <div className="stat-box positive">
            <span className="stat-label-top">Longest solo build</span>
            <span className="stat-num medium">12 months</span>
            <span className="stat-desc">Pinpoint: civic platform</span>
          </div>
          <div className="stat-box neutral">
            <span className="stat-label-top">Languages supported</span>
            <span className="stat-num large">15</span>
            <span className="stat-desc">Yap United: live translation</span>
          </div>
        </div>

        <div className="section-header">
          <span className="section-num">Case studies</span>
          <h2>Eleven shipped products</h2>
          <div className="section-rule" />
        </div>

        {caseStudies.map((c, i) => {
          const ProjectLogo = PROJECT_LOGOS[i]
          return (
            <Link key={c.slug} to={`/work/${c.slug}`} className="feature-item feature-item--linked">
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
                <span className="feature-cta">View case study →</span>
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
        </div>
      </footer>
    </>
  )
}
