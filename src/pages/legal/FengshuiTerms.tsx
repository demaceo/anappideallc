import { LegalPage } from '../../components/LegalPage/LegalPage'
import { SITE } from '../../data/site'

export default function FengshuiTerms() {
  return (
    <LegalPage
      path="/legal/fengshui/terms"
      appLabel="Feng Shui"
      docType="terms"
      subtitle={`Feng Shui — ${SITE.name}`}
      dateLine="Effective Date: June 5, 2026 · Last Updated: June 5, 2026"
    >

      <div className="intro-block">
        <p>
          These Terms of Service ("Terms") are a binding agreement between you ("you" or
          "user") and {SITE.name} ("An App Idea," "we," "us," or "our") governing your access
          to and use of the <strong>Feng Shui</strong> mobile application and related services
          (collectively, the "App").
        </p>
      </div>

      <div className="verdict-box note">
        <p>
          <strong>Please read these Terms carefully.</strong> By downloading, accessing, or
          using the App, you agree to be bound by these Terms and by our{' '}
          <a href="/legal/fengshui/privacy">Privacy Policy</a>. If you do not agree, do not
          use the App.
        </p>
      </div>

      {/* § 1 */}
      <div className="section-header">
        <span className="section-num">01</span>
        <h2>Eligibility</h2>
        <div className="section-rule" />
      </div>

      <p>
        You must be at least 13 years old (or the minimum age of digital consent in your
        jurisdiction) to use the App. If you are under the age of majority where you live, you
        may use the App only with the involvement and consent of a parent or legal guardian. By
        using the App, you represent that you meet these requirements and that you have the legal
        capacity to enter into these Terms.
      </p>

      {/* § 2 */}
      <div className="section-header">
        <span className="section-num">02</span>
        <h2>The Service</h2>
        <div className="section-rule" />
      </div>

      <p>
        The App is a tool that lets you sketch floor plans, refine room shapes, view rooms in
        3D, annotate walls/ceilings/floors with features, place furniture and décor, and receive{' '}
        <strong>AI-generated Feng Shui analysis</strong> and optional{' '}
        <strong>AI-generated layout suggestions</strong>. The App stores your content in the
        cloud and can sync it across devices.
      </p>
      <p>
        We may add, change, suspend, or remove features at any time. Some features (for example,
        the "Room Studio" beta) may be experimental, offered to a subset of users, or changed or
        withdrawn without notice.
      </p>

      {/* § 3 */}
      <div className="section-header">
        <span className="section-num">03</span>
        <h2>Important Disclaimer — Informational and Entertainment Use Only</h2>
        <div className="section-rule" />
      </div>

      <div className="verdict-box warning">
        <p>
          The Feng Shui scores, analyses, recommendations, chi-flow assessments,
          command-position evaluations, and layout suggestions provided by the App are generated
          by an automated artificial-intelligence system and are intended for{' '}
          <strong>general informational and entertainment purposes only</strong>. They:
        </p>
        <ul className="legal-list">
          <li>are <strong>not</strong> professional advice of any kind, including architectural, engineering, structural, interior-design, construction, real-estate, electrical, building-code, accessibility, fire/life-safety, medical, psychological, financial, or legal advice;</li>
          <li>may be <strong>inaccurate, incomplete, or unsuitable</strong> for your specific circumstances; and</li>
          <li>should <strong>not</strong> be relied upon for any decision that could affect your health, safety, property, or finances.</li>
        </ul>
        <p>
          Always exercise your own judgment and consult appropriately qualified professionals
          before making changes to your home or relying on any output of the App. You are solely
          responsible for any actions you take based on the App.
        </p>
      </div>

      {/* § 4 */}
      <div className="section-header">
        <span className="section-num">04</span>
        <h2>Accounts</h2>
        <div className="section-rule" />
      </div>

      <ul className="legal-list">
        <li><strong>Anonymous accounts.</strong> When you first use the App, an anonymous account is created automatically so your content can be saved. This account is tied to your installation. If you delete and reinstall the App without signing in, you may lose access to content associated with the previous anonymous account.</li>
        <li><strong>Optional sign-in.</strong> The App may allow you to sign in with Google or Apple to back up and sync your content. You are responsible for maintaining the confidentiality of your sign-in credentials and for all activity that occurs under your account.</li>
        <li>You agree to provide accurate information and to notify us promptly of any unauthorized use of your account.</li>
      </ul>

      {/* § 5 */}
      <div className="section-header">
        <span className="section-num">05</span>
        <h2>Acceptable Use</h2>
        <div className="section-rule" />
      </div>

      <p>You agree <strong>not</strong> to, and not to permit anyone else to:</p>
      <ul className="legal-list">
        <li>use the App for any unlawful, harmful, or fraudulent purpose, or in violation of these Terms;</li>
        <li>upload or enter content that is unlawful, infringing, defamatory, or that contains another person's private or sensitive information without authorization;</li>
        <li>reverse engineer, decompile, disassemble, or otherwise attempt to derive source code from the App, except to the limited extent permitted by applicable law;</li>
        <li>copy, modify, distribute, sell, lease, sublicense, or create derivative works of the App;</li>
        <li>interfere with, disrupt, or place undue load on the App or its infrastructure, or attempt to bypass rate limits, security, or access controls;</li>
        <li>access the App through automated means (bots, scrapers) except as expressly permitted by us;</li>
        <li>remove or obscure any proprietary notices; or</li>
        <li>use the App to develop a competing product or service.</li>
      </ul>
      <p>
        We may impose usage limits (for example, on the number of AI analyses or rearrangements
        per period) and may suspend or terminate access for conduct that violates these Terms or
        that we reasonably believe is harmful.
      </p>

      {/* § 6 */}
      <div className="section-header">
        <span className="section-num">06</span>
        <h2>Your Content</h2>
        <div className="section-rule" />
      </div>

      <ul className="legal-list">
        <li><strong>Ownership.</strong> As between you and us, you retain all rights you have in the floor plans, room data, notes, and other content you create or submit in the App ("Your Content").</li>
        <li><strong>License to operate the App.</strong> You grant us a worldwide, non-exclusive, royalty-free license to host, store, copy, transmit, process, display, and create derived representations of Your Content <strong>solely as necessary to provide, secure, maintain, and improve the App</strong> — including transmitting Your Content to our third-party providers (such as Google's AI services) to generate analysis and suggestions for you. This license ends when you delete Your Content or your account, except for content already processed, residual backup copies, or content we must retain to comply with law.</li>
        <li><strong>Your responsibility.</strong> You represent and warrant that you have the rights necessary to submit Your Content and that Your Content does not violate these Terms or any law or third-party right. Do not submit content you are not authorized to share, and avoid entering sensitive personal information into free-text fields (see the <a href="/legal/fengshui/privacy">Privacy Policy</a>).</li>
        <li><strong>AI outputs.</strong> Subject to these Terms and the terms of our AI providers, you may use the analysis and suggestions the App generates for you for your personal, non-commercial use. AI outputs may not be unique to you and may be similar to outputs generated for other users.</li>
      </ul>

      {/* § 7 */}
      <div className="section-header">
        <span className="section-num">07</span>
        <h2>Intellectual Property</h2>
        <div className="section-rule" />
      </div>

      <p>
        The App, including its software, design, text, graphics, the "Feng Shui" branding used
        in the App, and all related intellectual property (excluding Your Content and
        third-party materials), is owned by {SITE.name} or its licensors and is protected by
        intellectual-property laws. Subject to your compliance with these Terms, we grant you a
        limited, personal, non-exclusive, non-transferable, non-sublicensable, revocable license
        to download and use one copy of the App on a device you own or control, for your
        personal, non-commercial use. All rights not expressly granted are reserved.
      </p>

      {/* § 8 */}
      <div className="section-header">
        <span className="section-num">08</span>
        <h2>Third-Party Services</h2>
        <div className="section-rule" />
      </div>

      <p>
        The App relies on third-party services, including Google Firebase and Google Cloud
        (including the Gemini AI API), Apple (App Store distribution and Sign in with Apple),
        Google Sign-In, and Expo / EAS (builds and over-the-air updates). Your use of those
        services may be subject to their respective terms and policies. We are not responsible
        for third-party services, and their availability or performance may affect the App.
      </p>

      {/* § 9 */}
      <div className="section-header">
        <span className="section-num">09</span>
        <h2>Updates</h2>
        <div className="section-rule" />
      </div>

      <p>
        The App may automatically download and install updates, including over-the-air (OTA)
        updates to its software, to maintain, improve, or secure the App. You consent to these
        automatic updates. Some updates may require a new version from the App Store.
      </p>

      {/* § 10 */}
      <div className="section-header">
        <span className="section-num">10</span>
        <h2>Fees</h2>
        <div className="section-rule" />
      </div>

      <p>
        The App is currently provided free of charge and contains no in-app purchases. We
        reserve the right to introduce paid features, subscriptions, or other charges in the
        future. If we do, we will disclose the applicable pricing and terms before you incur any
        charge, and any purchases made through the Apple App Store will be processed and governed
        by Apple.
      </p>

      {/* § 11 */}
      <div className="section-header">
        <span className="section-num">11</span>
        <h2>Beta and Pre-Release Features</h2>
        <div className="section-rule" />
      </div>

      <p>
        Features identified as beta, preview, experimental, or similar (including the "Room
        Studio" experience) are provided <strong>"as is"</strong> for evaluation, may be
        unstable or change at any time, and may be modified or discontinued without notice. They
        may be subject to additional limits, and data created with them may not be preserved.
      </p>

      {/* § 12 */}
      <div className="section-header">
        <span className="section-num">12</span>
        <h2>Disclaimer of Warranties</h2>
        <div className="section-rule" />
      </div>

      <div className="verdict-box warning">
        <p className="legal-allcaps">
          TO THE FULLEST EXTENT PERMITTED BY LAW, THE APP AND ALL CONTENT AND OUTPUTS ARE
          PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS,
          IMPLIED, OR STATUTORY, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
          PARTICULAR PURPOSE, TITLE, ACCURACY, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE
          APP WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR THAT ANY ANALYSIS, RECOMMENDATION,
          OR OUTPUT WILL BE ACCURATE, RELIABLE, OR MEET YOUR EXPECTATIONS. SOME JURISDICTIONS DO
          NOT ALLOW THE EXCLUSION OF CERTAIN WARRANTIES, SO SOME OF THE ABOVE MAY NOT APPLY TO
          YOU.
        </p>
      </div>

      {/* § 13 */}
      <div className="section-header">
        <span className="section-num">13</span>
        <h2>Limitation of Liability</h2>
        <div className="section-rule" />
      </div>

      <div className="verdict-box warning">
        <p className="legal-allcaps">
          TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT WILL AN APP IDEA LLC OR ITS
          MEMBERS, OFFICERS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
          SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF PROFITS,
          DATA, GOODWILL, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATING TO YOUR USE OF
          (OR INABILITY TO USE) THE APP OR ANY OUTPUTS, WHETHER BASED ON WARRANTY, CONTRACT,
          TORT (INCLUDING NEGLIGENCE), OR ANY OTHER LEGAL THEORY, EVEN IF WE HAVE BEEN ADVISED
          OF THE POSSIBILITY OF SUCH DAMAGES.
        </p>
        <p className="legal-allcaps">
          TO THE FULLEST EXTENT PERMITTED BY LAW, OUR TOTAL CUMULATIVE LIABILITY ARISING OUT OF
          OR RELATING TO THE APP OR THESE TERMS WILL NOT EXCEED THE GREATER OF (A) THE AMOUNT
          YOU PAID US FOR THE APP IN THE TWELVE (12) MONTHS BEFORE THE CLAIM, OR (B) USD $50.
          SOME JURISDICTIONS DO NOT ALLOW CERTAIN LIMITATIONS, SO SOME OF THE ABOVE MAY NOT
          APPLY TO YOU.
        </p>
      </div>

      {/* § 14 */}
      <div className="section-header">
        <span className="section-num">14</span>
        <h2>Indemnification</h2>
        <div className="section-rule" />
      </div>

      <p>
        You agree to indemnify, defend, and hold harmless {SITE.name} and its members, officers,
        employees, and agents from and against any claims, liabilities, damages, losses, and
        expenses (including reasonable attorneys' fees) arising out of or related to: (a) Your
        Content; (b) your use or misuse of the App; (c) your violation of these Terms; or (d)
        your violation of any law or third-party right.
      </p>

      {/* § 15 */}
      <div className="section-header">
        <span className="section-num">15</span>
        <h2>Termination</h2>
        <div className="section-rule" />
      </div>

      <p>
        You may stop using the App at any time and may delete your content as described in the{' '}
        <a href="/legal/fengshui/privacy">Privacy Policy</a>. We may suspend or terminate your
        access to the App at any time, with or without notice, if we reasonably believe you have
        violated these Terms or to protect the App, our users, or us. Sections that by their
        nature should survive termination (including Sections 3, 6–8, and 12–18) will survive.
      </p>

      {/* § 16 */}
      <div className="section-header">
        <span className="section-num">16</span>
        <h2>Governing Law and Dispute Resolution</h2>
        <div className="section-rule" />
      </div>

      <p>
        These Terms are governed by the laws of the <strong>State of Colorado</strong>, United
        States, without regard to its conflict-of-laws principles. The United Nations Convention
        on Contracts for the International Sale of Goods does not apply.
      </p>
      <p>
        <strong>Informal resolution first.</strong> Before filing any claim, you agree to
        contact us at <a href={`mailto:${SITE.email}`}>{SITE.email}</a> and attempt in good
        faith to resolve the dispute informally for at least thirty (30) days.
      </p>
      <p>
        <strong>Venue.</strong> Subject to any applicable mandatory consumer-protection laws of
        your place of residence, you and we agree that the exclusive jurisdiction and venue for
        any dispute not subject to informal resolution will be the state and federal courts
        located in Colorado, and you consent to personal jurisdiction there.
      </p>

      {/* § 17 */}
      <div className="section-header">
        <span className="section-num">17</span>
        <h2>Apple App Store — Additional Terms</h2>
        <div className="section-rule" />
      </div>

      <p>
        These additional terms apply because the App is made available through the Apple App
        Store. You acknowledge and agree that:
      </p>
      <ol className="legal-list">
        <li>These Terms are between you and {SITE.name} only, and <strong>not</strong> with Apple Inc. ("Apple"). Apple is not responsible for the App or its content.</li>
        <li>The license granted in these Terms is limited to a non-transferable license to use the App on any Apple-branded device that you own or control, as permitted by the Apple Media Services / App Store Terms, except that the App may be accessed by other accounts associated with you via Family Sharing or volume purchasing where applicable.</li>
        <li>Apple has <strong>no obligation</strong> to furnish any maintenance or support services for the App.</li>
        <li>To the maximum extent permitted by law, Apple has <strong>no warranty obligation</strong> with respect to the App. If the App fails to conform to any applicable warranty, you may notify Apple, and Apple may refund the purchase price (if any); Apple has no other warranty obligation, and any other claims, losses, liabilities, damages, costs, or expenses attributable to a failure to conform to any warranty are our responsibility, not Apple's.</li>
        <li>Apple is not responsible for addressing any claims by you or a third party relating to the App or your possession and/or use of the App, including product-liability claims, claims that the App fails to conform to legal or regulatory requirements, and claims under consumer-protection, privacy, or similar legislation.</li>
        <li>In the event of any third-party claim that the App or your possession and use of the App infringes that third party's intellectual-property rights, {SITE.name}, not Apple, is responsible for the investigation, defense, settlement, and discharge of that claim.</li>
        <li>You represent and warrant that you are not located in a country subject to a U.S. Government embargo or designated a "terrorist supporting" country, and that you are not listed on any U.S. Government list of prohibited or restricted parties.</li>
        <li>Apple and Apple's subsidiaries are <strong>third-party beneficiaries</strong> of these Terms, and upon your acceptance, Apple will have the right (and will be deemed to have accepted the right) to enforce these Terms against you as a third-party beneficiary.</li>
      </ol>

      {/* § 18 */}
      <div className="section-header">
        <span className="section-num">18</span>
        <h2>General</h2>
        <div className="section-rule" />
      </div>

      <ul className="legal-list">
        <li><strong>Entire agreement.</strong> These Terms and the Privacy Policy are the entire agreement between you and us regarding the App and supersede any prior agreements on that subject.</li>
        <li><strong>Severability.</strong> If any provision is held unenforceable, the remaining provisions will remain in full force, and the unenforceable provision will be modified to the minimum extent necessary.</li>
        <li><strong>No waiver.</strong> Our failure to enforce any provision is not a waiver of our right to do so later.</li>
        <li><strong>Assignment.</strong> You may not assign these Terms without our prior written consent. We may assign these Terms in connection with a merger, acquisition, or sale of assets, or otherwise by operation of law.</li>
        <li><strong>Changes to these Terms.</strong> We may update these Terms from time to time. When we do, we will revise the "Last Updated" date and, where appropriate, provide additional notice. Your continued use of the App after the changes take effect constitutes acceptance of the updated Terms.</li>
      </ul>

      {/* § 19 */}
      <div className="section-header">
        <span className="section-num">19</span>
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
        <p>Questions about these Terms? Contact us at the address above.</p>
      </div>

    </LegalPage>
  )
}
