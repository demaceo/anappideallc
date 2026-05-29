import { SITE } from '../data/site'
import { RouteHead } from '../components/SEO/RouteHead'
import { META } from '../lib/seo'
import { IconEdit, IconSearch, IconSend } from '../components/icons'
import { SiteNav } from '../components/SiteNav/SiteNav'

const PROMPTS = [
  {
    icon: IconEdit,
    iconClass: 'icon-gold',
    eyebrow: 'The idea',
    title: 'What it does and who it\'s for',
    body: 'One to three sentences. What problem does it solve? Who\'s the primary user? What\'s the one thing it needs to do well?',
  },
  {
    icon: IconSearch,
    iconClass: 'icon-blue',
    eyebrow: 'Where you are',
    title: 'Stage, timeline, and any existing work',
    body: 'Sketches, wireframes, specs, or existing code — include whatever you have. A rough target date helps too, even if it\'s loose. None of it is required.',
  },
  {
    icon: IconSend,
    iconClass: 'icon-green',
    eyebrow: 'The fit',
    title: 'Budget ballpark, if you have one',
    body: 'A rough range helps scope the engagement. If you don\'t have a number yet, that\'s a normal place to start — just say so and we\'ll figure it out together.',
  },
] as const

export default function Contact() {
  const subject = encodeURIComponent('App idea — initial contact')
  const body = encodeURIComponent(
    `Hi ${SITE.founder.name.split(' ')[0]},\n\nI have an idea for a [mobile app / website] and I'd like to talk through what it would take to ship it.\n\nThe idea:\n\n\nWhere I am:\n\n\nBudget range:\n\n— `,
  )

  return (
    <>
      <RouteHead {...META['/contact']} />

      <header className="masthead">
        <p className="overline">An App Idea LLC · Denver, Colorado</p>
        <h1>Let's <em>talk.</em></h1>
        <p className="subtitle">
          Got an app or website idea? Send a few sentences.
          I read everything and respond within 1–2 business days.
        </p>
        <p className="date-line">{SITE.email}</p>
      </header>

      <SiteNav />

      <main className="container">
        <div className="intro-block">
          <p>
            Early-stage conversations are welcome. The goal of the first
            exchange is to figure out whether we're a good fit — no deck
            or finished spec required.
          </p>
        </div>

        <div className="contact-hero">
          <span className="contact-hero-label">Send an email</span>
          <a
            href={`mailto:${SITE.email}?subject=${subject}&body=${body}`}
            className="contact-hero-email"
          >
            {SITE.email}
          </a>
          <span className="contact-hero-sub">
            Responds within 1–2 business days · Denver, MT
          </span>
        </div>

        <div className="section-header">
          <span className="section-num">What to include</span>
          <h2>Three things worth mentioning</h2>
          <div className="section-rule" />
        </div>

        {PROMPTS.map((p) => {
          const PromptIcon = p.icon
          return (
            <div key={p.eyebrow} className="feature-item">
              <div className={`feature-icon ${p.iconClass}`}>
                <PromptIcon size={20} />
              </div>
              <div className="feature-body">
                <span className="feature-eyebrow">{p.eyebrow}</span>
                <h3 className="feature-title">{p.title}</h3>
                <p>{p.body}</p>
              </div>
            </div>
          )
        })}

        <div className="section-header">
          <span className="section-num">Location</span>
          <h2>Where I am</h2>
          <div className="section-rule" />
        </div>

        <div className="verdict-box note">
          <p>
            {SITE.founder.location} · Mountain Time (US/Denver).
            I work with founders remotely and have built across US, UK, and
            international time zones without friction.
          </p>
        </div>
      </main>

      <footer className="sources-section">
        <div className="container">
          <div className="sources-header">
            <h3>Contact details</h3>
            <div className="sources-header-rule" />
          </div>
          <ul className="source-list">
            <li>
              <strong>Email</strong>
              {SITE.email}
            </li>
            <li>
              <strong>Location</strong>
              {SITE.founder.location} · Mountain Time
            </li>
            <li>
              <strong>Response time</strong>
              1–2 business days
            </li>
            <li>
              <strong>Studio</strong>
              {SITE.name}
            </li>
          </ul>
        </div>
      </footer>
    </>
  )
}
