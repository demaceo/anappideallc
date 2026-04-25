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
  social: {
    // Placeholders — update when handles are claimed.
    twitter: '@anappidea',
    github: 'https://github.com/',
  },
  tagline: 'Got an app idea? Let’s build it.',
  description:
    'Solo dev studio in Denver helping founders ship mobile apps and websites — from interface to database to launch.',
} as const
