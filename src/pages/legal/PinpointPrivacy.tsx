import { LegalPage } from '../../components/LegalPage/LegalPage'
import { SITE } from '../../data/site'

const OPERATOR = 'Mile High Interface LLC'
const CONTACT = SITE.email

export default function PinpointPrivacy() {
  return (
    <>
      <LegalPage
        path="/legal/pinpoint/privacy"
        appLabel="Pinpoint"
        docType="privacy"
        subtitle={`Pinpoint — ${OPERATOR}`}
        dateLine="Effective Date: June 4, 2026 · Last Updated: June 4, 2026"
      >

        <div className="intro-block">
          <p>
            {OPERATOR} operates the Pinpoint app, a civic engagement platform that helps you find
            your elected officials, contact them about issues you care about, pin public issues, and
            organize with other constituents.
          </p>
        </div>

        <div className="verdict-box note">
          <p>
            By creating an account or using the App, you agree to the practices described in this
            Privacy Policy.
          </p>
        </div>

        {/* § 1 */}
        <div className="section-header">
          <span className="section-num">01</span>
          <h2>Who We Are</h2>
          <div className="section-rule" />
        </div>
        <p>
          {OPERATOR} ("we", "us", or "our") operates the Pinpoint app, a civic engagement platform
          that helps you find your elected officials, contact them about issues you care about, pin
          public issues, and organize with other constituents.
        </p>
        <div className="verdict-box contact">
          <p>
            <strong>Contact:</strong>{' '}
            <a href={`mailto:${CONTACT}`}>{CONTACT}</a><br />
            <strong>Address:</strong> Aurora, CO, U.S.A.
          </p>
        </div>

        {/* § 2 */}
        <div className="section-header">
          <span className="section-num">02</span>
          <h2>What Data We Collect</h2>
          <div className="section-rule" />
        </div>

        <h3 className="legal-subsection">Account Information</h3>
        <ul className="legal-list">
          <li>First name and last name (collected during onboarding)</li>
          <li>Email address (from your sign-in provider)</li>
          <li>
            Postcode / ZIP code (optional, collected during onboarding to help locate your
            representatives)
          </li>
          <li>Authentication provider details (Google Sign-In or Apple Sign-In)</li>
          <li>Firebase user ID</li>
        </ul>
        <p>
          We do not collect or store passwords — sign-in is handled entirely by Google or Apple.
        </p>

        <h3 className="legal-subsection">Location Data</h3>
        <ul className="legal-list">
          <li>
            With your permission, your device's approximate location is used to identify your local
            elected officials.
          </li>
          <li>
            Location coordinates are converted into a state and postcode (reverse geocoding) to look
            up the right representatives. We do not continuously track or store a history of your
            location.
          </li>
          <li>
            You can decline or revoke location access at any time in your device settings; you may
            also enter a postcode manually instead.
          </li>
        </ul>

        <h3 className="legal-subsection">Activity and Engagement Data</h3>
        <ul className="legal-list">
          <li>Officials and issues you pin or favorite, and upvotes/downvotes you cast</li>
          <li>
            Outreach history — a record, stored on your device, of which officials you have
            contacted, about which topic, and when
          </li>
          <li>Follow-up reminders you schedule, stored on your device</li>
          <li>App preferences and onboarding progress</li>
        </ul>

        <h3 className="legal-subsection">Content You Create</h3>
        <ul className="legal-list">
          <li>
            <strong>Pinboard issues</strong> you create (title, summary, category, and whether the
            issue is local or national)
          </li>
          <li>Issues you "back" or co-sign</li>
          <li>
            <strong>Posse</strong> (group) memberships, and the text messages you post in posses
          </li>
          <li>Your public display name shown alongside your posts and messages</li>
          <li>Reports you submit about other users' content</li>
        </ul>

        <h3 className="legal-subsection">Outreach Messages</h3>
        <p>
          When you send a message to an official through the app, we process the message subject and
          body, the official's contact email, and your name and email address (used as the reply-to
          address) in order to deliver your message.
        </p>

        <h3 className="legal-subsection">Device Information</h3>
        <p>
          Basic device and app information (device type, operating system, and app version) for
          security, diagnostics, and support.
        </p>

        {/* § 3 */}
        <div className="section-header">
          <span className="section-num">03</span>
          <h2>How We Use Your Data</h2>
          <div className="section-rule" />
        </div>
        <ul className="legal-list">
          <li>
            To provide the core app features (finding your representatives, contacting officials,
            the Pinboard, and Posses)
          </li>
          <li>
            To identify your local elected officials based on your location or postcode
          </li>
          <li>To deliver outreach messages you choose to send to officials</li>
          <li>To remind you to follow up on messages you have sent</li>
          <li>
            To display your public content and display name to other users in the Pinboard and
            Posses
          </li>
          <li>
            For moderation and safety (reviewing reports, and supporting muting, banning, and
            removal of abusive content)
          </li>
          <li>To maintain the security and reliability of the service</li>
          <li>To comply with legal obligations</li>
        </ul>

        {/* § 4 */}
        <div className="section-header">
          <span className="section-num">04</span>
          <h2>Data Storage and Retention</h2>
          <div className="section-rule" />
        </div>
        <ul className="legal-list">
          <li>
            Server-side data (your account profile, favorites, votes, and the content you post) is
            stored on US-based infrastructure using Firebase (authentication and the Firestore
            database) and our backend hosted on Railway.
          </li>
          <li>
            Some data is stored locally on your device using on-device storage, including your
            outreach history, follow-up reminders, favorites, votes, and app preferences. This
            local data persists between sessions and is cleared when you sign out.
          </li>
          <li>
            We retain server-side data until you delete your account or request its deletion. Public
            content you posted (such as Pinboard issues and Posse messages) may persist in aggregate
            or anonymized form where others have interacted with it.
          </li>
        </ul>

        {/* § 5 */}
        <div className="section-header">
          <span className="section-num">05</span>
          <h2>Third-Party Services</h2>
          <div className="section-rule" />
        </div>
        <p>
          We use the following third-party services to operate the app. Your data may be transmitted
          to these services as necessary:
        </p>
        <div className="legal-table-wrap">
          <table className="legal-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Purpose</th>
                <th>Data Shared</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Firebase</strong> (Google)</td>
                <td>
                  Authentication and the Firestore database that stores issues, posses, messages,
                  profiles, and reports
                </td>
                <td>Email, name, auth tokens, and the content you post</td>
              </tr>
              <tr>
                <td><strong>Pinpoint Backend</strong> (Railway)</td>
                <td>Account profile, favorites and votes, and relaying outreach messages</td>
                <td>Profile data, message content, official contact email</td>
              </tr>
              <tr>
                <td>
                  <strong>Email Delivery Provider</strong>
                  <br />
                  <span className="legal-table-note">(e.g. Postmark / SendGrid, via our backend)</span>
                </td>
                <td>Relaying the outreach emails you send to officials</td>
                <td>
                  Your name, your email (as reply-to), message content, official's email
                </td>
              </tr>
              <tr>
                <td><strong>OpenStates</strong></td>
                <td>Elected official and legislative data</td>
                <td>Location or jurisdiction lookups (public data)</td>
              </tr>
              <tr>
                <td><strong>Nominatim</strong> (OpenStreetMap)</td>
                <td>Reverse geocoding (turning coordinates into a state/postcode)</td>
                <td>Approximate location coordinates</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Outreach emails are relayed through our backend — your device does not email officials
          directly, and the email delivery provider receives only what is needed to deliver your
          message.
        </p>

        {/* § 6 */}
        <div className="section-header">
          <span className="section-num">06</span>
          <h2>Sharing and Disclosure</h2>
          <div className="section-rule" />
        </div>
        <ul className="legal-list">
          <li>We do not sell your personal data.</li>
          <li>
            Content you post publicly — including Pinboard issues, Posse messages, and your public
            display name — is visible to other users of the app.
          </li>
          <li>
            Aggregated or anonymized data may be used for product improvement or reporting.
          </li>
          <li>
            We may disclose data if required by law, or to protect the rights, safety, and security
            of our users and the service.
          </li>
        </ul>

        {/* § 7 */}
        <div className="section-header">
          <span className="section-num">07</span>
          <h2>Your Rights</h2>
          <div className="section-rule" />
        </div>
        <ul className="legal-list">
          <li>
            <strong>Access and deletion:</strong> You may request a copy of your data, or request
            deletion of your account and associated data, by contacting us at{' '}
            <a href={`mailto:${CONTACT}`}>{CONTACT}</a>. Deleting your account removes your
            server-side profile data and clears locally stored data on the device.
          </li>
          <li>
            <strong>Location:</strong> You may withdraw location permission at any time in your
            device settings, or enter your postcode manually instead.
          </li>
          <li>
            <strong>Sign out:</strong> Signing out clears locally stored data from the device.
          </li>
        </ul>

        {/* § 8 */}
        <div className="section-header">
          <span className="section-num">08</span>
          <h2>Children's Privacy</h2>
          <div className="section-rule" />
        </div>
        <p>
          The app is not intended for children under 13. We do not knowingly collect data from
          children under 13. If you believe a child under 13 has provided us with personal data,
          please contact us and we will delete it.
        </p>

        {/* § 9 */}
        <div className="section-header">
          <span className="section-num">09</span>
          <h2>Changes to This Policy</h2>
          <div className="section-rule" />
        </div>
        <p>
          We may update this policy from time to time. Changes will be posted in-app and on our
          website, and we will update the "Effective Date" above. Continued use of the app after
          changes take effect constitutes acceptance of the updated policy.
        </p>

        {/* § 10 */}
        <div className="section-header">
          <span className="section-num">10</span>
          <h2>Contact Us</h2>
          <div className="section-rule" />
        </div>

        <div className="verdict-box contact">
          <p>
            <strong>{OPERATOR}</strong><br />
            Email: <a href={`mailto:${CONTACT}`}>{CONTACT}</a><br />
            Address: Aurora, CO, U.S.A.
          </p>
          <p>
            For questions about this Privacy Policy or to exercise your data rights, contact us at
            the address above. We will respond within 30 days.
          </p>
        </div>

      </LegalPage>

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
