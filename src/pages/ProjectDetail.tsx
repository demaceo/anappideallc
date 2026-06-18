import { useParams, Link, Navigate } from 'react-router'
import { getCaseStudyBySlug, getAdjacentCaseStudies } from '../data/case-studies'
import { RouteHead } from '../components/SEO/RouteHead'
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
import { StlmntUnderTheHood } from '../components/StlmntUnderTheHood/StlmntUnderTheHood'

const SLUG_TO_LOGO: Record<string, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
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

const SLUG_TO_COLOR: Record<string, string> = {
  'stlmnt-settlement-tracker': '#1f6b3b',
  'pinpoint-civic-engagement': '#8A1C1C',
  'payback-consumer-intelligence': '#1a3a5c',
  'rentharbor-property-management': '#2563EB',
  'feng-shui-room-analysis': '#C44536',
  'yap-united-live-translation': '#0E7C86',
  'drayage-drivers': '#c0392b',
  'zoori-pet-care': '#F4533C',
  'hitldi-platform': '#2c3e50',
  'unmasked-coaching': '#8B4C99',
  'timeless-coach-consult': '#2D4A3E',
  'portfolio': '#2980b9',
}

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const project = slug ? getCaseStudyBySlug(slug) : null

  if (!project) return <Navigate to="/work" replace />

  const { prev, next } = getAdjacentCaseStudies(project.slug)

  const ProjectLogo = SLUG_TO_LOGO[project.slug] ?? LogoPinpoint
  const color = project.theme?.mark ?? SLUG_TO_COLOR[project.slug] ?? '#2980b9'

  // When a project ships its own theme, scope its accent colors to the detail
  // page body via CSS custom properties (the editorial --accent/--gold), and
  // expose a `data-project-theme` hook for the signature cover-block treatment
  // in globals.css. Untouched projects keep the default Editorial Ink palette.
  const themeStyle = project.theme
    ? ({
        '--accent': project.theme.accent,
        '--gold': project.theme.gold,
        ...(project.theme.gradient ? { '--project-gradient': project.theme.gradient } : {}),
      } as React.CSSProperties)
    : undefined

  return (
    <>
      <RouteHead
        path={`/work/${project.slug}`}
        title={`${project.title} — ${project.category} | An App Idea LLC`}
        description={project.metaDescription}
      />

      <PageHeader>
        <header className="masthead">
          <p className="overline">
            <Link to="/work">Work</Link>
            {' · '}
            {project.category}
          </p>
          <div className="project-study-nav">
            {prev && (
              <Link
                to={`/work/${prev.slug}`}
                className="project-study-arrow project-study-arrow--prev"
                aria-label={`Previous: ${prev.title}`}
                title={prev.title}
              >
                {'<'}
              </Link>
            )}

            <div className="project-detail-hero">
              <div
                className={`project-detail-mark${project.icon ? ' project-detail-mark--photo' : ''}`}
                style={project.icon ? undefined : { background: color }}
              >
                {project.icon ? (
                  <img src={project.icon} alt="" className="app-mark-img" />
                ) : (
                  <ProjectLogo size={30} color="white" strokeWidth={1.5} />
                )}
              </div>
              <h1>{project.title}</h1>
            </div>

            {next && (
              <Link
                to={`/work/${next.slug}`}
                className="project-study-arrow project-study-arrow--next"
                aria-label={`Next: ${next.title}`}
                title={next.title}
              >
                {'>'}
              </Link>
            )}
          </div>
          <p className="date-line">{project.cover.eyebrow}</p>
        </header>
      </PageHeader>

      <main
        className="container"
        style={themeStyle}
        data-project-theme={project.theme ? project.slug : undefined}
      >

        {/* Cover headline + chips */}
        <div className="project-cover-block">
          <p className="project-cover-headline">{project.cover.headline}</p>
          <div className="project-chips">
            {project.cover.chips.map((chip) => (
              <span key={chip} className="project-chip">{chip}</span>
            ))}
          </div>
        </div>

        {/* Key metrics row */}
        {project.cover.metrics.length > 0 && (
          <div className="project-metrics-row">
            {project.cover.metrics.map((m) => (
              <div key={m.label} className="project-metric-cell">
                <span className="project-metric-value">{m.value}</span>
                <span className="project-metric-label">{m.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Stats bar */}
        <div className="project-stats-bar">
          {project.stats.map((s) => (
            <div key={s.label} className="project-stat-item">
              <span className="project-stat-label">{s.label}</span>
              <span className="project-stat-value">{s.value}</span>
            </div>
          ))}
        </div>

        {/* Problem / Approach / Outcome sections */}
        {project.sections.map((section) => (
          <div key={section.title} className="project-section">
            <div className="section-header">
              <span className="section-num">{section.title}</span>
              <h2>{section.title === 'Problem' ? 'The challenge' : section.title === 'Approach' ? 'How we built it' : 'What shipped'}</h2>
              <div className="section-rule" />
            </div>
            <p className="project-section-body">{section.content}</p>
          </div>
        ))}

        {/* Outcomes */}
        <div className="project-section">
          <div className="section-header">
            <span className="section-num">Results</span>
            <h2>Outcomes</h2>
            <div className="section-rule" />
          </div>
          <ul className="project-outcomes">
            {project.outcomes.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </div>

        {/* Under the hood — a refactored STLMNT admin visualization, on-theme */}
        {project.slug === 'stlmnt-settlement-tracker' && (
          <div className="project-section">
            <div className="section-header">
              <span className="section-num">Under the hood</span>
              <h2>The claims pipeline</h2>
              <div className="section-rule" />
            </div>
            <p className="project-section-body">
              STLMNT's admin dashboard tracks every claim through its lifecycle — saved, filed,
              confirmed, approved, paid, with rejected as a terminal state. Here is that
              claims-by-status visualization, refactored from the app for the web and wearing
              STLMNT's own Editorial Ink palette.
            </p>
            <StlmntUnderTheHood />
          </div>
        )}

        {/* Tech stack */}
        <div className="project-section">
          <div className="section-header">
            <span className="section-num">Engineering</span>
            <h2>Tech stack</h2>
            <div className="section-rule" />
          </div>
          <div className="project-stack-grid">
            {project.stack.map((tech) => (
              <span key={tech} className="project-stack-pill">{tech}</span>
            ))}
          </div>
        </div>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="project-tags-row">
            {project.tags.map((tag) => (
              <span key={tag} className="project-tag">{tag}</span>
            ))}
          </div>
        )}

        {/* Links */}
        {(project.liveUrl || project.repoUrl || (project.resourceLinks && project.resourceLinks.length > 0)) && (
          <div className="project-section">
            <div className="section-header">
              <span className="section-num">Links</span>
              <h2>Resources</h2>
              <div className="section-rule" />
            </div>
            <div className="project-links">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="project-link-btn">
                  Live site ↗
                </a>
              )}
              {project.repoUrl && (
                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="project-link-btn secondary">
                  Repository ↗
                </a>
              )}
              {project.resourceLinks?.map((r) => (
                <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer" className="project-link-btn secondary">
                  {r.label} ↗
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Back nav */}
        <div className="project-back-nav">
          <Link to="/work" className="project-back-link">← All work</Link>
          <span className="project-tag">{project.category}</span>
        </div>

      </main>
    </>
  )
}
