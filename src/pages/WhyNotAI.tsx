import { SITE } from '../data/site'
import { SocialLinks } from '../components/SocialLinks/SocialLinks'
import { RouteHead } from '../components/SEO/RouteHead'
import { META } from '../lib/seo'
import { PageHeader } from '../components/PageHeader/PageHeader'
import { ConsultCTA } from '../components/ConsultCTA/ConsultCTA'
import {
  IconCompass2, IconEdit, IconLayers, IconShieldCheck, IconTerminal,
  IconLifeBuoy,
} from '../components/icons'

// The honest case for a human builder. Framed for the person who just asked
// an AI to "make me an app" and is staring at something that half-works.
const REALITIES = [
  {
    icon: IconCompass2,
    iconClass: 'icon-gold',
    eyebrow: 'Direction',
    title: 'Knowing what to build, and what to leave out',
    body: "A prompt gives you what you asked for. It can't tell you that two of your five features will sink the launch, or that the thing you almost skipped is the whole product. Judgment about scope comes from having shipped before, not from generating faster.",
  },
  {
    icon: IconEdit,
    iconClass: 'icon-blue',
    eyebrow: 'Design',
    title: 'Wireframing and testing with real people',
    body: 'AI can produce a screen. It can\'t sit with a confused first-time user, watch them tap the wrong thing, and rethink the flow. Interfaces that feel obvious are the result of watching real people struggle and quietly fixing it.',
  },
  {
    icon: IconLayers,
    iconClass: 'icon-teal',
    eyebrow: 'Architecture',
    title: 'Building something that holds up at 10,000 users',
    body: "Generated code often works for one user on your laptop. Auth, data modeling, rate limits, payments, edge cases (the unglamorous decisions that decide whether the app survives contact with real traffic) need someone accountable for the whole system.",
  },
  {
    icon: IconShieldCheck,
    iconClass: 'icon-green',
    eyebrow: 'Trust',
    title: 'Security and privacy you can actually stand behind',
    body: "An AI will happily write code that leaks user data and never mention it. Handling passwords, payment details, and personal information safely is a discipline: secret scanning, encryption, and secure auth. Not a feature you can prompt your way to.",
  },
  {
    icon: IconTerminal,
    iconClass: 'icon-navy',
    eyebrow: 'Launch',
    title: 'Getting it onto the App Store and live on the web',
    body: 'Deploying, configuring domains, passing Apple and Google review, setting up the build pipeline: this is where most solo AI projects stall. It\'s a gauntlet of accounts, certificates, and rejections that a person who\'s been through it can clear in days, not months.',
  },
  {
    icon: IconLifeBuoy,
    iconClass: 'icon-orange',
    eyebrow: 'After launch',
    title: 'Debugging, iterating, and keeping it alive',
    body: "Shipping is the start, not the finish. Something breaks at 2am, a dependency changes, users ask for the thing you didn't build. Maintenance is a standing commitment: a real person who knows your codebase, not a fresh chat with no memory of what you built last week.",
  },
] as const

export default function WhyNotAI() {
  return (
    <>
      <RouteHead {...META['/why-not-ai']} />

      <PageHeader>
        <header className="masthead">
          <p className="overline">An App Idea LLC · A candid take</p>
          <h1>Why not just have <em>AI build it?</em></h1>
          <p className="subtitle">
            AI is a genuinely useful tool. I use it every day. But "prompt it
            and ship" skips most of what turns an idea into an app real people
            rely on. Here's the honest version.
          </p>
          <p className="date-line">The human-vs-AI question</p>
        </header>
      </PageHeader>

      <main className="container">
        <div className="intro-block">
          <p>
            If you can describe your idea to an AI and get something on screen,
            that's real progress, and a great place to start. The gap shows up
            after: in everything between "it kind of works" and "it's live,
            secure, and people trust it." That stretch is the actual job.
          </p>
        </div>

        <div className="pullquote">
          <p>
            "You can absolutely get a head start from a prompt. But wireframing,
            testing, building, deploying, publishing, debugging, and
            maintaining an app each ask for a dedicated human, and skipping
            them just moves the work somewhere more expensive."
          </p>
          <span className="attrib">{SITE.founder.name}, {SITE.name}</span>
        </div>

        <div className="section-header">
          <span className="section-num">The gap</span>
          <h2>What a prompt can't do for you</h2>
          <div className="section-rule" />
        </div>

        {REALITIES.map((r) => {
          const Icon = r.icon
          return (
            <div key={r.title} className="feature-item">
              <div className={`feature-icon ${r.iconClass}`}>
                <Icon size={20} />
              </div>
              <div className="feature-body">
                <span className="feature-eyebrow">{r.eyebrow}</span>
                <h3 className="feature-title">{r.title}</h3>
                <p>{r.body}</p>
              </div>
            </div>
          )
        })}

        <div className="chapter-divider">
          <span className="ornament">✦ ✦ ✦</span>
        </div>

        <div className="verdict-box note">
          <p>
            Prefer AI out of the picture entirely? That's a valid position.
            Bring it up on the first call and we'll scope the build without it.
          </p>
        </div>

        <div className="section-header">
          <span className="section-num">The honest part</span>
          <h2>Where AI genuinely helps</h2>
          <div className="section-rule" />
        </div>

        <div className="verdict-box context">
          <p>
            I'm not anti-AI. Far from it. It's excellent for sketching ideas,
            drafting copy, exploring options, and speeding up the parts of the
            build that are well-understood. The difference is that I use it as a
            power tool inside a process I'm accountable for (wireframing,
            testing, securing, shipping, and maintaining) rather than handing
            the whole thing to a chatbot and hoping. You get the speed of modern
            tools <em>and</em> a person who owns the outcome.
          </p>
        </div>

        <div className="section-header">
          <span className="section-num">The math</span>
          <h2>The hidden cost of going it alone</h2>
          <div className="section-rule" />
        </div>

        <div className="stats-grid">
          <div className="stat-box neutral">
            <span className="stat-label-top">Prompt to "it works"</span>
            <span className="stat-num medium">The easy 20%</span>
            <span className="stat-desc">Where AI shines</span>
          </div>
          <div className="stat-box caution">
            <span className="stat-label-top">"Works" to launched</span>
            <span className="stat-num medium">The hard 80%</span>
            <span className="stat-desc">Design · security · deploy · support</span>
          </div>
          <div className="stat-box positive">
            <span className="stat-label-top">With a builder</span>
            <span className="stat-num medium">One owner</span>
            <span className="stat-desc">End to end, accountable</span>
          </div>
        </div>

        <div className="section-header">
          <span className="section-num">Next step</span>
          <h2>Talk it through with a person</h2>
          <div className="section-rule" />
        </div>

        <ConsultCTA
          eyebrow="No cost, no pressure"
          title="Bring your AI draft to a free call"
          blurb="Already started with AI? Even better. Bring what you have and we'll map the path from here to launched."
        />
      </main>

      <footer className="sources-section">
        <div className="container">
          <div className="sources-header">
            <h3>The short version</h3>
            <div className="sources-header-rule" />
          </div>
          <ul className="source-list">
            <li>
              <strong>AI is a tool</strong>
              Great for a head start, not a substitute for a builder.
            </li>
            <li>
              <strong>The work is the 80%</strong>
              Testing, security, deploy, and upkeep decide success.
            </li>
            <li>
              <strong>One accountable human</strong>
              {SITE.founder.name} owns it end to end.
            </li>
            <li>
              <strong>Start free</strong>
              A 30-minute call, no spec required.
            </li>
          </ul>
          <SocialLinks />
        </div>
      </footer>
    </>
  )
}
