import { LegalPage } from '../../components/LegalPage/LegalPage'
import { SocialLinks } from '../../components/SocialLinks/SocialLinks'
import { SITE } from '../../data/site'

const OPERATOR = 'An App Idea LLC'
const CONTACT = SITE.email

export default function PaybackPrivacy() {
  return (
    <>
      <LegalPage
        path="/legal/payback/privacy"
        appLabel="Ôwn (Payback)"
        docType="privacy"
        subtitle={`Ôwn (Payback Own) — ${OPERATOR}`}
        dateLine="Effective: December 8, 2025 · Last Updated: September 17, 2026"
      >

        <div className="intro-block">
          <p>
            Payback Own ("we," "our," or "us") is committed to protecting your privacy. This
            Privacy Policy explains how our mobile application handles your data when you use our
            consumer insights analysis service.
          </p>
        </div>

        <div className="pullquote">
          <p>
            "Your data is never sold. Your vault is built on your phone and encrypted (AES-256). We
            don't keep your data on our servers. AI analysis runs only when you ask it to — and
            what's sent for that analysis isn't retained by us. We only read the sources you
            connect, never changing, creating, or deleting anything in them, and you can
            disconnect or delete everything at any time."
          </p>
          <span className="attrib">— Our promise to you, in plain language</span>
        </div>

        <div className="verdict-box note">
          <p>
            <strong>Core Privacy Principle:</strong> Payback Own is designed with a local-first
            architecture. Most file selection, parsing, storage, and many analysis steps occur on
            your device. Some features also transmit data off-device, including Google sign-in/
            profile data, AI analysis inputs, analytics sync records, and over-the-air update
            checks. We do not use your data for cross-app tracking, data-broker sharing, or
            third-party advertising.
          </p>
        </div>

        {/* § 1 */}
        <div className="section-header">
          <span className="section-num">01</span>
          <h2>Information We Access</h2>
          <div className="section-rule" />
        </div>

        <h3 className="legal-subsection">Data You Provide</h3>
        <p>When you use Payback Own, you may choose to provide access to:</p>

        <p><strong>1. Google Takeout Archives</strong> (ZIP files stored in Google Drive)</p>
        <ul className="legal-list">
          <li>YouTube watch history</li>
          <li>Google Search history</li>
          <li>Chrome browsing history</li>
          <li>Location history (Timeline/Semantic Location)</li>
          <li>Google Maps activity (searches, saved places)</li>
          <li>Google Play Store (app installs)</li>
          <li>Gmail (metadata only, not message content)</li>
          <li>Other Google service data included in your Takeout export</li>
        </ul>

        <p><strong>2. Meta (Facebook/Instagram) Exports</strong> (the downloaded <code>.zip</code>, or a folder structure in Dropbox)</p>
        <ul className="legal-list">
          <li>Instagram: Posts, stories, likes, saved posts, searches, ad interactions, messages, following list</li>
          <li>Facebook: Posts, comments, friends list, likes, searches, ad interactions, groups, pages</li>
          <li>Detection: Automatic service detection via folder name patterns and content analysis</li>
          <li>Format: JSON files (recommended) or HTML</li>
          <li>Note: Standard export analysis focuses on structured export contents and media metadata. Some user-selected uploads or export files may still include photo/video-related data depending on the feature you use.</li>
        </ul>

        <p><strong>3. Device Calendar, Photo Library, and Contacts</strong> (read on-device, only if you grant the OS permission)</p>
        <p>
          Instant Analysis derives behavioural signals from your device rather than from a Google
          account. Each source is optional, is requested through the standard iOS/Android
          permission prompt, and can be revoked at any time in system Settings. The App works with
          any subset, including none.
        </p>
        <ul className="legal-list">
          <li><strong>Calendar</strong> — events from the calendars your device exposes, covering roughly the previous year and the next three months. This includes calendars synced from other accounts (for example a work Exchange or shared family calendar) if they appear in your device's calendar store. Event titles, locations, times, and attendee counts are read <strong>on your device</strong> to classify events as travel, professional or recurring. Titles and locations are <strong>not</strong> transmitted and are <strong>not</strong> stored.</li>
          <li><strong>Photo library</strong> — metadata only, for a sample of your most recent photos: capture timestamps and, where the photo carries them, embedded location coordinates. <strong>No image or video content is read, copied, or uploaded.</strong> Coordinates are reduced on-device to a count of distinct areas and a maximum distance; the coordinates themselves never leave the device and are not stored.</li>
          <li><strong>Contacts</strong> — a count of your contacts and a count of the distinct email domains among them, to gauge how broad your network is. <strong>No names, email addresses, or phone numbers are retained, transmitted, or stored.</strong></li>
        </ul>
        <p>
          On iOS, granting "Selected Photos" or "Select Contacts…" rather than full access is fully
          supported; the App analyses only what you shared.
        </p>

        <p><strong>4. Platforms shown in the App but not yet analysed</strong></p>
        <p>
          The App displays tiles for <strong>Apple, Microsoft, Amazon, TikTok, Snapchat and
          Spotify</strong> alongside Google and Meta, each marked as coming soon. Tapping one shows
          instructions for requesting your export from that service, so you can have it ready.
        </p>
        <p>
          <strong>Only Google Takeout and Meta exports can currently be imported and analysed.</strong>{' '}
          For the six platforms above the App does not detect, read, import, or transmit anything,
          and no data from them reaches us or any AI provider. They appear so you can see what is
          planned and start an export request, which those services can take days to fulfil. If
          that changes in a future release, the handling described in this policy will apply to
          them in the same way and this section will be updated.
        </p>

        <div className="verdict-box note">
          <p>
            <strong>Important:</strong> You control what data you provide. The App only accesses
            accounts, files, and exports that you explicitly connect or select. Depending on the
            feature you use, selected file contents, metadata, or derived signals may be transmitted
            to our backend and AI providers for processing.
          </p>
        </div>

        <h3 className="legal-subsection">Authentication Data</h3>
        <p>Payback Own supports two sign-in providers — you may use whichever you prefer.</p>

        <p><strong>Sign in with Google</strong></p>
        <ul className="legal-list">
          <li><strong>Google OAuth Tokens (Sign-in):</strong> Sign-in requests identity only. Scopes: <code>openid</code>, <code>email</code>, <code>profile</code>. No Gmail, Calendar, or Drive scope is requested at sign-in.</li>
          <li><strong>Google OAuth Tokens (Drive, per file):</strong> Importing a file from Google Drive uses a separate, optional grant you make through the Google Picker for that specific file. Scope: <code>drive.file</code>. The App can never list or browse your Drive.</li>
          <li><strong>Google Profile Information:</strong> During sign-in, we may receive your name, email address, Google user ID, and profile photo URL from Google and Firebase authentication services.</li>
        </ul>

        <p><strong>Sign in with Apple</strong></p>
        <ul className="legal-list">
          <li><strong>Apple Identity Token:</strong> Used to authenticate you. Contains a stable Apple user identifier (the <code>sub</code> claim) that is unique to your Apple ID and to this app.</li>
          <li><strong>Email Address:</strong> Apple may share your real email or relay it via a private <code>@privaterelay.appleid.com</code> address — your choice at sign-in. Either form is treated the same way for account identification.</li>
          <li><strong>Name:</strong> Apple shares your name only on first sign-in, and only if you choose to share it. We store whatever you provide locally.</li>
          <li>We do not collect Apple passwords, device identifiers, or any other Apple account data beyond the identity token.</li>
        </ul>

        <div className="verdict-box note">
          <p>
            <strong>Token storage:</strong> All authentication tokens are stored locally on your
            device in encrypted storage (iOS Keychain / Android Keystore). No passwords are
            collected or stored.
          </p>
        </div>

        {/* § 2 */}
        <div className="section-header">
          <span className="section-num">02</span>
          <h2>How We Process Your Data</h2>
          <div className="section-rule" />
        </div>

        <h3 className="legal-subsection">On-Device Processing</h3>
        <p>Most file handling and storage occurs on your device:</p>
        <ul className="legal-list">
          <li><strong>File Selection:</strong> Quick Analysis intelligently selects 10–15 high-value files from your export</li>
          <li><strong>File Extraction:</strong> Archive files are processed locally; extracted files cached in device storage temporarily</li>
          <li><strong>Data Parsing:</strong> Content is parsed on-device using local algorithms; Meta JSON files use custom Unicode parser</li>
          <li><strong>Storage:</strong> Analysis results stored in encrypted local SQLite database (<code>payback.db</code>)</li>
          <li><strong>Prompt Preparation:</strong> Selected content may be sampled, redacted, and formatted locally before being sent for AI processing</li>
          <li><strong>Cleanup:</strong> Temporary files automatically deleted after analysis</li>
        </ul>

        <h3 className="legal-subsection">Encryption</h3>
        <ul className="legal-list">
          <li><strong>At Rest:</strong> The local SQLite database is encrypted with SQLCipher 4 (AES-256)</li>
          <li><strong>Master Key:</strong> A 256-bit random encryption key is generated on-device via <code>expo-crypto</code> and stored in iOS Keychain / Android Keystore via <code>expo-secure-store</code>. The key is not synced to iCloud or Google Backup.</li>
          <li><strong>In Transit:</strong> All connections use HTTPS/TLS 1.3 (Google APIs, Gemini API, Expo/EAS services, backend proxy)</li>
          <li><strong>OAuth Tokens:</strong> Stored in encrypted device storage (iOS Keychain / Android Keystore)</li>
        </ul>

        <h3 className="legal-subsection">Off-Device Processing and AI Analysis</h3>
        <p>When you use AI-powered features, some data is transmitted off-device:</p>
        <ul className="legal-list">
          <li><strong>Instant Analysis:</strong> Signals read from your device's own calendar, photo library and contacts, and reduced on the device before anything is sent. What leaves is counts, time buckets, percentages and distances, such as how many distinct places you visited or how broad your contact network is. Event titles, photo coordinates, photo or video content, and contact names never leave the device.</li>
          <li><strong>Quick Analysis and Freestyle:</strong> Selected export or uploaded file contents and metadata may be sent for AI analysis. Depending on what you choose to analyze, this can include search history, browsing history, location history, purchases, contacts or social graph data, messages, photos or videos metadata, health or fitness exports, ad-interaction data, and other user-provided export contents.</li>
          <li><strong>What is NOT sent:</strong> Your Google or Meta passwords; payment card or bank account credentials entered outside the app; every file in a connected account by default — processing is limited to the files/signals required for the feature you use.</li>
          <li><strong>Service used:</strong> Google's paid Gemini API (model: <code>gemini-2.5-pro</code>) via our secure backend proxy. The paid tier is governed by Google's Cloud Data Processing Addendum and Google's paid-tier usage policy rather than Google AI Studio's free-tier terms.</li>
          <li><strong>Retention by us:</strong> We do not intentionally persist full AI request contents on our own servers after request completion, aside from limited operational metadata and logs.</li>
          <li><strong>Retention by Google:</strong> Under the paid tier, Google states that prompts, contextual information, and outputs sent to the Gemini API may be retained for up to 55 days for abuse monitoring and are not used to train or fine-tune AI/ML models. See: <a href="https://ai.google.dev/gemini-api/docs/usage-policies" target="_blank" rel="noopener noreferrer">ai.google.dev/gemini-api/docs/usage-policies</a></li>
        </ul>
        <div className="verdict-box note">
          <p>
            <strong>You control when AI runs.</strong> AI analysis occurs only when you initiate
            Instant Analysis, Quick Analysis, Freestyle analysis, or another AI-backed feature in
            the app. You can delete your local persona and results at any time from Settings.
          </p>
        </div>

        {/* § 3 */}
        <div className="section-header">
          <span className="section-num">03</span>
          <h2>Third-Party Services</h2>
          <div className="section-rule" />
        </div>

        <h3 className="legal-subsection">Google Services</h3>
        <ul className="legal-list">
          <li>
            <strong>Google OAuth 2.0 / OpenID / Firebase Authentication</strong> — Authenticate you, create your app session, and associate synced features with your account. Data shared: authentication tokens, name, email, Google user ID, and profile photo URL (if available). <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google's Privacy Policy</a>
          </li>
          <li>
            <strong>Google Drive API</strong> — Retrieves only the individual files you grant through the Google Picker. Scope: <code>drive.file</code>. There is no Gmail scope and no Google Calendar scope; calendar signals come from your device's own calendar, not from Google.
          </li>
          <li>
            <strong>Google Gemini AI</strong> (Instant Analysis, Quick Analysis, Freestyle) — AI-powered persona generation, category matching, and behavioral analysis. Model: <code>gemini-2.5-pro</code> (paid API tier). Data shared: behavioral signals and selected file contents/metadata. Prompts may be retained by Google for up to 55 days for abuse monitoring; paid-tier data is not used to train AI/ML models. <a href="https://ai.google.dev/gemini-api/docs/usage-policies" target="_blank" rel="noopener noreferrer">Google AI Usage Policies</a> · <a href="https://cloud.google.com/terms/data-processing-addendum" target="_blank" rel="noopener noreferrer">Cloud DPA</a>
          </li>
          <li>
            <strong>Expo / EAS Update</strong> — Delivers over-the-air app updates. Data shared when the app checks for an update: an install-level identifier, project ID, runtime version, release channel, platform, and OS version. <a href="https://docs.expo.dev/eas-update/introduction/" target="_blank" rel="noopener noreferrer">Expo documentation</a>
          </li>
        </ul>

        <h3 className="legal-subsection">Apple Services</h3>
        <ul className="legal-list">
          <li>
            <strong>Sign in with Apple</strong> — Authenticate you using your Apple ID. Data shared: a stable Apple user identifier (<code>sub</code> claim), an email address (your real address or a <code>@privaterelay.appleid.com</code> relay address), and your name (only on first sign-in, only if you choose to share it). Apple does not share other Apple account data with us. <a href="https://www.apple.com/legal/privacy/" target="_blank" rel="noopener noreferrer">Apple's Privacy Policy</a>
          </li>
        </ul>

        <h3 className="legal-subsection">Backend Proxy</h3>
        <p>We operate backend services (Node.js/Express) to:</p>
        <ul className="legal-list">
          <li><strong>Purpose:</strong> Securely manage Gemini API keys, authenticate users, process AI requests, and sync account-linked analytics/profile data</li>
          <li><strong>Data processed:</strong> AI analysis requests, account/profile metadata, category analytics scores, consent settings, and sync metadata</li>
          <li><strong>AI request retention:</strong> We do not intentionally persist full AI request contents after request completion</li>
          <li><strong>Analytics/profile retention:</strong> Account-linked analytics and profile sync records may be retained on our backend until you delete them or request deletion, subject to backups</li>
          <li><strong>Security:</strong> A per-user request limit set by our backend configuration, global IP rate limiting (100 req/15 min), Google OAuth token verification, dual API key failover</li>
          <li><strong>Deployment:</strong> Railway (US)</li>
          <li><strong>Logging:</strong> Request metadata and operational metrics emitted as JSON to Railway's platform log stream. Tokens, API keys, and AI payload bodies are redacted by the backend logger automatically. Log retention is governed by Railway's platform log-retention policy.</li>
        </ul>

        <h3 className="legal-subsection">Data Processing Agreements</h3>
        <p>
          We engage third-party processors to deliver authentication, AI analysis, app updates,
          and hosting. Each processor handles personal data on our behalf under an applicable Data
          Processing Agreement (DPA). For users in the EEA, UK, Switzerland, and other
          jurisdictions with cross-border transfer requirements, our processors maintain transfer
          safeguards such as the EU Standard Contractual Clauses, the UK International Data
          Transfer Agreement, or adequacy regulations.
        </p>
        <div className="legal-table-wrap">
          <table className="legal-table">
            <thead>
              <tr>
                <th>Processor</th>
                <th>Role</th>
                <th>Applicable DPA / Terms</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Google LLC</strong> (Cloud, Gemini API, Firebase Auth)</td>
                <td>Identity, authentication, paid-tier AI analysis</td>
                <td><a href="https://cloud.google.com/terms/data-processing-addendum" target="_blank" rel="noopener noreferrer">Google Cloud Data Processing Addendum</a></td>
              </tr>
              <tr>
                <td><strong>Railway Corporation</strong></td>
                <td>Backend hosting and database</td>
                <td><a href="https://railway.com/legal/dpa" target="_blank" rel="noopener noreferrer">Railway Data Processing Addendum</a></td>
              </tr>
              <tr>
                <td><strong>Expo (650 Industries, Inc.)</strong> — EAS Update</td>
                <td>Over-the-air app update delivery</td>
                <td><a href="https://expo.dev/terms" target="_blank" rel="noopener noreferrer">Expo Terms incorporating DPA terms</a></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* § 4 */}
        <div className="section-header">
          <span className="section-num">04</span>
          <h2>Data Storage and Retention</h2>
          <div className="section-rule" />
        </div>

        <h3 className="legal-subsection">Local Storage</h3>
        <ul className="legal-list">
          <li><strong>Location:</strong> Your device only (iOS app sandbox or Android app data directory)</li>
          <li><strong>Encryption:</strong> SQLCipher 4 (AES-256) encrypted SQLite database</li>
          <li><strong>Retention:</strong> Data persists until you delete it</li>
        </ul>

        <h3 className="legal-subsection">How to Delete Your Data</h3>
        <p>You have complete control over your data:</p>
        <ul className="legal-list">
          <li><strong>Delete specific analyses:</strong> Navigate to Settings &gt; Data Management, then tap "Delete Analysis" for individual reports.</li>
          <li><strong>Delete all data:</strong> Navigate to Settings &gt; Data Management, then tap "Delete All Data." Confirms deletion of all profiles, analyses, and cached files.</li>
          <li><strong>Revoke Google Drive access:</strong> Visit <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer">Google Account permissions</a> and remove "Payback Own" access.</li>
          <li><strong>Uninstall the App:</strong> Deleting the App removes all local data from your device.</li>
        </ul>

        {/* § 5 — Account & Data Deletion */}
        <div className="section-header">
          <span className="section-num">05</span>
          <h2>Account &amp; Data Deletion</h2>
          <div className="section-rule" />
        </div>

        <div className="verdict-box note">
          <p>
            This section fulfils Google Play and Apple App Store requirements for account and data
            deletion disclosures. Full standalone deletion policy:{' '}
            <a href="https://www.milehighinterface.com/payback/data-deletion.html" target="_blank" rel="noopener noreferrer">
              milehighinterface.com/payback/data-deletion.html
            </a>
          </p>
        </div>

        <p>
          <strong>Ôwn</strong> (published as "Payback Own" by {OPERATOR}) is a local-first app
          that analyses your Google and Meta data exports to generate behavioural insights. Most
          processing happens on your device, but some features also use server-side authentication,
          AI processing, analytics sync, and over-the-air update delivery.
        </p>

        <h3 className="legal-subsection">Option 1 — Delete directly inside the app (instant)</h3>
        <ul className="legal-list">
          <li>Open the <strong>Ôwn</strong> app</li>
          <li>Tap the <strong>Settings</strong> tab (bottom navigation bar)</li>
          <li>Scroll to <strong>Data Management</strong></li>
          <li>Tap <strong>Delete All Data</strong></li>
          <li>Confirm when prompted</li>
        </ul>
        <p><strong>What this deletes immediately:</strong></p>
        <ul className="legal-list">
          <li>All analysis results, reports, and personas stored in the encrypted local database (<code>payback.db</code>)</li>
          <li>All behavioural signals extracted from your Google Takeout and Meta exports</li>
          <li>All AI-generated insights and cached results</li>
          <li>All checkpoints and temporary files</li>
        </ul>

        <h3 className="legal-subsection">Option 2 — Submit a deletion request by email</h3>
        <div className="verdict-box contact">
          <p>
            <strong>Email:</strong> <a href={`mailto:${CONTACT}`}>{CONTACT}</a><br />
            <strong>Subject:</strong> <code>Data Deletion Request – Ôwn</code><br />
            <strong>Include:</strong> The email address linked to your Google account (used for sign-in)<br />
            <strong>Response time:</strong> Within 5 business days
          </p>
        </div>

        <h3 className="legal-subsection">Option 3 — Delete synced analytics and account-linked backend data</h3>
        <ul className="legal-list">
          <li><strong>In-app:</strong> Settings &gt; Analytics &gt; Delete My Data</li>
          <li><strong>API:</strong> <code>DELETE /api/v1/analytics/user/:userId</code> (authenticated)</li>
          <li><strong>By email:</strong> <a href={`mailto:${CONTACT}`}>{CONTACT}</a></li>
        </ul>

        <h3 className="legal-subsection">What Data Is Deleted vs. Retained</h3>
        <div className="legal-table-wrap">
          <table className="legal-table">
            <thead>
              <tr>
                <th>Data Type</th>
                <th>Where Stored</th>
                <th>Deleted When</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Analysis results, personas, and behavioural signals saved in the app</td>
                <td>On your device (encrypted SQLite)</td>
                <td>Immediately on "Delete All Data" or app uninstall</td>
                <td>No persistent server-side copy of the local database</td>
              </tr>
              <tr>
                <td>Google OAuth token</td>
                <td>On your device (iOS Keychain / Android Keystore)</td>
                <td>On app uninstall or manual revoke</td>
                <td>Revoke at: myaccount.google.com/permissions</td>
              </tr>
              <tr>
                <td>AI request payloads processed by our backend</td>
                <td>In-memory request pipeline / transient server processing</td>
                <td>Not intentionally persisted after request completion</td>
                <td>Limited request metadata may still be logged</td>
              </tr>
              <tr>
                <td>AI request prompts, context, and outputs processed by Google Gemini</td>
                <td>Google servers</td>
                <td>Google states up to 55 days for abuse monitoring</td>
                <td>Not used by Google to train or fine-tune AI/ML models per Google policy</td>
              </tr>
              <tr>
                <td>Account/profile sync and category analytics records</td>
                <td>Railway PostgreSQL (US)</td>
                <td>Within 30 days of deletion request</td>
                <td>May include user ID, email, display name, consent state, category scores, and sync metadata</td>
              </tr>
              <tr>
                <td>Backend proxy operational logs</td>
                <td>Railway platform log stream (metadata only)</td>
                <td>Governed by Railway's platform log-retention policy</td>
                <td>Tokens, API keys, and AI payload bodies are redacted at the logger before emission</td>
              </tr>
              <tr>
                <td>Over-the-air update check metadata</td>
                <td>Expo / EAS services</td>
                <td>Retention governed by Expo</td>
                <td>May include an install identifier, project ID, runtime version, release channel, platform, and OS version</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          We do not intentionally retain full raw export files, full email bodies, or full calendar
          event descriptions on our own servers after request completion.
        </p>

        <h3 className="legal-subsection">Retention Periods After Deletion</h3>
        <ul className="legal-list">
          <li><strong>On-device data:</strong> Deleted immediately when you use the in-app delete function or uninstall the app.</li>
          <li><strong>Account/profile sync and analytics data:</strong> Deleted within 30 days of a confirmed deletion request.</li>
          <li><strong>Automated database backups (Railway):</strong> Purged within 90 days in accordance with Railway's backup retention policy.</li>
          <li><strong>AI request data (Gemini):</strong> Google states prompts, contextual information, and outputs may be retained for up to 55 days for abuse monitoring.</li>
        </ul>

        {/* § 6 */}
        <div className="section-header">
          <span className="section-num">06</span>
          <h2>Tracking, Analytics, and Server-Side Data</h2>
          <div className="section-rule" />
        </div>

        <h3 className="legal-subsection">No Cross-App Tracking</h3>
        <p>Payback Own does <strong>not</strong> use your data to track you across apps or websites owned by other companies.</p>
        <ul className="legal-list">
          <li>We do not use IDFA</li>
          <li>We do not share data with data brokers</li>
          <li>We do not use collected data for third-party advertising</li>
          <li>We do not place App Tracking Transparency (ATT) tracking SDKs in the app</li>
        </ul>

        <h3 className="legal-subsection">Account-Linked Analytics and Profile Sync</h3>
        <p>When you sign in and use synced features, we may collect and store:</p>
        <ul className="legal-list">
          <li><strong>User identifiers:</strong> Google user ID or account ID</li>
          <li><strong>Contact/profile data:</strong> email address and display name</li>
          <li><strong>Category analytics:</strong> category match scores, confidence values, tiers, synthesis version, and sync history</li>
          <li><strong>Consent/settings metadata:</strong> analytics consent state and related timestamps</li>
        </ul>
        <p>
          These records are used for app functionality, product personalization, and understanding
          aggregate category distribution, sync health, and feature usage. You can request access
          to, export, or delete this backend data from Settings or by emailing{' '}
          <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
        </p>

        <h3 className="legal-subsection">App Updates</h3>
        <p>
          The app uses <strong>Expo / EAS Update</strong> to deliver over-the-air updates. When the
          app checks for an update, Expo's servers receive the request and may record an
          install-level identifier, project ID, runtime version, release channel, platform and OS
          version. This is what an update check necessarily sends in order to return the correct
          update. It is not usage analytics: no screen views, no session lengths, no
          feature-engagement events.
        </p>
        <p>
          <strong>We run no analytics, crash-reporting or session-replay SDK of any kind.</strong>{' '}
          Until version 1.2.0 the app also bundled Expo / EAS Insights, which collected app-launch,
          performance, crash and device telemetry. That package was removed in 1.2.0 and no longer
          ships.
        </p>

        {/* § 7 */}
        <div className="section-header">
          <span className="section-num">07</span>
          <h2>Children's Privacy</h2>
          <div className="section-rule" />
        </div>
        <p>
          Ôwn (Payback Own) is not intended for users under 13 years of age (or under 16 in the
          EEA, or under 18 in India). We do not knowingly collect data from children. If you
          believe a child has used the App, please contact us at{' '}
          <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
        </p>
        <div className="verdict-box note">
          <p>
            <strong>India — additional note:</strong> Under India's Digital Personal Data
            Protection Act, 2023 (DPDP Act), users under 18 are classified as children. We do not
            knowingly allow users under 18 in India to use the App without verified parental
            consent. If a parent or guardian believes their child has used the App, please contact
            us immediately to request data deletion.
          </p>
        </div>

        {/* § 8 */}
        <div className="section-header">
          <span className="section-num">08</span>
          <h2>Security Measures</h2>
          <div className="section-rule" />
        </div>
        <ul className="legal-list">
          <li><strong>Encryption:</strong> AES-256 (SQLCipher 4) for data at rest, TLS 1.3 for data in transit</li>
          <li><strong>Secure Storage:</strong> iOS Keychain and Android Keystore for sensitive credentials</li>
          <li><strong>Session Management:</strong> 30-minute inactivity timeout, automatic logout</li>
          <li><strong>Code Security:</strong> Regular security audits, dependency vulnerability scanning</li>
          <li><strong>Local-First Storage:</strong> Most user-facing analysis data remains in the app's encrypted local database rather than a general-purpose cloud store</li>
        </ul>

        {/* § 9 */}
        <div className="section-header">
          <span className="section-num">09</span>
          <h2>Your Privacy Rights</h2>
          <div className="section-rule" />
        </div>

        <h3 className="legal-subsection">General Rights (All Users)</h3>
        <ul className="legal-list">
          <li><strong>Right to Access:</strong> View all data stored in the App (Settings &gt; Data Management)</li>
          <li><strong>Right to Delete:</strong> Delete all data at any time (Settings &gt; Data Management)</li>
          <li><strong>Right to Portability:</strong> Export your persona data (Settings &gt; Export Data)</li>
        </ul>

        <h3 className="legal-subsection">GDPR Rights (EEA Users)</h3>
        <p>If you are in the European Economic Area, you have additional rights under GDPR:</p>
        <ul className="legal-list">
          <li><strong>Right to Rectification:</strong> Correct inaccurate data (delete and re-analyze)</li>
          <li><strong>Right to Restriction:</strong> Limit processing (disable AI analysis)</li>
          <li><strong>Right to Object:</strong> Object to processing (opt out of AI features)</li>
          <li><strong>Right to Lodge Complaint:</strong> Contact your local data protection authority</li>
        </ul>

        <h3 className="legal-subsection">CCPA Rights (California Users)</h3>
        <p>If you are a California resident, you have rights under CCPA:</p>
        <ul className="legal-list">
          <li><strong>Right to Know:</strong> What data is processed (detailed in this policy)</li>
          <li><strong>Right to Delete:</strong> Delete all data (Settings &gt; Data Management)</li>
          <li><strong>Right to Opt-Out:</strong> Opt out of AI analysis (Settings &gt; Privacy)</li>
        </ul>
        <div className="verdict-box note">
          <p>
            We do not sell your personal data or use it for cross-app tracking. However, some
            processing does occur on our backend and with third-party providers as described in
            this policy.
          </p>
        </div>

        <h3 className="legal-subsection">UK GDPR Rights (United Kingdom Users)</h3>
        <p>If you are in the United Kingdom, you have rights under the UK GDPR as retained in UK law by the Data Protection Act 2018:</p>
        <ul className="legal-list">
          <li><strong>Right to Access:</strong> Obtain a copy of your personal data</li>
          <li><strong>Right to Rectification:</strong> Correct inaccurate personal data (delete and re-analyze)</li>
          <li><strong>Right to Erasure:</strong> Request deletion (Settings &gt; Data Management)</li>
          <li><strong>Right to Restriction:</strong> Limit how your data is processed (disable AI analysis)</li>
          <li><strong>Right to Object:</strong> Object to processing based on legitimate interests (opt out of AI features)</li>
          <li><strong>Right to Portability:</strong> Receive your data in a machine-readable format (Settings &gt; Export Data)</li>
          <li><strong>Right to Lodge a Complaint:</strong> Contact the UK Information Commissioner's Office (ICO): <a href="https://ico.org.uk/concerns" target="_blank" rel="noopener noreferrer">ico.org.uk/concerns</a> · 0303 123 1113</li>
        </ul>

        <h3 className="legal-subsection">DPDP Rights (India Users)</h3>
        <p>If you are in India, you have rights under the Digital Personal Data Protection Act, 2023:</p>
        <ul className="legal-list">
          <li><strong>Right to Information:</strong> Know what personal data is collected, why it is processed, and which third parties it is shared with (detailed in this policy)</li>
          <li><strong>Right to Correction and Erasure:</strong> Request correction of inaccurate data or deletion of your personal data (Settings &gt; Data Management, or email <a href={`mailto:${CONTACT}`}>{CONTACT}</a>)</li>
          <li><strong>Right to Grievance Redressal:</strong> Lodge a grievance with our Grievance Officer; we will acknowledge within 48 hours and resolve within 30 days</li>
          <li><strong>Right to Nominate:</strong> Nominate another individual to exercise your data rights on your behalf in the event of death or incapacity</li>
        </ul>
        <div className="verdict-box contact">
          <p>
            <strong>Grievance Officer (India):</strong> {OPERATOR}<br />
            Email: <a href={`mailto:${CONTACT}`}>{CONTACT}</a><br />
            Subject: <code>DPDP Grievance – Ôwn</code><br />
            Response: Acknowledgement within 48 hours; resolution within 30 days
          </p>
        </div>

        {/* § 10 */}
        <div className="section-header">
          <span className="section-num">10</span>
          <h2>International Data Transfers</h2>
          <div className="section-rule" />
        </div>
        <ul className="legal-list">
          <li><strong>Local Processing:</strong> Many file-selection, parsing, and storage operations occur on your device.</li>
          <li><strong>Server-Side Processing:</strong> Account/profile sync data may be processed on our backend infrastructure and databases in the United States.</li>
          <li><strong>AI Requests:</strong> When you use AI-backed features, selected signals or file contents/metadata are sent to our backend and then to Google Gemini via encrypted HTTPS.</li>
          <li><strong>App Updates:</strong> Over-the-air update checks are processed by Expo / EAS services.</li>
          <li><strong>Safeguards:</strong> Third-party providers apply their own contractual and technical safeguards. Please review their privacy documentation for details.</li>
        </ul>
        <p>
          <strong>United Kingdom:</strong> Data transferred outside the UK is subject to UK GDPR
          transfer requirements. We rely on appropriate UK-approved transfer mechanisms (such as
          the UK International Data Transfer Agreement or adequacy regulations) for these
          international data flows.
        </p>
        <p>
          <strong>India:</strong> Data transferred outside India is subject to the DPDP Act's
          provisions on cross-border personal data transfers. We only transfer data to
          jurisdictions or entities that maintain adequate data protections consistent with the
          DPDP Act. By using the App, you consent to the transfer of your personal data to the
          United States and other countries where our service providers operate, subject to the
          protections described in this policy.
        </p>

        {/* § 11 */}
        <div className="section-header">
          <span className="section-num">11</span>
          <h2>Changes to This Privacy Policy</h2>
          <div className="section-rule" />
        </div>
        <p>
          We may update this Privacy Policy periodically to reflect changes in legal requirements,
          new features or services, or improved security practices. We will notify you of material
          changes via in-app notification on next launch, the updated "Last Updated" date at the
          top of this policy, and email (if you've provided contact information for support).
          Continued use of the App after changes constitutes acceptance of the updated policy.
        </p>

        {/* § 12 */}
        <div className="section-header">
          <span className="section-num">12</span>
          <h2>Data Breach Notification</h2>
          <div className="section-rule" />
        </div>
        <p>
          In the unlikely event of a data breach affecting our backend proxy, we will notify
          affected users within 72 hours with details including the nature of the breach, data
          affected, and remediation steps. We will report to relevant authorities as required by
          law, including the UK Information Commissioner's Office (ICO) for UK users and India's
          Data Protection Board (DPB) for Indian users.
        </p>
        <div className="verdict-box note">
          <p>
            Because much of the app's content storage remains local to your device, on-device
            deletion significantly reduces exposure. However, server-side account data, analytics
            records, logs, and third-party AI processing data may still be affected by a
            provider-side incident.
          </p>
        </div>

        {/* § 13 */}
        <div className="section-header">
          <span className="section-num">13</span>
          <h2>Compliance</h2>
          <div className="section-rule" />
        </div>
        <ul className="legal-list">
          <li><strong>GDPR</strong> — General Data Protection Regulation (EU/EEA)</li>
          <li><strong>UK GDPR</strong> / Data Protection Act 2018 — United Kingdom</li>
          <li><strong>DPDP Act</strong> — Digital Personal Data Protection Act, 2023 (India)</li>
          <li><strong>CCPA</strong> — California Consumer Privacy Act (California, USA)</li>
          <li><strong>COPPA</strong> — Children's Online Privacy Protection Act (USA)</li>
          <li><strong>Apple App Store Guidelines</strong> — Section 5.1.1 (Data Collection and Storage)</li>
          <li><strong>Google Play Store Policies</strong> — User Data policies</li>
        </ul>

        {/* § 14 */}
        <div className="section-header">
          <span className="section-num">14</span>
          <h2>Contact Us</h2>
          <div className="section-rule" />
        </div>
        <div className="verdict-box contact">
          <p>
            <strong>{OPERATOR}</strong><br />
            Email: <a href={`mailto:${CONTACT}`}>{CONTACT}</a><br />
            Website: <a href="https://www.milehighinterface.com/payback/privacy.html" target="_blank" rel="noopener noreferrer">milehighinterface.com/payback/privacy.html</a><br />
            Response time: Within 5 business days
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
              Ôwn (Payback Own)
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
              December 8, 2025
            </li>
            <li>
              <strong>Last Updated</strong>
              September 17, 2026 · v1.6
            </li>
          </ul>
          <SocialLinks />
        </div>
      </footer>
    </>
  )
}
