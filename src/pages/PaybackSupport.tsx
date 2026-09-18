import { Link } from 'react-router'
import { SocialLinks } from '../components/SocialLinks/SocialLinks'
import { FooterNav } from '../components/FooterNav/FooterNav'
import { RouteHead } from '../components/SEO/RouteHead'
import { META } from '../lib/seo'
import { PageHeader } from '../components/PageHeader/PageHeader'
import { VerdictBox } from '../components/VerdictBox/VerdictBox'
import {
  IconLifeBuoy, IconTerminal, IconShieldCheck, IconCalendar, IconSend,
} from '../components/icons'

// Payback's own support address, not the studio-wide one. It is the single
// source of truth in the app too (src/utils/supportContact.ts) and is what the
// privacy policy and terms publish, so all three agree.
const SUPPORT_EMAIL = 'support@paybackdigital.com'

const HELP_TOPICS = [
  {
    icon: IconTerminal,
    iconClass: 'icon-orange',
    eyebrow: 'Something broke',
    title: 'An analysis failed or got stuck',
    body: 'Email what you were importing, roughly how large it was, and the message you saw. The app can attach device and version details for you: Settings, Support tab, Contact Support.',
  },
  {
    icon: IconCalendar,
    iconClass: 'icon-blue',
    eyebrow: 'Waiting on an export',
    title: 'Your export has not arrived',
    body: 'Google and Meta produce exports on their own schedule, usually within a day but sometimes longer for large accounts. They email you when it is ready. Nothing needs doing in the app until then.',
  },
  {
    icon: IconShieldCheck,
    iconClass: 'icon-green',
    eyebrow: 'Your data',
    title: 'Delete your account and data',
    body: 'Settings, Account tab, Data Management: Delete Account & Data. It removes the encrypted vault from your device, destroys the key, revokes access tokens and deletes your records from the backend.',
  },
  {
    icon: IconLifeBuoy,
    iconClass: 'icon-teal',
    eyebrow: 'Everything else',
    title: 'Questions and feature requests',
    body: 'Stuck on how something works, or want to see something built? Send a few sentences. The app also carries a fuller FAQ under Settings, Support tab.',
  },
] as const

export default function PaybackSupport() {
  return (
    <>
      <RouteHead {...META['/support/payback']} />

      <PageHeader>
        <header className="masthead">
          <p className="overline">Support · Ôwn (Payback)</p>
          <h1>Help with <em>Ôwn</em></h1>
          <p className="subtitle">
            Ôwn turns the data export you can already request from Google or
            Meta into a readable picture of your own behaviour. Here is how to
            get it working, and how to reach a person when it does not.
          </p>
          <p className="date-line">{SUPPORT_EMAIL} · Replies within 5 business days</p>
        </header>
      </PageHeader>

      <main className="container" id="main-content" tabIndex={-1}>
        <div className="intro-block">
          <p>
            Email{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> with what
            you were doing and what happened. If you can still open the app,
            Settings, Support tab, Contact Support attaches your device and app
            version automatically, which usually saves a round trip.
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

        <VerdictBox variant="contact">
          <p>
            <IconSend size={16} /> The fastest way to reach support is email:{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>. Include
            what you were importing, your device and OS version, and anything
            the app told you.
          </p>
        </VerdictBox>

        <div className="chapter-divider">
          <span className="ornament">✦ ✦ ✦</span>
        </div>

        <div className="section-header">
          <span className="section-num">Getting started</span>
          <h2>Requesting your data</h2>
          <div className="section-rule" />
        </div>

        <div className="intro-block">
          <p>
            Ôwn does not collect your history itself. You ask the service for a
            copy, they send you an archive, and you bring that archive in.{' '}
            <strong>Google Takeout and Meta exports work today.</strong> Apple,
            Microsoft, Amazon, TikTok, Snapchat and Spotify appear in the app
            marked as coming soon; you can read their export instructions there
            and start a request early, but Ôwn cannot analyse them yet.
          </p>
        </div>

        <h3 className="legal-subsection">Google Takeout</h3>
        <ol className="legal-list">
          <li>
            Go to{' '}
            <a href="https://takeout.google.com" target="_blank" rel="noopener noreferrer">
              takeout.google.com
            </a>{' '}
            and sign in.
          </li>
          <li>Choose <strong>Deselect all</strong>, then pick the services you want included: YouTube, Location History, Chrome, Maps, Search and so on.</li>
          <li>For delivery, either add it to Google Drive or download the <code>.zip</code>. Either works.</li>
          <li>Pick <strong>Export once</strong>, file type <code>.zip</code>. Any split size is fine; 2 GB is a reasonable balance.</li>
          <li>Google emails you when it is ready, usually within a day and longer for large accounts.</li>
          <li>Open Ôwn and bring it in with <strong>Import from Google Drive</strong>, where you pick the one file and Ôwn can see nothing else, or <strong>Pick a file from your device</strong>.</li>
        </ol>

        <h3 className="legal-subsection">Meta (Facebook and Instagram)</h3>
        <ol className="legal-list">
          <li>In the Accounts Centre, open <strong>Your information and permissions</strong>, then <strong>Download your information</strong>.</li>
          <li>Request a download, choosing <strong>JSON</strong> format where offered. JSON reads more reliably than HTML.</li>
          <li>Meta emails you when it is ready.</li>
          <li>Bring the <code>.zip</code> into Ôwn the same way as a Takeout archive.</li>
        </ol>

        <div className="chapter-divider">
          <span className="ornament">✦ ✦ ✦</span>
        </div>

        <div className="section-header">
          <span className="section-num">What it does</span>
          <h2>The two kinds of analysis</h2>
          <div className="section-rule" />
        </div>

        <div className="feature-item">
          <div className="feature-body">
            <span className="feature-eyebrow">No export needed</span>
            <h3 className="feature-title">Instant Analysis</h3>
            <p>
              Runs from signals already on your phone: your calendar, photo
              library and contacts, each optional and each requested through the
              usual permission prompt. It takes about a minute and gives you a
              persona, so you can see the shape of the thing before an export
              arrives. It does not score the behavioural categories.
            </p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-body">
            <span className="feature-eyebrow">Needs an export</span>
            <h3 className="feature-title">Quick Analysis</h3>
            <p>
              The full run, over the archive you imported. It produces the
              persona and scores all 135 behavioural categories, the same sort
              of categories advertisers sort people into. It takes a few
              minutes and can carry on in the background.
            </p>
          </div>
        </div>

        <div className="section-header">
          <span className="section-num">Privacy</span>
          <h2>What stays on your phone, and what does not</h2>
          <div className="section-rule" />
        </div>

        <VerdictBox variant="context">
          <p>
            <strong>Your calendar, photos and contacts are reduced on your
            device before anything is sent.</strong> Counts, time buckets and
            distances leave. Event titles, photo coordinates, photo and video
            content, and contact names do not.
          </p>
          <p>
            <strong>Analysing an imported export is different.</strong> The
            contents of the files you select are sent through our own server to
            Google's Gemini API to be read, and are not kept there. Nothing is
            sold, nothing goes to advertisers, and there is no cross-app
            tracking. Everything stored on your phone sits in an encrypted
            database whose key never leaves it.
          </p>
          <p>
            The <Link to="/legal/payback/privacy">privacy policy</Link> sets
            this out in full, including what the backend stores against your
            account.
          </p>
        </VerdictBox>

        <div className="section-header">
          <span className="section-num">By app</span>
          <h2>Policies and legal</h2>
          <div className="section-rule" />
        </div>

        <div className="policy-list">
          <div className="policy-row">
            <span className="policy-app">Ôwn (Payback)</span>
            <span className="policy-links">
              <Link to="/legal/payback/privacy">Privacy Policy</Link>
              <Link to="/legal/payback/terms">Terms of Service</Link>
              <Link to="/legal/payback/data-deletion">Account &amp; Data Deletion</Link>
            </span>
          </div>
        </div>

        <VerdictBox variant="context">
          <p>
            Looking for another app, or for the studio rather than Ôwn? The{' '}
            <Link to="/support">main support page</Link> covers everything
            published by An App Idea LLC.
          </p>
        </VerdictBox>
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
              <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
            </li>
            <li>
              <strong>Response time</strong>
              Within 5 business days.
            </li>
            <li>
              <strong>Supported today</strong>
              Google Takeout and Meta exports.
            </li>
            <li>
              <strong>Deleting your data</strong>
              In the app, or by email.
            </li>
          </ul>
          <FooterNav />
          <SocialLinks />
        </div>
      </footer>
    </>
  )
}
