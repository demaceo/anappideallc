import { useRef } from 'react'
import { Link } from 'react-router'
import { SocialLinks } from '../components/SocialLinks/SocialLinks'
import { SITE } from '../data/site'
import { services } from '../data/services'
import { RouteHead } from '../components/SEO/RouteHead'
import { META } from '../lib/seo'
import { IconZap, IconLayers, IconGlobe, IconBarChart, IconCpu } from '../components/icons'
import { PageHeader } from '../components/PageHeader/PageHeader'
import { ConsultCTA } from '../components/ConsultCTA/ConsultCTA'
import { Marquee } from '../components/Marquee/Marquee'
import { Section } from '../components/Section/Section'
import { useBrutalistScroll } from '../hooks/useBrutalistScroll'

const MARQUEE_ITEMS = [
  'Apps',
  'Websites',
  'AI-Native',
  'Privacy-First',
  'Denver',
  'Founders',
] as const

// Keyed by service id rather than array position: a new entry in services.ts
// used to render `undefined` as a component here and crash the page. Unknown
// ids fall back, same pattern as SLUG_TO_LOGO in ProjectDetail.
const SERVICE_ICONS: Record<string, typeof IconZap> = {
  'mvp-development': IconZap,
  'ui-engineering': IconLayers,
  'business-websites': IconGlobe,
  'data-visualization': IconBarChart,
  'ai-integration': IconCpu,
}
const SERVICE_ICON_CLASSES: Record<string, string> = {
  'mvp-development': 'icon-green',
  'ui-engineering': 'icon-blue',
  'business-websites': 'icon-teal',
  'data-visualization': 'icon-orange',
  'ai-integration': 'icon-purple',
}

export default function Home() {
  const scopeRef = useRef<HTMLElement>(null)
  useBrutalistScroll(scopeRef)

  return (
    <>
      <RouteHead {...META['/']} />

      <PageHeader>
        <header className="masthead">
          <p className="overline">AI-Native Mobile · Privacy-First · Denver, Colorado</p>
          <h1>Got an app idea? <em>Let's build it.</em></h1>
          <p className="subtitle">AI-native mobile apps with privacy built in, shipped end-to-end by one builder.</p>
          <p className="date-line">{SITE.email} · {SITE.domain}</p>
        </header>
      </PageHeader>

      <Marquee items={MARQUEE_ITEMS} />

      <main ref={scopeRef}>
        <Section color="bone" ghost="IDEA">
          <div className="intro-block">
            <p data-split>
              Bring the idea, even a half-formed one. I build AI-native mobile
              apps with privacy architected in, not bolted on, founder-led from
              interface to encrypted vault to launch. And I'm a Black founder in
              Denver building this so Colorado's Black-owned businesses aren't
              the last ones to get what AI can do.
            </p>
          </div>
        </Section>

        <Section color="yellow" num="01" ghost="SHIP">
          <div className="section-header">
            <span className="section-num">At a Glance</span>
            <h2>What <span className="outline-word">ships</span> here</h2>
            <div className="section-rule" />
          </div>

          <div className="stats-grid" data-reveal>
            <div className="stat-box neutral" data-tilt>
              <span className="stat-label-top">Products shipped</span>
              <span className="stat-num large">12</span>
              <span className="stat-desc">iOS · Android · Web · AI-integrated</span>
            </div>
            <div className="stat-box positive" data-tilt>
              <span className="stat-label-top">MVP timeline</span>
              <span className="stat-num medium">6–8 weeks</span>
              <span className="stat-desc">Sketch to production deploy</span>
            </div>
            <div className="stat-box neutral" data-tilt>
              <span className="stat-label-top">AI-integrated builds</span>
              <span className="stat-num large">4</span>
              <span className="stat-desc">Gemini · ElevenLabs · Firebase</span>
            </div>
          </div>
        </Section>

        <Section color="ink">
          <div className="pullquote" data-reveal>
            <p>
              "Most 'AI-powered' apps are a single API call in a modal. I build
              the real version, with streaming audio, on-device pipelines, and
              multi-provider failover, and keep your users' data where it
              belongs."
            </p>
            <span className="attrib">{SITE.founder.name}, {SITE.name}</span>
          </div>
        </Section>

        <Section color="lime" num="02" ghost="BUILD">
          <div className="section-header">
            <span className="section-num">Services</span>
            <h2>What I <span className="outline-word">build</span></h2>
            <div className="section-rule" />
          </div>

          {services.map((s) => {
            const ServiceIcon = SERVICE_ICONS[s.id] ?? IconZap
            return (
              <div key={s.id} className="feature-item" data-reveal data-tilt>
                <div className={`feature-icon ${SERVICE_ICON_CLASSES[s.id] ?? 'icon-green'}`}>
                  <ServiceIcon size={20} />
                </div>
                <div className="feature-body">
                  {s.metric && (
                    <span className="feature-eyebrow">
                      {s.metric.label} · {s.metric.value}
                    </span>
                  )}
                  <h3 className="feature-title">{s.title}</h3>
                  <p>{s.description}</p>
                </div>
              </div>
            )
          })}
        </Section>

        <div className="container">
          <div className="chapter-divider">
            <span className="ornament">✦ ✦ ✦</span>
          </div>
        </div>

        <Section color="orange" num="03" ghost="HUMAN">
          <div className="section-header">
            <span className="section-num">Human vs AI</span>
            <h2>Why a <span className="outline-word">builder</span>, not just a bot</h2>
            <div className="section-rule" />
          </div>

          <div className="verdict-box context" data-reveal>
            <p>
              "Just prompt an AI and ship it" gets you a head start. And stops
              there. Wireframing, testing, security, App Store launch, and
              maintenance each need a dedicated human.{' '}
              <Link to="/why-not-ai">Here's the honest case for working with a person →</Link>
            </p>
          </div>
        </Section>

        <Section color="lavender" num="04" ghost="TALK">
          <div className="section-header">
            <span className="section-num">Contact</span>
            <h2>Start a <span className="outline-word">conversation</span></h2>
            <div className="section-rule" />
          </div>

          <ConsultCTA />

          <div className="verdict-box contact" data-reveal>
            <p>
              Prefer to write? Got an app or website idea, or a project that needs
              a co-builder? Send a few sentences to{' '}
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or use the{' '}
              <Link to="/contact">guided form</Link>.
              I read everything and respond within 1–2 business days.
            </p>
          </div>
        </Section>
      </main>

      <footer className="sources-section">
        <div className="container">
          <p className="footer-giant">
            An App <span>Idea</span>
          </p>
          <div className="sources-header">
            <h3>Studio</h3>
            <div className="sources-header-rule" />
          </div>
          <ul className="source-list">
            <li>
              <strong>{SITE.name}</strong>
              Founder-led dev studio. {SITE.founder.location}.
            </li>
            <li>
              <strong>Founder</strong>
              {SITE.founder.name}, builder end-to-end.
            </li>
            <li>
              <strong>Contact</strong>
              {SITE.email}
            </li>
            <li>
              <strong>Domain</strong>
              {SITE.domain}
            </li>
          </ul>
          <SocialLinks />
        </div>
      </footer>
    </>
  )
}
