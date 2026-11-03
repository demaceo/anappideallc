import { Link } from 'react-router'
import { SocialLinks } from '../components/SocialLinks/SocialLinks'
import { FooterNav } from '../components/FooterNav/FooterNav'
import { SITE } from '../data/site'
import { services } from '../data/services'
import { RouteHead } from '../components/SEO/RouteHead'
import { META } from '../lib/seo'
import { IconZap, IconLayers, IconGlobe, IconCpu, IconKey, IconLifeBuoy } from '../components/icons'
import { PageHeader } from '../components/PageHeader/PageHeader'
import { VerdictBox } from '../components/VerdictBox/VerdictBox'
import { ConsultCTA } from '../components/ConsultCTA/ConsultCTA'
import { MessageCTA } from '../components/MessageCTA/MessageCTA'
import { Marquee } from '../components/Marquee/Marquee'
import { Section } from '../components/Section/Section'
import { StoryChapter, StoryNext } from '../components/StoryChapter/StoryChapter'
import { UnfoldScene } from '../components/scenes/UnfoldScene'
import { Counter } from '../components/Counter/Counter'
import { FounderPortrait } from '../components/FounderPortrait/FounderPortrait'
import { PricingNote } from '../components/PricingNote/PricingNote'

const MARQUEE_ITEMS = [
  'Websites',
  'Apps',
  'AI',
  'Own It',
  'Small Business',
  'Denver',
] as const

// Keyed by service id rather than array position: a new entry in services.ts
// used to render `undefined` as a component here and crash the page. Unknown
// ids fall back, same pattern as SLUG_TO_LOGO in ProjectDetail.
const SERVICE_ICONS: Record<string, typeof IconZap> = {
  'business-websites': IconGlobe,
  'site-fixes': IconLifeBuoy,
  'own-it': IconKey,
  'ai-integration': IconCpu,
  'custom-builds': IconLayers,
}
const SERVICE_ICON_CLASSES: Record<string, string> = {
  'business-websites': 'icon-teal',
  'site-fixes': 'icon-orange',
  'own-it': 'icon-gold',
  'ai-integration': 'icon-purple',
  'custom-builds': 'icon-green',
}

export default function Home() {
  return (
    <>
      <RouteHead {...META['/']} />

      <PageHeader>
        <header className="masthead">
          <p className="overline">Websites · Apps · AI · Denver, Colorado</p>
          <h1>Your business is the job. <em>The tech shouldn't be a second one.</em></h1>
          <p className="subtitle">
            Websites, mobile apps, and AI for small businesses, built with
            Black and brown business owners in mind. I build it, then teach
            you to run it.
          </p>
          {/* The masthead filled roughly half the first screen with nothing
              actionable in it — the first interactive element was the corner
              FAB. This gives the strongest copy on the site somewhere to land.
              It collapses with the rest of the masthead on scroll. */}
          <a
            className="hero-cta"
            href={SITE.booking.consultationUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-analytics="hero-book-consultation"
          >
            Book a free call
          </a>
          <p className="date-line">{SITE.email} · {SITE.domain}</p>
        </header>
      </PageHeader>

      <Marquee items={MARQUEE_ITEMS} />

      <main id="main-content" tabIndex={-1}>
        <Section color="bone" ghost="IDEA">
          <div className="intro-block intro-block--portrait">
            <p>
              Bring the idea, even a half-formed one. I'm a Black founder in
              Denver, and I build websites, apps, and AI tools for Black and
              brown business owners who've had the drive all along and not the
              backing. Then I hand you the keys and the know-how.
            </p>
            <FounderPortrait />
          </div>

          <div className="split">
            <StoryChapter id="belief" />
            <UnfoldScene />
          </div>
        </Section>

        <Section color="yellow" num="01" ghost="SHIP">
          <div className="section-header">
            <span className="section-num">At a Glance</span>
            <h2>What <span className="outline-word">ships</span> here</h2>
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

        <Section color="lime" num="02" ghost="BUILD">
          <div className="section-header">
            <span className="section-num">Services</span>
            <h2>What I <span className="outline-word">build</span></h2>
            <div className="section-rule" />
          </div>

          <div className="grid-3">
          {services.map((s) => {
            const ServiceIcon = SERVICE_ICONS[s.id] ?? IconZap
            return (
              <div key={s.id} className="feature-item" data-tilt>
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
                  {s.price && <p className="feature-price">{s.price.label}</p>}
                  <p>{s.description}</p>
                </div>
              </div>
            )
          })}
          </div>

          <p className="services-more">
            <Link to="/services">
              See what's included, and how payment and ownership work →
            </Link>
          </p>
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

        <Section color="bone" num="04" ghost="TALK">
          <div className="section-header">
            <span className="section-num">Contact</span>
            <h2>Start a <span className="outline-word">conversation</span></h2>
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
