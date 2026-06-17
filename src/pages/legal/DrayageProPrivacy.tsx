import { LegalPage } from '../../components/LegalPage/LegalPage'
import { SocialLinks } from '../../components/SocialLinks/SocialLinks'
import { SITE } from '../../data/site'

export default function DrayageProPrivacy() {
  return (
    <>
      <LegalPage
        path="/legal/drayagepro/privacy"
        appLabel="DrayagePro TMS"
        docType="privacy"
        subtitle={`DrayagePro TMS — ${SITE.name}`}
        dateLine="Effective Date: June 4, 2026 · Last Updated: June 4, 2026"
      >

        <div className="intro-block">
          <p>
            {SITE.name} ("An App Idea," "we," "our," or "us") develops and operates the{' '}
            <strong>DrayagePro TMS</strong> mobile application (the "App"). This Privacy Policy
            describes how we handle information when you use the App.
          </p>
        </div>

        <div className="verdict-box note">
          <p>
            By downloading, installing, or using the App, you agree to the practices described in
            this Privacy Policy.
          </p>
        </div>

        {/* § 1 */}
        <div className="section-header">
          <span className="section-num">01</span>
          <h2>Introduction</h2>
          <div className="section-rule" />
        </div>
        <p>
          {SITE.name} ("An App Idea," "we," "our," or "us") develops and operates the{' '}
          <strong>DrayagePro TMS</strong> mobile application (the "App"). This Privacy Policy
          describes how we handle information when you use the App.
        </p>

        {/* § 2 */}
        <div className="section-header">
          <span className="section-num">02</span>
          <h2>About DrayagePro TMS</h2>
          <div className="section-rule" />
        </div>
        <p>
          DrayagePro TMS is a Transportation Management System (TMS) and Warehouse Management
          System (WMS) designed for logistics professionals, freight brokers, carriers, and
          warehouse operators. The App is intended for use by businesses and their authorized
          personnel. It is not directed at or intended for use by children under the age of 13.
        </p>

        {/* § 3 */}
        <div className="section-header">
          <span className="section-num">03</span>
          <h2>Information We Collect</h2>
          <div className="section-rule" />
        </div>

        <h3 className="legal-subsection">3.1 Information You Enter Into the App</h3>
        <p>
          All data you create and manage within DrayagePro TMS is{' '}
          <strong>stored exclusively on your device</strong> using local device storage
          (AsyncStorage). We do not have access to this data. It is never transmitted to our
          servers or any cloud service. This data includes:
        </p>
        <ul className="legal-list">
          <li>
            <strong>Account credentials</strong> — usernames and passwords used to access the App
          </li>
          <li>
            <strong>Customer records</strong> — business names, contact information (names, phone
            numbers, email addresses, mailing addresses), credit terms, and account details
          </li>
          <li>
            <strong>Carrier records</strong> — company names, Motor Carrier (MC) numbers, DOT
            numbers, and accounts receivable contact information
          </li>
          <li>
            <strong>Load and shipment data</strong> — freight load details including
            origin/destination addresses, equipment types, commodity descriptions, hazardous
            material classifications, dates, weights, shipment values, and billable charges
          </li>
          <li>
            <strong>Invoice and billing data</strong> — invoice records, line items, payment
            status, and transaction amounts
          </li>
          <li>
            <strong>Warehouse/storage order data</strong> — inbound and outbound order details,
            warehouse locations, carrier information, commodity descriptions, and storage rates
          </li>
          <li>
            <strong>Settings and preferences</strong> — theme preferences (dark/light mode) and
            other in-app configuration
          </li>
        </ul>

        <h3 className="legal-subsection">3.2 Information Collected Automatically</h3>
        <p>
          <strong>Expo Updates (Over-the-Air Updates):</strong> The App uses Expo's update delivery
          service to receive software updates. When checking for or downloading updates, the Expo
          Updates service may receive standard network request metadata, such as device platform, OS
          version, and App version. This service is operated by Expo (Software, Inc.). We do not
          control Expo's data practices; please refer to{' '}
          <a href="https://expo.dev/privacy" target="_blank" rel="noopener noreferrer">
            Expo's Privacy Policy
          </a>{' '}
          for more information.
        </p>
        <p>
          <strong>No analytics or tracking:</strong> We do not integrate any analytics platforms,
          advertising networks, crash-reporting services, or behavioral tracking tools. We do not
          collect usage data, session recordings, or telemetry of any kind.
        </p>

        {/* § 4 */}
        <div className="section-header">
          <span className="section-num">04</span>
          <h2>How We Use Information</h2>
          <div className="section-rule" />
        </div>
        <p>
          Because all App data is stored locally on your device, we do not have access to the
          business data you enter into DrayagePro TMS. We do not use your data for advertising,
          profiling, or any purpose beyond the App's operation on your device.
        </p>
        <p>
          The only limited data processing that occurs is in connection with over-the-air update
          delivery as described in Section 3.2.
        </p>

        {/* § 5 */}
        <div className="section-header">
          <span className="section-num">05</span>
          <h2>Data Storage and Security</h2>
          <div className="section-rule" />
        </div>
        <div className="verdict-box note">
          <p>
            <strong>Local storage only.</strong> All business records — customers, carriers, loads,
            invoices, storage orders, and user credentials — are stored in the App's local storage
            on your device. This data is not transmitted to our servers, to any cloud service, or to
            any third party.
          </p>
        </div>
        <p>
          <strong>Your responsibility.</strong> Because data resides on your device, you are
          responsible for maintaining the physical security of your device and protecting your App
          login credentials. If your device is lost, stolen, or accessible to others, your App data
          may be exposed.
        </p>
        <p>
          <strong>No cloud backup.</strong> The App does not perform automatic cloud backup. If you
          uninstall the App or reset your device, your App data will be permanently deleted unless
          you have backed it up through your device's own backup mechanisms.
        </p>

        {/* § 6 */}
        <div className="section-header">
          <span className="section-num">06</span>
          <h2>Sharing of Information</h2>
          <div className="section-rule" />
        </div>
        <p>
          We do not sell, rent, lease, or otherwise share your personal information or business data
          with third parties, except in the following limited circumstances:
        </p>
        <ul className="legal-list">
          <li>
            <strong>Service providers:</strong> Expo (Software, Inc.) may receive device and version
            metadata as part of the update delivery process described in Section 3.2.
          </li>
          <li>
            <strong>Legal requirements:</strong> If required by applicable law, court order, or
            government authority, we may disclose information as necessary to comply with legal
            obligations.
          </li>
          <li>
            <strong>Business transfers:</strong> In the event of a merger, acquisition, or sale of
            all or substantially all of our assets, information associated with the App may be
            transferred as part of that transaction. We will notify you by updating this Privacy
            Policy.
          </li>
        </ul>

        {/* § 7 */}
        <div className="section-header">
          <span className="section-num">07</span>
          <h2>PDF Documents</h2>
          <div className="section-rule" />
        </div>
        <p>
          The App allows you to generate and share PDF invoices and documents using your device's
          native print and sharing capabilities. When you share a PDF via the system share sheet
          (email, messaging, AirDrop, etc.), that document is handled by the app or service you
          choose. We have no control over how third-party applications process documents you choose
          to share.
        </p>

        {/* § 8 */}
        <div className="section-header">
          <span className="section-num">08</span>
          <h2>Children's Privacy</h2>
          <div className="section-rule" />
        </div>
        <p>
          DrayagePro TMS is a business-to-business application and is not directed at children under
          the age of 13 (or 16 where required by applicable law). We do not knowingly collect
          personal information from children. If you believe a child has used the App in a way that
          resulted in the collection of their information, please contact us and we will take
          appropriate steps to address it.
        </p>

        {/* § 9 */}
        <div className="section-header">
          <span className="section-num">09</span>
          <h2>International Users</h2>
          <div className="section-rule" />
        </div>
        <p>
          {SITE.name} is based in the United States. If you are located outside the United States,
          please be aware that any information processed in connection with App updates (Section 3.2)
          may be transferred to and processed in the United States, where privacy laws may differ
          from those in your jurisdiction.
        </p>

        {/* § 10 */}
        <div className="section-header">
          <span className="section-num">10</span>
          <h2>California Residents</h2>
          <div className="section-rule" />
        </div>
        <p>
          If you are a California resident, you may have additional rights under the California
          Consumer Privacy Act (CCPA). Because DrayagePro TMS does not collect, sell, or share
          personal information beyond the limited update delivery metadata described in Section 3.2,
          most CCPA rights (such as the right to opt out of sale) are not applicable. To submit a
          privacy inquiry, contact us at the address below.
        </p>

        {/* § 11 */}
        <div className="section-header">
          <span className="section-num">11</span>
          <h2>Changes to This Privacy Policy</h2>
          <div className="section-rule" />
        </div>
        <p>
          We may update this Privacy Policy from time to time. When we make material changes, we
          will update the "Last Updated" date at the top of this document and, where appropriate,
          provide notice through the App. We encourage you to review this policy periodically.
        </p>

        {/* § 12 */}
        <div className="section-header">
          <span className="section-num">12</span>
          <h2>Contact Us</h2>
          <div className="section-rule" />
        </div>
        <p>
          If you have questions, concerns, or requests regarding this Privacy Policy or our data
          practices, please contact us:
        </p>
        <div className="verdict-box contact">
          <p>
            <strong>{SITE.name}</strong><br />
            Email:{' '}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a><br />
            Website:{' '}
            <a href={SITE.url} target="_blank" rel="noopener noreferrer">{SITE.url}</a>
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
          <SocialLinks />
        </div>
      </footer>
    </>
  )
}
