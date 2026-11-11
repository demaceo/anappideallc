import { Link } from 'react-router'
import { LegalPage } from '../../components/LegalPage/LegalPage'
import { SITE } from '../../data/site'

// Privacy policy for this website itself (the contact form, analytics and
// hosting). The per-app policies live under /legal/:app; this one covers what a
// visitor shares when they reach out. Keep it in step with api/contact.ts and
// the analytics script in index.html: if either starts collecting something
// new, this page must say so.
function Section({ num, title }: { num: string; title: string }) {
  return (
    <div className="section-header">
      <span className="section-num">{num}</span>
      <h2>{title}</h2>
      <div className="section-rule" />
    </div>
  )
}

export default function SitePrivacy() {
  return (
    <LegalPage
      path="/privacy"
      appLabel="This website"
      docType="privacy"
      subtitle={`anappidea.llc, ${SITE.name}`}
      dateLine="Effective Date: November 11, 2026 · Last Updated: November 11, 2026"
    >
      <div className="intro-block">
        <p>
          This policy explains what {SITE.name} ("An App Idea," "I," "me") collects when you visit
          this website or send a message through it, and what happens to it. The short version: I
          only collect what you choose to send me, I use it to reply to you, and I never sell it.
        </p>
      </div>

      <Section num="01" title="What you send through the contact form" />
      <p>When you fill in the contact form, I receive what you enter:</p>
      <ul>
        <li>Your name, and an email address and/or phone number</li>
        <li>Any other way to reach you and how you prefer to be contacted</li>
        <li>What you tell me about your project: type, platforms, business category, audience, budget, and description</li>
        <li>A voice note, if you choose to record one</li>
      </ul>
      <p>
        The form also measures how long it was open before you sent it. That number is only used to
        filter out spam bots and is not stored.
      </p>

      <Section num="02" title="How I use it" />
      <ul>
        <li>To read your message and reply to you</li>
        <li>To send you one confirmation email that your message arrived, if you gave an email address</li>
        <li>To prepare for a call or a quote, if you ask for one</li>
      </ul>
      <p>
        I do not add you to a mailing list, and I do not sell, rent or share your information for
        anyone else's marketing.
      </p>

      <Section num="03" title="Services that handle it" />
      <ul>
        <li><strong>Resend</strong> delivers form messages and the confirmation email to and from my inbox.</li>
        <li><strong>Vercel</strong> hosts this website. Like any web host, it keeps short-lived technical logs (such as IP addresses) to run and protect the site.</li>
        <li><strong>Plausible Analytics</strong> counts visits to understand which pages are useful. It uses no cookies and does not collect personal information.</li>
        <li><strong>Calendly</strong> handles bookings if you schedule a call. What you enter there is covered by Calendly's own privacy policy.</li>
      </ul>

      <Section num="04" title="Cookies" />
      <p>
        This website does not use advertising or tracking cookies.
      </p>

      <Section num="05" title="How long I keep it" />
      <p>
        Messages stay in my email for as long as we are in touch or working together, and for a
        reasonable time after, in case you come back to the conversation. Ask me to delete your
        messages at any time and I will.
      </p>

      <Section num="06" title="Your choices" />
      <p>
        You can ask what I have about you, ask me to correct it, or ask me to delete it. Email{' '}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a> and I will respond within a few business
        days.
      </p>

      <Section num="07" title="Children" />
      <p>This website is meant for business owners and is not directed at children under 13.</p>

      <Section num="08" title="Changes and app policies" />
      <p>
        If this policy changes, the date at the top changes with it. The apps I have built have
        their own privacy policies and terms, listed on the <Link to="/legal">Legal</Link> page.
      </p>
    </LegalPage>
  )
}
