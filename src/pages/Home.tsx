import { Link } from 'react-router'
import { SocialLinks } from '../components/SocialLinks/SocialLinks'
import { SITE } from '../data/site'
import { services } from '../data/services'
import { RouteHead } from '../components/SEO/RouteHead'
import { META } from '../lib/seo'
import { IconZap, IconLayers, IconGlobe, IconBarChart } from '../components/icons'
import { PageHeader } from '../components/PageHeader/PageHeader'
import { ConsultCTA } from '../components/ConsultCTA/ConsultCTA'

const SERVICE_ICONS = [IconZap, IconLayers, IconGlobe, IconBarChart]
const SERVICE_ICON_CLASSES = ['icon-green', 'icon-blue', 'icon-teal', 'icon-orange'] as const

export default function Home() {
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

      <main className="container">
        <div className="intro-block">
          <p>
            Bring the idea, even a half-formed one. I build AI-native mobile
            apps with privacy architected in, not bolted on, founder-led from
            interface to encrypted vault to launch.
          </p>
        </div>

        <div className="section-header">
          <span className="section-num">At a Glance</span>
          <h2>What ships here</h2>
          <div className="section-rule" />
        </div>

        <div className="stats-grid">
          <div className="stat-box neutral">
            <span className="stat-label-top">Products shipped</span>
            <span className="stat-num large">12</span>
            <span className="stat-desc">iOS · Android · Web · AI-integrated</span>
          </div>
          <div className="stat-box positive">
            <span className="stat-label-top">MVP timeline</span>
            <span className="stat-num medium">6–8 weeks</span>
            <span className="stat-desc">Sketch to production deploy</span>
          </div>
          <div className="stat-box neutral">
            <span className="stat-label-top">AI-integrated builds</span>
            <span className="stat-num large">4</span>
            <span className="stat-desc">Gemini · ElevenLabs · Firebase</span>
          </div>
        </div>

        <div className="pullquote">
          <p>
            "Most 'AI-powered' apps are a single API call in a modal. I build
            the real version, with streaming audio, on-device pipelines, and
            multi-provider failover, and keep your users' data where it
            belongs."
          </p>
          <span className="attrib">{SITE.founder.name}, {SITE.name}</span>
        </div>

        <div className="section-header">
          <span className="section-num">Services</span>
          <h2>What I build</h2>
          <div className="section-rule" />
        </div>

        {services.map((s, i) => {
          const ServiceIcon = SERVICE_ICONS[i]
          return (
            <div key={s.id} className="feature-item">
              <div className={`feature-icon ${SERVICE_ICON_CLASSES[i]}`}>
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

        <div className="chapter-divider">
          <span className="ornament">✦ ✦ ✦</span>
        </div>

        <div className="section-header">
          <span className="section-num">Human vs AI</span>
          <h2>Why a builder, not just a bot</h2>
          <div className="section-rule" />
        </div>

        <div className="verdict-box context">
          <p>
            "Just prompt an AI and ship it" gets you a head start. And stops
            there. Wireframing, testing, security, App Store launch, and
            maintenance each need a dedicated human.{' '}
            <Link to="/why-not-ai">Here's the honest case for working with a person →</Link>
          </p>
        </div>

        <div className="section-header">
          <span className="section-num">Contact</span>
          <h2>Start a conversation</h2>
          <div className="section-rule" />
        </div>

        <ConsultCTA />

        <div className="verdict-box contact">
          <p>
            Prefer to write? Got an app or website idea, or a project that needs
            a co-builder? Send a few sentences to{' '}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or use the{' '}
            <Link to="/contact">guided form</Link>.
            I read everything and respond within 1–2 business days.
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
