import { RouteHead } from '../../components/SEO/RouteHead'
import { PageHeader } from '../../components/PageHeader/PageHeader'
import { META } from '../../lib/seo'
import { SITE } from '../../data/site'

export default function ZooriPrivacy() {
  return (
    <>
      <RouteHead {...META['/legal/zoori/privacy']} />

      <PageHeader>
        <header className="masthead">
          <p className="overline">Legal · Zoori</p>
          <h1>Privacy <em>Policy</em></h1>
          <p className="subtitle">Zoori — {SITE.name}</p>
          <p className="date-line">Effective Date: June 5, 2026 · Last Updated: June 5, 2026</p>
        </header>
      </PageHeader>

      <main className="container" id="main-content" tabIndex={-1}>

        <div className="intro-block">
          <p>
            {SITE.name} ("we," "us," or "our") operates the Zoori mobile application ("App").
            This Privacy Policy explains what personal information we collect, how we use it,
            who we share it with, and what choices you have.
          </p>
        </div>

        <div className="verdict-box note">
          <p>
            By creating an account or using the App, you agree to the practices described here.
          </p>
        </div>

        {/* § 1 */}
        <div className="section-header">
          <span className="section-num">01</span>
          <h2>Introduction</h2>
          <div className="section-rule" />
        </div>

        <p>
          {SITE.name} ("we," "us," or "our") operates the Zoori mobile application ("App"). This
          Privacy Policy explains what personal information we collect, how we use it, who we share
          it with, and what choices you have. By creating an account or using the App, you agree to
          the practices described here.
        </p>

        {/* § 2 */}
        <div className="section-header">
          <span className="section-num">02</span>
          <h2>Who This Policy Applies To</h2>
          <div className="section-rule" />
        </div>

        <p>This policy applies to all users of the Zoori App, including:</p>
        <ul className="legal-list">
          <li><strong>Adopters</strong> — individuals looking to adopt or foster a rescue dog</li>
          <li><strong>Organization members</strong> — staff and volunteers of rescue organizations that manage dog listings through the App</li>
          <li><strong>Administrators</strong> — {SITE.name} personnel who operate and moderate the platform</li>
        </ul>

        {/* § 3 */}
        <div className="section-header">
          <span className="section-num">03</span>
          <h2>Information We Collect</h2>
          <div className="section-rule" />
        </div>

        <h3 className="legal-subsection">3.1 Information You Provide Directly</h3>
        <div className="legal-table-wrap">
          <table className="legal-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Examples</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Account information</td>
                <td>Full name, email address, password (hashed by Firebase Auth)</td>
              </tr>
              <tr>
                <td>Contact details</td>
                <td>Phone number (optional)</td>
              </tr>
              <tr>
                <td>Profile preferences</td>
                <td>Desired dog size, age range, energy level, temperament, special-needs tolerance</td>
              </tr>
              <tr>
                <td>Household information</td>
                <td>Home type (apartment/house), yard access, presence of children or other pets</td>
              </tr>
              <tr>
                <td>Lifestyle information</td>
                <td>Daily hours dog would be alone, activity level, prior dog-ownership experience</td>
              </tr>
              <tr>
                <td>Application answers</td>
                <td>Responses to organization-specific adoption or foster questions; a snapshot of your preferences at the time of submission and your computed compatibility score are stored as part of the application record</td>
              </tr>
              <tr>
                <td>Organization profile</td>
                <td>Organization name, description, contact email and phone, logo image, location</td>
              </tr>
              <tr>
                <td>Dog listings</td>
                <td>Dog name, breed, age, sex, size, photos/videos, medical notes, temperament tags, adoption requirements</td>
              </tr>
              <tr>
                <td>Messages</td>
                <td>Text content of conversations between adopters and rescue organizations</td>
              </tr>
              <tr>
                <td>Reports</td>
                <td>Description of a reported listing, selected report reason</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="legal-subsection">3.2 Information Collected Automatically</h3>
        <div className="legal-table-wrap">
          <table className="legal-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Push notification token</td>
                <td>Expo push token generated on your device, used to deliver in-app notifications</td>
              </tr>
              <tr>
                <td>Swipe history</td>
                <td>Dog IDs you swiped right (liked) or left (passed), with timestamps — used only to power your recommendation feed and avoid re-showing dogs you've already seen</td>
              </tr>
              <tr>
                <td>App activity</td>
                <td>Dogs saved to favorites, applications submitted, notifications read, breed bookmarks (breed IDs and names you bookmark to receive match alerts)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="legal-subsection">3.3 Device Permissions We Request</h3>
        <div className="legal-table-wrap">
          <table className="legal-table">
            <thead>
              <tr>
                <th>Permission</th>
                <th>Why We Need It</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Camera</strong></td>
                <td>Lets users capture photos directly within the App (primarily used by rescue organizations uploading dog listings)</td>
              </tr>
              <tr>
                <td><strong>Photo / media library</strong></td>
                <td>Lets users upload existing photos and videos from their device (primarily used by rescue organizations uploading dog listings)</td>
              </tr>
              <tr>
                <td><strong>Push notifications</strong></td>
                <td>Delivers application status updates, new-dog alerts, and important account notices</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          You may deny any permission; denying a permission disables the specific feature that
          requires it but does not prevent you from using the rest of the App.
        </p>

        <h3 className="legal-subsection">3.4 Information from Third Parties</h3>
        <ul className="legal-list">
          <li>
            <strong>RescueGroups.org</strong> — Organizations that connect their RescueGroups
            account may have dog listings imported into Zoori. Imported data consists only of
            publicly listed dog information (name, breed, age, photos, status).
          </li>
          <li>
            <strong>TheDogAPI</strong> — We fetch breed reference data (breed names, descriptions,
            temperament) from TheDogAPI to power our breed glossary. No personal information is
            exchanged.
          </li>
        </ul>

        {/* § 4 */}
        <div className="section-header">
          <span className="section-num">04</span>
          <h2>How We Use Your Information</h2>
          <div className="section-rule" />
        </div>

        <div className="legal-table-wrap">
          <table className="legal-table">
            <thead>
              <tr>
                <th>Purpose</th>
                <th>Legal Basis</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Create and maintain your account</td>
                <td>Performance of contract</td>
              </tr>
              <tr>
                <td>Match you with dogs that fit your household and lifestyle (compatibility scoring)</td>
                <td>Performance of contract</td>
              </tr>
              <tr>
                <td>Enable messaging between adopters and rescue organizations</td>
                <td>Performance of contract</td>
              </tr>
              <tr>
                <td>Send push notifications and transactional emails about application status, account approvals, and saved-dog updates</td>
                <td>Performance of contract / Legitimate interest</td>
              </tr>
              <tr>
                <td>Deliver daily or weekly digest notifications about new dogs that match your preferences</td>
                <td>Consent (notification opt-in)</td>
              </tr>
              <tr>
                <td>Allow organizations to manage dog listings and review applications</td>
                <td>Performance of contract</td>
              </tr>
              <tr>
                <td>Enable platform moderation (admin review of reports, flagged listings, organization approvals)</td>
                <td>Legitimate interest (platform safety)</td>
              </tr>
              <tr>
                <td>Maintain audit logs of admin actions for accountability</td>
                <td>Legitimate interest (platform integrity)</td>
              </tr>
              <tr>
                <td>Improve and debug the App</td>
                <td>Legitimate interest</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          We do <strong>not</strong> sell your personal information to third parties. We do not use
          your data for targeted advertising.
        </p>

        {/* § 5 */}
        <div className="section-header">
          <span className="section-num">05</span>
          <h2>How We Share Your Information</h2>
          <div className="section-rule" />
        </div>

        <h3 className="legal-subsection">5.1 With Other Users (By Design)</h3>
        <ul className="legal-list">
          <li>Your <strong>name</strong> and <strong>application responses</strong> are shared with the rescue organization when you submit an adoption or foster application.</li>
          <li>Your <strong>name</strong> and messages are visible to the rescue organization in the messaging thread for that application.</li>
          <li>An organization's <strong>name, description, contact info, and approved status</strong> are visible to all authenticated users.</li>
          <li>Dog listings posted by an organization are visible to all authenticated adopters.</li>
        </ul>

        <h3 className="legal-subsection">5.2 With Service Providers</h3>
        <p>We use the following sub-processors to operate the App:</p>
        <div className="legal-table-wrap">
          <table className="legal-table">
            <thead>
              <tr>
                <th>Provider</th>
                <th>Service</th>
                <th>Data shared</th>
                <th>Region</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Google Firebase (Auth, Firestore, Storage, Cloud Functions)</td>
                <td>Authentication, database, file storage, server-side logic</td>
                <td>All user and app data described in Section 3</td>
                <td>United States (us-east1 / us-central1)</td>
              </tr>
              <tr>
                <td>Expo (EAS / Expo Push API)</td>
                <td>App builds, over-the-air updates, push notification delivery</td>
                <td>Push tokens, notification payloads</td>
                <td>United States</td>
              </tr>
              <tr>
                <td>Resend</td>
                <td>Transactional email</td>
                <td>Recipient email address, notification content</td>
                <td>United States</td>
              </tr>
              <tr>
                <td>TheDogAPI</td>
                <td>Breed reference data</td>
                <td>No personal data</td>
                <td>United States</td>
              </tr>
              <tr>
                <td>RescueGroups.org</td>
                <td>Dog listing import (optional, organization-initiated)</td>
                <td>Organization ID, dog data</td>
                <td>United States</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Each provider is bound by their own privacy policies and, where applicable, data processing
          agreements.
        </p>

        <h3 className="legal-subsection">5.3 For Legal Reasons</h3>
        <p>
          We may disclose your information if required by law, subpoena, court order, or other
          governmental request, or where we believe in good faith that disclosure is necessary to
          protect the safety of any person, prevent fraud, or defend our legal rights.
        </p>

        <h3 className="legal-subsection">5.4 Business Transfers</h3>
        <p>
          If {SITE.name} is acquired, merges with another entity, or transfers its assets, user
          information may be included in that transaction. We will notify you of any such change via
          the email address on your account.
        </p>

        {/* § 6 */}
        <div className="section-header">
          <span className="section-num">06</span>
          <h2>Data Retention</h2>
          <div className="section-rule" />
        </div>

        <div className="legal-table-wrap">
          <table className="legal-table">
            <thead>
              <tr>
                <th>Data type</th>
                <th>Retention</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Active user accounts</td>
                <td>Retained while account is active</td>
              </tr>
              <tr>
                <td>Deleted accounts</td>
                <td>Marked <code>deleted</code> (soft delete) immediately; personal details purged within 30 days, except where retention is required for safety or legal reasons</td>
              </tr>
              <tr>
                <td>Swipe history</td>
                <td>Retained to power your recommendation feed; cleared when you use the "clear history" feature or delete your account</td>
              </tr>
              <tr>
                <td>Applications</td>
                <td>Retained after approval/rejection for organizational record-keeping; adopter may request deletion</td>
              </tr>
              <tr>
                <td>Dog media (photos/videos)</td>
                <td>Retained while the listing is active; deleted when the organization removes the listing or upon account deletion</td>
              </tr>
              <tr>
                <td>Audit logs (admin actions)</td>
                <td>Retained for a minimum of 2 years for platform integrity purposes</td>
              </tr>
              <tr>
                <td>Push tokens</td>
                <td>Removed when you unregister notifications or delete your account</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* § 7 */}
        <div className="section-header">
          <span className="section-num">07</span>
          <h2>Your Rights and Choices</h2>
          <div className="section-rule" />
        </div>

        <p>Depending on your jurisdiction, you may have the following rights:</p>
        <ul className="legal-list">
          <li><strong>Access</strong> — Request a copy of the personal data we hold about you.</li>
          <li><strong>Correction</strong> — Update inaccurate or incomplete information through your profile settings.</li>
          <li><strong>Deletion</strong> — Request deletion of your account and personal data. Deleted accounts are soft-deleted immediately; residual data is purged within 30 days, except where retention is required for legal or safety reasons.</li>
          <li><strong>Portability</strong> — Request your data in a structured, machine-readable format.</li>
          <li><strong>Opt out of push notifications</strong> — Disable push notifications in your device OS settings, or toggle individual notification types within the App from your profile settings.</li>
          <li><strong>Clear swipe history</strong> — Available in the App in your swipe History screen (filter by liked, passed, or clear all).</li>
        </ul>

        <p>
          To exercise any of these rights, contact us at the address in Section 11. We will respond
          within 30 days.
        </p>

        {/* § 8 */}
        <div className="section-header">
          <span className="section-num">08</span>
          <h2>Children's Privacy</h2>
          <div className="section-rule" />
        </div>

        <p>
          The App is not directed to children under the age of 13. We do not knowingly collect
          personal information from children under 13. If you believe a child has provided us with
          personal information, contact us immediately and we will delete it.
        </p>

        {/* § 9 */}
        <div className="section-header">
          <span className="section-num">09</span>
          <h2>Security</h2>
          <div className="section-rule" />
        </div>

        <p>We implement industry-standard security measures, including:</p>
        <ul className="legal-list">
          <li>Firebase Authentication with hashed password storage</li>
          <li>Firestore security rules enforcing role-based access (adopters cannot read other adopters' data; organizations cannot read data outside their own records)</li>
          <li>Server-side validation in Firebase Cloud Functions for all privileged operations</li>
          <li>HTTPS/TLS in transit for all network communication</li>
          <li>Storage access rules limiting media access to authorized parties</li>
        </ul>

        <p>
          No method of transmission over the Internet or electronic storage is 100% secure. We
          cannot guarantee absolute security but commit to promptly notifying affected users and
          authorities in the event of a data breach as required by applicable law.
        </p>

        {/* § 10 */}
        <div className="section-header">
          <span className="section-num">10</span>
          <h2>Changes to This Policy</h2>
          <div className="section-rule" />
        </div>

        <p>
          We may update this Privacy Policy from time to time. When we do, we will revise the "Last
          updated" date at the top. For material changes, we will notify you via push notification
          or email at least 14 days before the change takes effect. Continued use of the App after
          the effective date constitutes acceptance of the updated policy.
        </p>

        {/* § 11 */}
        <div className="section-header">
          <span className="section-num">11</span>
          <h2>Contact Us</h2>
          <div className="section-rule" />
        </div>

        <div className="verdict-box contact">
          <p>
            <strong>{SITE.name}</strong><br />
            Email: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </p>
          <p>
            If you have questions, requests, or complaints about this Privacy Policy or our data
            practices, please contact us at the address above.
          </p>
        </div>

      </main>
    </>
  )
}
