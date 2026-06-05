import { LegalPage } from '../../components/LegalPage/LegalPage'
import { SITE } from '../../data/site'

export default function YapPrivacy() {
  return (
    <>
      <LegalPage
        path="/legal/yap/privacy"
        appLabel="The Yap App"
        docType="privacy"
        subtitle={`The Yap App — ${SITE.name}`}
        dateLine="Effective Date: June 4, 2026 · Last Updated: June 4, 2026"
      >

        <div className="intro-block">
          <p>
            {SITE.name} ("we," "us," or "our") operates The Yap App (the "App"). This Privacy
            Policy explains what information we collect, how we use and protect it, and your rights
            regarding your personal data.
          </p>
        </div>

        <div className="verdict-box note">
          <p>
            By creating an account or using the App, you agree to the practices described in this
            policy.
          </p>
        </div>

        {/* § 1 */}
        <div className="section-header">
          <span className="section-num">01</span>
          <h2>Information We Collect</h2>
          <div className="section-rule" />
        </div>

        <h3 className="legal-subsection">1.1 Account and Profile Data</h3>
        <p>When you register, we collect:</p>
        <ul className="legal-list">
          <li><strong>Email address</strong> — if you sign in with email and password</li>
          <li><strong>Name or display name</strong> — optional, provided during profile setup</li>
          <li><strong>Authentication provider</strong> — email, Google, or Apple</li>
          <li><strong>Username</strong> — auto-generated at registration; you may update your display name later</li>
          <li><strong>User number</strong> — a unique, immutable identifier used to connect with other users</li>
        </ul>

        <h3 className="legal-subsection">1.2 Conversation and Translation Content</h3>
        <ul className="legal-list">
          <li><strong>Message text</strong> — original and translated versions of every message you send or receive</li>
          <li><strong>Audio recordings</strong> — voice recordings you make inside the App for transcription and translation</li>
          <li><strong>Detected and selected languages</strong> — source and target languages for each message</li>
          <li><strong>Sign Scanner images</strong> — photos you take or choose from your library for OCR-based translation (compressed on-device before processing; the original photo is not uploaded)</li>
          <li><strong>Scan history</strong> — saved results from Sign Scanner sessions</li>
        </ul>

        <h3 className="legal-subsection">1.3 Voice Cloning Data (Pro Tier)</h3>
        <p>If you choose to use Voice Cloning:</p>
        <ul className="legal-list">
          <li><strong>Voice sample audio files</strong> you record</li>
          <li><strong>Cloned voice metadata</strong> — name, processing status, sample count, total duration, and the third-party voice ID assigned by ElevenLabs</li>
        </ul>
        <p>
          Voice samples and cloned voices are processed and stored by ElevenLabs on our behalf.
          See Section 5 for details.
        </p>

        <h3 className="legal-subsection">1.4 Usage and Preference Data</h3>
        <ul className="legal-list">
          <li><strong>Translation counts</strong> — daily usage of translations and TTS generation, used to enforce plan limits</li>
          <li><strong>Settings</strong> — target language, selected voice, and color theme preference</li>
          <li><strong>Contacts and connection requests</strong> — display names, user numbers, and relationship status (connected, blocked, muted, custom alias)</li>
          <li><strong>Presence signals</strong> — approximate last-active timestamp and which conversation you are currently viewing; visible only to contacts and used solely to show "online" indicators</li>
          <li><strong>Discoverability signals</strong> — if you activate the "broadcast availability" feature, a short-lived discoverability record is visible to nearby users for up to 15 minutes</li>
          <li><strong>Performance telemetry</strong> — anonymized timing data from translation pipeline stages (no message content, no personal identifiers)</li>
        </ul>

        <h3 className="legal-subsection">1.5 Push Notification Token</h3>
        <p>
          If you grant notification permission, we store your device's Expo push token to deliver
          new-message alerts from your contacts.
        </p>

        <h3 className="legal-subsection">1.6 Support Messages and User Reports</h3>
        <ul className="legal-list">
          <li><strong>Support messages</strong> — subject line, message body, and email address you provide when contacting support</li>
          <li><strong>User reports</strong> — if you report another user, we record your user ID, the reported user's ID, the reason selected, any additional details you provide, and the relevant message ID if applicable</li>
        </ul>

        {/* § 2 */}
        <div className="section-header">
          <span className="section-num">02</span>
          <h2>How We Use Your Information</h2>
          <div className="section-rule" />
        </div>
        <div className="legal-table-wrap">
          <table className="legal-table">
            <thead>
              <tr>
                <th>Purpose</th>
                <th>Data Used</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Provide transcription, translation, and TTS</td>
                <td>Message text, audio recordings, scan images, language selections</td>
              </tr>
              <tr>
                <td>Deliver real-time remote conversations</td>
                <td>Message content, typing indicators, presence, read receipts</td>
              </tr>
              <tr>
                <td>Enforce subscription plan limits</td>
                <td>Daily translation and TTS counts, subscription tier</td>
              </tr>
              <tr>
                <td>Send push notifications</td>
                <td>Push token, sender display name</td>
              </tr>
              <tr>
                <td>Voice cloning (Pro)</td>
                <td>Voice sample audio, cloned voice metadata</td>
              </tr>
              <tr>
                <td>Show your profile to contacts</td>
                <td>Display name, user number, default language, privacy mode</td>
              </tr>
              <tr>
                <td>Account security and fraud prevention</td>
                <td>Authentication data, subscription status</td>
              </tr>
              <tr>
                <td>Respond to support requests</td>
                <td>Support message content, email</td>
              </tr>
              <tr>
                <td>Moderate content and enforce Community Guidelines</td>
                <td>User reports, flagged messages, admin audit log</td>
              </tr>
              <tr>
                <td>Anonymized performance monitoring</td>
                <td>Pipeline timing telemetry</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="verdict-box note">
          <p>
            We do <strong>not</strong> use your conversation content, voice recordings, or scan
            images for advertising or to train general-purpose AI models.
          </p>
        </div>

        {/* § 3 */}
        <div className="section-header">
          <span className="section-num">03</span>
          <h2>Data Storage</h2>
          <div className="section-rule" />
        </div>
        <p>Your data is stored in the following systems:</p>
        <ul className="legal-list">
          <li><strong>Google Cloud Firestore</strong> — user accounts, remote conversations, contacts, preferences, subscription data, and presence. Data resides in the United States by default.</li>
          <li><strong>Google Cloud Storage</strong> — audio recordings you make, synthesized speech files, and remote conversation audio clips.</li>
          <li><strong>On-device storage (AsyncStorage)</strong> — local conversations, scan history, settings, and translation cache. This data never leaves your device unless you start a remote conversation.</li>
        </ul>

        {/* § 4 */}
        <div className="section-header">
          <span className="section-num">04</span>
          <h2>Device Permissions</h2>
          <div className="section-rule" />
        </div>
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
                <td><strong>Microphone</strong></td>
                <td>Recording speech for translation; Live Mode hands-free translation; Voice Cloning sample recording</td>
              </tr>
              <tr>
                <td><strong>Camera</strong></td>
                <td>Sign Scanner (photograph text for translation); QR code scanning to connect with contacts</td>
              </tr>
              <tr>
                <td><strong>Photo Library</strong></td>
                <td>Selecting existing photos for Sign Scanner</td>
              </tr>
              <tr>
                <td><strong>Push Notifications</strong></td>
                <td>Alerting you when contacts send you messages</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          You can revoke any permission at any time in your device Settings. Revoking microphone
          access disables recording-based translation and Live Mode. Revoking notifications
          disables message alerts but does not affect other App features.
        </p>

        {/* § 5 */}
        <div className="section-header">
          <span className="section-num">05</span>
          <h2>Third-Party Services</h2>
          <div className="section-rule" />
        </div>
        <p>
          All AI processing occurs <strong>server-side</strong> through Firebase Cloud Functions —
          no third-party AI provider API keys are present in the App itself. The following services
          receive data as necessary to fulfill their function:
        </p>
        <div className="legal-table-wrap">
          <table className="legal-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Provider</th>
                <th>Data Received</th>
                <th>Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Firebase Authentication</td>
                <td>Google</td>
                <td>Email address, OAuth tokens</td>
                <td>Account sign-in (email, Google, Apple)</td>
              </tr>
              <tr>
                <td>Cloud Firestore and Cloud Storage</td>
                <td>Google</td>
                <td>User data, messages, audio files</td>
                <td>Storage, real-time sync</td>
              </tr>
              <tr>
                <td>Google Gemini</td>
                <td>Google</td>
                <td>Audio, text, images</td>
                <td>Speech-to-text, text translation, image OCR</td>
              </tr>
              <tr>
                <td>Groq (Llama 3.3 70B)</td>
                <td>Groq</td>
                <td>Text</td>
                <td>Streaming text translation</td>
              </tr>
              <tr>
                <td>Deepgram (Nova-3)</td>
                <td>Deepgram</td>
                <td>Audio stream</td>
                <td>Real-time streaming speech-to-text</td>
              </tr>
              <tr>
                <td>ElevenLabs</td>
                <td>ElevenLabs</td>
                <td>Text, voice sample audio</td>
                <td>Text-to-speech synthesis and voice cloning</td>
              </tr>
              <tr>
                <td>RevenueCat</td>
                <td>RevenueCat</td>
                <td>User ID, purchase events</td>
                <td>Subscription management</td>
              </tr>
              <tr>
                <td>Expo / EAS</td>
                <td>Expo</td>
                <td>Device push token</td>
                <td>Push notification delivery</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>Each provider operates under its own privacy policy:</p>
        <ul className="legal-list">
          <li><strong>Google / Firebase:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a></li>
          <li><strong>Groq:</strong> <a href="https://groq.com/privacy-policy" target="_blank" rel="noopener noreferrer">groq.com/privacy-policy</a></li>
          <li><strong>Deepgram:</strong> <a href="https://deepgram.com/privacy" target="_blank" rel="noopener noreferrer">deepgram.com/privacy</a></li>
          <li><strong>ElevenLabs:</strong> <a href="https://elevenlabs.io/privacy" target="_blank" rel="noopener noreferrer">elevenlabs.io/privacy</a></li>
          <li><strong>RevenueCat:</strong> <a href="https://www.revenuecat.com/privacy" target="_blank" rel="noopener noreferrer">revenuecat.com/privacy</a></li>
          <li><strong>Expo:</strong> <a href="https://expo.dev/privacy" target="_blank" rel="noopener noreferrer">expo.dev/privacy</a></li>
        </ul>

        {/* § 6 */}
        <div className="section-header">
          <span className="section-num">06</span>
          <h2>Data Sharing</h2>
          <div className="section-rule" />
        </div>
        <p>We do not sell your personal data to third parties. We share data only:</p>
        <ul className="legal-list">
          <li>With the third-party service providers listed in Section 5, strictly to operate the App</li>
          <li>With your conversation partners, who receive the translated versions of your messages and, in remote conversations, your display name and selected language</li>
          <li>If required by law, court order, or to protect the rights, property, or safety of {SITE.name}, its users, or the public</li>
        </ul>

        {/* § 7 */}
        <div className="section-header">
          <span className="section-num">07</span>
          <h2>Data Retention and Deletion</h2>
          <div className="section-rule" />
        </div>
        <ul className="legal-list">
          <li><strong>Account and profile data</strong> is retained for as long as your account is active.</li>
          <li><strong>Local-only data</strong> (conversations created without a remote partner, scan history) remains on your device until you delete the App or clear its data.</li>
          <li><strong>Remote conversations</strong> are retained until you or your conversation partner deletes them, or until your account is deleted.</li>
          <li><strong>Voice clones</strong> are deleted from our servers and from ElevenLabs when you delete them in the App or when your account is removed.</li>
          <li><strong>Support messages and reports</strong> are retained for as long as necessary to resolve the matter.</li>
        </ul>
        <div className="verdict-box contact">
          <p>
            <strong>To delete your account,</strong> contact us at{' '}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. We will delete your Firestore
            documents, Cloud Storage files, and Firebase Authentication record within 30 days.
            Some anonymized, aggregated data may be retained in de-identified form.
          </p>
        </div>

        {/* § 8 */}
        <div className="section-header">
          <span className="section-num">08</span>
          <h2>Children's Privacy</h2>
          <div className="section-rule" />
        </div>
        <p>
          The App is not directed to children under the age of 13 (or under 16 in the European
          Economic Area). We do not knowingly collect personal information from children. If you
          believe a child has provided us personal information without appropriate consent, please
          contact us immediately and we will promptly delete it.
        </p>

        {/* § 9 */}
        <div className="section-header">
          <span className="section-num">09</span>
          <h2>Security</h2>
          <div className="section-rule" />
        </div>
        <p>We implement industry-standard measures to protect your information:</p>
        <ul className="legal-list">
          <li>All data in transit is encrypted with HTTPS/TLS</li>
          <li>Firebase Security Rules restrict each user to accessing only their own data</li>
          <li>AI provider API keys are stored exclusively as Firebase Cloud Functions secrets — they are never embedded in the App</li>
          <li>Real-time streaming sessions use short-lived tokens minted by our server that expire within minutes</li>
          <li>All privileged administrative actions are recorded in a tamper-evident audit log</li>
        </ul>
        <p>
          No system is completely secure. If you discover a potential security vulnerability,
          please contact us at the address in Section 12.
        </p>

        {/* § 10 */}
        <div className="section-header">
          <span className="section-num">10</span>
          <h2>Your Privacy Rights</h2>
          <div className="section-rule" />
        </div>
        <p>Depending on your jurisdiction, you may have the right to:</p>
        <ul className="legal-list">
          <li><strong>Access</strong> the personal data we hold about you</li>
          <li><strong>Correct</strong> inaccurate or incomplete data</li>
          <li><strong>Delete</strong> your account and associated personal data</li>
          <li><strong>Data portability</strong> — receive a machine-readable copy of your data</li>
          <li><strong>Object or restrict</strong> certain processing activities</li>
        </ul>
        <p>
          To exercise any of these rights, contact us as described in Section 12. We will respond
          within 30 days.
        </p>

        {/* § 11 */}
        <div className="section-header">
          <span className="section-num">11</span>
          <h2>Changes to This Policy</h2>
          <div className="section-rule" />
        </div>
        <p>
          We may update this Privacy Policy from time to time. When we do, we will revise the
          "Last Updated" date above. If we make material changes, we will notify you through the
          App or by email before the changes take effect. Continued use of the App after changes
          constitutes your acceptance of the revised policy.
        </p>

        {/* § 12 */}
        <div className="section-header">
          <span className="section-num">12</span>
          <h2>Contact Us</h2>
          <div className="section-rule" />
        </div>
        <div className="verdict-box contact">
          <p>
            <strong>{SITE.name}</strong><br />
            Email: <a href={`mailto:${SITE.email}`}>{SITE.email}</a><br />
            Website: <a href="https://yap-united.app" target="_blank" rel="noopener noreferrer">yap-united.app</a>
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
              The Yap App (Yap United)
            </li>
            <li>
              <strong>Platform</strong>
              iOS &amp; Android
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
              {SITE.email}
            </li>
            <li>
              <strong>App Website</strong>
              yap-united.app
            </li>
          </ul>
        </div>
      </footer>
    </>
  )
}
