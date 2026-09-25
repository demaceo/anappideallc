import { LegalPage } from '../../components/LegalPage/LegalPage'
import { SocialLinks } from '../../components/SocialLinks/SocialLinks'
import { SITE } from '../../data/site'

const OPERATOR = 'An App Idea LLC'
const CONTACT = SITE.email

export default function PinpointPrivacy() {
  return (
    <>
      <LegalPage
        path="/legal/pinpoint/privacy"
        appLabel="Pinpoint"
        docType="privacy"
        subtitle={`Pinpoint — ${OPERATOR}`}
        dateLine="Effective Date: June 4, 2026 · Last Updated: September 25, 2026"
      >

        <div className="intro-block">
          <p>
            {OPERATOR} operates the Pinpoint app, a civic engagement app that helps you find your
            elected officials, follow the bills they vote on, compare their votes with how you would
            vote, and write to them.
          </p>
        </div>

        <div className="verdict-box note">
          <p>
            By creating an account or using the App, you agree to the practices described in this
            Privacy Policy.
          </p>
        </div>

        {/* § 1 */}
        <div className="section-header">
          <span className="section-num">01</span>
          <h2>Who We Are</h2>
          <div className="section-rule" />
        </div>
        <p>
          {OPERATOR} ("we", "us", or "our") operates the Pinpoint app, a civic engagement app that
          helps you find your elected officials, follow the bills they vote on, compare their votes
          with how you would vote, and write to them.
        </p>
        <div className="verdict-box contact">
          <p>
            <strong>Contact:</strong>{' '}
            <a href={`mailto:${CONTACT}`}>{CONTACT}</a><br />
            <strong>Address:</strong> Denver, CO, U.S.A.
          </p>
        </div>

        {/* § 2 */}
        <div className="section-header">
          <span className="section-num">02</span>
          <h2>What Data We Collect</h2>
          <div className="section-rule" />
        </div>

        <h3 className="legal-subsection">Account Information</h3>
        <ul className="legal-list">
          <li>First name and last name, which you enter when you sign up and can change later</li>
          <li>Email address (from your sign-in provider)</li>
          <li>
            Postcode / ZIP code (optional). You can enter it when you sign up, when the app asks
            where you are, or in the You tab. We save it to your account to find your
            representatives.
          </li>
          <li>Your sign-in provider (Google Sign-In or Apple Sign-In) and your Firebase user ID</li>
          <li>Whether you want push notifications</li>
        </ul>
        <p>
          We do not collect or store passwords. Sign-in is handled entirely by Google or Apple.
        </p>

        <h3 className="legal-subsection">Location Data</h3>
        <ul className="legal-list">
          <li>
            With your permission, the app reads your device's location to find the officials who
            represent you. It asks for an approximate fix, not continuous tracking.
          </li>
          <li>
            The app sends those coordinates to our servers, which match them against district maps.
            When our maps don't cover a location, our servers send the coordinates, rounded to about
            11 meters, to OpenStates to find your officials.
          </li>
          <li>
            The app also sends your coordinates directly to Nominatim (OpenStreetMap) to turn them
            into a street, city, state and ZIP code. It uses Nominatim to look up a ZIP code you
            type and to draw your city's boundary on the district map, too.
          </li>
          <li>
            We don't store your coordinates on our servers. Your device keeps your most recently
            confirmed location so the app can open where you left off, until you delete your account
            or the app.
          </li>
          <li>
            You can decline or revoke location access at any time in your device settings and enter
            a ZIP code instead.
          </li>
        </ul>

        <h3 className="legal-subsection">Bill Votes</h3>
        <p>
          When you vote on a bill (yes, no, or abstain), we save your vote to your account along
          with the bill's number and title. A vote on a bill is final: it can't be changed or
          deleted afterwards, except by deleting your account. Your vote is counted in that bill's
          anonymous tally, which is shown only to people who have voted on the bill themselves and
          only once at least ten people have. We also use your votes to show how your officials voted
          compared with you, and to tell you when a bill you voted on reaches a final outcome, such
          as becoming law or failing. We don't show your individual votes to other users.
        </p>

        <h3 className="legal-subsection">Officials and Bills You Follow</h3>
        <p>
          When you follow an official or a bill, we save that to your account with its name or
          title. We use your follows to decide what appears in your Activity. Other users see only
          how many people follow something, and only once at least ten people do.
        </p>

        <h3 className="legal-subsection">Activity and Push Notifications</h3>
        <ul className="legal-list">
          <li>
            We create notifications about the officials and bills you follow or voted on (for
            example, "Sen. Smith voted Yes on H.R. 1") and store them with your account so you can
            see them in Activity.
          </li>
          <li>
            If you allow push notifications, we store your device's push token and its platform
            (iOS or Android). To deliver a notification, we send the token and the notification's
            text to Expo's push service, which passes it to Apple or Google for delivery.
          </li>
          <li>
            You can turn push notifications off in the You tab or in your device settings. Signing
            out removes this device's push token from your account.
          </li>
        </ul>

        <h3 className="legal-subsection">Writing to Your Officials</h3>
        <p>
          Pinpoint helps you draft a message to an official, then copies it to your clipboard and
          opens it in your own email app. Pinpoint doesn't send the message and never receives its
          contents. To show you how to reach an official, the app asks our servers for their
          contact details by the official's ID. Your device keeps a record of the messages you
          drafted (the official, the topic and the text) and any follow-up reminders you set. They
          stay on the device until you delete your account or the app.
        </p>

        <h3 className="legal-subsection">Ballot Lookup</h3>
        <p>
          If you choose to look up your ballot, you type your home address. The app saves it on
          your device and sends it to our servers, which send it to Google's Civic Information API
          to find your upcoming elections, ballot and polling place. Our servers keep that answer in
          memory for up to six hours so repeat lookups are fast, and don't save your address.
          Signing out removes the address from your device. Any notes or choices you record for
          your ballot stay on your device only and are never sent to us; signing out removes them
          as well.
        </p>

        <h3 className="legal-subsection">Survey Answers and Results</h3>
        <p>
          If you take Pinpoint's political affiliation or political philosophy survey, we save your
          answer to each statement (how strongly you agree or disagree) and your results to your
          account. Questions you skip aren't saved. Because survey answers can reveal your political
          opinions and beliefs, we treat them as sensitive. We use them to show you your results. We
          also keep your answers for AI Vote Assist, an optional feature that isn't available yet.
          It will use them only if you turn it on, and we will describe it in this policy before it
          launches. We don't show your individual answers or results to other users. The only
          survey information anyone else sees is anonymous averages across everyone who has taken a
          survey, shown only after at least five people have taken it. Your device also keeps a copy
          of your answers so a retake can start from them; signing out removes it.
        </p>

        <h3 className="legal-subsection">Information That Stays on Your Device</h3>
        <p>
          Some things never leave your device: the keyword filters you save on the Bills tab, your
          theme and display settings, and which introductions you have already seen.
        </p>

        <h3 className="legal-subsection">Technical Information</h3>
        <ul className="legal-list">
          <li>
            Pinpoint contains no analytics, advertising, tracking or crash-reporting tools.
          </li>
          <li>
            Our servers log each request for security and troubleshooting: the page requested
            (without the details you entered), the result, how long it took, and the app's user
            agent, which can name the app and your device's operating system. Our hosting provider may
            also record your IP address. We use IP addresses briefly to limit how quickly requests
            can be made.
          </li>
          <li>
            When the app opens, it checks Expo's update service for a newer version. That request
            tells Expo your platform, the app's version and an identifier for this installation.
          </li>
        </ul>

        {/* § 3 */}
        <div className="section-header">
          <span className="section-num">03</span>
          <h2>How We Use Your Data</h2>
          <div className="section-rule" />
        </div>
        <ul className="legal-list">
          <li>To identify your elected officials from your location or ZIP code</li>
          <li>
            To show you the bills your officials vote on, record your own votes, and compare the
            two
          </li>
          <li>To keep your Activity up to date and send the notifications you asked for</li>
          <li>To help you draft messages to officials and remind you to follow up</li>
          <li>To look up your ballot when you ask</li>
          <li>To show you your survey results</li>
          <li>To show anonymous totals that never identify anyone</li>
          <li>To maintain the security and reliability of the service and prevent abuse</li>
          <li>To comply with legal obligations</li>
        </ul>

        {/* § 4 */}
        <div className="section-header">
          <span className="section-num">04</span>
          <h2>Data Storage and Retention</h2>
          <div className="section-rule" />
        </div>
        <ul className="legal-list">
          <li>
            Our servers and database run on US-based infrastructure hosted by Railway. Sign-in and
            push tokens are handled by Firebase (Google).
          </li>
          <li>
            We keep your account information, votes, follows and notifications until you delete your
            account. We keep your survey answers and results until you delete them or your account.
          </li>
          <li>
            Our hosting provider keeps server logs for a limited period, after which they are
            deleted.
          </li>
          <li>
            Data stored on your device is described in section 02. Signing out clears your cached
            account data, your ballot address and notes, and your survey answers. Deleting your
            account clears the rest, except display settings such as your theme. Deleting the app
            removes everything it stored on the device.
          </li>
          <li>
            Earlier versions of Pinpoint had community features: Pinboard issues and group
            messages. If you posted there, that content is kept. When you delete your account, we
            replace your name on it with "Former member" and remove your backings and group
            memberships.
          </li>
        </ul>

        {/* § 5 */}
        <div className="section-header">
          <span className="section-num">05</span>
          <h2>Third-Party Services</h2>
          <div className="section-rule" />
        </div>
        <p>
          We use the following third-party services to operate the app. Your data may be transmitted
          to these services as necessary:
        </p>
        <div className="legal-table-wrap">
          <table className="legal-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Purpose</th>
                <th>Data Shared</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Firebase</strong> (Google)</td>
                <td>Sign-in, and storing push tokens</td>
                <td>Email, name, Firebase user ID, push token</td>
              </tr>
              <tr>
                <td><strong>Google Sign-In</strong> / <strong>Sign in with Apple</strong></td>
                <td>Signing in</td>
                <td>What you choose to share with the sign-in provider</td>
              </tr>
              <tr>
                <td><strong>Railway</strong></td>
                <td>Hosting our servers, database and server logs</td>
                <td>The account, vote, follow, notification and survey data described above</td>
              </tr>
              <tr>
                <td><strong>Expo</strong></td>
                <td>Delivering push notifications, and app updates</td>
                <td>Push token and notification text; platform, app version and an installation identifier</td>
              </tr>
              <tr>
                <td>
                  <strong>Apple</strong> and <strong>Google</strong>
                  <br />
                  <span className="legal-table-note">(push delivery)</span>
                </td>
                <td>Delivering push notifications to your device</td>
                <td>Push token and notification text</td>
              </tr>
              <tr>
                <td><strong>Google Civic Information API</strong></td>
                <td>Finding your elections, ballot and polling place</td>
                <td>The address you type for a ballot lookup</td>
              </tr>
              <tr>
                <td><strong>Nominatim</strong> (OpenStreetMap)</td>
                <td>
                  Turning coordinates into an address, looking up ZIP codes, and city boundaries
                </td>
                <td>
                  Coordinates or ZIP code, sent directly from your device (so Nominatim also sees
                  your IP address)
                </td>
              </tr>
              <tr>
                <td><strong>OpenStates</strong></td>
                <td>Elected official and legislative data</td>
                <td>
                  Coordinates rounded to about 11 meters, only when our own district maps don't
                  cover your location
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          We also read public legislative and election data from Congress.gov, the U.S. Senate and
          the Federal Election Commission. We send them no information about you.
        </p>

        {/* § 6 */}
        <div className="section-header">
          <span className="section-num">06</span>
          <h2>Sharing and Disclosure</h2>
          <div className="section-rule" />
        </div>
        <ul className="legal-list">
          <li>We do not sell your personal data, or use it for advertising or tracking.</li>
          <li>
            Other users never see your individual votes, follows, survey answers or results. They
            see only anonymous totals, each withheld until enough people have contributed that it
            can't point to anyone.
          </li>
          <li>
            A small number of authorized administrators can see account details (name, email, and
            account status) to operate the service and handle abuse. Administrative changes to an
            account are logged.
          </li>
          <li>
            We may disclose data if required by law, or to protect the rights, safety, and security
            of our users and the service.
          </li>
        </ul>

        {/* § 7 */}
        <div className="section-header">
          <span className="section-num">07</span>
          <h2>Your Rights</h2>
          <div className="section-rule" />
        </div>
        <ul className="legal-list">
          <li>
            <strong>Access:</strong> You may request a copy of your data by contacting us at{' '}
            <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
          </li>
          <li>
            <strong>Deletion:</strong> You can delete your account in the app (You tab → Delete
            account), or ask us to by email. Deleting your account removes your profile, votes,
            follows, notifications, survey data and push tokens from our servers, and clears the
            data the app stored on your device.
          </li>
          <li>
            <strong>Survey data:</strong> To delete a survey's answers and results, open your
            results in the You tab and choose "Delete my results." This removes them from our
            servers and from your device. You can also delete your whole account in the app (You
            tab → Delete account), which removes all of your survey data along with the rest of your
            account.
          </li>
          <li>
            <strong>Location:</strong> You may withdraw location permission at any time in your
            device settings, or enter your ZIP code manually instead.
          </li>
          <li>
            <strong>Notifications:</strong> You can turn push notifications off in the You tab or in
            your device settings.
          </li>
          <li>
            <strong>Sign out:</strong> Signing out clears your cached account data, ballot address
            and notes, and survey answers from the device. Deleting the app removes all locally
            stored data.
          </li>
        </ul>

        {/* § 8 */}
        <div className="section-header">
          <span className="section-num">08</span>
          <h2>Children's Privacy</h2>
          <div className="section-rule" />
        </div>
        <p>
          The app is not intended for children under 13. We do not knowingly collect data from
          children under 13. If you believe a child under 13 has provided us with personal data,
          please contact us and we will delete it.
        </p>

        {/* § 9 */}
        <div className="section-header">
          <span className="section-num">09</span>
          <h2>Changes to This Policy</h2>
          <div className="section-rule" />
        </div>
        <p>
          We may update this policy from time to time. Changes will be posted in-app and on our
          website, and we will update the "Last Updated" date above. Continued use of the app after
          changes take effect constitutes acceptance of the updated policy.
        </p>

        {/* § 10 */}
        <div className="section-header">
          <span className="section-num">10</span>
          <h2>Contact Us</h2>
          <div className="section-rule" />
        </div>

        <div className="verdict-box contact">
          <p>
            <strong>{OPERATOR}</strong><br />
            Email: <a href={`mailto:${CONTACT}`}>{CONTACT}</a><br />
            Address: Denver, CO, U.S.A.
          </p>
          <p>
            For questions about this Privacy Policy or to exercise your data rights, contact us at
            the address above. We will respond within 30 days.
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
