import { LegalPage } from '../../components/LegalPage/LegalPage'
import { SITE } from '../../data/site'

const OPERATOR = 'Mile High Interface LLC'
const CONTACT = SITE.email

export default function StlmntTerms() {
  return (
    <>
      <LegalPage
        path="/legal/stlmnt/terms"
        appLabel="STLMNT"
        docType="terms"
        subtitle={`STLMNT — ${OPERATOR}`}
        dateLine="Effective Date: June 17, 2026 · Last Updated: June 17, 2026"
      >

        <div className="intro-block">
          <p>
            By creating an account or using the STLMNT app, you agree to these Terms of Service and
            our{' '}
            <a href="/legal/stlmnt/privacy">Privacy Policy</a>.
          </p>
        </div>

        <div className="verdict-box note">
          <p>
            By creating an account or using the App, you agree to these Terms. If you do not agree,
            do not create an account or use the App.
          </p>
        </div>

        {/* § 1 */}
        <div className="section-header">
          <span className="section-num">01</span>
          <h2>Acceptance</h2>
          <div className="section-rule" />
        </div>
        <p>
          By creating an account or using the STLMNT app, you agree to these Terms of Service and our{' '}
          <a href="/legal/stlmnt/privacy">Privacy Policy</a>.
        </p>

        {/* § 2 */}
        <div className="section-header">
          <span className="section-num">02</span>
          <h2>What STLMNT Is — and Is Not</h2>
          <div className="section-rule" />
        </div>
        <div className="verdict-box warning">
          <p className="legal-allcaps">
            STLMNT IS NOT A LAW FIRM, A LAWYER, A CLAIMS FILING SERVICE, OR A SETTLEMENT
            ADMINISTRATOR. IT DOES NOT PROVIDE LEGAL ADVICE, AND USING IT DOES NOT CREATE AN
            ATTORNEY–CLIENT RELATIONSHIP.
          </p>
        </div>
        <ul className="legal-list">
          <li>
            STLMNT helps you discover open class action settlements, check whether you may be
            eligible, and prepare the official claim form by copying or pre-filling your saved
            details.
          </li>
          <li>
            STLMNT never files or submits a claim for you. You review, complete, and submit every
            claim yourself, directly on the official settlement administrator's website or by the
            method that administrator specifies.
          </li>
          <li>
            The App is provided free of charge. We do not charge you to use STLMNT and we take no
            portion of any settlement payment you may receive.
          </li>
        </ul>

        {/* § 3 */}
        <div className="section-header">
          <span className="section-num">03</span>
          <h2>Eligibility</h2>
          <div className="section-rule" />
        </div>
        <p>
          You must be at least 13 years old to use the App. By using the App, you represent that you
          meet this requirement and that the information you provide is accurate.
        </p>

        {/* § 4 */}
        <div className="section-header">
          <span className="section-num">04</span>
          <h2>Account Responsibilities</h2>
          <div className="section-rule" />
        </div>
        <ul className="legal-list">
          <li>
            You may create an account with email and password, or sign in with Google or Apple. You
            agree to provide accurate account information.
          </li>
          <li>
            You are responsible for maintaining the security of your account and the credentials you
            use to sign in.
          </li>
          <li>You are responsible for all activity that occurs under your account.</li>
          <li>You agree not to impersonate another person or create an account on someone else's behalf without authorization.</li>
        </ul>

        {/* § 5 */}
        <div className="section-header">
          <span className="section-num">05</span>
          <h2>Filing Claims Is Your Responsibility</h2>
          <div className="section-rule" />
        </div>
        <div className="verdict-box warning">
          <p>
            Class action claim forms are typically signed under penalty of perjury. You — not
            STLMNT — submit your claim, and you are solely responsible for the truthfulness and
            accuracy of everything you submit.
          </p>
        </div>
        <ul className="legal-list">
          <li>
            The eligibility self-check and any autofill are aids only. You are responsible for
            confirming, on the official source, that you actually qualify before submitting a claim.
          </li>
          <li>
            You must review every field before submitting, and you must not submit false, inflated,
            or fraudulent claims. Doing so may be unlawful and is your responsibility alone.
          </li>
          <li>
            Only the settlement administrator and the court decide whether your claim is valid,
            approved, or paid. STLMNT has no role in that decision and cannot influence it.
          </li>
        </ul>

        {/* § 6 */}
        <div className="section-header">
          <span className="section-num">06</span>
          <h2>Settlement Information and Accuracy</h2>
          <div className="section-rule" />
        </div>
        <ul className="legal-list">
          <li>
            Settlement information in the App — including descriptions, eligibility summaries,
            deadlines, proof requirements, and links — is compiled from public court records,
            regulatory sources, and settlement-administrator sites. We work to verify it, but it may
            change or contain errors.
          </li>
          <li>
            We do not guarantee that any settlement listing is current, complete, or accurate.
            Deadlines and requirements are set by the administrator and court, not by us, and can
            change at any time.
          </li>
          <li>
            Always confirm the details — eligibility, deadlines, required proof, and how to file —
            on the official administrator's site before relying on them. The official source
            controls if there is any discrepancy.
          </li>
        </ul>

        {/* § 7 */}
        <div className="section-header">
          <span className="section-num">07</span>
          <h2>Payout Estimates</h2>
          <div className="section-rule" />
        </div>
        <ul className="legal-list">
          <li>
            Any payout figures shown are estimates drawn from settlement documents. Actual payments
            depend on the number of valid claims, the terms of the settlement, and the
            administrator's and court's determinations.
          </li>
          <li>
            We do not promise that you will receive any payment, or any particular amount, or that a
            payment will arrive by any particular date.
          </li>
        </ul>

        {/* § 8 */}
        <div className="section-header">
          <span className="section-num">08</span>
          <h2>Acceptable Use</h2>
          <div className="section-rule" />
        </div>
        <p>You agree not to:</p>
        <ul className="legal-list">
          <li>Use the App to prepare or submit any false, fraudulent, or duplicate settlement claim</li>
          <li>Use the App for any unlawful purpose or in violation of any settlement's terms</li>
          <li>Attempt to access another user's account, profile, or claims</li>
          <li>Interfere with, disrupt, or attempt to circumvent the security of the App or its infrastructure</li>
          <li>Scrape, copy, or redistribute the settlement catalog for a competing commercial service</li>
          <li>Reverse engineer the App except to the extent that restriction is prohibited by law</li>
        </ul>

        {/* § 9 */}
        <div className="section-header">
          <span className="section-num">09</span>
          <h2>Your Content and Data</h2>
          <div className="section-rule" />
        </div>
        <ul className="legal-list">
          <li>
            You retain ownership of the information you enter — your autofill profile, claim notes,
            brand selections, and any receipt photos you attach.
          </li>
          <li>
            You grant us a limited license to store and process that information solely to provide
            the App's features to you, as described in the{' '}
            <a href="/legal/stlmnt/privacy">Privacy Policy</a>.
          </li>
          <li>
            Receipt photos you attach stay on your device and are not uploaded to us. You are
            responsible for the content you choose to store in the App.
          </li>
        </ul>

        {/* § 10 */}
        <div className="section-header">
          <span className="section-num">10</span>
          <h2>Intellectual Property</h2>
          <div className="section-rule" />
        </div>
        <ul className="legal-list">
          <li>
            The STLMNT app, its name, design, and original content are owned by {OPERATOR}.
          </li>
          <li>
            Underlying settlement information originates from public records and third-party sources
            and is subject to their respective terms.
          </li>
        </ul>

        {/* § 11 */}
        <div className="section-header">
          <span className="section-num">11</span>
          <h2>Account Termination</h2>
          <div className="section-rule" />
        </div>
        <ul className="legal-list">
          <li>
            You may delete your account and associated data at any time from within the App (Profile
            → Delete account &amp; data), or by contacting us at{' '}
            <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
          </li>
          <li>
            We may suspend or terminate accounts that violate these Terms, are used to submit
            fraudulent claims, or are used in a way that harms the service or other users.
          </li>
        </ul>

        {/* § 12 */}
        <div className="section-header">
          <span className="section-num">12</span>
          <h2>Disclaimers</h2>
          <div className="section-rule" />
        </div>
        <div className="verdict-box warning">
          <p className="legal-allcaps">
            THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS
            OR IMPLIED. WE DO NOT PROVIDE LEGAL ADVICE. WE DO NOT WARRANT THAT THE APP WILL BE
            UNINTERRUPTED OR ERROR-FREE, THAT SETTLEMENT INFORMATION, ELIGIBILITY SELF-CHECKS, OR
            PAYOUT ESTIMATES WILL BE ACCURATE OR CURRENT, OR THAT ANY CLAIM YOU FILE WILL BE
            ACCEPTED, APPROVED, OR PAID. YOU ARE RESPONSIBLE FOR VERIFYING ALL INFORMATION ON THE
            OFFICIAL SETTLEMENT SOURCE AND FOR THE CLAIMS YOU SUBMIT.
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
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, MILE HIGH INTERFACE LLC SHALL NOT BE
            LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR
            ANY MISSED DEADLINE, REJECTED OR DENIED CLAIM, LOST OR UNRECEIVED PAYMENT, OR RELIANCE ON
            SETTLEMENT INFORMATION, ELIGIBILITY RESULTS, OR PAYOUT ESTIMATES, ARISING FROM YOUR USE
            OF THE APP.
          </p>
        </div>

        {/* § 14 */}
        <div className="section-header">
          <span className="section-num">14</span>
          <h2>Governing Law</h2>
          <div className="section-rule" />
        </div>
        <p>
          These Terms are governed by the laws of the <strong>State of Colorado</strong>, U.S.A.,
          without regard to conflict of law principles.
        </p>

        {/* § 15 */}
        <div className="section-header">
          <span className="section-num">15</span>
          <h2>Changes</h2>
          <div className="section-rule" />
        </div>
        <p>
          We may update these Terms from time to time. Material changes will be communicated through
          the App, and we will update the "Effective Date" above. Continued use of the App after
          changes take effect constitutes acceptance of the updated Terms.
        </p>

        {/* § 16 */}
        <div className="section-header">
          <span className="section-num">16</span>
          <h2>Contact</h2>
          <div className="section-rule" />
        </div>
        <div className="verdict-box contact">
          <p>
            For questions about these Terms, contact{' '}
            <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
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
        </div>
      </footer>
    </>
  )
}
