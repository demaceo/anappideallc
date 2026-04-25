import { SITE } from '../data/site'

// JSON-LD structured data describing An App Idea LLC. Injected into
// index.html so Google sees it on every pre-rendered route.
export function buildStructuredData(): string {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': `${SITE.url}/#org`,
        name: SITE.name,
        url: SITE.url,
        description: SITE.description,
        founder: {
          '@type': 'Person',
          name: SITE.founder.name,
          jobTitle: 'Founder & solo developer',
        },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Denver',
          addressRegion: 'CO',
          addressCountry: 'US',
        },
        email: `mailto:${SITE.email}`,
        slogan: SITE.tagline,
        priceRange: '$$',
        areaServed: 'United States',
        knowsAbout: [
          'Mobile app development',
          'Web app development',
          'MVP development',
          'React',
          'TypeScript',
          'Next.js',
          'PostgreSQL',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE.url}/#website`,
        url: SITE.url,
        name: SITE.name,
        publisher: { '@id': `${SITE.url}/#org` },
      },
    ],
  }
  return JSON.stringify(data)
}

// Per-route metadata. Used by the page components via React 19's
// built-in <title>/<meta> hoisting — no react-helmet needed.
export const META: Record<
  string,
  { title: string; description: string; path: string }
> = {
  '/': {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    path: '/',
  },
  '/about': {
    title: `About — ${SITE.name}`,
    description: `Founder-led, Denver-based dev studio run by ${SITE.founder.name}.`,
    path: '/about',
  },
  '/work': {
    title: `Work — ${SITE.name}`,
    description:
      'Five products shipped end-to-end: Pinpoint, Payback, RentHarbor, Feng Shui, and Yap United.',
    path: '/work',
  },
  '/services': {
    title: `Services — ${SITE.name}`,
    description:
      'MVP development, product & UI engineering, business websites, and data visualization.',
    path: '/services',
  },
  '/process': {
    title: `Process — ${SITE.name}`,
    description:
      'A 4-phase workflow: Discovery → Design → Development → Launch. Each phase ends with a tangible deliverable.',
    path: '/process',
  },
  '/contact': {
    title: `Contact — ${SITE.name}`,
    description: `Got an app or website idea? Send a few sentences. ${SITE.email}.`,
    path: '/contact',
  },
}
