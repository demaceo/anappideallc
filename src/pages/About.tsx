import { Link } from 'react-router'
import { SocialLinks } from '../components/SocialLinks/SocialLinks'
import { FooterNav } from '../components/FooterNav/FooterNav'
import { SITE } from '../data/site'
import { differentiators } from '../data/case-studies'
import { RouteHead } from '../components/SEO/RouteHead'
import { META } from '../lib/seo'
import { IconCpu, IconLock, IconKey, IconShieldCheck } from '../components/icons'
import { PageHeader } from '../components/PageHeader/PageHeader'
import { VerdictBox } from '../components/VerdictBox/VerdictBox'

// Keyed by differentiator title rather than array position: index-aligned
// lookups silently mispair every later entry when the source array is
// reordered, and render `undefined` as a component when it grows. Same reason
// Home.tsx keys SERVICE_ICONS by id.
const DIFF_META: Record<string, { Icon: typeof IconCpu; iconClass: string; eyebrow: string }> = {
  'ai-native':     { Icon: IconCpu,         iconClass: 'icon-blue',  eyebrow: 'AI-Native'     },
  'privacy-first': { Icon: IconLock,        iconClass: 'icon-navy',  eyebrow: 'Privacy-First' },
  'ownership':     { Icon: IconKey,         iconClass: 'icon-gold',  eyebrow: 'Ownership'     },
  'discipline':    { Icon: IconShieldCheck, iconClass: 'icon-green', eyebrow: 'Discipline'    },
}
const DIFF_FALLBACK = { Icon: IconCpu, iconClass: 'icon-blue', eyebrow: 'Approach' }

export default function About() {
  return (
    <>
      <RouteHead {...META['/about']} />

      <PageHeader>
        <header className="masthead">
          <p className="overline">AI-Native · Privacy-First · {SITE.founder.location}</p>
          <h1><em>Founder-led,</em> Denver-based.</h1>
          <p className="subtitle">
            {SITE.name}, run by {SITE.founder.name}. AI-native mobile apps
            with privacy built in. One builder from interface to deploy.
          </p>
          <p className="date-line">About the studio</p>
        </header>
      </PageHeader>

      <main className="container" id="main-content" tabIndex={-1}>
        <div className="intro-block">
          <p>
            {SITE.name} is a {SITE.founder.location} dev studio run by{' '}
            {SITE.founder.name}. I build AI-native mobile apps with privacy
            designed in from the first commit, and care most about the ones
            that empower people and bring communities together.
          </p>
        </div>

        <div className="section-header">
          <span className="section-num">Differentiators</span>
          <h2>What sets the work apart</h2>
          <div className="section-rule" />
        </div>

        {differentiators.map((d) => {
          const { Icon: DiffIcon, iconClass, eyebrow } = DIFF_META[d.id] ?? DIFF_FALLBACK
          return (
            <div key={d.id} className="feature-item">
              <div className={`feature-icon ${iconClass}`}>
                <DiffIcon size={20} />
              </div>
              <div className="feature-body">
                <span className="feature-eyebrow">{eyebrow}</span>
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
            "Every build carries CI, secret scanning, monitoring, and a real
            release process. It ships for real users, not a demo audience."
          </p>
          <span className="attrib">{SITE.founder.name}, on shipping discipline</span>
        </div>

        <VerdictBox variant="assessment">
          <p>
            You work directly with the person building your product. Interface
            design, database architecture, auth, API security, and deployment
            pipelines. All from the same builder. Nothing gets outsourced or
            glossed over, and the person who writes your code is the same one
            who answers your emails.{' '}
            <Link to="/why-not-ai">Why a human over AI? →</Link>
          </p>
        </VerdictBox>
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
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </li>
            <li>
              <strong>Approach</strong>
              Founder-led · end-to-end engineering
            </li>
          </ul>
          <FooterNav />
          <SocialLinks />
        </div>
      </footer>
    </>
  )
}
