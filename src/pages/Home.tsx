import { SITE } from '../data/site'
import { services } from '../data/services'
import { RouteHead } from '../components/SEO/RouteHead'
import { META } from '../lib/seo'
import { IconZap, IconLayers, IconGlobe, IconBarChart } from '../components/icons'
import { SiteNav } from '../components/SiteNav/SiteNav'

const SERVICE_ICONS = [IconZap, IconLayers, IconGlobe, IconBarChart]
const SERVICE_ICON_CLASSES = ['icon-green', 'icon-blue', 'icon-teal', 'icon-orange'] as const

export default function Home() {
  return (
    <>
      <RouteHead {...META['/']} />

      <header className="masthead">
        <p className="overline">Dev Studio · Denver, Colorado</p>
        <h1>Got an app idea? <em>Let's build it.</em></h1>
        <p className="subtitle">{SITE.description}</p>
        <p className="date-line">{SITE.email} · {SITE.domain}</p>
      </header>

      <SiteNav />

      <main className="container">
        <div className="intro-block">
          <p>
            I design the interface, build the backend, and ship the operational
            systems that make ambitious products credible. Founder-led, one
            builder end-to-end, Denver-based.
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
            <span className="stat-num large">5</span>
            <span className="stat-desc">iOS · Android · Web · AI-integrated</span>
          </div>
          <div className="stat-box positive">
            <span className="stat-label-top">MVP timeline</span>
            <span className="stat-num medium">6–8 weeks</span>
            <span className="stat-desc">Sketch to production deploy</span>
          </div>
          <div className="stat-box neutral">
            <span className="stat-label-top">Service categories</span>
            <span className="stat-num large">4</span>
            <span className="stat-desc">Mobile · Web · MVP · Data viz</span>
          </div>
        </div>

        <div className="pullquote">
          <p>
            "I design the interface, build the backend, and ship the
            operational systems that make ambitious products credible."
          </p>
          <span className="attrib">— {SITE.founder.name}, {SITE.name}</span>
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
          <span className="section-num">Contact</span>
          <h2>Start a conversation</h2>
          <div className="section-rule" />
        </div>

        <div className="verdict-box contact">
          <p>
            Got an app or website idea, or a project that needs a co-builder?
            Send a few sentences to{' '}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
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
              {SITE.founder.name} — builder end-to-end.
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
        </div>
      </footer>
    </>
  )
}
