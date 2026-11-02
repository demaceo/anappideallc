import { LegalPage } from '../../components/LegalPage/LegalPage'
import { SocialLinks } from '../../components/SocialLinks/SocialLinks'
import { SITE } from '../../data/site'

const OPERATOR = 'An App Idea LLC'
const CONTACT = SITE.email

export default function PinpointTerms() {
  return (
    <>
      <LegalPage
        path="/legal/pinpoint/terms"
        appLabel="Pinpoint"
        docType="terms"
        subtitle={`Pinpoint — ${OPERATOR}`}
        dateLine="Effective Date: June 4, 2026 · Last Updated: November 2, 2026"
      >

        <div className="intro-block">
          <p>
            By creating an account or using the Pinpoint app, you agree to these Terms of Service
            and our{' '}
            <a href="/legal/pinpoint/privacy">Privacy Policy</a>.
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
          By creating an account or using the Pinpoint app, you agree to these Terms of Service and
          our{' '}
          <a href="/legal/pinpoint/privacy">Privacy Policy</a>.
        </p>

        {/* § 2 */}
        <div className="section-header">
          <span className="section-num">02</span>
          <h2>Eligibility</h2>
          <div className="section-rule" />
        </div>
        <p>
          You must be at least 13 years old to use the app. By using the app, you represent that
          you meet this requirement.
        </p>

        {/* § 3 */}
        <div className="section-header">
          <span className="section-num">03</span>
          <h2>Account Responsibilities</h2>
          <div className="section-rule" />
        </div>
        <ul className="legal-list">
          <li>
            You sign in using Google Sign-In or Apple Sign-In and provide your first and last name (and, optionally, your postcode) during onboarding. You agree to provide accurate information.
          </li>
          <li>
            You are responsible for maintaining the security of the third-party account you use to sign in.
          </li>
          <li>
            You are responsible for all activity that occurs under your account.
          </li>
          <li>
            You must not create multiple accounts, for example to vote on a bill more than once or to get around usage limits.
          </li>
        </ul>

        {/* § 4 */}
        <div className="section-header">
          <span className="section-num">04</span>
          <h2>Acceptable Use</h2>
          <div className="section-rule" />
        </div>
        <p>You agree not to:</p>
        <ul className="legal-list">
          <li>
            Impersonate government officials, representatives, or other people
          </li>
          <li>
            Use messages drafted in the app to send abusive, threatening, fraudulent, spam, or unlawful messages to officials
          </li>
          <li>
            Send messages on behalf of anyone other than yourself, or misrepresent your identity to an official
          </li>
          <li>
            Attempt to manipulate vote tallies, follower counts, survey averages, or other figures shown in the app
          </li>
          <li>
            Get around rate limits, usage limits, or other safeguards
          </li>
          <li>
            Use the app for commercial solicitation, advertising, or spam
          </li>
          <li>
            Interfere with the app's operation, security, or other users' experience
          </li>
        </ul>

        {/* § 5 */}
        <div className="section-header">
          <span className="section-num">05</span>
          <h2>Writing to Officials</h2>
          <div className="section-rule" />
        </div>
        <ul className="legal-list">
          <li>
            The app helps you draft a message to an elected official. Message templates are a starting point; you are responsible for reviewing and editing your message.
          </li>
          <li>
            Pinpoint does not send messages for you. It copies your draft to your clipboard and opens it in your own email app, and you send it from your own account. You are solely responsible for the messages you send.
          </li>
          <li>
            Official contact details come from public sources and may be out of date. We do not guarantee that any official will receive, read, or respond to your message.
          </li>
        </ul>

        {/* § 6 */}
        <div className="section-header">
          <span className="section-num">06</span>
          <h2>Bill Votes and Surveys</h2>
          <div className="section-rule" />
        </div>
        <ul className="legal-list">
          <li>
            Votes you cast on bills in Pinpoint are a personal record. They are not official votes, are not submitted to any government body, and have no legal effect.
          </li>
          <li>
            A vote on a bill is final: it can't be changed or deleted afterwards, except by deleting your account.
          </li>
          <li>
            Vote tallies and survey averages shown in the app are anonymous and reflect only Pinpoint users who took part. They are not polls of any wider population.
          </li>
          <li>
            Pinpoint’s political affiliation and political philosophy surveys are for your own reflection. Their results are not professional, legal, or political advice.
          </li>
        </ul>

        {/* § 7 */}
        <div className="section-header">
          <span className="section-num">07</span>
          <h2>AI Vote Assist</h2>
          <div className="section-rule" />
        </div>
        <ul className="legal-list">
          <li>
            AI Vote Assist is optional. It stays off unless you turn it on and agree to the screen that names the AI provider. The <a href="/legal/pinpoint/privacy">Privacy Policy</a> describes what is sent to that provider.
          </li>
          <li>
            Its suggestions are generated by an AI model from your own survey answers and notes. They may be inaccurate, incomplete, or a poor fit for your views, and they are not advice or an endorsement by us.
          </li>
          <li>
            You review every suggestion. Only votes you approve or choose yourself are cast, and you are responsible for them.
          </li>
          <li>
            We may limit how often you can use AI Vote Assist, and may change or withdraw it.
          </li>
        </ul>

        {/* § 8 */}
        <div className="section-header">
          <span className="section-num">08</span>
          <h2>Your Content</h2>
          <div className="section-rule" />
        </div>
        <ul className="legal-list">
          <li>
            You retain ownership of the notes you write and any other content you create in the app. Your notes are private to you.
          </li>
          <li>
            Earlier versions of Pinpoint had community features (Pinboard issues and group messages), which have been retired. Content you posted there is kept as described in the <a href="/legal/pinpoint/privacy">Privacy Policy</a>, and you grant {OPERATOR} a non-exclusive, royalty-free license to store and display it for that purpose.
          </li>
          <li>
            We may remove or restrict content that violates these terms or applicable law.
          </li>
        </ul>

        {/* § 9 */}
        <div className="section-header">
          <span className="section-num">09</span>
          <h2>Civic Data and Information</h2>
          <div className="section-rule" />
        </div>
        <ul className="legal-list">
          <li>
            Information about elected officials, districts, legislation, elections, ballots, and polling places comes from third-party sources (including OpenStates and the Google Civic Information API) and may not always be current, complete, or accurate.
          </li>
          <li>
            We do not guarantee the accuracy, completeness, or timeliness of any civic data displayed in the app.
          </li>
          <li>
            The app is not a substitute for official government sources. Confirm election dates, ballot contents, and polling places with your local election office before you vote.
          </li>
        </ul>

        {/* § 10 */}
        <div className="section-header">
          <span className="section-num">10</span>
          <h2>Account Termination</h2>
          <div className="section-rule" />
        </div>
        <ul className="legal-list">
          <li>
            You can delete your account at any time in the app (You tab → Delete account) or by contacting us at{' '}
            <a href={`mailto:${CONTACT}`}>{CONTACT}</a>. Deletion removes your server-side data and clears data the app stored on your device, as described in the Privacy Policy.
          </li>
          <li>
            We may suspend or terminate accounts that violate these terms, engage in abusive behavior, or are used for purposes inconsistent with the app's civic engagement mission.
          </li>
        </ul>

        {/* § 11 */}
        <div className="section-header">
          <span className="section-num">11</span>
          <h2>Intellectual Property</h2>
          <div className="section-rule" />
        </div>
        <ul className="legal-list">
          <li>
            The Pinpoint app, its design, features, and original content are owned by {OPERATOR}.
          </li>
          <li>
            Public civic data displayed in the app is sourced from third-party providers and is
            subject to their respective terms.
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
            THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EPRESS
            OR IMPLIED. WE DO NOT WARRANT THAT THE APP WILL BE UNINTERRUPTED OR ERROR-FREE, THAT
            MESSAGES TO OFFICIALS WILL BE ANSWERED, OR THAT CIVIC DATA WILL BE
            ACCURATE OR CURRENT. WE ARE NOT LIABLE FOR AI VOTE ASSIST SUGGESTIONS, THE CONTENT
            OF MESSAGES YOU SEND, OR THIRD-PARTY DATA.
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
            TO THE MAIMUM ETENT PERMITTED BY APPLICABLE LAW, AN APP IDEA LLC SHALL NOT
            BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES
            ARISING FROM YOUR USE OF THE APP, INCLUDING BUT NOT LIMITED TO RELIANCE ON CIVIC DATA,
            MESSAGES SENT TO OFFICIALS, OR AI VOTE ASSIST SUGGESTIONS.
          </p>
        </div>

        {/* § 14 */}
        <div className="section-header">
          <span className="section-num">14</span>
          <h2>Governing Law</h2>
          <div className="section-rule" />
        </div>
        <p>
          These terms are governed by the laws of the <strong>State of Colorado</strong>, U.S.A.,
          without regard to conflict of law principles.
        </p>

        {/* § 15 */}
        <div className="section-header">
          <span className="section-num">15</span>
          <h2>Changes</h2>
          <div className="section-rule" />
        </div>
        <p>
          We may update these terms from time to time. Material changes will be communicated
          through the app, and we will update the "Last Updated" date above. Continued use of the app
          after changes take effect constitutes acceptance of the updated terms.
        </p>

        {/* § 16 */}
        <div className="section-header">
          <span className="section-num">16</span>
          <h2>Contact</h2>
          <div className="section-rule" />
        </div>
        <div className="verdict-box contact">
          <p>
            For questions about these terms, contact{' '}
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
              Pinpoint
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
              June 4, 2026
            </li>
            <li>
              <strong>Contact</strong>
              {CONTACT}
            </li>
          </ul>
          <SocialLinks />
        </div>
      </footer>
    </>
  )
}
