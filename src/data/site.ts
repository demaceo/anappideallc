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
  // ⬇️ FILL IN THE REAL URLS BELOW. Leave any you don't have as ''.
  // Blank or non-URL entries are filtered out by SAME_AS and never shipped,
  // so a placeholder value can't leak into the markup.
  social: {
    twitter: '', // e.g. '@anappidea' — powers twitter:site meta + X sameAs link
    facebook: '', // e.g. 'https://www.facebook.com/anappidea'
    instagram: '', // e.g. 'https://www.instagram.com/anappidea'
    linkedin: '', // e.g. 'https://www.linkedin.com/company/anappidea'
    github: '', // e.g. 'https://github.com/demaceo'
  },
  tagline: 'Got an app idea? Let’s build it.',
  description:
    'Dev studio in Denver helping founders ship mobile apps and websites — from interface to database to launch.',
} as const

// Normalizes an X/Twitter @handle into a full profile URL for `sameAs`.
function xProfileUrl(handle: string): string {
  return handle ? `https://x.com/${handle.replace(/^@/, '')}` : ''
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
