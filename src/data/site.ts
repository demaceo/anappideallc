// Single source of truth for company-wide identifiers used across blocks,
// pages, and SEO metadata. Update here, propagates everywhere.

export const SITE = {
  name: 'An App Idea LLC',
  short: 'An App Idea',
  initials: 'AAI',
  domain: 'anappidea.llc',
  url: 'https://www.anappidea.llc',
  email: 'hello@milehighinterface.com',
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
    'Dev studio in Denver helping founders ship mobile apps and websites — from interface to database to launch.',
  // Booking — first consultation is free. Replace `consultationUrl` with your
  // real Calendly (or other) scheduling link; the "Book a consultation"
  // buttons across the site read from here, so updating it once is enough.
  booking: {
    consultationUrl: 'https://calendly.com/anappidea/intro-consultation',
    label: 'Book a free consultation',
    blurb: 'A free 30-minute call to talk through your idea — no pressure, no spec required.',
  },
} as const
