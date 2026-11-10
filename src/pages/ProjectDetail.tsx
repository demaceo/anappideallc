import { useParams, Link, Navigate } from 'react-router'
import { getCaseStudyBySlug, getAdjacentCaseStudies } from '../data/case-studies'
import { PROJECT_COLORS } from '../data/project-colors'
import { RouteHead } from '../components/SEO/RouteHead'
import { META } from '../lib/seo'
import { PageHeader } from '../components/PageHeader/PageHeader'
import { NextStep } from '../components/NextStep/NextStep'
import { Marquee } from '../components/Marquee/Marquee'
import { readableOn, fillForSmallText } from '../lib/color'
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

// META (src/lib/seo.ts) is the single source of truth for titles and
// descriptions: the prerender step writes them into <head>, so the page must
// emit the same values or crawlers see two conflicting titles per URL.
function fallbackMeta(project: { slug: string; title: string; category: string; metaDescription: string }) {
  return {
    path: `/work/${project.slug}`,
    title: `${project.title} — ${project.category} | An App Idea LLC`,
    description: project.metaDescription,
  }
}

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const project = slug ? getCaseStudyBySlug(slug) : null

  if (!project) return <Navigate to="/work" replace />

  const { prev, next } = getAdjacentCaseStudies(project.slug)

  const ProjectLogo = SLUG_TO_LOGO[project.slug] ?? LogoPinpoint
  const color = project.theme?.mark ?? PROJECT_COLORS[project.slug] ?? '#2980b9'

  // Every project carries its own color into the cover-strip + first-chip
  // "specimen swatch" (see the data-project-theme rules in globals.css):
  // projects with a shipped theme.accent use that (tuned for swatch/chip
  // legibility — e.g. Unmasked's #A855F7 vs its #8B4C99 mark); everything
  // else falls back to the same PROJECT_COLORS value already visible on
  // the Work index tile and this page's own hero mark. Structural chrome
  // (links, section numbers, focus rings) stays on the global monochrome +
  // acid system rather than inheriting per-project accents.
  const sectionByTitle = (t: 'Problem' | 'Approach' | 'Outcome') =>
    project.sections.find((x) => x.title === t)
  const problem = sectionByTitle('Problem')
  const approach = sectionByTitle('Approach')
  const shipped = sectionByTitle('Outcome')

  const swatch = project.theme?.accent ?? PROJECT_COLORS[project.slug] ?? color
  const themeStyle = {
    '--project-swatch': swatch,
    '--project-swatch-ink': readableOn(swatch),
    // The cover chip carries small text, which two brand colours can't hold
    // at 4.5:1 with either text colour; see fillForSmallText.
    '--chip-fill': fillForSmallText(swatch).fill,
    '--chip-fill-fg': fillForSmallText(swatch).ink,
    ...(project.theme?.gradient ? { '--project-gradient': project.theme.gradient } : {}),
  } as React.CSSProperties

  return (
    <>
      <RouteHead {...(META[`/work/${project.slug}`] ?? fallbackMeta(project))} />

      <PageHeader>
        <header className="masthead">
          <p className="overline">
            <Link to="/work">Work</Link>
            {' · '}
            {project.client ? `Client work for ${project.client}` : project.category}
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
        id="main-content"
        tabIndex={-1}
        style={themeStyle}
        data-project-theme={project.slug}
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

        {/* Each part of the story gets its own shape, so the page has a
            rhythm instead of six identical text sections: the challenge on
            an ink band, the build as numbered steps, what shipped as a bone
            card, outcomes on the project's own colour, the stack as a ticker. */}
        {problem && (
          <section className="cs-band cs-band--ink" aria-labelledby="cs-challenge">
            <h2 id="cs-challenge" className="cs-eyebrow">The challenge</h2>
            <p className="cs-band-lead">{problem.content}</p>
          </section>
        )}

        {approach && (
          <section className="project-section" aria-labelledby="cs-approach">
            <div className="section-header">
              <span className="section-num">Approach</span>
              <h2 id="cs-approach">How I built it</h2>
              <div className="section-rule" />
            </div>
            {project.steps && project.steps.length > 0 && (
              <ol className="cs-steps">
                {project.steps.map((step, i) => (
                  <li key={step}>
                    <span className="cs-step-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                    {step}
                  </li>
                ))}
              </ol>
            )}
            <p className="project-section-body">{approach.content}</p>
          </section>
        )}

        {shipped && (
          <section className="cs-card" aria-labelledby="cs-shipped">
            <span className="cs-eyebrow">Outcome</span>
            <h2 id="cs-shipped">What shipped</h2>
            <p className="project-section-body">{shipped.content}</p>
          </section>
        )}

        <section className="cs-band cs-band--project" aria-labelledby="cs-outcomes">
          <span className="cs-eyebrow">Results</span>
          <h2 id="cs-outcomes">Outcomes</h2>
          <ol className="cs-outcomes">
            {project.outcomes.map((o, i) => (
              <li key={o}>
                <span className="cs-outcome-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <span>{o}</span>
              </li>
            ))}
          </ol>
        </section>

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

        {/* Tech stack, as a ticker like Home's. */}
        <section className="cs-stack" aria-labelledby="cs-stack">
          <h2 id="cs-stack" className="sr-only">Tech stack</h2>
          {/* The ticker is decorative (aria-hidden); this list carries the
              same content for screen readers and crawlers. */}
          <ul className="sr-only">
            {project.stack.map((tech) => <li key={tech}>{tech}</li>)}
          </ul>
          <Marquee items={project.stack} />
        </section>

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

        <NextStep
          heading={`Building something like ${project.title}?`}
          blurb="A free 30-minute call to talk through your idea with the person who built this one."
        />

        {/* Back nav */}
        <div className="project-back-nav">
          <Link to="/work" className="project-back-link">← All work</Link>
          <span className="project-tag">{project.category}</span>
        </div>

      </main>
    </>
  )
}
