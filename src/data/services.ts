// Services offered by An App Idea LLC.
//
// Four plain offers an owner can pick from, then one for bigger builds. The
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
  technologies: string[]
  useCases: string[]
  deliverables: string[]
  metric?: { label: string; value: string }
  // One short line under the title in the Home offer list.
  tagline?: string
  // Public starting price. Rates come from SITE.pricing; the sliding-scale
  // discount (SITE.pricing.range) applies to fixed-price projects only.
  price?: { label: string; note?: string }
  // Marks the offer shown after a "Building something bigger?" divider, so the
  // four offers most owners come for are not mixed in with custom builds.
  group?: 'bigger'
}

export const services: Service[] = [
  {
    id: 'business-websites',
    slug: 'business-websites',
    title: 'A Website for Your Business',
    description:
      'A site that shows up when people search for what you do, works on a phone, and lets customers book, call, or message you. Ready in 3 to 5 weeks. You own it, and I teach you to run it.',
    features: [
      'Looks right and loads fast on any phone',
      'Customers can book, call, or message you',
      'Shows up when people search for what you do',
      'You can change your own prices, photos, and hours',
      'A simple report on who visits and where they come from',
    ],
    technologies: ['Next.js', 'Sanity CMS', 'Contentful', 'Vercel', 'Plausible', 'Schema.org', 'Resend'],
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
    metric: { label: 'Ready in', value: '3–5 weeks' },
    tagline: 'Ready in 3–5 weeks',
    price: { label: 'From $3,700', note: 'With the Own It teaching package: $4,400' },
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
    technologies: ['React', 'Next.js', 'TypeScript', 'HTML & CSS', 'Vercel'],
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
    metric: { label: 'Rush turnaround', value: '1 business day' },
    tagline: 'Rush: 1 business day',
    price: { label: '$92/hour', note: '2-hour minimum ($184). Needed within 1 business day: $138/hour.' },
  },
  {
    id: 'own-it',
    slug: 'own-it',
    title: 'Own It: Learn to Run Your Site',
    description:
      "A separate teaching package for after the build. I teach you to manage your own website, read your analytics, check its performance, and put AI to work in your business, so you're never stuck waiting on someone else to change a price or read your traffic. I bring several years of experience teaching software engineering to a wide range of students, so the sessions start where you are.",
    features: [
      'Updating your own pages, photos, prices, and posts',
      'Reading your visitor numbers: who comes, from where, and what they do',
      'Checking your site is fast, online, and easy to find',
      'Spotting when something breaks and knowing what to do next',
      'Using AI tools in your daily work without exposing customer information',
      'One-on-one sessions at your pace, in plain language',
    ],
    technologies: ['Plausible', 'Google Analytics', 'Google Search Console', 'PageSpeed Insights', 'Your CMS', 'Claude · ChatGPT · Gemini'],
    useCases: [
      'Owners who want to update their own site without calling anyone',
      'Teams who want to understand their numbers, not just receive a report',
      'Businesses ready to use AI but unsure where to start',
    ],
    deliverables: [
      'One-on-one teaching sessions',
      'Written guides for your exact setup',
      'A monthly checklist for your numbers and site health',
      'An AI playbook for your business',
    ],
    metric: { label: 'Goal', value: 'You run it' },
    tagline: 'At your pace',
    price: { label: 'From $750' },
  },
  {
    id: 'ai-integration',
    slug: 'ai-integration',
    title: 'AI for Your Business',
    description:
      'Your website, store, or booking system already works. I add AI to it, like answering common questions, replying to routine messages, and sending booking reminders, and I keep it running. It sits on top of what you already have, so there is no rebuild.',
    features: [
      'A chat helper that answers from your own information, not generic replies',
      'Search that understands what your customers mean',
      'Booking reminders and routine replies sent for you',
      'Fits onto what you already run',
      "Your customers' information stays protected",
      'Spending limits, so costs never surprise you',
    ],
    technologies: ['Gemini', 'Groq', 'ElevenLabs', 'Deepgram', 'Firebase', 'Vercel'],
    useCases: [
      'Shops and service businesses whose site works but predates AI',
      'Booking and scheduling systems drowning in routine questions',
      'Owners who want AI without handing customer data to a third party',
    ],
    deliverables: [
      'AI features live on your site or system',
      'A dashboard showing what it does and what it costs',
      'A walkthrough call so you know how it works',
      'Monthly tuning and updates, and a quarterly cost review',
    ],
    metric: { label: 'Rebuild needed', value: 'None' },
    tagline: 'No rebuild needed',
    price: { label: 'From $4,100' },
  },
  {
    id: 'custom-builds',
    slug: 'custom-builds',
    group: 'bigger',
    title: 'Apps & Custom Software',
    description:
      'Got an idea for an app, a customer portal, or a dashboard of your numbers? I build it from start to finish: design, code, and launch. We begin with the smallest working version that shows people want it, so you do not spend big before you know.',
    features: [
      'An app for iPhone, Android, or the web',
      'Customer sign-in, accounts, and payments',
      'Dashboards that turn your numbers into charts you can read',
      'Easy to use and accessible to everyone (WCAG AA)',
      'A progress demo every week, so nothing is a surprise',
    ],
    technologies: ['Next.js', 'React', 'TypeScript', 'Supabase', 'PostgreSQL', 'Stripe', 'D3.js', 'Recharts', 'Vercel'],
    useCases: [
      'Founders testing whether an idea has customers',
      'Teams pitching to investors with a working demo',
      'Established businesses exploring a new product line',
    ],
    deliverables: [
      'A working app or dashboard, live',
      'Everything customers need to sign in and pay',
      'A plan for growing it',
      'Plain-language documentation',
    ],
    // Matches the Process page: Discovery 1–2 + Design 2–3 + Development 4–8
    // weeks. Launch adds another 1–2, so this is time to build, not to launch.
    metric: { label: 'Time to build', value: '7–13 weeks' },
    price: {
      label: 'From $2,800',
      note: 'Dashboards from $2,800. Apps typically $16,000–$36,000. Interface work by the hour: $92/hour.',
    },
  },
]
