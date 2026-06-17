import { LegalPage } from '../../components/LegalPage/LegalPage'
import { SocialLinks } from '../../components/SocialLinks/SocialLinks'
import { SITE } from '../../data/site'

const OPERATOR = 'Mile High Interface LLC'
const CONTACT = SITE.email

export default function StlmntPrivacy() {
  return (
    <>
      <LegalPage
        path="/legal/stlmnt/privacy"
        appLabel="STLMNT"
        docType="privacy"
        subtitle={`STLMNT — ${OPERATOR}`}
        dateLine="Effective Date: June 17, 2026 · Last Updated: June 17, 2026"
      >

        <div className="intro-block">
          <p>
            {OPERATOR} operates STLMNT, a free app that surfaces verified, open U.S. class action
            settlements, helps you check whether you may be eligible, assists you in filling out the
            official claim form, and lets you track the status of claims you file — all in one place.
          </p>
        </div>

        <div className="verdict-box note">
          <p>
            STLMNT is not a legal service and never files claims on your behalf. You review and
            submit every claim yourself, on the official settlement administrator's site. By creating
            an account or using the App, you agree to the practices described in this Privacy Policy.
          </p>
        </div>

        {/* § 1 */}
        <div className="section-header">
          <span className="section-num">01</span>
          <h2>Who We Are</h2>
          <div className="section-rule" />
        </div>
        <p>
          {OPERATOR} ("we", "us", or "our") operates the STLMNT app, a tool for discovering open
          class action settlements, checking eligibility, preparing the official claim form, and
          tracking the claims you choose to file.
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
          <li>
            Email address, and a password if you create an account with email and password. Passwords
            are handled by Firebase Authentication — we never see or store your password ourselves.
          </li>
          <li>
            If you sign in with Google or Apple, we receive your email address and a unique account
            identifier from that provider. We do not receive your Google or Apple password.
          </li>
          <li>Your Firebase user ID, used to associate your data with your account.</li>
        </ul>

        <h3 className="legal-subsection">Autofill Profile (Optional)</h3>
        <p>
          To save you from re-typing the same details into every claim form, you may optionally
          create an autofill profile. You choose whether to fill this in, and you can edit or clear
          it at any time. It may include:
        </p>
        <ul className="legal-list">
          <li>First and last name</li>
          <li>Mailing address (two address lines, city, state, and ZIP code)</li>
          <li>Email address</li>
          <li>
            Payment handles only — your Venmo, Zelle, or Cash App identifier, used because some
            settlements pay out through those services
          </li>
        </ul>
        <p>
          STLMNT copies these values to your clipboard, or pre-fills fields, so you can paste them
          into the official claim form yourself. The App does not submit them for you.
        </p>

        <h3 className="legal-subsection">Claims and Activity Data</h3>
        <ul className="legal-list">
          <li>
            The settlements you save and the claims you track, including the settlement title, the
            date you filed, the claim status, any confirmation number you record, and notes you add
          </li>
          <li>Deadline reminders you schedule</li>
          <li>
            Brands you select in "Select brands you bought" — names of brands only, used to flag
            settlements whose defendant matches. We do not collect purchase history, receipts of what
            you bought, or any link to your bank or cards for this feature.
          </li>
          <li>Your notification preferences and onboarding progress</li>
        </ul>

        <h3 className="legal-subsection">Receipt Photos</h3>
        <p>
          You may optionally attach a photo of a receipt to a claim, for your own records. In the
          current version of the App, receipt photos stay on your device only — they are stored in
          the app's local storage and are never uploaded to us or anyone else.
        </p>

        <h3 className="legal-subsection">Notifications and Device Data</h3>
        <ul className="legal-list">
          <li>
            If you enable notifications, we register your device's push token (provided by the Expo
            push service) so we can send reminders and updates. Deadline reminders are scheduled
            locally on your device.
          </li>
          <li>
            Basic device information needed to register for notifications and to keep the App secure
            and reliable.
          </li>
        </ul>

        {/* § 3 */}
        <div className="section-header">
          <span className="section-num">03</span>
          <h2>What We Never Collect</h2>
          <div className="section-rule" />
        </div>
        <div className="verdict-box warning">
          <p>
            STLMNT is built so it never needs your most sensitive financial information. We do{' '}
            <strong>not</strong> collect or store:
          </p>
        </div>
        <ul className="legal-list">
          <li>Bank routing or account numbers</li>
          <li>Social Security numbers</li>
          <li>Credit or debit card numbers</li>
        </ul>
        <p>
          For payouts, we store payment handles only (such as a Venmo username) — never the
          underlying account or card. If a particular settlement requires sensitive identifiers, you
          enter them directly on the official administrator's site, not in STLMNT.
        </p>

        {/* § 4 */}
        <div className="section-header">
          <span className="section-num">04</span>
          <h2>How We Use Your Data</h2>
          <div className="section-rule" />
        </div>
        <ul className="legal-list">
          <li>To provide the core features: discovering settlements, the eligibility self-check, claim-form autofill, and claim tracking</li>
          <li>To pre-fill or copy your autofill details so you can paste them into official claim forms</li>
          <li>To remind you about approaching claim deadlines and to send updates you opt into (such as new settlements or status changes)</li>
          <li>To flag settlements that may match the brands you selected</li>
          <li>To keep your account and data secure, and to prevent abuse of the service</li>
          <li>To maintain, debug, and improve the App</li>
          <li>To comply with legal obligations</li>
        </ul>
        <p>
          We do not use your personal data to train AI models, and we do not send your personal
          data to any AI provider. We use AI only on our own servers to help draft entries for the
          public settlement catalog from public court and regulatory records — that process never
          involves your account, profile, or claims data.
        </p>

        {/* § 5 */}
        <div className="section-header">
          <span className="section-num">05</span>
          <h2>How Your Data Is Stored and Protected</h2>
          <div className="section-rule" />
        </div>
        <ul className="legal-list">
          <li>
            <strong>Encryption of sensitive fields.</strong> When your account is backed by our
            cloud, the most sensitive parts of your autofill profile — your name, address lines, and
            payment handles — are encrypted with Google Cloud KMS field-level (envelope) encryption
            before they are written to the database, and are only decrypted for you through a secured
            gateway. The remaining profile fields (city, state, ZIP, and email) are stored in your
            private, access-controlled record.
          </li>
          <li>
            <strong>Server-side storage.</strong> Your account, claims, account settings, and
            encrypted profile are stored on U.S.-based infrastructure using Firebase (Authentication,
            the Firestore database, and Cloud Functions). Access is restricted to your own account by
            default-deny security rules.
          </li>
          <li>
            <strong>On-device storage.</strong> Receipt photos are kept on your device only. If the
            App is used without our cloud configured ("demo mode"), your account, autofill profile,
            and claims are stored only on your device and are cleared when you sign out.
          </li>
        </ul>

        {/* § 6 */}
        <div className="section-header">
          <span className="section-num">06</span>
          <h2>Third-Party Services</h2>
          <div className="section-rule" />
        </div>
        <p>
          We use the following third-party services to operate the App. Your data may be transmitted
          to these services only as needed to provide the features described above:
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
                <td><strong>Firebase Authentication</strong> (Google)</td>
                <td>Account sign-in and identity</td>
                <td>Email, authentication tokens, account identifier</td>
              </tr>
              <tr>
                <td><strong>Cloud Firestore</strong> (Google / Firebase)</td>
                <td>Stores your claims, account settings, and encrypted profile</td>
                <td>Claims data, brand selections, notification preferences, encrypted profile fields</td>
              </tr>
              <tr>
                <td><strong>Cloud Functions &amp; Google Cloud KMS</strong></td>
                <td>The secured gateway that encrypts and decrypts sensitive profile fields</td>
                <td>Autofill profile fields (names, address, payment handles)</td>
              </tr>
              <tr>
                <td><strong>Firebase App Check</strong></td>
                <td>Verifies requests come from the genuine app, to prevent abuse</td>
                <td>App and device integrity signals (reCAPTCHA on web)</td>
              </tr>
              <tr>
                <td><strong>Google Sign-In / Apple Sign-In</strong></td>
                <td>Optional sign-in providers</td>
                <td>Email and account identifier from the provider you choose</td>
              </tr>
              <tr>
                <td>
                  <strong>Expo / EAS</strong>
                  <br />
                  <span className="legal-table-note">(push service, app builds &amp; updates)</span>
                </td>
                <td>Delivering remote notifications and app updates</td>
                <td>Device push token</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          The public settlement catalog is built from public records and settlement-administrator
          sources. Those sources receive no personal data about you — they supply settlement
          information to us, not the other way around.
        </p>

        {/* § 7 */}
        <div className="section-header">
          <span className="section-num">07</span>
          <h2>Sharing and Disclosure</h2>
          <div className="section-rule" />
        </div>
        <ul className="legal-list">
          <li>We do not sell your personal data.</li>
          <li>We do not share your personal data with advertisers, and STLMNT contains no advertising.</li>
          <li>
            We do not transmit your claim forms, autofill details, or receipts to settlement
            administrators on your behalf — you submit those yourself on the official site.
          </li>
          <li>Aggregated or anonymized statistics may be used to understand usage and improve the App.</li>
          <li>
            We may disclose data if required by law, or to protect the rights, safety, and security
            of our users and the service.
          </li>
        </ul>

        {/* § 8 */}
        <div className="section-header">
          <span className="section-num">08</span>
          <h2>Data Retention and Deletion</h2>
          <div className="section-rule" />
        </div>
        <ul className="legal-list">
          <li>
            We retain your account, profile, and claims data until you delete it or delete your
            account.
          </li>
          <li>
            You can delete your account and all associated data from within the App (Profile →
            Delete account &amp; data). This removes your account-level settings, your encrypted
            autofill profile, and your claims. A server-side safeguard additionally removes any
            remaining account data if the in-app cleanup is interrupted.
          </li>
          <li>
            Signing out clears locally stored data on the device. Receipt photos stored on your
            device are removed when you delete the associated claim or your account.
          </li>
        </ul>

        {/* § 9 */}
        <div className="section-header">
          <span className="section-num">09</span>
          <h2>Your Rights</h2>
          <div className="section-rule" />
        </div>
        <ul className="legal-list">
          <li>
            <strong>Access and deletion:</strong> You may view and edit your profile and claims in
            the App at any time, delete individual items, or delete your entire account and data. You
            may also request a copy of your data, or its deletion, by contacting us at{' '}
            <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
          </li>
          <li>
            <strong>Notifications:</strong> You can turn notifications on or off in the App or in
            your device settings.
          </li>
          <li>
            <strong>Permissions:</strong> Photo-library access is requested only when you choose to
            attach a receipt, and can be revoked in your device settings at any time.
          </li>
        </ul>

        {/* § 10 */}
        <div className="section-header">
          <span className="section-num">10</span>
          <h2>Children's Privacy</h2>
          <div className="section-rule" />
        </div>
        <p>
          The App is not intended for children under 13. We do not knowingly collect data from
          children under 13. If you believe a child under 13 has provided us with personal data,
          please contact us and we will delete it.
        </p>

        {/* § 11 */}
        <div className="section-header">
          <span className="section-num">11</span>
          <h2>Changes to This Policy</h2>
          <div className="section-rule" />
        </div>
        <p>
          We may update this policy from time to time. Changes will be posted in-app and on our
          website, and we will update the "Effective Date" above. Continued use of the App after
          changes take effect constitutes acceptance of the updated policy.
        </p>

        {/* § 12 */}
        <div className="section-header">
          <span className="section-num">12</span>
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
              STLMNT
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
              June 17, 2026
            </li>
            <li>
              <strong>Contact</strong>
              {CONTACT}
            </li>
          </ul>
          <SocialLinks />
        </div>
      </footer>
    </>
  )
}
