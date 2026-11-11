// Services offered by An App Idea LLC.
//
// Plain offers an owner can pick from, then one for bigger builds. The
// list used to read like a startup menu (MVPs, UI engineering, data
// visualization) next to the offers most owners come for, and "Six ways"
// meant nothing to someone who needed a website. Wording here is the wording
// shown on Home, Services and in the structured data, so write it for the
// owner, not for another developer.

export interface Service {
  id: string
  slug: string
  title: string
  description: string
  features: string[]
  useCases: string[]
  deliverables: string[]
  metric?: { label: string; value: string }
  // One short line under the title in the Home offer list.
  tagline?: string
  // Public price. The sliding-scale discount (SITE.pricing.range) applies to
  // every service, hourly work included.
  price?: { label: string; note?: string }
  // Marks the offer shown after a "Building something bigger?" divider, so the
  // offers most owners come for are not mixed in with custom builds.
  group?: 'bigger'
}

// Keep ids stable: they travel in /contact?service=<id> links and the contact
// API maps them to titles (SERVICE_LABELS in api/contact.ts, which must match).
export const services: Service[] = [
  {
    id: 'business-websites',
    slug: 'business-websites',
    title: 'A Website for Your Business',
    description:
      'A site that shows up when people search for what you do, works on a phone, and lets customers book, call, or message you. Start with one page, or go bigger with a full site. You own it, and I teach you to run it: I bring several years of experience teaching software engineering, so training starts where you are.',
    features: [
      'Looks right and loads fast on any phone',
      'Customers can book, call, or message you',
      'Shows up when people search for what you do',
      'You can change your own prices, photos, and hours',
      'Training included, so you can run it yourself',
    ],
    useCases: [
      'Small businesses getting online or outgrowing a template site',
      'Service businesses that need booking, quotes, or lead capture',
      'Owners who want a site they can actually update themselves',
    ],
    deliverables: [
      'Your live website, in your own accounts',
      'Training so you can update it yourself',
      'Your site set up to be found on Google',
      'Visitor reports ready to read',
    ],
    metric: { label: 'Full site ready in', value: '3–5 weeks' },
    tagline: 'One page or a full site',
    price: {
      label: 'From $699',
      note: 'One-page site: $699. Full multi-page site: $1,500–$3,500. Any page or feature beyond one page moves to the full-site price.',
    },
  },
  {
    id: 'start-right',
    slug: 'start-right',
    title: 'Set Up Your Own Site, the Right Way',
    description:
      'Already want to use Wix or Squarespace? Do it right the first time. In one working session I set up your site properly and get you on Google Maps, so you do not lose a weekend to it. Upgrade later and your fee counts toward a full website.',
    features: [
      'Your builder site set up with the right pages and layout',
      'Your Google Business Profile set up, so you show up on Maps',
      'Clear words for what you do and how to book',
      'A quick walkthrough so you can keep it updated',
    ],
    useCases: [
      'Brand-new businesses on a tight budget',
      'Owners who want to do it themselves, with a pro start',
    ],
    deliverables: [
      'Your builder site, set up and live',
      'Your Google Business Profile, live',
      'Credit toward a full website if you upgrade within 6 months',
    ],
    metric: { label: 'Time', value: 'One session' },
    tagline: 'One session, done',
    price: { label: '$299–$499', note: 'Fixed scope: one session. Your fee counts toward a full website if you upgrade within 6 months.' },
  },
  {
    id: 'site-fixes',
    slug: 'site-fixes',
    title: 'Fix My Existing Site',
    description:
      "Someone else built your site, and now something's broken or customers keep getting stuck. I find the problem and fix it, or tighten up the pages that confuse people, without starting over.",
    features: [
      'Bugs on a site another developer built',
      'Broken forms, booking, or checkout',
      'Pages that look wrong on a phone or load slowly',
      'Pages where visitors get stuck, made clearer',
      'A plain-language note on what was wrong and what changed',
    ],
    useCases: [
      'A bug you noticed that needs fixing now',
      "A site whose original developer isn't answering",
      'Pages that look fine but lose customers',
    ],
    deliverables: [
      'The fix, tested and live',
      'A short write-up of the cause',
      'Notes on anything else that could break',
    ],
    metric: { label: 'Billed', value: 'By the hour' },
    tagline: 'Billed by the hour',
    price: { label: '$110/hour', note: '2-hour minimum ($220). The same rate covers support after launch and work beyond an agreed scope.' },
  },
  {
    id: 'care-plan',
    slug: 'care-plan',
    title: 'Keep It Running: Monthly Care',
    description:
      'You run your business; I keep your site working. Updates, security, small changes, and a plain-English report every month showing the calls and bookings your site brought in.',
    features: [
      'Updates and security checks every month',
      'Small changes to text, photos, prices, and hours',
      'A monthly report in plain English: visitors, calls, bookings',
      'Ongoing work to show up on Google, on the higher plans',
    ],
    useCases: [
      'Owners who would rather not touch the site after launch',
      'Businesses that want steady progress on Google',
    ],
    deliverables: [
      'Monthly updates and checks',
      'A monthly report',
      'Small changes, done for you',
    ],
    metric: { label: 'Commitment', value: 'Month to month' },
    tagline: 'Month to month',
    price: { label: '$150–$400/month', note: 'Search (SEO) work is included on plans from $300/month.' },
  },
  {
    id: 'ai-integration',
    slug: 'ai-integration',
    title: 'AI & Automation for Your Business',
    description:
      'Your website, store, or booking system already works. I connect it to the rest of your tools and add AI where it helps, like answering common questions, replying to routine messages, and sending booking reminders, so leads turn into appointments on their own. No rebuild.',
    features: [
      'A chat helper that answers from your own information, not generic replies',
      'Booking, payments, and messages connected, so nothing is copied by hand',
      'Booking reminders and routine replies sent for you',
      'Fits onto what you already run',
      "Your customers' information stays protected",
      'Spending limits, so costs never surprise you',
    ],
    useCases: [
      'Shops and service businesses whose site works but predates AI',
      'Booking and scheduling systems drowning in routine questions',
      'Owners copying the same details between tools every day',
    ],
    deliverables: [
      'AI and automations live on your site or system',
      'A dashboard showing what it does and what it costs',
      'A walkthrough call so you know how it works',
    ],
    metric: { label: 'Rebuild needed', value: 'None' },
    tagline: 'No rebuild needed',
    price: { label: 'From $1,500', note: 'Priced per project, scoped in writing before work starts.' },
  },
  {
    id: 'custom-builds',
    slug: 'custom-builds',
    group: 'bigger',
    title: 'Apps & Custom Software',
    description:
      'Got an idea for an app, a customer portal, or a dashboard of your numbers? It starts with a Product Sprint: in 1 to 2 weeks you get a scoped plan, a clickable prototype, and a real budget, ready to show a funder, before you spend big. Then I build the version that proves the idea, in milestones you can see.',
    features: [
      'An app for iPhone, Android, or the web',
      'Customer sign-in, accounts, and payments',
      'Dashboards that turn your numbers into charts you can read',
      'Easy to use and accessible to everyone (WCAG AA)',
      'A progress demo every week, so nothing is a surprise',
    ],
    useCases: [
      'Founders with funding and a deadline',
      'Teams pitching to investors with a working demo',
      'Established businesses exploring a new product line',
    ],
    deliverables: [
      'Product Sprint: plan, clickable prototype, and budget',
      'A working app or dashboard, live',
      'Progress reports you can share with funders',
      'Plain-language documentation',
    ],
    // Matches the Process page: Discovery 1–2 + Design 2–3 + Development 4–8
    // weeks. Launch adds another 1–2, so this is time to build, not to launch.
    metric: { label: 'Time to build', value: '7–13 weeks' },
    price: {
      label: 'Sprint $2,500–$4,000',
      note: 'Product Sprint: $2,500–$4,000. App or MVP builds: typically $10,000–$40,000+, billed by milestone.',
    },
  },
]
