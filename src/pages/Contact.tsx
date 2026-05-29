import { SITE } from '../data/site'
import { RouteHead } from '../components/SEO/RouteHead'
import { META } from '../lib/seo'

export default function Contact() {
  const subject = encodeURIComponent('App idea — initial contact')
  const body = encodeURIComponent(
    `Hi ${SITE.founder.name.split(' ')[0]},\n\nI have an idea for a [mobile app / website] and I'd like to talk through what it would take to ship it.\n\nA short description:\n\n— `,
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

      <main className="container">
        <div className="intro-block">
          <p>
            Got an app or website idea, or a project that needs a co-builder?
            Send a few sentences. I read everything and respond within
            1–2 business days.
          </p>
        </div>

        <div className="section-header">
          <span className="section-num">01</span>
          <h2>Email</h2>
          <div className="section-rule" />
        </div>

        <div className="verdict-box contact">
          <p>
            The best way to reach me is a direct email. Describe your idea in a
            few sentences — what it does, who it's for, and where you are in the
            process. No decks required.{' '}
            <a href={`mailto:${SITE.email}?subject=${subject}&body=${body}`}>
              {SITE.email}
            </a>
          </p>
        </div>

        <div className="section-header">
          <span className="section-num">02</span>
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

        <div className="chapter-divider">
          <span className="ornament">✦ ✦ ✦</span>
        </div>

        <div className="section-header">
          <span className="section-num">03</span>
          <h2>What to include</h2>
          <div className="section-rule" />
        </div>

        <div className="dialogue-entry">
          <div className="speaker-card">
            <div className="speaker-icon" style={{ background: '#2980b9' }}>
              📝
            </div>
            <div className="speaker-name">Your note</div>
          </div>
          <div className="speech-bubble bubble-blue">
            <p>
              A few sentences is plenty. Useful things to include: what the
              product does, who uses it, whether you have designs or specs
              already, and your rough timeline or budget range.
            </p>
            <p>
              You don't need a finished idea — early-stage conversations are
              welcome. The goal of the first exchange is to figure out whether
              we're a good fit.
            </p>
          </div>
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
