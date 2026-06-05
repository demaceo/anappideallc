import { LegalPage } from '../../components/LegalPage/LegalPage'
import { SITE } from '../../data/site'

export default function FengshuiPrivacy() {
  return (
    <LegalPage
      path="/legal/fengshui/privacy"
      appLabel="Feng Shui"
      docType="privacy"
      subtitle={`Feng Shui — ${SITE.name}`}
      dateLine="Effective Date: June 5, 2026 · Last Updated: June 5, 2026"
    >

      <div className="intro-block">
        <p>
          This Privacy Policy explains how {SITE.name} ("An App Idea," "we," "us," or "our")
          collects, uses, shares, and protects information in connection with the{' '}
          <strong>Feng Shui</strong> mobile application and related services (collectively, the
          "App").
        </p>
      </div>

      <div className="verdict-box note">
        <p>
          By downloading, accessing, or using the App, you agree to the practices described in
          this Privacy Policy. If you do not agree, please do not use the App.
        </p>
      </div>

      <div className="pullquote">
        <strong>At a Glance</strong>
        <ul className="legal-list">
          <li>The App helps you draw floor plans, model rooms in 3D, annotate features, place furniture, and receive AI-generated Feng Shui analysis and layout suggestions.</li>
          <li>You can start using the App <strong>without creating an account or providing your name or email</strong> — a private, randomly generated account is created automatically.</li>
          <li>We <strong>do not</strong> sell your personal information, we <strong>do not</strong> use advertising, and we <strong>do not</strong> track you across other companies' apps or websites.</li>
          <li>To generate analysis, the room information you create is sent securely to <strong>Google's Gemini AI</strong> through our backend.</li>
          <li>You can delete your content at any time from <strong>Settings → Delete All Data</strong>, or by contacting us for complete deletion.</li>
        </ul>
      </div>

      {/* § 1 */}
      <div className="section-header">
        <span className="section-num">01</span>
        <h2>Who We Are</h2>
        <div className="section-rule" />
      </div>

      <p>
        The App is provided by {SITE.name}, a limited liability company organized under the laws
        of the State of Colorado, United States.
      </p>
      <ul className="legal-list">
        <li><strong>Website:</strong> {SITE.url}</li>
        <li><strong>Contact:</strong> <a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
      </ul>

      {/* § 2 */}
      <div className="section-header">
        <span className="section-num">02</span>
        <h2>Information We Collect</h2>
        <div className="section-rule" />
      </div>

      <p>
        We aim to collect only what is needed to operate the App. The categories below describe
        what we collect and why.
      </p>

      <h3 className="legal-subsection">2.1 Account and Identifiers</h3>
      <ul className="legal-list">
        <li>
          <strong>Anonymous account identifier.</strong> When you first open the App, we
          automatically create an anonymous account using Firebase Authentication. This generates
          a random user ID (UID) stored on your device. It is <strong>not</strong> linked to
          your name, email, or phone number, and is used to associate your rooms, analyses, and
          settings with your installation of the App.
        </li>
        <li>
          <strong>Optional sign-in (Google or Apple).</strong> The App may offer the option to
          sign in with Google or Sign in with Apple so you can back up and sync your data across
          devices. <strong>If, and only if, you choose to sign in,</strong> we receive limited
          information from the provider, which may include: your email address (or, for Sign in
          with Apple, an Apple-generated private relay email if you choose to hide your address);
          your name or display name, if provided; and a provider account identifier used to link
          your sign-in to your existing data.
        </li>
      </ul>

      <h3 className="legal-subsection">2.2 Content You Create ("Room Data")</h3>
      <p>When you use the App, you create and store content that may include:</p>
      <ul className="legal-list">
        <li>floor-plan drawings and room geometry (corners, walls, dimensions, area, perimeter, wall height);</li>
        <li>the <strong>room name</strong>, room type, and any <strong>free-text notes or context</strong> you choose to enter;</li>
        <li>wall, ceiling, and floor annotations (doors, windows, outlets, vents, light switches, ceiling fans/lights, and their attributes);</li>
        <li>furniture and wall-décor placements, dimensions, and custom labels;</li>
        <li>room appearance choices (colors and materials); and</li>
        <li>room orientation and facing direction, and related visual previews.</li>
      </ul>
      <div className="verdict-box note">
        <p>
          <strong>Please note:</strong> The room name and notes fields are free text. Avoid
          entering sensitive personal information (such as health, financial, or government-ID
          details) into these fields, because this content is stored in your account and sent to
          our AI provider to generate your analysis.
        </p>
      </div>

      <h3 className="legal-subsection">2.3 Analysis and Layout Results</h3>
      <p>
        We store the outputs the App generates for you, including Feng Shui analysis results
        (overall and sub-scores, Bagua zone mapping, element balance, chi-flow analysis,
        command-position evaluation, strengths/issues, and recommendations) and any AI-generated
        furniture-rearrangement alternatives.
      </p>

      <h3 className="legal-subsection">2.4 Preferences and Settings</h3>
      <p>
        We store your in-App settings, such as your measurement unit (meters/feet),
        haptic-feedback toggle, light/dark theme preference, and a feature-rollout setting for
        the "Room Studio" feature.
      </p>

      <h3 className="legal-subsection">2.5 Device Sensor Data (Compass)</h3>
      <p>
        If you use the room-orientation feature, the App reads your device's{' '}
        <strong>magnetometer (compass)</strong> to help you point your room toward a real-world
        direction. Compass readings are processed <strong>on your device</strong> to compute a
        heading. We store only the <strong>facing direction you ultimately set</strong> for a
        room — not a continuous stream of raw sensor data. The magnetometer is a
        motion/orientation sensor and is <strong>not</strong> GPS; the App does{' '}
        <strong>not</strong> collect your geographic location.
      </p>

      <h3 className="legal-subsection">2.6 Usage and Diagnostic Data (Room Studio)</h3>
      <p>
        To evaluate and improve the optional "Room Studio" editing experience, the App records
        limited, product-usage metrics tied to your own account, such as: number and duration of
        Studio sessions, counts of editing commands, undo/redo counts, invalid-placement counts,
        save/analyze counts, and which feature-rollout group your device is in. These metrics are
        stored under your own account data and used in aggregate to make product decisions.
      </p>
      <p>
        We do <strong>not</strong> use any third-party analytics, advertising, attribution, or
        tracking SDKs. We do not collect a device advertising identifier (IDFA), and we do not
        request App Tracking Transparency permission because we do not track you.
      </p>

      <h3 className="legal-subsection">2.7 Technical Data Processed by Our Infrastructure</h3>
      <p>
        To operate authentication, database sync, and our AI backend, our infrastructure
        providers (primarily Google Firebase / Google Cloud) necessarily process certain technical
        data when your device communicates with our servers, such as IP address, connection
        metadata, device/runtime information, and timestamps. This data is used to deliver the
        service, maintain security, prevent abuse, and enforce rate limits.
      </p>

      {/* § 3 */}
      <div className="section-header">
        <span className="section-num">03</span>
        <h2>How We Use Information</h2>
        <div className="section-rule" />
      </div>

      <p>We use the information described above to:</p>
      <ul className="legal-list">
        <li>provide, maintain, and operate the App's core features (drawing, 3D modeling, annotation, furniture placement, storage, and sync);</li>
        <li>generate AI-powered Feng Shui analysis and layout-optimization suggestions;</li>
        <li>save your rooms, analyses, and settings, and (if you sign in) sync them across your devices;</li>
        <li>understand how features are used so we can fix issues and improve the App;</li>
        <li>protect the security and integrity of the App, prevent fraud and abuse, and enforce usage limits; and</li>
        <li>comply with legal obligations and enforce our Terms of Service.</li>
      </ul>

      {/* § 4 */}
      <div className="section-header">
        <span className="section-num">04</span>
        <h2>How Your Information Is Shared</h2>
        <div className="section-rule" />
      </div>

      <p>
        We do <strong>not</strong> sell your personal information, and we do{' '}
        <strong>not</strong> share it for cross-context behavioral advertising. We share
        information only as described below.
      </p>

      <h3 className="legal-subsection">4.1 Service Providers and Sub-Processors</h3>
      <p>
        We use trusted third parties to provide the App. These providers process information on
        our behalf or as independent controllers for the limited purposes described:
      </p>
      <div className="legal-table-wrap">
        <table className="legal-table">
          <thead>
            <tr>
              <th>Provider</th>
              <th>Purpose</th>
              <th>Data involved</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Google Firebase</strong> (Authentication, Cloud Firestore, Cloud Functions) — Google LLC</td>
              <td>Anonymous/optional sign-in, cloud storage and sync of your content, and running our backend</td>
              <td>Account identifier, Room Data, analyses, settings, and technical data (e.g., IP)</td>
            </tr>
            <tr>
              <td><strong>Google Gemini API</strong> — Google LLC</td>
              <td>Generating Feng Shui analysis and layout suggestions from your room information, server-side</td>
              <td>Room information you create (geometry, room type, name, notes, annotations, furniture, appearance)</td>
            </tr>
            <tr>
              <td><strong>Apple</strong> — Apple Inc.</td>
              <td>App distribution via the App Store/TestFlight and, if you use it, Sign in with Apple</td>
              <td>Account/sign-in information you provide to Apple; standard App Store data handled by Apple</td>
            </tr>
            <tr>
              <td><strong>Google Sign-In</strong> — Google LLC</td>
              <td>If you choose to sign in with Google</td>
              <td>Your Google email, name, and account identifier</td>
            </tr>
            <tr>
              <td><strong>Expo / EAS</strong> — 650 Industries, Inc.</td>
              <td>App builds and over-the-air (OTA) JavaScript updates</td>
              <td>Technical data needed to deliver the correct app update to your device</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Our AI requests are made <strong>server-side</strong> from our backend; the AI
        provider's API key is never included in the App on your device.
      </p>
      <div className="verdict-box warning">
        <p>
          <strong>Important — AI processing:</strong> To generate your analysis, the room
          information you create is transmitted to Google's Gemini AI. Google processes this data
          to return results to us. Please review Google's applicable terms and privacy
          documentation for how Google handles data submitted to its AI APIs.
        </p>
      </div>

      <h3 className="legal-subsection">4.2 Legal and Safety</h3>
      <p>
        We may disclose information if we believe in good faith that it is necessary to: comply
        with applicable law, regulation, legal process, or governmental request; enforce our
        Terms of Service; detect, prevent, or address fraud, security, or technical issues; or
        protect the rights, property, or safety of our users, the public, or us.
      </p>

      <h3 className="legal-subsection">4.3 Business Transfers</h3>
      <p>
        If we are involved in a merger, acquisition, financing, reorganization, or sale of
        assets, information may be transferred as part of that transaction, subject to this
        Privacy Policy.
      </p>

      {/* § 5 */}
      <div className="section-header">
        <span className="section-num">05</span>
        <h2>Data Retention and Deletion</h2>
        <div className="section-rule" />
      </div>

      <p>
        We retain your information for as long as your account exists or as needed to provide
        the App, comply with our legal obligations, resolve disputes, and enforce our agreements.
      </p>
      <p>
        <strong>You control your content.</strong> In the App, go to{' '}
        <strong>Settings → Delete All Data</strong> to permanently delete your rooms, settings,
        and saved rearrangements.
      </p>
      <div className="verdict-box note">
        <p>
          Because of how our backend is secured, certain records — including saved{' '}
          <strong>analyses</strong> and the internal <strong>job records</strong> used to generate
          analyses and rearrangements — are managed by our backend and are{' '}
          <strong>not</strong> deletable directly from the App. To request{' '}
          <strong>complete deletion</strong> of all remaining data associated with your account,
          contact us at <a href={`mailto:${SITE.email}`}>{SITE.email}</a> and we will process
          your request within a reasonable time, subject to legal retention requirements.
        </p>
      </div>
      <p>
        Deleting the App from your device does not, by itself, delete content stored in the
        cloud; use the in-App deletion or contact us.
      </p>

      {/* § 6 */}
      <div className="section-header">
        <span className="section-num">06</span>
        <h2>Data Security</h2>
        <div className="section-rule" />
      </div>

      <p>
        We take reasonable technical and organizational measures to protect your information,
        including:
      </p>
      <ul className="legal-list">
        <li>transport encryption (HTTPS/TLS) for data in transit;</li>
        <li>access controls that scope all stored data to your own account, enforced by server-side security rules; and</li>
        <li>keeping sensitive credentials (such as our AI API key) only on our backend, never in the App.</li>
      </ul>
      <p>
        No method of transmission or storage is completely secure, and we cannot guarantee
        absolute security. You are responsible for maintaining the security of any device and any
        sign-in credentials you use with the App.
      </p>

      {/* § 7 */}
      <div className="section-header">
        <span className="section-num">07</span>
        <h2>Children's Privacy</h2>
        <div className="section-rule" />
      </div>

      <p>
        The App is not directed to children under 13, and we do not knowingly collect personal
        information from children under 13 (or the minimum age required in your jurisdiction).
        If you believe a child has provided us personal information, contact us at{' '}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a> and we will take steps to delete it.
      </p>

      {/* § 8 */}
      <div className="section-header">
        <span className="section-num">08</span>
        <h2>Your Privacy Rights</h2>
        <div className="section-rule" />
      </div>

      <p>
        Depending on where you live, you may have rights regarding your personal information,
        including the right to access, correct, delete, or receive a copy of it, and to object
        to or restrict certain processing.
      </p>
      <p>
        <strong>How to exercise your rights:</strong> Use{' '}
        <strong>Settings → Delete All Data</strong> in the App, or contact us at{' '}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. We will respond as required by
        applicable law. We will not discriminate against you for exercising these rights.
      </p>

      <h3 className="legal-subsection">8.1 U.S. State Privacy Rights (including California)</h3>
      <p>
        We do <strong>not</strong> "sell" personal information and do{' '}
        <strong>not</strong> "share" it for cross-context behavioral advertising as those terms
        are defined under California and other U.S. state privacy laws. Residents of California
        and certain other states may have rights to know, access, correct, delete, and to be free
        from discrimination for exercising these rights. To make a request, contact us using the
        details above.
      </p>

      <h3 className="legal-subsection">8.2 EEA/UK Rights</h3>
      <p>
        If you are in the European Economic Area or the United Kingdom, our legal bases for
        processing are: performance of a contract (to provide the App you request); our
        legitimate interests (to secure, maintain, and improve the App); your consent (for
        optional sign-in); and compliance with legal obligations. You may have rights to access,
        rectify, erase, restrict, or object to processing, to data portability, and to lodge a
        complaint with your local supervisory authority.
      </p>

      {/* § 9 */}
      <div className="section-header">
        <span className="section-num">09</span>
        <h2>International Data Transfers</h2>
        <div className="section-rule" />
      </div>

      <p>
        We are based in the United States, and our infrastructure providers process data in the
        United States and potentially other countries. If you access the App from outside the
        United States, you understand that your information may be transferred to, stored, and
        processed in the United States, where data-protection laws may differ from those in your
        jurisdiction.
      </p>

      {/* § 10 */}
      <div className="section-header">
        <span className="section-num">10</span>
        <h2>Do Not Track</h2>
        <div className="section-rule" />
      </div>

      <p>
        The App does not respond to browser "Do Not Track" signals, and we do not track you
        across third-party apps or websites.
      </p>

      {/* § 11 */}
      <div className="section-header">
        <span className="section-num">11</span>
        <h2>Third-Party Services and Links</h2>
        <div className="section-rule" />
      </div>

      <p>
        The App relies on third-party services (such as those listed in Section 4) and may
        reference third-party content. Your use of those services is governed by their own terms
        and privacy policies, and we are not responsible for their practices. We encourage you to
        review them.
      </p>

      {/* § 12 */}
      <div className="section-header">
        <span className="section-num">12</span>
        <h2>Changes to This Privacy Policy</h2>
        <div className="section-rule" />
      </div>

      <p>
        We may update this Privacy Policy from time to time. When we do, we will revise the
        "Last Updated" date above and, where appropriate, provide additional notice (for example,
        within the App or on our website). Your continued use of the App after an update becomes
        effective constitutes acceptance of the revised policy.
      </p>

      {/* § 13 */}
      <div className="section-header">
        <span className="section-num">13</span>
        <h2>Apple App Store Notice</h2>
        <div className="section-rule" />
      </div>

      <p>
        The App is distributed through the Apple App Store. Apple's handling of information
        related to your App Store account, downloads, and purchases is governed by Apple's
        privacy policy, not this one.
      </p>

      {/* § 14 */}
      <div className="section-header">
        <span className="section-num">14</span>
        <h2>AI-Generated Content Notice</h2>
        <div className="section-rule" />
      </div>

      <p>
        Feng Shui analysis and layout suggestions are generated by an automated AI system and
        are provided for <strong>informational and entertainment purposes only</strong>. They may
        be inaccurate or incomplete and are not professional architectural, structural,
        real-estate, design, health, financial, or safety advice. See our Terms of Service for
        more detail.
      </p>

      {/* § 15 */}
      <div className="section-header">
        <span className="section-num">15</span>
        <h2>Contact Us</h2>
        <div className="section-rule" />
      </div>

      <div className="verdict-box contact">
        <p>
          <strong>{SITE.name}</strong><br />
          Colorado, United States<br />
          Email: <a href={`mailto:${SITE.email}`}>{SITE.email}</a><br />
          Website: <a href={SITE.url}>{SITE.url}</a>
        </p>
        <p>
          If you have questions, concerns, or requests regarding this Privacy Policy or your
          information, contact us at the address above.
        </p>
      </div>

    </LegalPage>
  )
}
