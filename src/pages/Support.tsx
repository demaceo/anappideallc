import { Link } from 'react-router'
import { SITE } from '../data/site'
import { RouteHead } from '../components/SEO/RouteHead'
import { META } from '../lib/seo'
import { PageHeader } from '../components/PageHeader/PageHeader'
import {
  IconLifeBuoy, IconTerminal, IconShieldCheck, IconCalendar, IconSend,
} from '../components/icons'

// Common support requests, shown as the studio's first-line help. Kept short
// and action-oriented so a user who just hit a problem in an app can self-serve
// or know exactly what to send.
const HELP_TOPICS = [
  {
    icon: IconTerminal,
    iconClass: 'icon-orange',
    eyebrow: 'Something broke',
    title: 'Report a bug or a crash',
    body: 'Email what happened, the app and device you were on, and the steps that led to it. A screenshot or screen recording helps. Most issues are reproduced and triaged within a day.',
  },
  {
    icon: IconShieldCheck,
    iconClass: 'icon-green',
    eyebrow: 'Your data',
    title: 'Delete your account or data',
    body: "Want your account or personal data removed? Email from the address on the account and it's handled. Each app's privacy policy below details exactly what's stored and how deletion works.",
  },
  {
    icon: IconCalendar,
    iconClass: 'icon-blue',
    eyebrow: 'Subscriptions',
    title: 'Billing & subscriptions',
    body: 'Purchases and renewals are managed by the App Store or Google Play, so refunds and cancellations go through them. If a Pro feature isn\'t unlocking after purchase, email and it gets sorted.',
  },
  {
    icon: IconLifeBuoy,
    iconClass: 'icon-teal',
    eyebrow: 'Everything else',
    title: 'Feature requests & questions',
    body: 'Missing something, or stuck on how a feature works? Send a few sentences. Real product feedback from people who use the apps shapes what gets built next.',
  },
] as const

// Apps with published policies. Each row links to its privacy and terms so the
// Support page doubles as the per-app legal index the App Store review expects.
const APPS = [
  { name: 'The Yap App', privacy: '/legal/yap/privacy', terms: '/legal/yap/terms' },
  { name: 'Ôwn (Payback)', privacy: '/legal/payback/privacy', terms: '/legal/payback/terms' },
  { name: 'Pinpoint', privacy: '/legal/pinpoint/privacy', terms: '/legal/pinpoint/terms' },
  { name: 'DrayagePro TMS', privacy: '/legal/drayagepro/privacy', terms: '/legal/drayagepro/terms' },
  { name: 'Zoori', privacy: '/legal/zoori/privacy', terms: '/legal/zoori/terms' },
  { name: 'Feng Shui', privacy: '/legal/fengshui/privacy', terms: '/legal/fengshui/terms' },
  { name: 'STLMNT', privacy: '/legal/stlmnt/privacy', terms: '/legal/stlmnt/terms' },
] as const

export default function Support() {
  return (
    <>
      <RouteHead {...META['/support']} />

      <PageHeader>
        <header className="masthead">
          <p className="overline">Support · An App Idea LLC</p>
          <h1>Need a hand? <em>I've got you.</em></h1>
          <p className="subtitle">
            Help for every app I've shipped, answered by the person who built
            it. No ticket maze, no bots, just a direct line to a real builder.
          </p>
          <p className="date-line">{SITE.email} · Replies within 1–2 business days</p>
        </header>
      </PageHeader>

      <main className="container">
        <div className="intro-block">
          <p>
            Every app from {SITE.name} is built and maintained by one person, so
            support comes straight from the source. Email{' '}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a> with the app you're
            using and what's going on, and you'll hear back within 1–2 business
            days, often sooner.
          </p>
        </div>

        <div className="section-header">
          <span className="section-num">How to get help</span>
          <h2>Common requests</h2>
          <div className="section-rule" />
        </div>

        {HELP_TOPICS.map((t) => {
          const Icon = t.icon
          return (
            <div key={t.title} className="feature-item">
              <div className={`feature-icon ${t.iconClass}`}>
                <Icon size={20} />
              </div>
              <div className="feature-body">
                <span className="feature-eyebrow">{t.eyebrow}</span>
                <h3 className="feature-title">{t.title}</h3>
                <p>{t.body}</p>
              </div>
            </div>
          )
        })}

        <div className="verdict-box contact">
          <p>
            <IconSend size={16} /> The fastest way to reach support is email:{' '}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. Include the app
            name, your device and OS version, and a short description. Screenshots
            or a screen recording make a fix faster.
          </p>
        </div>

        <div className="chapter-divider">
          <span className="ornament">✦ ✦ ✦</span>
        </div>

        <div className="section-header">
          <span className="section-num">By app</span>
          <h2>Policies & legal</h2>
          <div className="section-rule" />
        </div>

        <div className="intro-block">
          <p>
            Privacy policy and terms of service for each published app. They cover
            what data is collected, how it's stored, and how to request deletion.
          </p>
        </div>

        {APPS.map((app) => (
          <div key={app.name} className="feature-item">
            <div className="feature-body">
              <h3 className="feature-title">{app.name}</h3>
              <p>
                <Link to={app.privacy}>Privacy Policy</Link>
                {' · '}
                <Link to={app.terms}>Terms of Service</Link>
              </p>
            </div>
          </div>
        ))}

        <div className="section-header">
          <span className="section-num">Not an app issue?</span>
          <h2>Looking to build something</h2>
          <div className="section-rule" />
        </div>

        <div className="verdict-box context">
          <p>
            If you're here about a new project rather than an existing app, head
            to the <Link to="/contact">contact page</Link> or email{' '}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. Early-stage ideas
            are welcome, no finished spec required.
          </p>
        </div>
      </main>

      <footer className="sources-section">
        <div className="container">
          <div className="sources-header">
            <h3>Support at a glance</h3>
            <div className="sources-header-rule" />
          </div>
          <ul className="source-list">
            <li>
              <strong>Contact</strong>
              {SITE.email}
            </li>
            <li>
              <strong>Response time</strong>
              Within 1–2 business days.
            </li>
            <li>
              <strong>Who answers</strong>
              {SITE.founder.name}, the builder.
            </li>
            <li>
              <strong>Billing</strong>
              Managed via the App Store & Google Play.
            </li>
          </ul>
        </div>
      </footer>
    </>
  )
}
