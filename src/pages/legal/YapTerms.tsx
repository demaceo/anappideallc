import { LegalPage } from '../../components/LegalPage/LegalPage'
import { SITE } from '../../data/site'

export default function YapTerms() {
  return (
    <>
      <LegalPage
        path="/legal/yap/terms"
        appLabel="The Yap App"
        docType="terms"
        subtitle={`The Yap App — ${SITE.name}`}
        dateLine="Effective Date: June 4, 2026 · Last Updated: June 4, 2026"
      >

        <div className="intro-block">
          <p>
            These Terms of Service ("Terms") are a legal agreement between you and{' '}
            {SITE.name} ("we," "us," or "our") governing your access to and use of The Yap App
            (the "App"). By creating an account or using the App, you agree to be bound by these
            Terms.
          </p>
        </div>

        <div className="verdict-box warning">
          <p><strong>If you do not agree, do not use the App.</strong></p>
        </div>

        {/* § 1 */}
        <div className="section-header">
          <span className="section-num">01</span>
          <h2>Eligibility</h2>
          <div className="section-rule" />
        </div>
        <p>
          You must be at least 13 years old to use the App. If you are located in the European
          Economic Area, you must be at least 16 years old. By using the App, you represent that
          you meet the applicable minimum age requirement.
        </p>
        <p>
          If you are using the App on behalf of an organization, you represent that you have the
          authority to bind that organization to these Terms, and "you" refers to both you and the
          organization.
        </p>

        {/* § 2 */}
        <div className="section-header">
          <span className="section-num">02</span>
          <h2>Accounts</h2>
          <div className="section-rule" />
        </div>
        <ul className="legal-list">
          <li>You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account.</li>
          <li>You must provide accurate and current information when registering.</li>
          <li>You may not create an account on behalf of another person without their consent.</li>
          <li>You may not transfer or sell your account to another person.</li>
          <li>You must notify us immediately at the contact address in Section 18 if you believe your account has been compromised.</li>
          <li>We reserve the right to suspend or permanently terminate accounts that violate these Terms.</li>
        </ul>

        {/* § 3 */}
        <div className="section-header">
          <span className="section-num">03</span>
          <h2>Description of the Service</h2>
          <div className="section-rule" />
        </div>
        <p>
          The Yap App enables real-time speech and text translation between people who do not share
          a language. The App includes:
        </p>
        <ul className="legal-list">
          <li><strong>Conversation translation</strong> — turn-by-turn translation on a single device, or real-time back-and-forth with a remote contact</li>
          <li><strong>Sign Scanner</strong> — camera-based OCR and translation of signs and printed text</li>
          <li><strong>Live Mode</strong> — hands-free, streaming conversation translation routed to earbuds</li>
          <li><strong>Voice Cloning</strong> — clone your voice for personalized text-to-speech playback (Pro tier only)</li>
          <li><strong>Remote connections</strong> — connect with contacts via QR code or deep link for networked, real-time bilingual conversations</li>
        </ul>
        <p>
          We reserve the right to modify, suspend, or discontinue any feature or the entire App at
          any time, with or without notice. We will make reasonable efforts to notify you of
          significant changes.
        </p>

        {/* § 4 */}
        <div className="section-header">
          <span className="section-num">04</span>
          <h2>Subscriptions and Payments</h2>
          <div className="section-rule" />
        </div>

        <h3 className="legal-subsection">4.1 Free Tier</h3>
        <p>The App is available at no charge with the following limits (enforced server-side):</p>
        <ul className="legal-list">
          <li><strong>30 translations per day</strong> (plus a one-time bonus of 10 credits upon first use)</li>
          <li><strong>5 Sign Scanner uses per day</strong></li>
          <li><strong>15 spoken TTS playbacks per day</strong></li>
          <li><strong>Up to 3 active remote conversation channels</strong></li>
          <li><strong>No access to Voice Cloning</strong></li>
        </ul>

        <h3 className="legal-subsection">4.2 Pro Tier</h3>
        <p>A Pro subscription unlocks:</p>
        <ul className="legal-list">
          <li><strong>Up to 1,000 translations per day</strong> (fair-use limit)</li>
          <li><strong>Up to 200 Sign Scanner uses per day</strong></li>
          <li><strong>Up to 500 spoken TTS playbacks per day</strong></li>
          <li><strong>Unlimited remote conversation channels</strong></li>
          <li><strong>Voice Cloning</strong></li>
        </ul>

        <h3 className="legal-subsection">4.3 Billing and Auto-Renewal</h3>
        <p>
          Pro subscriptions are managed through <strong>RevenueCat</strong> and charged by Apple
          (App Store) or Google (Google Play), depending on your platform. By subscribing, you
          authorize the applicable platform to charge your payment method on a recurring basis.
          Subscriptions automatically renew unless cancelled at least 24 hours before the end of
          the then-current billing period. You can manage or cancel your subscription in your
          device's system subscription settings.
        </p>

        <h3 className="legal-subsection">4.4 Refunds</h3>
        <p>
          Refund requests are governed by the refund policy of the platform through which you
          subscribed (Apple App Store or Google Play Store). We do not issue refunds directly.
        </p>

        <h3 className="legal-subsection">4.5 Price Changes</h3>
        <p>
          We reserve the right to modify subscription prices at any time. We will provide
          reasonable advance notice of any price increases. Continued use of a subscription after a
          price change takes effect constitutes your acceptance of the new price.
        </p>

        <h3 className="legal-subsection">4.6 Free Trial</h3>
        <p>
          If we offer a free trial period, it will be described at the time of sign-up. Your
          subscription will automatically convert to a paid plan at the end of the trial unless
          you cancel before the trial ends.
        </p>

        {/* § 5 */}
        <div className="section-header">
          <span className="section-num">05</span>
          <h2>Acceptable Use</h2>
          <div className="section-rule" />
        </div>
        <p>
          You agree to use the App only for lawful purposes and in accordance with these Terms. You
          agree <strong>not</strong> to:
        </p>
        <ul className="legal-list">
          <li>Transmit content that is unlawful, harassing, defamatory, threatening, obscene, or that infringes any third party's rights</li>
          <li>Impersonate any person or entity, or misrepresent your affiliation with any person or entity</li>
          <li>Attempt to gain unauthorized access to the App, its servers, or any accounts other than your own</li>
          <li>Interfere with, disrupt, or overburden the App or its infrastructure</li>
          <li>Use automated tools to access, scrape, or interact with the App without our prior written consent</li>
          <li>Reverse-engineer, decompile, disassemble, or attempt to derive the source code of the App</li>
          <li>Circumvent, disable, or interfere with subscription limits, entitlement checks, or other access controls</li>
          <li>Use the App to facilitate spam, phishing, or fraudulent activity</li>
          <li>Collect or harvest personal data about other users without their explicit consent</li>
        </ul>
        <p>
          Violation of this Section may result in immediate suspension or termination of your
          account.
        </p>

        {/* § 6 */}
        <div className="section-header">
          <span className="section-num">06</span>
          <h2>User Content</h2>
          <div className="section-rule" />
        </div>

        <h3 className="legal-subsection">6.1 Ownership</h3>
        <p>
          You retain ownership of the messages, audio recordings, images, and other content you
          create through the App ("User Content").
        </p>

        <h3 className="legal-subsection">6.2 License to Us</h3>
        <p>
          By using the App, you grant {SITE.name} a limited, non-exclusive, worldwide,
          royalty-free license to process, store, transmit, and display your User Content solely
          as necessary to provide and improve the App's features (for example, transcribing,
          translating, delivering messages to your conversation partner, and caching synthesized
          speech on your device).
        </p>

        <h3 className="legal-subsection">6.3 Your Responsibility</h3>
        <p>
          You are solely responsible for the User Content you transmit through the App. We do not
          proactively review all User Content, but we reserve the right to remove content or
          restrict access for accounts that violate these Terms or our Community Guidelines.
        </p>

        <h3 className="legal-subsection">6.4 Feedback</h3>
        <p>
          If you submit feedback, suggestions, or ideas about the App, you grant us the right to
          use that feedback without restriction or compensation.
        </p>

        {/* § 7 */}
        <div className="section-header">
          <span className="section-num">07</span>
          <h2>Voice Cloning</h2>
          <div className="section-rule" />
        </div>
        <p>If you use the Voice Cloning feature, you represent and warrant that:</p>
        <ul className="legal-list">
          <li>You are the sole owner of the voice being cloned, or you have explicit written authorization from the voice owner.</li>
          <li>You will not use a cloned voice to impersonate any person, generate non-consensual audio, or facilitate fraud or deception.</li>
          <li>You will comply with ElevenLabs' Terms of Service, which govern the underlying voice cloning infrastructure.</li>
        </ul>
        <p>
          We reserve the right to disable or remove cloned voices that violate these Terms or that
          are reported as abusive.
        </p>

        {/* § 8 */}
        <div className="section-header">
          <span className="section-num">08</span>
          <h2>Translation Accuracy Disclaimer</h2>
          <div className="section-rule" />
        </div>
        <p>
          The Yap App uses machine translation. Translations are generated by AI models and{' '}
          <strong>may contain errors, omissions, or culturally inappropriate output</strong>.
        </p>
        <div className="verdict-box warning">
          <p>
            <strong>Machine translation is not a substitute for professional human translation.</strong>{' '}
            Do not rely on the App for safety-critical communications, legal documents, medical
            instructions, official proceedings, or any context where translation accuracy is
            essential. We disclaim all liability for harm arising from inaccurate translations.
          </p>
        </div>

        {/* § 9 */}
        <div className="section-header">
          <span className="section-num">09</span>
          <h2>Privacy</h2>
          <div className="section-rule" />
        </div>
        <p>
          Your use of the App is governed by our{' '}
          <a href="/legal/yap/privacy">Privacy Policy</a>, which is incorporated into these Terms
          by reference. By using the App, you also agree to the Privacy Policy.
        </p>

        {/* § 10 */}
        <div className="section-header">
          <span className="section-num">10</span>
          <h2>Intellectual Property</h2>
          <div className="section-rule" />
        </div>
        <p>
          The App — including its design, source code, branding, trademarks, and content
          (excluding User Content) — is owned by {SITE.name} and protected by applicable
          copyright, trademark, and other intellectual property laws. Nothing in these Terms grants
          you any rights in the App other than the limited license to use it as described herein.
        </p>
        <p>
          You may not use our name, logo, or trademarks without our prior written consent.
        </p>

        {/* § 11 */}
        <div className="section-header">
          <span className="section-num">11</span>
          <h2>Disclaimer of Warranties</h2>
          <div className="section-rule" />
        </div>
        <div className="verdict-box warning">
          <p className="legal-allcaps">
            TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, THE APP IS PROVIDED "AS IS" AND
            "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING
            BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
            TITLE, AND NON-INFRINGEMENT.
          </p>
          <p className="legal-allcaps" style={{ marginTop: '0.75rem' }}>
            WE DO NOT WARRANT THAT THE APP WILL BE AVAILABLE AT ALL TIMES OR FREE FROM
            INTERRUPTIONS, ERRORS, OR SECURITY VULNERABILITIES; THAT TRANSLATION OUTPUT WILL BE
            ACCURATE, COMPLETE, OR APPROPRIATE FOR ANY PARTICULAR PURPOSE; OR THAT ANY DEFECTS
            OR ERRORS WILL BE CORRECTED.
          </p>
        </div>
        <p>Your use of the App is at your sole risk.</p>

        {/* § 12 */}
        <div className="section-header">
          <span className="section-num">12</span>
          <h2>Limitation of Liability</h2>
          <div className="section-rule" />
        </div>
        <div className="verdict-box warning">
          <p className="legal-allcaps">
            TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL {SITE.name.toUpperCase()},
            ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
            SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO
            LOSS OF PROFITS, DATA, GOODWILL, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR IN
            CONNECTION WITH YOUR ACCESS TO OR USE OF THE APP, ANY CONTENT OR TRANSLATION OUTPUT
            GENERATED BY THE APP, ANY UNAUTHORIZED ACCESS TO OR ALTERATION OF YOUR DATA, OR ANY
            OTHER MATTER RELATING TO THE APP.
          </p>
          <p className="legal-allcaps" style={{ marginTop: '0.75rem' }}>
            OUR TOTAL AGGREGATE LIABILITY FOR ANY CLAIM ARISING FROM THESE TERMS OR YOUR USE OF
            THE APP SHALL NOT EXCEED THE GREATER OF (A) THE TOTAL AMOUNT YOU PAID US IN THE
            TWELVE (12) MONTHS IMMEDIATELY PRECEDING THE CLAIM, OR (B) $10.00 USD.
          </p>
        </div>
        <p>
          Some jurisdictions do not allow the exclusion of certain warranties or the limitation of
          certain damages, so the above limitations may not apply to you in full.
        </p>

        {/* § 13 */}
        <div className="section-header">
          <span className="section-num">13</span>
          <h2>Indemnification</h2>
          <div className="section-rule" />
        </div>
        <p>
          You agree to indemnify, defend, and hold harmless {SITE.name} and its officers,
          directors, employees, and agents from and against any and all claims, liabilities,
          damages, losses, and expenses (including reasonable legal fees) arising out of or in any
          way connected with your access to or use of the App, your User Content, your violation
          of these Terms, or your violation of any third-party rights.
        </p>

        {/* § 14 */}
        <div className="section-header">
          <span className="section-num">14</span>
          <h2>Governing Law and Dispute Resolution</h2>
          <div className="section-rule" />
        </div>
        <p>
          These Terms are governed by and construed in accordance with the laws of the{' '}
          <strong>State of Colorado, United States</strong>, without regard to its conflict of law
          provisions. Any dispute arising under or relating to these Terms or the App shall be
          subject to the exclusive jurisdiction of the state and federal courts located in
          Colorado.
        </p>
        <p>
          If you are located outside the United States, you may have additional rights under your
          local law that cannot be waived by contract.
        </p>

        {/* § 15 */}
        <div className="section-header">
          <span className="section-num">15</span>
          <h2>Changes to These Terms</h2>
          <div className="section-rule" />
        </div>
        <p>
          We reserve the right to update these Terms at any time. If we make material changes, we
          will notify you through the App or by email at least 14 days before the changes take
          effect. Continued use of the App after the effective date of any changes constitutes your
          acceptance of the revised Terms.
        </p>

        {/* § 16 */}
        <div className="section-header">
          <span className="section-num">16</span>
          <h2>Termination</h2>
          <div className="section-rule" />
        </div>
        <p>
          We may suspend or terminate your access to the App, with or without notice, if you
          violate these Terms or for any other reason at our discretion. Upon termination, your
          license to use the App ends immediately. Sections 6, 8, 10, 11, 12, 13, and 14 survive
          termination.
        </p>
        <p>You may stop using the App and delete your account at any time.</p>

        {/* § 17 */}
        <div className="section-header">
          <span className="section-num">17</span>
          <h2>Severability and Entire Agreement</h2>
          <div className="section-rule" />
        </div>
        <p>
          If any provision of these Terms is found to be unenforceable, that provision will be
          modified to the minimum extent necessary to make it enforceable, and the remaining
          provisions will continue in full force and effect.
        </p>
        <p>
          These Terms, together with our Privacy Policy, constitute the entire agreement between
          you and {SITE.name} regarding the App and supersede any prior agreements.
        </p>

        {/* § 18 */}
        <div className="section-header">
          <span className="section-num">18</span>
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
