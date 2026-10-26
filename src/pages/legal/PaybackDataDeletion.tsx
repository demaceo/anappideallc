import { LegalPage } from '../../components/LegalPage/LegalPage'
import { SocialLinks } from '../../components/SocialLinks/SocialLinks'
import { SITE } from '../../data/site'

const OPERATOR = 'An App Idea LLC'
const CONTACT = SITE.email

export default function PaybackDataDeletion() {
  return (
    <>
      <LegalPage
        path="/legal/payback/data-deletion"
        appLabel="Ôwn (Payback)"
        docType="data-deletion"
        subtitle={`Ôwn (Payback Own) — ${OPERATOR}`}
        dateLine="Last Updated: September 17, 2026"
      >
        <div className="intro-block">
          <p>
            This page explains how to delete your account and every piece of data associated with
            it, what is removed immediately, and what takes longer. It is maintained to meet the
            Google Play Store and Apple App Store data-deletion requirements.
          </p>
        </div>

        <div className="verdict-box note">
          <p>
            <strong>Most of your data is only ever on your phone.</strong> Your analysis results,
            personas and behavioural signals live in an encrypted database on your device and have
            no server copy, so deleting in the app removes them outright. Two things do leave your
            device and are covered below: the contents of export files you select for analysis, and
            your account identity plus per-category scores if you have not opted out of analytics
            sync.
          </p>
        </div>

        {/* § 1 */}
        <div className="section-header">
          <span className="section-num">01</span>
          <h2>How to Delete Your Account and All Data</h2>
          <div className="section-rule" />
        </div>

        <h3 className="legal-subsection">Option 1 — Delete inside the app (instant)</h3>
        <p>This is the fastest route and removes all on-device data immediately.</p>
        <ul className="legal-list">
          <li>Open the <strong>Ôwn</strong> app.</li>
          <li>Tap the <strong>Settings</strong> tab in the bottom navigation bar.</li>
          <li>Stay on the <strong>Account</strong> tab, which opens first, and scroll to <strong>Data Management</strong>.</li>
          <li>Tap <strong>Delete Account &amp; Data</strong>.</li>
          <li>Confirm when prompted.</li>
        </ul>
        <p>
          This deletes the encrypted vault and its contents, clears the stored keys, revokes the
          app's Google access tokens, and removes your analytics records from our backend. No
          further action is required.
        </p>

        <h3 className="legal-subsection">Option 2 — Request deletion by email</h3>
        <p>
          If you cannot access the app, or you want written confirmation that server-side data is
          gone:
        </p>
        <ul className="legal-list">
          <li><strong>Email:</strong> <a href={`mailto:${CONTACT}`}>{CONTACT}</a></li>
          <li><strong>Subject:</strong> <code>Data Deletion Request – Ôwn</code></li>
          <li><strong>Include:</strong> the email address linked to the account you signed in with</li>
        </ul>
        <p>
          We will process the request and send confirmation within <strong>5 business days</strong>.
        </p>

        <h3 className="legal-subsection">Option 3 — Delete analytics data only</h3>
        <p>
          Category analytics sync is <strong>opt-out</strong>, not opt-in: it is on unless you
          turned it off, so this applies to you unless you opted out. To remove just those records
          while keeping the app installed:
        </p>
        <ul className="legal-list">
          <li><strong>In-app:</strong> Settings &gt; Account &gt; <strong>Delete Analytics Data</strong></li>
          <li><strong>By email:</strong> <a href={`mailto:${CONTACT}`}>{CONTACT}</a> with subject <code>Analytics Deletion Request – Ôwn</code></li>
        </ul>

        {/* § 2 */}
        <div className="section-header">
          <span className="section-num">02</span>
          <h2>What Is Deleted, and When</h2>
          <div className="section-rule" />
        </div>

        <div className="legal-table-wrap">
          <table className="legal-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Where it lives</th>
                <th>Deleted when</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Analysis results, personas, behavioural signals</td>
                <td>Your device, in AES-256 encrypted SQLite via SQLCipher 4</td>
                <td><strong>Immediately</strong>, on in-app delete or uninstall</td>
                <td>No server copy exists</td>
              </tr>
              <tr>
                <td>Google and Apple sign-in tokens</td>
                <td>Your device, in the iOS Keychain or Android Keystore</td>
                <td>On in-app delete, uninstall, or manual revoke</td>
                <td>Revoke separately at <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer">myaccount.google.com/permissions</a></td>
              </tr>
              <tr>
                <td>Account identity and per-category scores</td>
                <td>Our backend database (Railway PostgreSQL, US)</td>
                <td>Within <strong>30 days</strong> of a confirmed request</td>
                <td>Includes the account identifier, email address and display name</td>
              </tr>
              <tr>
                <td>AI request contents sent for analysis</td>
                <td>Our backend proxy, then Google Gemini</td>
                <td>Not persisted by us after the request completes</td>
                <td>Google states prompts may be held up to 55 days for abuse monitoring, and are not used to train models</td>
              </tr>
              <tr>
                <td>Backend operational logs</td>
                <td>Railway platform log stream, metadata only</td>
                <td>Governed by Railway's log-retention policy</td>
                <td>Tokens, API keys and request bodies are redacted before emission</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="verdict-box note">
          <p>
            <strong>What never reaches a server at all.</strong> Calendar event titles and
            locations, photo and video content, photo coordinates, and contact names, email
            addresses and phone numbers are reduced on your device to counts, time buckets and
            distances before anything is sent. The underlying text and coordinates are neither
            transmitted nor stored, so there is nothing of them to delete anywhere but your phone.
          </p>
        </div>

        {/* § 3 */}
        <div className="section-header">
          <span className="section-num">03</span>
          <h2>Revoking Account Access</h2>
          <div className="section-rule" />
        </div>

        <p>
          Revoking access is separate from deleting data. It stops the app reaching your account
          but does not remove anything already on your device, so use Option 1 or 2 above for that.
        </p>
        <ul className="legal-list">
          <li>
            <strong>Google:</strong> go to <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer">myaccount.google.com/permissions</a>, find <strong>Payback</strong>, and choose <strong>Remove Access</strong>.
          </li>
          <li>
            <strong>Apple:</strong> on your device, open Settings, tap your name, then <strong>Sign in with Apple</strong>, select <strong>Payback</strong>, and choose <strong>Stop using Apple ID</strong>.
          </li>
        </ul>

        {/* § 4 */}
        <div className="section-header">
          <span className="section-num">04</span>
          <h2>Contact</h2>
          <div className="section-rule" />
        </div>

        <ul className="legal-list">
          <li><strong>Email:</strong> <a href={`mailto:${CONTACT}`}>{CONTACT}</a></li>
          <li><strong>Developer:</strong> {OPERATOR}</li>
          <li><strong>Privacy Policy:</strong> <a href="/legal/payback/privacy">anappidea.llc/legal/payback/privacy</a></li>
          <li><strong>Response time:</strong> 5 business days</li>
        </ul>
      </LegalPage>

      <footer className="legal-footer">
        <div className="container">
          <ul className="legal-footer-meta">
            <li>
              <strong>Operator</strong>
              {SITE.name}
            </li>
            <li>
              <strong>Last Updated</strong>
              September 17, 2026
            </li>
          </ul>
          <SocialLinks />
        </div>
      </footer>
    </>
  )
}
