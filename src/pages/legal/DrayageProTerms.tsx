import { RouteHead } from '../../components/SEO/RouteHead'
import { PageHeader } from '../../components/PageHeader/PageHeader'
import { META } from '../../lib/seo'
import { SITE } from '../../data/site'

export default function DrayageProTerms() {
  return (
    <>
      <RouteHead {...META['/legal/drayagepro/terms']} />

      <PageHeader>
        <header className="masthead">
          <p className="overline">Legal · DrayagePro TMS</p>
          <h1>Terms of <em>Service</em></h1>
          <p className="subtitle">DrayagePro TMS — {SITE.name}</p>
          <p className="date-line">Effective Date: June 4, 2026 · Last Updated: June 4, 2026</p>
        </header>
      </PageHeader>

      <main className="container" id="main-content" tabIndex={-1}>

        <div className="intro-block">
          <p>
            These Terms of Service govern your use of the <strong>DrayagePro TMS</strong> mobile
            application. By downloading, installing, or using the App, you agree to be bound by
            these Terms.
          </p>
        </div>

        <div className="verdict-box note">
          <p>
            By downloading, installing, or using the App, you agree to be bound by these Terms.
            If you do not agree, do not use the App.
          </p>
        </div>

        {/* § 1 */}
        <div className="section-header">
          <span className="section-num">01</span>
          <h2>Agreement to Terms</h2>
          <div className="section-rule" />
        </div>
        <p>
          These Terms of Service ("Terms") are a legal agreement between you (an individual or the
          business entity you represent, "you" or "User") and <strong>{SITE.name}</strong> ("An App
          Idea," "we," "our," or "us") governing your use of the <strong>DrayagePro TMS</strong>{' '}
          mobile application and any related services (collectively, the "App").
        </p>
        <p>
          By downloading, installing, accessing, or using the App, you agree to be bound by these
          Terms. If you do not agree to these Terms, do not use the App. If you are using the App on
          behalf of a business or other legal entity, you represent that you have the authority to
          bind that entity to these Terms.
        </p>

        {/* § 2 */}
        <div className="section-header">
          <span className="section-num">02</span>
          <h2>Description of the App</h2>
          <div className="section-rule" />
        </div>
        <p>
          DrayagePro TMS is a Transportation Management System (TMS) and Warehouse Management
          System (WMS) application for logistics professionals. The App allows users to manage
          freight loads, carriers, customers, invoices, warehouse storage orders, and inventory —
          all stored locally on your device.
        </p>

        {/* § 3 */}
        <div className="section-header">
          <span className="section-num">03</span>
          <h2>License</h2>
          <div className="section-rule" />
        </div>

        <h3 className="legal-subsection">3.1 Grant of License</h3>
        <p>
          Subject to your compliance with these Terms, {SITE.name} grants you a limited,
          non-exclusive, non-transferable, revocable license to download and use the App on a
          device you own or control, solely for your internal business purposes.
        </p>

        <h3 className="legal-subsection">3.2 Restrictions</h3>
        <p>You may not:</p>
        <ul className="legal-list">
          <li>Copy, modify, distribute, sell, or sublicense the App or any portion of it</li>
          <li>
            Reverse engineer, decompile, disassemble, or attempt to derive the source code of the
            App
          </li>
          <li>
            Remove, alter, or obscure any proprietary notices (including copyright or trademark
            notices) within the App
          </li>
          <li>
            Use the App for any unlawful purpose or in violation of any applicable law or regulation
          </li>
          <li>
            Use the App in any manner that could damage, disable, overburden, or impair its
            operation
          </li>
          <li>
            Attempt to gain unauthorized access to any portion of the App or any systems or
            networks connected to the App
          </li>
          <li>Create derivative works based on the App</li>
        </ul>

        <h3 className="legal-subsection">3.3 Reservation of Rights</h3>
        <p>
          The App is licensed, not sold. {SITE.name} retains all right, title, and interest in and
          to the App, including all intellectual property rights. Nothing in these Terms transfers
          any ownership rights to you.
        </p>

        {/* § 4 */}
        <div className="section-header">
          <span className="section-num">04</span>
          <h2>Eligibility</h2>
          <div className="section-rule" />
        </div>
        <p>
          The App is intended for business use by adults 18 years of age or older. By using the
          App, you represent and warrant that:
        </p>
        <ul className="legal-list">
          <li>You are at least 18 years old</li>
          <li>You have the legal capacity to enter into a binding agreement</li>
          <li>You are not prohibited from using the App under applicable law</li>
          <li>You will use the App only for lawful business purposes</li>
        </ul>

        {/* § 5 */}
        <div className="section-header">
          <span className="section-num">05</span>
          <h2>Your Data and Content</h2>
          <div className="section-rule" />
        </div>

        <h3 className="legal-subsection">5.1 Ownership</h3>
        <p>
          All business data you enter into the App (including customer records, carrier information,
          load details, invoices, and storage orders) remains yours. We do not claim any ownership
          over your data.
        </p>

        <h3 className="legal-subsection">5.2 Local Storage</h3>
        <p>
          All data you create within the App is stored exclusively on your device. We do not have
          access to, and do not transmit or store, your business data on any server or cloud service.
        </p>

        <h3 className="legal-subsection">5.3 Your Responsibility</h3>
        <p>You are solely responsible for:</p>
        <ul className="legal-list">
          <li>
            The accuracy, completeness, and legality of all data you enter into the App
          </li>
          <li>Maintaining appropriate backup copies of your data</li>
          <li>
            Ensuring that your use of data complies with all applicable laws, including data
            protection laws governing any personal information of customers or business contacts
          </li>
          <li>Maintaining the security of your device and App credentials</li>
        </ul>

        <h3 className="legal-subsection">5.4 Data Loss</h3>
        <p>
          Because data is stored locally on your device, {SITE.name} is not responsible for any
          loss of data resulting from device failure, App uninstallation, device reset, OS updates,
          or any other cause. We strongly recommend maintaining regular backups through your
          device's backup system.
        </p>

        {/* § 6 */}
        <div className="section-header">
          <span className="section-num">06</span>
          <h2>Acceptable Use</h2>
          <div className="section-rule" />
        </div>
        <p>
          You agree to use the App only for legitimate business purposes. You will not use the App
          to:
        </p>
        <ul className="legal-list">
          <li>Enter false, inaccurate, or misleading business records</li>
          <li>
            Violate any applicable federal, state, local, or international law or regulation
          </li>
          <li>Infringe the intellectual property rights of any third party</li>
          <li>
            Store, transmit, or process data that you do not have authorization to handle
          </li>
          <li>Engage in any fraudulent activity or facilitate fraud</li>
        </ul>

        {/* § 7 */}
        <div className="section-header">
          <span className="section-num">07</span>
          <h2>Updates and Modifications</h2>
          <div className="section-rule" />
        </div>

        <h3 className="legal-subsection">7.1 App Updates</h3>
        <p>
          The App uses Expo's over-the-air (OTA) update technology to deliver software updates. By
          using the App, you agree to receive these updates, which may be delivered automatically.
          Updates may change features, fix bugs, or modify App functionality.
        </p>

        <h3 className="legal-subsection">7.2 Changes to the App</h3>
        <p>
          {SITE.name} reserves the right to modify, suspend, or discontinue the App (or any feature
          within the App) at any time, with or without notice. We will not be liable to you or any
          third party for any modification, suspension, or discontinuation of the App.
        </p>

        <h3 className="legal-subsection">7.3 Changes to These Terms</h3>
        <p>
          We may revise these Terms at any time. If we make material changes, we will update the
          "Last Updated" date and, where appropriate, provide notice through the App. Your continued
          use of the App after changes take effect constitutes your acceptance of the revised Terms.
        </p>

        {/* § 8 */}
        <div className="section-header">
          <span className="section-num">08</span>
          <h2>Third-Party Services</h2>
          <div className="section-rule" />
        </div>
        <p>The App relies on certain third-party services, including:</p>
        <ul className="legal-list">
          <li>
            <strong>Expo (Software, Inc.) / Expo Updates</strong> — for over-the-air software
            updates
          </li>
          <li>
            <strong>Apple App Store / Google Play</strong> — for App distribution and device-level
            platform services
          </li>
        </ul>
        <p>
          Your use of any third-party service is subject to that service's own terms and privacy
          policy. {SITE.name} is not responsible for the availability, accuracy, or practices of
          any third-party service.
        </p>

        {/* § 9 */}
        <div className="section-header">
          <span className="section-num">09</span>
          <h2>Disclaimer of Warranties</h2>
          <div className="section-rule" />
        </div>
        <div className="verdict-box warning">
          <p className="legal-allcaps">
            THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT WARRANTY OF ANY KIND. TO THE
            FULLEST EXTENT PERMITTED BY APPLICABLE LAW, {SITE.name.toUpperCase()} EXPRESSLY
            DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
          </p>
          <ul className="legal-list legal-allcaps">
            <li>
              WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT
            </li>
            <li>
              WARRANTIES THAT THE APP WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR
              OTHER HARMFUL COMPONENTS
            </li>
            <li>
              WARRANTIES REGARDING THE ACCURACY, RELIABILITY, OR COMPLETENESS OF ANY CONTENT OR
              DATA IN OR ACCESSIBLE THROUGH THE APP
            </li>
          </ul>
          <p className="legal-allcaps">
            NO ADVICE OR INFORMATION, WHETHER ORAL OR WRITTEN, OBTAINED FROM {SITE.name.toUpperCase()} OR
            THROUGH THE APP, WILL CREATE ANY WARRANTY NOT EXPRESSLY MADE IN THESE TERMS.
          </p>
        </div>
        <div className="verdict-box note">
          <p>
            THE APP IS NOT A SUBSTITUTE FOR PROFESSIONAL LEGAL, FINANCIAL, REGULATORY, OR LOGISTICS
            COMPLIANCE ADVICE. YOU ARE SOLELY RESPONSIBLE FOR VERIFYING THAT YOUR OPERATIONS COMPLY
            WITH ALL APPLICABLE LAWS AND REGULATIONS, INCLUDING FMCSA REGULATIONS, CUSTOMS
            REQUIREMENTS, AND HAZARDOUS MATERIALS RULES.
          </p>
        </div>

        {/* § 10 */}
        <div className="section-header">
          <span className="section-num">10</span>
          <h2>Limitation of Liability</h2>
          <div className="section-rule" />
        </div>
        <div className="verdict-box warning">
          <p className="legal-allcaps">
            TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT WILL{' '}
            {SITE.name.toUpperCase()}, ITS OWNERS, OFFICERS, EMPLOYEES, AGENTS, OR LICENSORS BE
            LIABLE TO YOU FOR ANY:
          </p>
          <ul className="legal-list legal-allcaps">
            <li>
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES
            </li>
            <li>LOSS OF PROFITS, REVENUE, BUSINESS, DATA, GOODWILL, OR ANTICIPATED SAVINGS</li>
            <li>DAMAGES ARISING FROM LOSS OF OR CORRUPTION OF DATA</li>
            <li>
              DAMAGES ARISING FROM BUSINESS INTERRUPTION OR OPERATIONAL DECISIONS MADE IN RELIANCE
              ON THE APP
            </li>
          </ul>
          <p className="legal-allcaps">
            WHETHER BASED ON CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY, OR OTHERWISE,
            EVEN IF {SITE.name.toUpperCase()} HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
          </p>
          <p className="legal-allcaps">
            {SITE.name.toUpperCase()}'S TOTAL CUMULATIVE LIABILITY TO YOU FOR ALL CLAIMS ARISING
            FROM OR RELATED TO THE APP WILL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID FOR
            THE APP IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR (B) ONE HUNDRED DOLLARS (USD
            $100).
          </p>
        </div>
        <p>
          Some jurisdictions do not allow the exclusion or limitation of certain warranties or
          liabilities, so some of the above limitations may not apply to you.
        </p>

        {/* § 11 */}
        <div className="section-header">
          <span className="section-num">11</span>
          <h2>Indemnification</h2>
          <div className="section-rule" />
        </div>
        <p>
          You agree to defend, indemnify, and hold harmless {SITE.name} and its owners, officers,
          employees, and agents from and against any claims, damages, losses, liabilities, costs,
          and expenses (including reasonable attorneys' fees) arising out of or related to:
        </p>
        <ul className="legal-list">
          <li>Your use of the App</li>
          <li>Your violation of these Terms</li>
          <li>Your violation of any applicable law or regulation</li>
          <li>Any data you enter into or generate through the App</li>
          <li>
            Any claim by a third party related to your business operations as tracked or managed
            through the App
          </li>
        </ul>

        {/* § 12 */}
        <div className="section-header">
          <span className="section-num">12</span>
          <h2>Termination</h2>
          <div className="section-rule" />
        </div>
        <p>
          {SITE.name} may terminate or suspend your license to use the App at any time, for any
          reason, including if we reasonably believe you have violated these Terms. Upon termination,
          your right to use the App ceases immediately. Because data is stored locally on your
          device, App data will remain on your device until you uninstall the App or clear its data.
        </p>
        <p>You may stop using the App at any time by uninstalling it from your device.</p>

        {/* § 13 */}
        <div className="section-header">
          <span className="section-num">13</span>
          <h2>Governing Law and Dispute Resolution</h2>
          <div className="section-rule" />
        </div>
        <p>
          These Terms are governed by and construed in accordance with the laws of the{' '}
          <strong>State of Colorado</strong>, without regard to its conflict of law principles.
        </p>
        <p>
          Any dispute arising from or relating to these Terms or the App that cannot be resolved
          informally shall be subject to binding arbitration administered in{' '}
          <strong>Aurora, Colorado</strong> under the rules of the American Arbitration Association,
          except that either party may seek injunctive or other equitable relief in a court of
          competent jurisdiction to prevent actual or threatened infringement, misappropriation, or
          violation of intellectual property rights.
        </p>
        <div className="verdict-box note">
          <p>
            <strong>CLASS ACTION WAIVER:</strong> YOU AGREE THAT ANY DISPUTE RESOLUTION PROCEEDINGS
            WILL BE CONDUCTED ONLY ON AN INDIVIDUAL BASIS AND NOT AS A CLASS OR REPRESENTATIVE
            ACTION.
          </p>
        </div>

        {/* § 14 */}
        <div className="section-header">
          <span className="section-num">14</span>
          <h2>General Provisions</h2>
          <div className="section-rule" />
        </div>

        <h3 className="legal-subsection">14.1 Entire Agreement</h3>
        <p>
          These Terms and our Privacy Policy constitute the entire agreement between you and{' '}
          {SITE.name} regarding the App and supersede all prior agreements and understandings.
        </p>

        <h3 className="legal-subsection">14.2 Severability</h3>
        <p>
          If any provision of these Terms is found to be invalid or unenforceable, that provision
          will be modified to the minimum extent necessary to make it enforceable, and the remaining
          provisions will remain in full force and effect.
        </p>

        <h3 className="legal-subsection">14.3 Waiver</h3>
        <p>
          Our failure to enforce any provision of these Terms will not constitute a waiver of our
          right to enforce that or any other provision in the future.
        </p>

        <h3 className="legal-subsection">14.4 Assignment</h3>
        <p>
          You may not assign or transfer your rights under these Terms without our prior written
          consent. {SITE.name} may assign its rights and obligations under these Terms without
          restriction.
        </p>

        <h3 className="legal-subsection">14.5 No Third-Party Beneficiaries</h3>
        <p>These Terms do not confer any rights or remedies on any third party.</p>

        {/* § 15 */}
        <div className="section-header">
          <span className="section-num">15</span>
          <h2>Contact Information</h2>
          <div className="section-rule" />
        </div>
        <p>For questions about these Terms of Service, please contact:</p>
        <div className="verdict-box contact">
          <p>
            <strong>{SITE.name}</strong><br />
            Email:{' '}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a><br />
            Website:{' '}
            <a href={SITE.url} target="_blank" rel="noopener noreferrer">{SITE.url}</a>
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
              DrayagePro TMS
            </li>
            <li>
              <strong>Platform</strong>
              iOS &amp; Android
            </li>
            <li>
              <strong>Bundle ID</strong>
              com.hudsoninsights.drayagepro
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
          </ul>
        </div>
      </footer>
    </>
  )
}
