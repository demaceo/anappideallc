import { RouteHead } from '../../components/SEO/RouteHead'
import { PageHeader } from '../../components/PageHeader/PageHeader'
import { META } from '../../lib/seo'
import { SITE } from '../../data/site'

const OPERATOR = 'Mile High Interface LLC'
const CONTACT = SITE.email

export default function PaybackTerms() {
  return (
    <>
      <RouteHead {...META['/legal/payback/terms']} />

      <PageHeader>
        <header className="masthead">
          <p className="overline">Legal · Ôwn (Payback)</p>
          <h1>Terms of <em>Service</em></h1>
          <p className="subtitle">Ôwn (Payback Own) — {OPERATOR}</p>
          <p className="date-line">Effective: December 8, 2025 · Last Updated: May 14, 2026</p>
        </header>
      </PageHeader>

      <main className="container" id="main-content" tabIndex={-1}>

        <div className="intro-block">
          <p>
            By downloading, installing, or using Payback Own, you agree to be bound by these Terms
            of Service. These Terms constitute a legally binding agreement between you and{' '}
            {OPERATOR}.
          </p>
        </div>

        <div className="verdict-box note">
          <p>
            By downloading, installing, or using the App, you agree to be bound by these Terms.
            If you do not agree to these Terms, do not use the App.
          </p>
        </div>

        {/* § 1 */}
        <div className="section-header">
          <span className="section-num">01</span>
          <h2>Acceptance of Terms</h2>
          <div className="section-rule" />
        </div>
        <p>
          By downloading, installing, or using Payback Own ("the App"), you ("User," "you," or
          "your") agree to be bound by these Terms of Service ("Terms"). If you do not agree to
          these Terms, do not use the App. These Terms constitute a legally binding agreement
          between you and <strong>{OPERATOR}</strong> ("Company," "we," "our," or "us").
        </p>

        <h3 className="legal-subsection">1.1 Changes to Terms</h3>
        <p>
          We reserve the right to modify these Terms at any time. Changes will be effective upon
          posting of updated Terms in the App, notification via in-app message on next launch, or
          the updated "Last Updated" date at the top of this document. Your continued use of the
          App after changes constitutes acceptance of the modified Terms.
        </p>

        <h3 className="legal-subsection">1.2 Additional Terms</h3>
        <p>
          Certain features may be subject to additional terms and conditions, which will be
          presented to you at the time of use.
        </p>

        {/* § 2 */}
        <div className="section-header">
          <span className="section-num">02</span>
          <h2>Description of Service</h2>
          <div className="section-rule" />
        </div>

        <h3 className="legal-subsection">2.1 What Payback Own Does</h3>
        <p>
          Ôwn (marketed as "Payback Own") is a privacy-first mobile application available on iOS
          and Android that:
        </p>
        <ul className="legal-list">
          <li>Processes Google Takeout (ZIP files) and Meta (Facebook/Instagram) export data</li>
          <li>Generates consumer personas and behavioral insights using AI</li>
          <li>Analyzes data against 135 unified targeting categories across 10 pillars</li>
          <li>Performs signal extraction locally on your device</li>
          <li>Uses Google Gemini 2.5 Pro AI via backend proxy during Instant Analysis</li>
          <li>Stores results in encrypted SQLite database on your device</li>
          <li>Supports resumable analysis via checkpoint system</li>
        </ul>

        <h3 className="legal-subsection">2.2 What Payback Own Is NOT</h3>
        <ul className="legal-list">
          <li><strong>Not a Data Broker:</strong> We do not sell, share, or monetize your data</li>
          <li><strong>Not a Social Network:</strong> We do not share data with other users</li>
          <li><strong>Not a Cloud Service:</strong> We do not store your data on our servers</li>
          <li><strong>Not Financial Advice:</strong> Insights are for informational purposes only</li>
          <li><strong>Not a Guarantee:</strong> Results depend on the quality and completeness of your export data</li>
        </ul>

        <h3 className="legal-subsection">2.3 Beta Software</h3>
        <p>
          The App is currently in beta and may contain bugs or incomplete features. We make no
          guarantees about accuracy of analysis results, compatibility with all devices,
          uninterrupted service availability, or fitness for any particular purpose.
        </p>

        {/* § 3 */}
        <div className="section-header">
          <span className="section-num">03</span>
          <h2>User Eligibility</h2>
          <div className="section-rule" />
        </div>

        <h3 className="legal-subsection">3.1 Age Requirement</h3>
        <p>
          You must be at least 13 years old to use the App (or 16 in the European Economic Area).{' '}
          <strong>Users in India must be at least 18 years old</strong> to use the App without
          verified parental consent, in accordance with India's Digital Personal Data Protection
          Act, 2023 (DPDP Act). Users under 18 elsewhere should use the App with parental
          guidance.
        </p>

        <h3 className="legal-subsection">3.2 Legal Capacity</h3>
        <p>
          You represent that you have the legal capacity to enter into these Terms in your
          jurisdiction.
        </p>

        <h3 className="legal-subsection">3.3 Authorized Use</h3>
        <p>
          You may only analyze your own personal data. Analyzing data belonging to others without
          their consent may violate privacy laws.
        </p>

        {/* § 4 */}
        <div className="section-header">
          <span className="section-num">04</span>
          <h2>User Accounts and Authentication</h2>
          <div className="section-rule" />
        </div>

        <h3 className="legal-subsection">4.1 Supported Sign-In Providers</h3>
        <p>
          <strong>Sign in with Apple.</strong> You can sign in with your Apple ID. Apple shares
          only a stable user identifier, your email (your real email or a relayed{' '}
          <code>@privaterelay.appleid.com</code> address, at your choice), and optionally your
          name on first sign-in. No passwords are stored by Payback.
        </p>
        <p>
          <strong>Sign in with Google.</strong> To use features that require Google data, you
          must have a valid Google account and grant the App read-only access to your Google Drive
          (<code>drive.readonly</code> scope) for Takeout imports. For Instant Analysis,
          additionally grant read-only Gmail (<code>gmail.readonly</code>) and Calendar (
          <code>calendar.readonly</code>) scopes — Gmail and Calendar signal extraction runs
          on-device; only the extracted behavioural signals are sent off-device for AI analysis.
          Authenticate via Google OAuth 2.0 (no passwords stored by Payback). Comply with Google's
          Terms of Service.
        </p>

        <h3 className="legal-subsection">4.2 Account Security</h3>
        <p>You are responsible for:</p>
        <ul className="legal-list">
          <li>Maintaining the security of your device</li>
          <li>Protecting your Google account credentials</li>
          <li>Any activity that occurs through your authenticated session</li>
          <li>Revoking app access if device is lost or compromised</li>
        </ul>

        <h3 className="legal-subsection">4.3 Session Management</h3>
        <p>
          The App automatically logs you out after 30 minutes of inactivity for security purposes.
          OAuth tokens are stored encrypted in iOS Keychain/Android Keystore.
        </p>

        {/* § 5 */}
        <div className="section-header">
          <span className="section-num">05</span>
          <h2>Acceptable Use</h2>
          <div className="section-rule" />
        </div>

        <h3 className="legal-subsection">5.1 Permitted Uses</h3>
        <p>You may use the App to:</p>
        <ul className="legal-list">
          <li>Analyze your own Google Takeout (ZIP files) and Meta export data (folders)</li>
          <li>Generate personal consumer personas and category insights</li>
          <li>View your analysis history and synthesized profile</li>
          <li>Export your persona data for personal use (if feature available)</li>
          <li>Share insights at your discretion (outside the App)</li>
          <li>Delete your data at any time</li>
        </ul>

        <h3 className="legal-subsection">5.2 Prohibited Uses</h3>
        <p>You may NOT:</p>
        <ul className="legal-list">
          <li>Reverse engineer, decompile, or disassemble the App</li>
          <li>Analyze data belonging to others without explicit written consent</li>
          <li>Use the App for illegal purposes or to violate any laws</li>
          <li>Attempt to bypass security features or rate limits</li>
          <li>Use the App to harass, abuse, or harm others</li>
          <li>Upload malicious code or attempt to compromise the App</li>
          <li>Scrape or automate access to backend services</li>
          <li>Resell, redistribute, or commercialize the App or its outputs</li>
          <li>Remove or obscure any proprietary notices or labels</li>
          <li>Use the App in a way that violates third-party rights</li>
        </ul>

        <h3 className="legal-subsection">5.3 Enforcement</h3>
        <p>
          We reserve the right to investigate violations of these Terms, suspend or terminate your
          access for violations, report illegal activity to law enforcement, and cooperate with
          legal investigations.
        </p>

        {/* § 6 */}
        <div className="section-header">
          <span className="section-num">06</span>
          <h2>Intellectual Property</h2>
          <div className="section-rule" />
        </div>

        <h3 className="legal-subsection">6.1 Ownership</h3>
        <p>
          <strong>Our Property:</strong> The App's source code, design, and algorithms are owned
          by {OPERATOR}. Payback name, logo, and branding are our trademarks. All rights not
          expressly granted are reserved.
        </p>
        <p>
          <strong>Your Property:</strong> You retain all rights to your personal data. You own any
          insights or personas generated from your data. We claim no ownership over your data or
          analysis results.
        </p>

        <h3 className="legal-subsection">6.2 License Grant</h3>
        <p>
          <strong>To You:</strong> We grant you a limited, non-exclusive, non-transferable,
          revocable license to use the App for personal, non-commercial purposes and to export and
          use your persona data as you see fit.
        </p>
        <p>
          <strong>To Us:</strong> You grant us a limited license to process your data on-device to
          provide the service, send behavioral signals to AI services during Instant Analysis, and
          use anonymized, aggregated usage data to improve the App (if you opt in to telemetry).
        </p>

        <h3 className="legal-subsection">6.3 Open Source Components</h3>
        <p>
          The App uses open source libraries subject to their respective licenses. See{' '}
          <code>package.json</code> for details.
        </p>

        {/* § 7 */}
        <div className="section-header">
          <span className="section-num">07</span>
          <h2>Privacy and Data Processing</h2>
          <div className="section-rule" />
        </div>

        <h3 className="legal-subsection">7.1 Privacy Policy</h3>
        <p>
          Our collection, use, and protection of your data is governed by our{' '}
          <a href="/legal/payback/privacy">Privacy Policy</a>, which is incorporated into these
          Terms by reference.
        </p>

        <h3 className="legal-subsection">7.2 Data Ownership</h3>
        <p>
          You retain complete ownership of your data. We do not claim any rights to your Google
          Takeout files, Meta export data, or generated personas or insights.
        </p>

        <h3 className="legal-subsection">7.3 Data Deletion</h3>
        <p>
          You may delete all data at any time via Settings &gt; Data Management &gt; Delete All
          Data, or by uninstalling the App (which deletes all local data).
        </p>

        <h3 className="legal-subsection">7.4 Third-Party Data Processing</h3>
        <p>When you use Instant Analysis:</p>
        <ul className="legal-list">
          <li>Gmail and Calendar behavioral signals are extracted on-device</li>
          <li>Signals are sent to our backend proxy server for AI persona generation</li>
          <li>Backend proxy authenticates your request via Google OAuth token verification</li>
          <li>Backend proxy forwards requests to Google Gemini AI with secure server-side API keys</li>
          <li>Backend applies per-user rate limiting (5 requests/minute)</li>
          <li>AI request contents are not intentionally persisted on our backend after request completion; account-linked data (profile, analytics, consent settings) may be retained — see the Privacy Policy for details</li>
          <li>Google's Gemini API Terms apply: <a href="https://ai.google.dev/gemini-api/terms" target="_blank" rel="noopener noreferrer">ai.google.dev/gemini-api/terms</a></li>
          <li>Data is not retained or used for model training per Gemini API terms</li>
        </ul>

        {/* § 8 */}
        <div className="section-header">
          <span className="section-num">08</span>
          <h2>AI Analysis and Accuracy</h2>
          <div className="section-rule" />
        </div>

        <h3 className="legal-subsection">8.1 Instant Analysis Feature</h3>
        <p>AI-powered persona generation runs automatically during Instant Analysis. The App uses:</p>
        <ul className="legal-list">
          <li><strong>Model:</strong> Google Gemini 2.5 Pro</li>
          <li><strong>Architecture:</strong> Backend proxy with OAuth verification</li>
          <li><strong>Rate limiting:</strong> 5 requests per minute per user, 100 requests per 15 minutes per IP</li>
          <li><strong>Failover:</strong> Dual API keys for high availability</li>
        </ul>
        <p>
          AI only runs when you initiate Instant Analysis. You can view your generated persona in
          the app and delete it at any time (Settings &gt; Data Management).
        </p>

        <h3 className="legal-subsection">8.2 Accuracy Disclaimer</h3>
        <p>AI-generated personas and behavioral insights are:</p>
        <ul className="legal-list">
          <li><strong>Approximations:</strong> Based on statistical patterns from Gmail and Calendar signals</li>
          <li><strong>Not Guaranteed:</strong> May contain errors, inaccuracies, or biases inherent to AI models</li>
          <li><strong>For Informational Use:</strong> Not professional advice of any kind</li>
          <li><strong>Intent Scores:</strong> Categories include confidence/score ratings (1–10 scale)</li>
        </ul>

        <h3 className="legal-subsection">8.3 No Reliance</h3>
        <p>You acknowledge that:</p>
        <ul className="legal-list">
          <li>You should not make important decisions based solely on AI insights</li>
          <li>Results depend on the quality, completeness, and representativeness of your input data</li>
          <li>Categories are targeting approximations used by digital advertisers, not psychological assessments</li>
          <li>We are not liable for decisions you make based on App outputs</li>
        </ul>

        {/* § 9 */}
        <div className="section-header">
          <span className="section-num">09</span>
          <h2>Fees and Payment</h2>
          <div className="section-rule" />
        </div>

        <h3 className="legal-subsection">9.1 Current Pricing</h3>
        <p>
          Payback is currently <strong>free to use</strong>. There are no subscription fees,
          in-app purchases, or hidden costs.
        </p>

        <h3 className="legal-subsection">9.2 Future Pricing</h3>
        <p>
          We reserve the right to introduce paid features or subscriptions in the future, with at
          least 30 days' advance notice before charging for previously-free features. Grandfathering
          existing users into free tiers is at our discretion.
        </p>

        <h3 className="legal-subsection">9.3 Third-Party Costs</h3>
        <p>
          You are responsible for internet/data charges from your carrier, Google account costs (if
          applicable), and device and operating system requirements.
        </p>

        {/* § 10 */}
        <div className="section-header">
          <span className="section-num">10</span>
          <h2>Disclaimers and Limitations</h2>
          <div className="section-rule" />
        </div>

        <h3 className="legal-subsection">10.1 "AS IS" Basis</h3>
        <div className="verdict-box warning">
          <p className="legal-allcaps">
            THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER
            EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS
            FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, ACCURACY OF ANALYSIS RESULTS, OR
            RELIABILITY OF UNINTERRUPTED OR ERROR-FREE OPERATION.
          </p>
        </div>

        <h3 className="legal-subsection">10.2 No Professional Advice</h3>
        <p>
          The App does not provide financial advice or investment recommendations, medical or health
          advice, legal advice or opinions, or professional consulting of any kind. Consult
          appropriate professionals for advice in these areas.
        </p>

        <h3 className="legal-subsection">10.3 Beta Software Risks</h3>
        <p>You acknowledge that the App is in beta and may have bugs or incomplete features. Updates may introduce new bugs or break existing functionality. Features may be added, changed, or removed without notice. We do not guarantee backward compatibility.</p>

        <h3 className="legal-subsection">10.4 Third-Party Services</h3>
        <p>
          We are not responsible for Google's services (OAuth, Drive API, Gemini AI API), your
          Google account security or availability, changes to third-party APIs or terms,
          third-party service outages, backend hosting provider downtime (Railway), or Gemini API
          quota exhaustion or rate limiting.
        </p>

        {/* § 11 */}
        <div className="section-header">
          <span className="section-num">11</span>
          <h2>Limitation of Liability</h2>
          <div className="section-rule" />
        </div>

        <h3 className="legal-subsection">11.1 Damages Waiver</h3>
        <div className="verdict-box warning">
          <p className="legal-allcaps">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, {OPERATOR.toUpperCase()} AND ITS OFFICERS,
            DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR DIRECT DAMAGES (LOSS OF DATA,
            PROFITS, REVENUE, OR BUSINESS OPPORTUNITIES), INDIRECT DAMAGES (INCIDENTAL,
            CONSEQUENTIAL, OR PUNITIVE), SPECIAL DAMAGES ARISING FROM USE OR INABILITY TO USE THE
            APP, OR THIRD-PARTY CLAIMS RESULTING FROM YOUR USE OF THE APP — EVEN IF WE HAVE BEEN
            ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
          </p>
        </div>

        <h3 className="legal-subsection">11.2 Maximum Liability</h3>
        <p>
          In jurisdictions that do not allow exclusion of liability, our total liability to you
          shall not exceed the greater of (a) $100 USD, or (b) the amount you paid us in the 12
          months preceding the claim (currently $0).
        </p>

        <h3 className="legal-subsection">11.3 Exception</h3>
        <p>
          Nothing in these Terms shall limit liability for death or personal injury caused by
          negligence, fraud or fraudulent misrepresentation, or any liability that cannot be
          excluded by law.
        </p>

        {/* § 12 */}
        <div className="section-header">
          <span className="section-num">12</span>
          <h2>Indemnification</h2>
          <div className="section-rule" />
        </div>
        <p>
          You agree to indemnify, defend, and hold harmless {OPERATOR} and its officers,
          directors, employees, and agents from any claims, damages, losses, liabilities, and
          expenses (including legal fees) arising from your use or misuse of the App, your
          violation of these Terms, your violation of any laws or third-party rights, your data or
          content, or unauthorized access to your account or device.
        </p>

        {/* § 13 */}
        <div className="section-header">
          <span className="section-num">13</span>
          <h2>Dispute Resolution</h2>
          <div className="section-rule" />
        </div>

        <h3 className="legal-subsection">13.1 Informal Resolution</h3>
        <p>
          Before filing a claim, you agree to contact us at{' '}
          <a href={`mailto:${CONTACT}`}>{CONTACT}</a>, provide a detailed description of the
          dispute, and attempt to resolve the matter informally for 60 days.
        </p>

        <h3 className="legal-subsection">13.2 Governing Law</h3>
        <p>
          These Terms shall be governed by the laws of <strong>Colorado, USA</strong>, excluding
          conflict of law principles. The UN Convention on Contracts for the International Sale of
          Goods does not apply.
        </p>

        <h3 className="legal-subsection">13.3 Arbitration (U.S. Users)</h3>
        <p>
          If informal resolution fails, disputes shall be resolved by binding arbitration via the
          American Arbitration Association (AAA) Consumer Arbitration Rules, in Denver, Colorado,
          USA. We will pay arbitration fees for claims under $10,000.
        </p>

        <h3 className="legal-subsection">13.4 Class Action Waiver</h3>
        <div className="verdict-box note">
          <p>
            You agree to bring claims only in your individual capacity, not as a class member or
            representative. Class actions and class arbitrations are not permitted.
          </p>
        </div>

        <h3 className="legal-subsection">13.5 Small Claims Court</h3>
        <p>
          You may bring claims in small claims court if they qualify and are brought on an
          individual basis.
        </p>

        <h3 className="legal-subsection">13.6 Exceptions</h3>
        <p>
          Intellectual property disputes, claims seeking injunctive relief, and claims that cannot
          be arbitrated by law may be brought in court without arbitration.
        </p>

        <h3 className="legal-subsection">13.7 International Users — United Kingdom and India</h3>
        <p>
          <strong>United Kingdom:</strong> Nothing in these Terms limits your statutory rights as a
          UK consumer. UK users retain the right to bring claims in UK courts regardless of any
          arbitration or choice-of-law clause in these Terms.
        </p>
        <p>
          <strong>India:</strong> Indian users may contact our Grievance Officer at{' '}
          <a href={`mailto:${CONTACT}`}>{CONTACT}</a> (subject:{' '}
          <code>DPDP Grievance – Ôwn</code>) for dispute resolution under the DPDP Act. We will
          acknowledge within 48 hours and aim to resolve within 30 days. Disputes not resolved
          informally may be referred to India's Data Protection Board in accordance with the DPDP
          Act.
        </p>

        {/* § 14 */}
        <div className="section-header">
          <span className="section-num">14</span>
          <h2>Export Compliance</h2>
          <div className="section-rule" />
        </div>
        <p>
          You agree to comply with all export and import laws of the United States, your country
          of residence, and any jurisdiction where the App is used. You may not use the App if you
          are located in a country subject to U.S. embargo or on any U.S. government list of
          prohibited or restricted parties.
        </p>

        {/* § 15 */}
        <div className="section-header">
          <span className="section-num">15</span>
          <h2>Government Users</h2>
          <div className="section-rule" />
        </div>
        <p>
          If you are a U.S. government entity, the App is a "Commercial Item" as defined in FAR
          2.101 and is licensed in accordance with these Terms.
        </p>

        {/* § 16 */}
        <div className="section-header">
          <span className="section-num">16</span>
          <h2>Termination</h2>
          <div className="section-rule" />
        </div>

        <h3 className="legal-subsection">16.1 Termination by You</h3>
        <p>
          You may stop using the App at any time by deleting all data (Settings &gt; Data
          Management) or uninstalling the App from your device.
        </p>

        <h3 className="legal-subsection">16.2 Termination by Us</h3>
        <p>
          We may suspend or terminate your access if you violate these Terms, engage in fraudulent
          or illegal activity, we discontinue the App (with 30 days' notice), or required by law
          or legal process.
        </p>

        <h3 className="legal-subsection">16.3 Effect of Termination</h3>
        <p>
          Upon termination, your license to use the App ends immediately. You must delete the App
          from all devices. Sections 6 (Intellectual Property), 10 (Disclaimers), 11 (Limitation
          of Liability), 12 (Indemnification), and 13 (Dispute Resolution) survive termination.
        </p>

        <h3 className="legal-subsection">16.4 Data After Termination</h3>
        <p>
          Because all data is stored locally on your device, we cannot remotely delete your data.
          You are responsible for deleting data before uninstalling. Uninstalling the App typically
          deletes all local data.
        </p>

        {/* § 17 */}
        <div className="section-header">
          <span className="section-num">17</span>
          <h2>Miscellaneous</h2>
          <div className="section-rule" />
        </div>
        <ul className="legal-list">
          <li><strong>17.1 Entire Agreement:</strong> These Terms, together with the Privacy Policy, constitute the entire agreement between you and {OPERATOR} regarding the App.</li>
          <li><strong>17.2 Severability:</strong> If any provision of these Terms is found invalid or unenforceable, the remaining provisions remain in full force and effect.</li>
          <li><strong>17.3 No Waiver:</strong> Our failure to enforce any provision does not waive our right to enforce it later.</li>
          <li><strong>17.4 Assignment:</strong> You may not assign or transfer these Terms. We may assign these Terms to an affiliate or successor without your consent.</li>
          <li><strong>17.5 Force Majeure:</strong> We are not liable for delays or failures caused by circumstances beyond our reasonable control (e.g., natural disasters, war, pandemics, internet outages).</li>
          <li><strong>17.6 Notices:</strong> Notices to us should be sent to <a href={`mailto:${CONTACT}`}>{CONTACT}</a>. Notices to you may be provided via in-app notifications, to the email address associated with your Google account, or by posting on our website.</li>
          <li><strong>17.7 Third-Party Beneficiaries:</strong> There are no third-party beneficiaries to these Terms.</li>
          <li><strong>17.8 Translations:</strong> These Terms are written in English. The English version governs in case of conflict.</li>
        </ul>

        {/* § 18 */}
        <div className="section-header">
          <span className="section-num">18</span>
          <h2>Contact Information</h2>
          <div className="section-rule" />
        </div>
        <div className="verdict-box contact">
          <p>
            <strong>{OPERATOR}</strong><br />
            Email: <a href={`mailto:${CONTACT}`}>{CONTACT}</a><br />
            Website: <a href="https://www.milehighinterface.com/payback" target="_blank" rel="noopener noreferrer">milehighinterface.com/payback</a><br />
            Privacy Policy: <a href="/legal/payback/privacy">anappidea.llc/legal/payback/privacy</a><br />
            Response time: Within 5 business days
          </p>
        </div>

        {/* § 19 */}
        <div className="section-header">
          <span className="section-num">19</span>
          <h2>Apple and Google Terms</h2>
          <div className="section-rule" />
        </div>

        <h3 className="legal-subsection">19.1 Apple App Store</h3>
        <p>
          If you downloaded the App from the Apple App Store: Apple is not a party to these Terms
          and is not responsible for the App or its content. Apple has no obligation to provide
          support. You must comply with Apple's App Store Terms of Service. In case of conflict,
          Apple's terms prevail regarding your use of the App Store.
        </p>

        <h3 className="legal-subsection">19.2 Google Play Store</h3>
        <p>
          If you downloaded the App from Google Play: Google is not a party to these Terms and is
          not responsible for the App or its content. You must comply with Google Play's Terms of
          Service. Data deletion requests:{' '}
          <a href="https://www.milehighinterface.com/payback/data-deletion.html" target="_blank" rel="noopener noreferrer">
            milehighinterface.com/payback/data-deletion.html
          </a>
        </p>

        {/* § 20 */}
        <div className="section-header">
          <span className="section-num">20</span>
          <h2>Open Source</h2>
          <div className="section-rule" />
        </div>
        <p>
          We plan to open-source Payback in the future to enable community security audits,
          transparency in data processing, and user trust and verification. Check{' '}
          <a href="https://github.com/demaceo/pbv2" target="_blank" rel="noopener noreferrer">
            github.com/demaceo/pbv2
          </a>{' '}
          for updates.
        </p>

        <div className="verdict-box warning">
          <p className="legal-allcaps">
            BY USING ÔWN (PAYBACK), YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF SERVICE,
            UNDERSTAND THEM, AND AGREE TO BE BOUND BY THEM. IF YOU DO NOT AGREE TO THESE TERMS,
            DO NOT USE THE APP.
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
              May 14, 2026 · v1.4
            </li>
          </ul>
        </div>
      </footer>
    </>
  )
}
