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
    twitter: '', // X/Twitter handle, e.g. '@anappidea'
    facebook: '', // e.g. 'https://www.facebook.com/anappidea'
    instagram: '', // e.g. 'https://www.instagram.com/anappidea'
    linkedin: '', // e.g. 'https://www.linkedin.com/company/anappidea'
    github: '', // e.g. 'https://github.com/demaceo'
  },
  tagline: 'Got an app idea? Let’s build it.',
  description:
    'Dev studio in Denver helping founders ship mobile apps and websites — from interface to database to launch.',
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

// Verified profile URLs Google can use to corroborate the business identity.
// Only real, absolute http(s) URLs survive the filter, so unset placeholders
// ('') are dropped automatically.
export const SAME_AS: readonly string[] = [
  xProfileUrl(SITE.social.twitter),
  SITE.social.facebook,
  SITE.social.instagram,
  SITE.social.linkedin,
  SITE.social.github,
].filter((url) => /^https?:\/\//.test(url))
