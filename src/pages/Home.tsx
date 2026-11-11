import { Link } from 'react-router'
import { SocialLinks } from '../components/SocialLinks/SocialLinks'
import { FooterNav } from '../components/FooterNav/FooterNav'
import { SITE } from '../data/site'
import { services } from '../data/services'
import { RouteHead } from '../components/SEO/RouteHead'
import { META } from '../lib/seo'
import { PageHeader } from '../components/PageHeader/PageHeader'
import { VerdictBox } from '../components/VerdictBox/VerdictBox'
import { ConsultCTA } from '../components/ConsultCTA/ConsultCTA'
import { MessageCTA } from '../components/MessageCTA/MessageCTA'
import { Section } from '../components/Section/Section'
import { StoryChapter, StoryNext } from '../components/StoryChapter/StoryChapter'
import { UnfoldScene } from '../components/scenes/UnfoldScene'
import { Counter } from '../components/Counter/Counter'
import { FounderPortrait } from '../components/FounderPortrait/FounderPortrait'
import { PricingNote } from '../components/PricingNote/PricingNote'

// The offers most owners come for, then the bigger-build offer under its
// own divider, as on the Services page.
const OFFERS = services.filter((s) => s.group !== 'bigger')
const BIGGER = services.find((s) => s.group === 'bigger')

export default function Home() {
  return (
    <>
      <RouteHead {...META['/']} />

      <PageHeader>
        <header className="masthead masthead--hero">
          <div className="hero-copy">
            <p className="overline">Websites · Apps · AI · Denver, Colorado</p>
            <h1>Your business is the job. The tech shouldn't be a second one.</h1>
            <p className="subtitle">
              Websites, mobile apps, and AI for small businesses, built with
              Black and brown business owners in mind. I build it, then teach
              you to run it.
            </p>
            <div className="hero-actions">
              <a
                className="hero-cta"
                href={SITE.booking.consultationUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-analytics="hero-book-consultation"
              >
                Book a free call
              </a>
              <Link className="hero-secondary" to="/contact">
                Send me a message →
              </Link>
            </div>
            <p className="hero-scale">{SITE.pricing.heroLine}</p>
          </div>
          <FounderPortrait eager hero />
        </header>
      </PageHeader>

      <main id="main-content" tabIndex={-1}>
        <Section color="page">
          <div className="intro-block">
            <p>
              Bring the idea, even a half-formed one. I'm a Black founder in
              Denver, and I build websites, apps, and AI tools for Black and
              brown business owners who've had the drive all along and not the
              backing. Then I hand you the keys and the know-how.
            </p>
          </div>

          <div className="split">
            <StoryChapter id="belief" />
            <UnfoldScene />
          </div>
        </Section>

        <Section color="white">
          <div className="section-header">
            <span className="section-num">At a Glance</span>
            <h2>What <span className="accent-word">ships</span> here</h2>
            <div className="section-rule" />
          </div>

          <div className="stats-grid">
            <div className="stat-box neutral" data-tilt>
              <span className="stat-label-top">Products shipped</span>
              <Counter className="stat-num large" value={12} />
              <span className="stat-desc">iOS · Android · Web · AI-integrated</span>
            </div>
            <div className="stat-box positive" data-tilt>
              <span className="stat-label-top">A business website</span>
              <span className="stat-num medium">3–5 weeks</span>
              <span className="stat-desc">First call to launch</span>
            </div>
            <div className="stat-box neutral" data-tilt>
              <span className="stat-label-top">AI-integrated builds</span>
              <Counter className="stat-num large" value={4} />
              <span className="stat-desc">Gemini · ElevenLabs · Firebase</span>
            </div>
          </div>
        </Section>

        <Section color="ink">
          <div className="pullquote">
            <p>
              "Most 'AI-powered' tools are a chat box added on top. I build AI
              that does real work for your business, and I keep your
              customers' information where it belongs."
            </p>
            <span className="attrib">{SITE.founder.name}, {SITE.name}</span>
          </div>
        </Section>

        <Section color="page">
          <div className="section-header">
            <span className="section-num">Services</span>
            <h2>Five ways to <span className="accent-word">start</span></h2>
            <div className="section-rule" />
          </div>
          <p className="offers-lede">Not sure which? That's what the free call is for.</p>

          <ol className="offer-list">
            {OFFERS.map((s, i) => (
              <li key={s.id} className="offer">
                <span className="offer-num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="offer-head">
                  <h3 className="offer-title">{s.title}</h3>
                  {s.tagline && <span className="offer-meta">{s.tagline}</span>}
                </div>
                <p className="offer-body">{s.description}</p>
                {s.price && <span className="offer-price">{s.price.label}</span>}
              </li>
            ))}
          </ol>

          {BIGGER && (
            <div className="offer-bigger">
              <span className="offer-bigger-label">Building something bigger?</span>
              <strong className="offer-bigger-title">{BIGGER.title}</strong>
              {BIGGER.price && (
                <span className="offer-bigger-price">
                  {BIGGER.price.label}
                  {BIGGER.metric && ` · ${BIGGER.metric.value}`}
                </span>
              )}
            </div>
          )}

          <p className="services-more">
            <Link to="/services">
              See what's included, and how payment and ownership work →
            </Link>
          </p>
        </Section>

        <Section color="white">
          <div className="section-header">
            <span className="section-num">Human vs AI</span>
            <h2>Why a <span className="accent-word">builder</span>, not just a bot</h2>
            <div className="section-rule" />
          </div>

          <VerdictBox variant="context">
            <p>
              "Just prompt an AI and ship it" gets you a head start. And stops
              there. Wireframing, testing, security, App Store launch, and
              maintenance each need a dedicated human. And when AI does belong
              in your business, I'll show you how to use it safely.{' '}
              <Link to="/why-not-ai">Here's the honest case for working with a person →</Link>
            </p>
          </VerdictBox>
        </Section>

        <Section color="page">
          <div className="section-header">
            <span className="section-num">Contact</span>
            <h2>Start a <span className="accent-word">conversation</span></h2>
            <div className="section-rule" />
          </div>

          <ConsultCTA steps={SITE.booking.callSteps} note={SITE.booking.callNote} />

          <MessageCTA>
            <p>
              Prefer to write? Send a few sentences to{' '}
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>, or use the form.
              I read everything and reply within 1–2 business days.
            </p>
          </MessageCTA>

          <PricingNote />

          <StoryNext id="belief" />
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
              Websites, apps, and AI for small businesses. {SITE.founder.location}.
            </li>
            <li>
              <strong>Founder</strong>
              {SITE.founder.name}, builder end-to-end.
            </li>
            <li>
              <strong>Contact</strong>
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </li>
            <li>
              <strong>Domain</strong>
              {SITE.domain}
            </li>
          </ul>
          <FooterNav />
          <SocialLinks />
        </div>
      </footer>
    </>
  )
}
