// Single source of truth for company-wide identifiers used across blocks,
// pages, and SEO metadata. Update here, propagates everywhere.

export const SITE = {
  name: 'An App Idea LLC',
  short: 'An App Idea',
  initials: 'AAI',
  domain: 'anappidea.llc',
  url: 'https://www.anappidea.llc',
  email: 'hello@anappidea.llc',
  founder: {
    name: 'Demaceo Vincent',
    location: 'Denver, Colorado',
    // Personal profiles for the founder — attached to the Person node in
    // JSON-LD (not the organization), since they identify the individual.
    github: 'https://github.com/demaceo',
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
    linkedin: '', // e.g. 'https://www.linkedin.com/company/anappidea'
  },
  tagline: 'Got an app idea? Let’s build it.',
  description:
    'Denver dev studio building AI-native mobile apps with privacy built in: real-time AI features, on-device encryption, shipped end-to-end by one builder.',
  // Booking — first consultation is free. Replace `consultationUrl` with your
  // real Calendly (or other) scheduling link; the "Book a consultation"
  // buttons across the site read from here, so updating it once is enough.
  booking: {
    consultationUrl: 'https://calendly.com/demaceo-milehighinterface/30min',
    label: 'Book a free consultation',
    blurb: 'A free 30-minute call to talk through your idea. No pressure, no spec required.',
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
