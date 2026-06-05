import { LegalPage } from '../../components/LegalPage/LegalPage'
import { SITE } from '../../data/site'

export default function ZooriTerms() {
  return (
    <LegalPage
      path="/legal/zoori/terms"
      appLabel="Zoori"
      docType="terms"
      subtitle={`Zoori — ${SITE.name}`}
      dateLine="Effective Date: June 5, 2026 · Last Updated: June 5, 2026"
    >

        <div className="intro-block">
          <p>
            These Terms of Service ("Terms") form a legally binding agreement between you and{' '}
            {SITE.name} ("Company," "we," "us," or "our") governing your use of the Zoori mobile
            application ("App").
          </p>
        </div>

        <div className="verdict-box note">
          <p>
            By creating an account or using the App, you confirm that you are at least 13 years
            old, have read and understood these Terms, and agree to be bound by them.
          </p>
        </div>

        {/* § 1 */}
        <div className="section-header">
          <span className="section-num">01</span>
          <h2>Agreement to Terms</h2>
          <div className="section-rule" />
        </div>

        <p>
          These Terms of Service ("Terms") form a legally binding agreement between you and{' '}
          {SITE.name} ("Company," "we," "us," or "our") governing your use of the Zoori mobile
          application ("App"). By creating an account or using the App, you confirm that you are
          at least 13 years old, have read and understood these Terms, and agree to be bound by
          them.
        </p>
        <p>
          If you are between the age of 13 and the age of majority in your jurisdiction, you may
          use the App only with the involvement and consent of a parent or legal guardian. Adopting
          or fostering an animal is a serious commitment: to submit an adoption or foster
          application you must have the legal capacity to enter into a binding agreement with a
          rescue organization (generally 18 years of age), and individual organizations may impose
          their own minimum age requirements.
        </p>
        <p>
          If you are accessing the App on behalf of a rescue organization, you represent that you
          have the authority to bind that organization to these Terms.
        </p>

        {/* § 2 */}
        <div className="section-header">
          <span className="section-num">02</span>
          <h2>Description of the Service</h2>
          <div className="section-rule" />
        </div>

        <p>
          Zoori is a platform that connects Puerto Rico dog rescue organizations with individuals
          interested in adopting or fostering dogs. The App provides:
        </p>
        <ul className="legal-list">
          <li>A searchable directory of rescue dogs available for adoption or fostering</li>
          <li>Swipe-based and browse-based dog discovery for prospective adopters</li>
          <li>Tools for rescue organizations to manage dog listings, photos, and incoming applications</li>
          <li>A messaging channel between adopters and organizations for each active application</li>
          <li>Push notifications and email updates related to application status and platform activity</li>
          <li>An administrative layer for platform moderation and organization oversight</li>
        </ul>
        <p>
          Zoori is a <strong>technology platform</strong>, not a rescue organization, shelter, or
          animal placement service. We do not own, house, care for, or place any animals. We
          facilitate connections and communications between independent rescue organizations and
          prospective adopters.
        </p>

        {/* § 3 */}
        <div className="section-header">
          <span className="section-num">03</span>
          <h2>Accounts and Registration</h2>
          <div className="section-rule" />
        </div>

        <h3 className="legal-subsection">3.1 Account Creation</h3>
        <p>
          You must create an account to use the App. You agree to provide accurate, current, and
          complete information during registration and to keep that information up to date.
        </p>

        <h3 className="legal-subsection">3.2 Account Security</h3>
        <p>
          You are responsible for safeguarding your password and for all activity that occurs under
          your account. Notify us immediately at{' '}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a> if you suspect unauthorized access to
          your account.
        </p>

        <h3 className="legal-subsection">3.3 One Account Per Person</h3>
        <p>
          You may only maintain one personal account. Organizations may not create multiple accounts
          to circumvent platform decisions.
        </p>

        <h3 className="legal-subsection">3.4 Account Types and Roles</h3>
        <ul className="legal-list">
          <li><strong>Adopter</strong> — An individual seeking to adopt or foster a dog.</li>
          <li><strong>Organization</strong> — A rescue organization that has been approved by platform administrators to post dog listings and manage applications.</li>
          <li><strong>Admin</strong> — {SITE.name} personnel responsible for platform operations and moderation.</li>
        </ul>
        <p>
          Organization accounts must be approved before they can post listings. We reserve the
          right to deny or revoke organization status at our sole discretion.
        </p>

        {/* § 4 */}
        <div className="section-header">
          <span className="section-num">04</span>
          <h2>User Conduct</h2>
          <div className="section-rule" />
        </div>

        <p>You agree not to:</p>
        <ol className="legal-list">
          <li>Provide false, inaccurate, or misleading information in your account, a dog listing, or an adoption application.</li>
          <li>Post dog listings for animals you do not have the right to place, or listings that misrepresent the animal's health, temperament, or history.</li>
          <li>Use the App for commercial purposes unrelated to dog rescue (e.g., selling dogs for profit, breeding sales).</li>
          <li>Harass, threaten, or abuse other users through the messaging or application features.</li>
          <li>Circumvent or attempt to circumvent platform moderation decisions, including account disablements or listing removals.</li>
          <li>Attempt to gain unauthorized access to other accounts, systems, or databases.</li>
          <li>Use automated scripts, bots, or scrapers to access the App or its data.</li>
          <li>Upload content that is unlawful, obscene, defamatory, or that violates any third party's intellectual property rights.</li>
          <li>Use the App in any way that violates applicable federal, Puerto Rico, or local law.</li>
        </ol>

        {/* § 5 */}
        <div className="section-header">
          <span className="section-num">05</span>
          <h2>Organization Responsibilities</h2>
          <div className="section-rule" />
        </div>

        <p>Organizations that use Zoori to post listings agree to the following:</p>
        <ol className="legal-list">
          <li><strong>Accuracy</strong> — All information posted about a dog (health records, temperament, age, status) must be truthful and current. Listings must be updated promptly when a dog's status changes (adopted, no longer available, health update).</li>
          <li><strong>Animal welfare</strong> — Organizations warrant that the animals listed are in their care, that the organization operates lawfully, and that animals are treated in accordance with applicable animal welfare standards.</li>
          <li><strong>Application handling</strong> — Organizations must respond to adoption applications in a timely manner and communicate decisions to applicants through the platform.</li>
          <li><strong>Compliance</strong> — Organizations are solely responsible for ensuring their adoption and fostering processes comply with all applicable laws and regulations in Puerto Rico and any other jurisdiction where they operate.</li>
          <li><strong>External links</strong> — If an organization uses the "external application" mode (directing adopters to a third-party form), that third-party process is governed entirely by the organization and is outside Zoori's control.</li>
        </ol>

        {/* § 6 */}
        <div className="section-header">
          <span className="section-num">06</span>
          <h2>Content You Submit</h2>
          <div className="section-rule" />
        </div>

        <h3 className="legal-subsection">6.1 Your Content</h3>
        <p>
          You retain ownership of content you submit to the App (photos, text, application
          responses, messages). By submitting content, you grant {SITE.name} a non-exclusive,
          worldwide, royalty-free license to store, display, and transmit that content solely as
          necessary to operate the App.
        </p>

        <h3 className="legal-subsection">6.2 Content Standards</h3>
        <p>
          All submitted content must comply with Section 4 (User Conduct). We reserve the right to
          remove any content that violates these Terms or that we determine, in our sole discretion,
          is harmful to the platform or its users.
        </p>

        <h3 className="legal-subsection">6.3 Feedback</h3>
        <p>
          If you provide feedback or suggestions about the App, we may use that feedback without
          obligation or compensation to you.
        </p>

        {/* § 7 */}
        <div className="section-header">
          <span className="section-num">07</span>
          <h2>Platform Moderation</h2>
          <div className="section-rule" />
        </div>

        <p>{SITE.name} may, at its sole discretion:</p>
        <ul className="legal-list">
          <li>Remove or hide dog listings that appear inaccurate, fraudulent, or in violation of these Terms.</li>
          <li>Approve or deny organization registration applications.</li>
          <li>Suspend or terminate user accounts for violations of these Terms or for activity that we determine poses a risk to users or animals.</li>
          <li>Investigate reports of misuse and take appropriate corrective action.</li>
        </ul>
        <p>
          Moderation decisions are made by platform administrators and are logged in an audit trail.
          If your account is disabled, you may contact us to request review.
        </p>

        {/* § 8 */}
        <div className="section-header">
          <span className="section-num">08</span>
          <h2>Third-Party Services and Links</h2>
          <div className="section-rule" />
        </div>

        <p>
          The App integrates with third-party services including Firebase, Expo, Resend, TheDogAPI,
          and optionally RescueGroups.org. Your use of features powered by these services is also
          subject to their respective terms and privacy policies. {SITE.name} is not responsible
          for the practices of third-party services.
        </p>
        <p>
          Organizations using the external application mode may link to third-party adoption forms.
          Zoori is not responsible for any third-party website's content, practices, or your
          interactions with it.
        </p>

        {/* § 9 */}
        <div className="section-header">
          <span className="section-num">09</span>
          <h2>Intellectual Property</h2>
          <div className="section-rule" />
        </div>

        <p>
          The App, its design, branding ("Zoori"), source code, and all content created by{' '}
          {SITE.name} are the intellectual property of {SITE.name}, protected by applicable
          copyright, trademark, and other laws. You may not copy, modify, distribute, or create
          derivative works from our proprietary content without written permission.
        </p>
        <p>
          Breed reference data displayed in the App is sourced from TheDogAPI and is used in
          accordance with their terms of service.
        </p>

        {/* § 10 */}
        <div className="section-header">
          <span className="section-num">10</span>
          <h2>Disclaimers</h2>
          <div className="section-rule" />
        </div>

        <div className="verdict-box warning">
          <p className="legal-allcaps">
            THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS
            OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
            AND NON-INFRINGEMENT.
          </p>
        </div>

        <p>Specifically:</p>
        <ul className="legal-list">
          <li>We do not warrant that the App will be uninterrupted, error-free, or free of viruses or other harmful components.</li>
          <li>We do not verify the accuracy of dog listing information posted by rescue organizations. Prospective adopters are encouraged to independently verify information about a dog before completing an adoption.</li>
          <li>We do not guarantee the outcome of any adoption or fostering arrangement. Adoption and fostering decisions are made entirely between the adopter and the rescue organization.</li>
          <li>Compatibility scores and "For You" recommendations are algorithmic suggestions based on your stated preferences. They are informational only and do not constitute a guarantee of compatibility.</li>
        </ul>

        {/* § 11 */}
        <div className="section-header">
          <span className="section-num">11</span>
          <h2>Limitation of Liability</h2>
          <div className="section-rule" />
        </div>

        <div className="verdict-box warning">
          <p className="legal-allcaps">
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, AN APP IDEA LLC, ITS OFFICERS,
            DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
            SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF DATA, LOSS OF PROFITS,
            PROPERTY DAMAGE, PERSONAL INJURY, OR EMOTIONAL DISTRESS, ARISING OUT OF OR RELATED TO
            YOUR USE OF THE APP OR ANY ANIMAL ADOPTION OR FOSTERING FACILITATED THROUGH THE APP.
          </p>
          <p className="legal-allcaps">
            OUR TOTAL CUMULATIVE LIABILITY FOR ANY CLAIMS ARISING UNDER THESE TERMS SHALL NOT
            EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID US IN THE TWELVE MONTHS PRECEDING THE
            CLAIM, OR (B) ONE HUNDRED U.S. DOLLARS ($100).
          </p>
          <p>
            Some jurisdictions do not allow limitations on certain types of damages; those
            limitations may not apply to you.
          </p>
        </div>

        {/* § 12 */}
        <div className="section-header">
          <span className="section-num">12</span>
          <h2>Indemnification</h2>
          <div className="section-rule" />
        </div>

        <p>
          You agree to defend, indemnify, and hold harmless {SITE.name} and its officers,
          directors, employees, and agents from any claim, liability, damage, loss, or expense
          (including reasonable attorneys' fees) arising out of: (a) your use of the App; (b)
          content you submit; (c) your violation of these Terms; or (d) your violation of any
          applicable law or third-party right.
        </p>

        {/* § 13 */}
        <div className="section-header">
          <span className="section-num">13</span>
          <h2>Account Termination</h2>
          <div className="section-rule" />
        </div>

        <h3 className="legal-subsection">13.1 By You</h3>
        <p>
          You may delete your account at any time from within the App. Deletion removes your
          profile and personal data in accordance with our Privacy Policy. Submitted applications
          and messages may be retained for a limited period for the benefit of the organizations
          involved.
        </p>

        <h3 className="legal-subsection">13.2 By Us</h3>
        <p>
          We may suspend or terminate your account without notice if we determine you have violated
          these Terms or if your account poses a risk to users, animals, or the platform. Where
          feasible, we will provide notice and an opportunity to respond.
        </p>

        <h3 className="legal-subsection">13.3 Effect of Termination</h3>
        <p>
          Upon termination, your right to access the App ceases. Sections 6 (Content), 9
          (Intellectual Property), 10 (Disclaimers), 11 (Limitation of Liability), 12
          (Indemnification), and 15 (Governing Law) survive termination.
        </p>

        {/* § 14 */}
        <div className="section-header">
          <span className="section-num">14</span>
          <h2>Changes to These Terms</h2>
          <div className="section-rule" />
        </div>

        <p>
          We may update these Terms at any time. When we do, we will revise the "Last updated"
          date. For material changes, we will notify you via push notification or email at least
          14 days before the effective date. Continued use of the App after the effective date
          constitutes acceptance of the updated Terms. If you do not agree to updated Terms, you
          must stop using the App and delete your account.
        </p>

        {/* § 15 */}
        <div className="section-header">
          <span className="section-num">15</span>
          <h2>Governing Law and Dispute Resolution</h2>
          <div className="section-rule" />
        </div>

        <p>
          These Terms are governed by the laws of the Commonwealth of Puerto Rico and the federal
          laws of the United States of America, without regard to conflict-of-law provisions.
        </p>
        <p>
          Any dispute arising out of or relating to these Terms or the App that cannot be resolved
          informally shall be subject to binding arbitration administered by the American
          Arbitration Association ("AAA") under its Consumer Arbitration Rules then in effect, with
          proceedings conducted in San Juan, Puerto Rico. The arbitration shall be conducted in
          English or Spanish at the option of the claimant. The AAA's rules are available at
          www.adr.org. Each party is responsible for its own legal fees unless the arbitrator
          awards otherwise. Notwithstanding the foregoing, either party may seek injunctive or
          other equitable relief in any court of competent jurisdiction to prevent irreparable harm
          pending arbitration.
        </p>

        {/* § 16 */}
        <div className="section-header">
          <span className="section-num">16</span>
          <h2>Miscellaneous</h2>
          <div className="section-rule" />
        </div>

        <ul className="legal-list">
          <li><strong>Entire Agreement</strong> — These Terms, together with the Privacy Policy, constitute the entire agreement between you and {SITE.name} regarding the App.</li>
          <li><strong>Severability</strong> — If any provision of these Terms is found unenforceable, the remaining provisions remain in full force.</li>
          <li><strong>No Waiver</strong> — Our failure to enforce any right or provision does not constitute a waiver of that right.</li>
          <li><strong>Assignment</strong> — You may not assign your rights under these Terms without our written consent. We may assign our rights in connection with a merger, acquisition, or sale of assets.</li>
          <li><strong>Language</strong> — These Terms are provided in English. A Spanish translation may be made available for convenience; in the event of conflict, the English version controls.</li>
        </ul>

        {/* § 17 */}
        <div className="section-header">
          <span className="section-num">17</span>
          <h2>Apple App Store Requirements</h2>
          <div className="section-rule" />
        </div>

        <p>
          If you downloaded the App from Apple's App Store, the following terms apply in addition
          to all other terms in this agreement:
        </p>
        <ol className="legal-list">
          <li><strong>Parties</strong> — These Terms are between you and {SITE.name} only. Apple, Inc. is not a party to these Terms and has no obligation whatsoever with respect to the App.</li>
          <li><strong>Scope of license</strong> — Your license to use the App is limited to a non-transferable license to use the App on any Apple-branded product that you own or control, as permitted by the App Store Terms of Service.</li>
          <li><strong>Maintenance and support</strong> — {SITE.name} is solely responsible for providing maintenance and support services for the App. Apple has no obligation whatsoever to furnish any maintenance or support services with respect to the App.</li>
          <li><strong>Warranty</strong> — In the event of any failure of the App to conform to any applicable warranty, you may notify Apple and Apple will refund any applicable purchase price. To the maximum extent permitted by applicable law, Apple has no other warranty obligation with respect to the App.</li>
          <li><strong>Product liability</strong> — {SITE.name}, not Apple, is responsible for addressing any claims by you or any third party relating to the App or your possession and/or use of the App, including product liability claims, consumer protection claims, or intellectual property claims.</li>
          <li><strong>Third-party beneficiary</strong> — Apple and Apple's subsidiaries are third-party beneficiaries of these Terms, and upon your acceptance, Apple will have the right to enforce these Terms against you as a third-party beneficiary.</li>
        </ol>

        {/* § 18 */}
        <div className="section-header">
          <span className="section-num">18</span>
          <h2>Contact Us</h2>
          <div className="section-rule" />
        </div>

        <div className="verdict-box contact">
          <p>
            <strong>{SITE.name}</strong><br />
            Email: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </p>
          <p>For questions about these Terms, contact us at the address above.</p>
        </div>

    </LegalPage>
  )
}
