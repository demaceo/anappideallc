// Single source of truth for company-wide identifiers used across blocks,
// pages, and SEO metadata. Update here, propagates everywhere.

export const SITE = {
  name: 'An App Idea LLC',
  alternateName: 'Mile High Interface',
  short: 'An App Idea',
  initials: 'AAI',
  domain: 'anappidea.llc',
  url: 'https://anappidea.llc',
  // Share image (og:image / twitter:image), 1200x630. Social platforms cache
  // by URL, so a new banner gets a new filename (og.png -> og-v2.png) and the
  // static copy in index.html is updated by hand to match.
  ogImage: '/og-v2.png',
  email: 'hello@anappidea.llc',
  founder: {
    name: 'Demaceo Vincent Howard',
    jobTitle: 'Founder & CEO',
    location: 'Denver, Colorado',
    // Personal profiles for the founder — attached to the Person node in
    // JSON-LD (not the organization), since they identify the individual.
    github: 'https://github.com/demaceo',
    // Real portrait, resized to two widths (public/founder). Shown beside the
    // intro on Home and About: the site says "I'm a Black founder" and a face
    // is the proof a visitor looks for first.
    photo: {
      src400: '/founder/demaceo-howard-400.webp',
      src800: '/founder/demaceo-howard-800.webp',
      alt: 'Demaceo Vincent Howard, founder of An App Idea LLC',
    },
  },
  // Public profiles for this business. These power two things:
  //   1. The JSON-LD `sameAs` entity links — Google uses these to tie this
  //      domain to the real business in its Knowledge Graph. This is the
  //      single biggest on-page signal for being recognized as a real entity
  //      in search (and AI Overviews) instead of an unknown domain.
  //   2. The social meta tags (twitter:site).
  //
  // ⬇️ FILL IN YOUR REAL PROFILES BELOW. Leave any you don't have as ''.
  // Blank or non-URL entries are filtered out and never shipped, so a
  // placeholder value can't leak into the markup.
  //
  // NOTE: `twitter` is a HANDLE (e.g. '@anappidea'), not a URL — it feeds the
  // twitter:site meta tag. The remaining fields are full profile URLs. The
  // helpers below tolerate either form for `twitter` (handle, bare name, or a
  // pasted x.com/twitter.com URL), so a mix-up degrades gracefully.
  social: {
    twitter: '', // Intentionally empty — the studio isn't on X. Set an '@handle' to enable.
    facebook: 'https://www.facebook.com/profile.php?id=61590729180671',
    instagram: 'https://www.instagram.com/anappidea',
    threads: 'https://www.threads.com/@anappidea',
    tiktok: 'https://www.tiktok.com/@anappidea',
    linkedin: 'https://www.linkedin.com/company/an-app-idea/',
  },
  tagline: 'Got an app idea? Let’s build it.',
  description:
    'Denver studio building websites, mobile apps, and AI for small businesses, with Black and brown business owners in mind. Built for you, then handed to you.',
  // Booking — first consultation is free. Replace `consultationUrl` with your
  // real Calendly (or other) scheduling link; the "Book a consultation"
  // buttons across the site read from here, so updating it once is enough.
  booking: {
    // Also hard-coded as BOOKING_URL in api/contact.ts (the confirmation
    // email) — change both together.
    consultationUrl: 'https://calendly.com/anappidea/30min',
    label: 'A free 30-minute call',
    blurb: 'A free 30-minute call to talk through your idea. No pressure, no spec required.',
    // What happens on the call. Answers the "what am I signing up for?" worry
    // before someone books; shown on Home and Contact.
    callSteps: [
      'You tell me about your business and what is not working.',
      'I tell you honestly whether I am the right fit, and what it would cost.',
      'You leave with a clear next step, even if it is not with me.',
    ],
    callNote: 'Nothing to prepare. Half an idea is plenty.',
  },
  // How money and ownership work. One source for the Services page, so the
  // wording an owner reads is the wording that governs a quote.
  terms: {
    payment: {
      title: 'How you pay',
      body: 'Fixed-price projects are 50% to start and 50% when it launches. You get the full price in writing before you pay anything.',
    },
    ownership: {
      title: 'What you own',
      body: 'Everything. Your domain, your hosting account, and your site\'s code and content are in your name from day one. If we ever stop working together, you keep it all.',
    },
    running: {
      title: 'What it costs to keep running',
      body: 'Hosting is paid straight to the provider, not to me: usually about $20 a month, plus around $15 to $20 a year for your domain. I confirm the exact numbers in your quote. There is no required monthly fee to me.',
    },
    provide: {
      title: 'What I need from you',
      body: 'Your logo, photos, and the basics about your business: services, hours, and how customers reach you. No logo or photos yet? I can create them, and I will tell you the cost up front. You review the site before it goes live.',
    },
    appStores: {
      title: 'App store fees',
      body: 'Publishing an app means paying the stores directly, in your name: Apple charges $99 a year and Google Play charges a one-time $25. Those go to Apple and Google, not to me.',
    },
    afterLaunch: {
      title: 'After it launches',
      body: '30 days of free bug fixes. If something does not work the way we agreed, I fix it at no charge. After that, fixes are $92/hour with a 2-hour minimum.',
    },
  },
  // Cost signal shown on Services and Contact so visitors can self-qualify
  // before booking. Renders nothing while `range` is blank — fill in a real
  // range (e.g. 'MVPs typically run $X–$Y'); never ship a placeholder number.
  pricing: {
    range: 'Sliding scale: 40% off fixed-price projects for businesses in their first year or under $100k in annual revenue.',
    // Optional sentence after the range, e.g. how quotes are scoped.
    note: 'Hourly work is $92/hour and isn’t discounted.',
    // One line under the Home hero buttons: the two facts that answer "can I
    // afford to ask?" before anyone scrolls.
    heroLine: 'Free 30-minute call · 40% off for businesses in their first year or under $100k in revenue',
  },
} as const

// Extracts a bare X/Twitter handle from a configured value. Tolerates a
// leading '@', surrounding whitespace, or a full x.com/twitter.com profile
// URL. Returns '' when nothing usable remains (e.g. '' or a lone '@').
export function xHandle(value: string): string {
  return value
    .trim()
    .replace(/^https?:\/\/(www\.)?(x|twitter)\.com\//i, '')
    .replace(/^@+/, '')
    .replace(/[/?#].*$/, '')
    .trim()
}

// '@handle' form for the twitter:site meta tag, or '' when unset/invalid.
export const TWITTER_HANDLE: string = xHandle(SITE.social.twitter)
  ? `@${xHandle(SITE.social.twitter)}`
  : ''

// Normalizes a configured X/Twitter value into a full profile URL for
// `sameAs`. Returns '' when no real handle can be derived.
function xProfileUrl(value: string): string {
  const handle = xHandle(value)
  return handle ? `https://x.com/${handle}` : ''
}

// Keeps only real, absolute http(s) URLs, dropping unset placeholders ('').
function onlyUrls(values: string[]): readonly string[] {
  return values.filter((url) => /^https?:\/\//.test(url))
}

// Brand profile URLs for the organization's `sameAs` — the signal Google
// uses to corroborate the business identity behind this domain.
export const SAME_AS: readonly string[] = onlyUrls([
  xProfileUrl(SITE.social.twitter),
  SITE.social.facebook,
  SITE.social.instagram,
  SITE.social.threads,
  SITE.social.tiktok,
  SITE.social.linkedin,
])

// Personal profile URLs for the founder's Person node `sameAs`.
export const FOUNDER_SAME_AS: readonly string[] = onlyUrls([
  SITE.founder.github,
])
