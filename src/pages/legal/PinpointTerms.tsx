import { RouteHead } from '../../components/SEO/RouteHead'
import { PageHeader } from '../../components/PageHeader/PageHeader'
import { META } from '../../lib/seo'
import { SITE } from '../../data/site'

const OPERATOR = 'Mile High Interface LLC'
const CONTACT = SITE.email

export default function PinpointTerms() {
  return (
    <>
      <RouteHead {...META['/legal/pinpoint/terms']} />

      <PageHeader>
        <header className="masthead">
          <p className="overline">Legal · Pinpoint</p>
          <h1>Terms of <em>Service</em></h1>
          <p className="subtitle">Pinpoint — {OPERATOR}</p>
          <p className="date-line">Effective Date: June 4, 2026</p>
        </header>
      </PageHeader>

      <main className="container" id="main-content" tabIndex={-1}>

        <div className="intro-block">
          <p>
            By creating an account or using the Pinpoint app, you agree to these Terms of Service
            and our{' '}
            <a href="/legal/pinpoint/privacy">Privacy Policy</a>.
          </p>
        </div>

        {/* § 1 */}
        <div className="section-header">
          <span className="section-num">01</span>
          <h2>Acceptance</h2>
          <div className="section-rule" />
        </div>
        <p>
          By creating an account or using the Pinpoint app, you agree to these Terms of Service and
          our{' '}
          <a href="/legal/pinpoint/privacy">Privacy Policy</a>.
        </p>

        {/* § 2 */}
        <div className="section-header">
          <span className="section-num">02</span>
          <h2>Eligibility</h2>
          <div className="section-rule" />
        </div>
        <p>
          You must be at least 13 years old to use the app. By using the app, you represent that
          you meet this requirement.
        </p>

        {/* § 3 */}
        <div className="section-header">
          <span className="section-num">03</span>
          <h2>Account Responsibilities</h2>
          <div className="section-rule" />
        </div>
        <ul className="legal-list">
          <li>
            You sign in using Google Sign-In or Apple Sign-In and provide your first and last name
            (and, optionally, your postcode) during onboarding. You agree to provide accurate
            information.
          </li>
          <li>
            You are responsible for maintaining the security of the third-party account you use to
            sign in.
          </li>
          <li>You are responsible for all activity that occurs under your account.</li>
          <li>
            You must not create multiple accounts to evade moderation or impersonate others.
          </li>
        </ul>

        {/* § 4 */}
        <div className="section-header">
          <span className="section-num">04</span>
          <h2>Acceptable Use</h2>
          <div className="section-rule" />
        </div>
        <p>You agree not to:</p>
        <ul className="legal-list">
          <li>
            Post illegal, abusive, threatening, harassing, hateful, or otherwise harmful content on
            the Pinboard or in Posses
          </li>
          <li>Impersonate government officials, representatives, or other users</li>
          <li>
            Send abusive, threatening, fraudulent, spam, or unlawful messages to officials through
            the outreach feature
          </li>
          <li>
            Send outreach messages on behalf of anyone other than yourself, or misrepresent your
            identity to an official
          </li>
          <li>
            Attempt to manipulate issue backing, voting, or other civic engagement metrics
          </li>
          <li>Circumvent moderation, muting, banning, or reporting systems</li>
          <li>Use the app for commercial solicitation, advertising, or spam</li>
          <li>Interfere with the app's operation, security, or other users' experience</li>
        </ul>

        {/* § 5 */}
        <div className="section-header">
          <span className="section-num">05</span>
          <h2>Contacting Officials (Outreach)</h2>
          <div className="section-rule" />
        </div>
        <ul className="legal-list">
          <li>
            The app lets you compose and send messages to elected officials. We provide message
            templates as a starting point; you are responsible for reviewing and editing your
            message before sending it.
          </li>
          <li>
            When you send a message, we relay it to the official on your behalf, using your email
            address as the reply-to address. You are solely responsible for the content of the
            messages you send.
          </li>
          <li>
            We do not guarantee that any official will receive, read, or respond to your message,
            and delivery may depend on the accuracy of publicly available contact information and
            the availability of our delivery providers.
          </li>
          <li>
            If automated delivery is unavailable, the app may instead copy your message or open a
            phone, web form, or email channel so you can send it yourself.
          </li>
        </ul>

        {/* § 6 */}
        <div className="section-header">
          <span className="section-num">06</span>
          <h2>User Content and Moderation</h2>
          <div className="section-rule" />
        </div>
        <ul className="legal-list">
          <li>
            You retain ownership of the content you create (Pinboard issues, Posse messages, and
            other posts).
          </li>
          <li>
            By posting content in the app, you grant {OPERATOR} a non-exclusive, royalty-free
            license to host, display, distribute, and moderate that content within the app for the
            purpose of operating the service.
          </li>
          <li>We may remove or restrict content that violates these terms or applicable law.</li>
          <li>
            Posses are moderated. Posse moderators and we may mute, ban, or remove users or
            content. Users may report content, and we may take action on reports at our discretion.
          </li>
          <li>
            Your public display name and public content are visible to other users.
          </li>
        </ul>

        {/* § 7 */}
        <div className="section-header">
          <span className="section-num">07</span>
          <h2>Civic Data and Information</h2>
          <div className="section-rule" />
        </div>
        <ul className="legal-list">
          <li>
            Information about elected officials, districts, and legislation is sourced from
            third-party public databases (including OpenStates) and may not always be current,
            complete, or accurate.
          </li>
          <li>
            We do not guarantee the accuracy, completeness, or timeliness of any civic data
            displayed in the app.
          </li>
          <li>
            The app is not a substitute for official government sources when making voting or civic
            decisions.
          </li>
        </ul>

        {/* § 8 */}
        <div className="section-header">
          <span className="section-num">08</span>
          <h2>Account Termination</h2>
          <div className="section-rule" />
        </div>
        <ul className="legal-list">
          <li>
            You may request deletion of your account at any time by contacting us at{' '}
            <a href={`mailto:${CONTACT}`}>{CONTACT}</a>. Deletion removes your server-side data
            and clears locally stored data on the device.
          </li>
          <li>
            We may suspend or terminate accounts that violate these terms, engage in abusive
            behavior, or are used for purposes inconsistent with the app's civic engagement mission.
          </li>
        </ul>

        {/* § 9 */}
        <div className="section-header">
          <span className="section-num">09</span>
          <h2>Intellectual Property</h2>
          <div className="section-rule" />
        </div>
        <ul className="legal-list">
          <li>
            The Pinpoint app, its design, features, and original content are owned by {OPERATOR}.
          </li>
          <li>
            Public civic data displayed in the app is sourced from third-party providers and is
            subject to their respective terms.
          </li>
        </ul>

        {/* § 10 */}
        <div className="section-header">
          <span className="section-num">10</span>
          <h2>Disclaimers</h2>
          <div className="section-rule" />
        </div>
        <div className="verdict-box warning">
          <ul className="legal-list">
            <li>
              The app is provided "as is" and "as available" without warranties of any kind,
              express or implied.
            </li>
            <li>
              We do not warrant that the app will be uninterrupted or error-free, that messages to
              officials will be delivered or answered, or that civic data will be accurate or
              current.
            </li>
            <li>
              We are not liable for user-generated content, the content of messages you send, or
              third-party data.
            </li>
          </ul>
        </div>

        {/* § 11 */}
        <div className="section-header">
          <span className="section-num">11</span>
          <h2>Limitation of Liability</h2>
          <div className="section-rule" />
        </div>
        <div className="verdict-box warning">
          <p>
            To the maximum extent permitted by applicable law, {OPERATOR} shall not be liable for
            any indirect, incidental, special, consequential, or punitive damages arising from your
            use of the app, including but not limited to reliance on civic data, messages sent to
            officials, or interactions with other users.
          </p>
        </div>

        {/* § 12 */}
        <div className="section-header">
          <span className="section-num">12</span>
          <h2>Governing Law</h2>
          <div className="section-rule" />
        </div>
        <p>
          These terms are governed by the laws of the <strong>State of Colorado</strong>, U.S.A.,
          without regard to conflict of law principles.
        </p>

        {/* § 13 */}
        <div className="section-header">
          <span className="section-num">13</span>
          <h2>Changes</h2>
          <div className="section-rule" />
        </div>
        <p>
          We may update these terms from time to time. Material changes will be communicated
          through the app, and we will update the "Effective Date" above. Continued use of the app
          after changes take effect constitutes acceptance of the updated terms.
        </p>

        {/* § 14 */}
        <div className="section-header">
          <span className="section-num">14</span>
          <h2>Contact</h2>
          <div className="section-rule" />
        </div>
        <div className="verdict-box contact">
          <p>
            For questions about these terms, contact{' '}
            <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
          </p>
        </div>

      </main>

      <footer className="sources-section">
        <div className="container">
          <div className="sources-header">
            <h3>Document Info</h3>
            <div className="sources-header-rule" />
          </div>
          <ul className="source-list">
            <li>
              <strong>App</strong>
              Pinpoint
            </li>
            <li>
              <strong>Platform</strong>
              iOS &amp; Android
            </li>
            <li>
              <strong>Operator</strong>
              {OPERATOR}
            </li>
            <li>
              <strong>Publisher</strong>
              {SITE.name}
            </li>
            <li>
              <strong>Effective Date</strong>
              June 4, 2026
            </li>
            <li>
              <strong>Contact</strong>
              {CONTACT}
            </li>
          </ul>
        </div>
      </footer>
    </>
  )
}
