import { SocialLinks } from '../components/SocialLinks/SocialLinks'
import { FooterNav } from '../components/FooterNav/FooterNav'
import { SITE } from '../data/site'
import { RouteHead } from '../components/SEO/RouteHead'
import { META } from '../lib/seo'
import { IconEdit, IconSearch, IconSend } from '../components/icons'
import { PageHeader } from '../components/PageHeader/PageHeader'
import { VerdictBox } from '../components/VerdictBox/VerdictBox'
import { PricingNote } from '../components/PricingNote/PricingNote'
import { ConsultCTA } from '../components/ConsultCTA/ConsultCTA'
import { ContactForm } from '../components/ContactForm/ContactForm'
import { DoorScene } from '../components/scenes/DoorScene'
import { StoryChapter } from '../components/StoryChapter/StoryChapter'
import { STORY_CLOSING } from '../data/story'

// The three prompts shown below the form — kept from the original page so the
// "what to include" guidance still lives here for people who'd rather just email.
const PROMPTS = [
  {
    icon: IconEdit,
    iconClass: 'icon-gold',
    eyebrow: 'The need',
    title: 'What it should do and who it\'s for',
    body: 'One to three sentences. What\'s not working today? Who are your customers? What\'s the one thing it has to do well?',
  },
  {
    icon: IconSearch,
    iconClass: 'icon-blue',
    eyebrow: 'Where you are',
    title: 'What you have today',
    body: 'A website, a social page, a booking app, or nothing yet: all fine. A rough target date helps too, even if it\'s loose. None of it is required.',
  },
  {
    icon: IconSend,
    iconClass: 'icon-green',
    eyebrow: 'The fit',
    title: 'Budget ballpark, if you have one',
    body: 'A rough range helps scope the engagement. If you don\'t have a number yet, that\'s a normal place to start; just say so. Pricing is a sliding scale by your business\'s size and stage.',
  },
] as const

export default function Contact() {
  return (
    <>
      <RouteHead {...META['/contact']} />

      <PageHeader>
        <header className="masthead">
          <p className="overline">An App Idea LLC · Denver, Colorado</p>
          <h1>Let's <em>talk.</em></h1>
          <p className="subtitle">
            Running a business that needs a website, an app, or AI? Send a
            quick message, or book a free call. I reply within 1–2 business
            days.
          </p>
          <p className="date-line">{SITE.email}</p>
        </header>
      </PageHeader>

      <main className="container" id="main-content" tabIndex={-1}>
        <div className="intro-block">
          <p>
            Come as you are. Half an idea is plenty. The first conversation
            is just to see if we're a good fit.
          </p>
        </div>

        <div className="split">
          <StoryChapter id="door" />
          <DoorScene />
        </div>

        <PricingNote />

        {/* The form leads: it is why most visitors come. The free call follows
            as the alternative for anyone who would rather talk. */}
        <ContactForm />

        <ConsultCTA
          eyebrow="Prefer to talk?"
          title={SITE.booking.label}
          blurb="Rather talk it through? Thirty minutes, free. Bring as much or as little as you've got."
          steps={SITE.booking.callSteps}
          note={SITE.booking.callNote}
        />

        <div className="section-header">
          <span className="section-num">What to include</span>
          <h2>Three things worth mentioning</h2>
          <div className="section-rule" />
        </div>

        <div className="grid-3">
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
        </div>

        <div className="section-header">
          <span className="section-num">Location</span>
          <h2>Where I am</h2>
          <div className="section-rule" />
        </div>

        <VerdictBox variant="note">
          <p>
            {SITE.founder.location} · Mountain Time (US/Denver).
            I work with business owners anywhere, remotely, and keep calls
            at hours that suit you.
          </p>
        </VerdictBox>

        <div className="pullquote story-closing">
          <p>{STORY_CLOSING}</p>
          <span className="attrib">{SITE.founder.name}, {SITE.name}</span>
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
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </li>
            <li>
              <strong>Book a call</strong>
              Free 30-minute call
            </li>
            <li>
              <strong>Location</strong>
              {SITE.founder.location} · Mountain Time
            </li>
            <li>
              <strong>Pricing</strong>
              Sliding scale by business size and stage
            </li>
            <li>
              <strong>Response time</strong>
              1–2 business days
            </li>
          </ul>
          <FooterNav />
          <SocialLinks />
        </div>
      </footer>
    </>
  )
}