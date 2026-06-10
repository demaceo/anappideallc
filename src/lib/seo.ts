import { SITE, SAME_AS, FOUNDER_SAME_AS } from '../data/site'
import { services } from '../data/services'
import { caseStudies } from '../data/case-studies'
import { processSteps } from '../data/process'

// Per-route metadata. Used by RouteHead via React 19's built-in
// <title>/<meta> hoisting. Titles are keyword-first; descriptions
// are intent-driven and sized for SERP truncation (~155 chars).
export const META: Record<string, { title: string; description: string; path: string }> = {
  '/': {
    title: `${SITE.name} — Mobile App & Web Dev Studio | Denver, CO`,
    description:
      'Denver dev studio building mobile apps, MVPs, and web products end-to-end. Founder-led by Demaceo Vincent. React Native, TypeScript, full-stack. 5 products shipped. MVPs in 6–8 weeks.',
    path: '/',
  },
  '/about': {
    title: `About — Demaceo Vincent, App Developer | ${SITE.name}`,
    description:
      'Demaceo Vincent builds mobile apps and web products from interface to deployment. Founder-led, Denver-based. Interface design, backend, auth, CI/CD — one builder, no handoffs.',
    path: '/about',
  },
  '/work': {
    title: `Work — 5 Shipped Mobile Apps & Web Products | ${SITE.name}`,
    description:
      '5 apps shipped solo: Pinpoint (civic AI), Payback (privacy analytics), RentHarbor (PropTech), Feng Shui (spatial AI), Yap United (live translation). React Native, TypeScript, full-stack.',
    path: '/work',
  },
  '/services': {
    title: `Services — Mobile App, MVP & Web Development | ${SITE.name}`,
    description:
      'Mobile app development, MVP validation, product & UI engineering, and data visualization. React Native, Next.js, TypeScript, Supabase. MVPs launch in 6–8 weeks from first conversation.',
    path: '/services',
  },
  '/process': {
    title: `Development Process — Discovery to Launch | ${SITE.name}`,
    description:
      '4-phase development process: Discovery (1–2 wks), Design (2–3 wks), Development (4–8 wks), Launch. Every phase ends with a tangible deliverable. Built for founders who want full visibility.',
    path: '/process',
  },
  '/contact': {
    title: `Hire a Mobile App Developer | ${SITE.name} — Denver, CO`,
    description:
      'Ready to build your mobile app or website? Contact Demaceo Vincent at An App Idea LLC. Early-stage conversations welcome. MVPs in 6–8 weeks. Reply within 1–2 business days.',
    path: '/contact',
  },
}

// Base graph present on every page: ProfessionalService + WebSite.
function buildBaseGraph(): object[] {
  return [
    {
      '@type': 'ProfessionalService',
      '@id': `${SITE.url}/#org`,
      name: SITE.name,
      url: SITE.url,
      description: SITE.description,
      founder: {
        '@type': 'Person',
        '@id': `${SITE.url}/#founder`,
        name: SITE.founder.name,
        jobTitle: 'Founder & Software Developer',
        worksFor: { '@id': `${SITE.url}/#org` },
        // Founder's personal profiles (e.g. GitHub) live on the Person, not
        // the org. Omitted entirely until at least one is configured.
        ...(FOUNDER_SAME_AS.length ? { sameAs: FOUNDER_SAME_AS } : {}),
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Denver',
        addressRegion: 'CO',
        addressCountry: 'US',
      },
      email: SITE.email,
      // sameAs ties this domain to the business's verified profiles, the
      // strongest on-page signal for Knowledge Graph entity recognition.
      // Omitted entirely until at least one real profile URL is configured.
      ...(SAME_AS.length ? { sameAs: SAME_AS } : {}),
      slogan: SITE.tagline,
      priceRange: '$$',
      areaServed: { '@type': 'Country', name: 'United States' },
      knowsAbout: [
        'Mobile app development',
        'Web app development',
        'MVP development',
        'React Native',
        'React',
        'TypeScript',
        'Next.js',
        'PostgreSQL',
        'iOS development',
        'Android development',
        'Full-stack development',
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Development Services',
        itemListElement: services.map((s, i) => ({
          '@type': 'Offer',
          position: i + 1,
          itemOffered: {
            '@type': 'Service',
            name: s.title,
            description: s.description,
          },
        })),
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.name,
      publisher: { '@id': `${SITE.url}/#org` },
    },
  ]
}

// Page-specific schema nodes keyed by route.
function buildPageGraph(route: string): object[] {
  const meta = META[route] ?? META['/']
  const url = `${SITE.url}${route === '/' ? '' : route}`

  switch (route) {
    case '/':
      return [
        {
          '@type': 'WebPage',
          '@id': `${url}/#webpage`,
          url,
          name: meta.title,
          description: meta.description,
          isPartOf: { '@id': `${SITE.url}/#website` },
          about: { '@id': `${SITE.url}/#org` },
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'How long does it take to build a mobile app MVP?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Most MVPs take 6–8 weeks from first conversation to production deploy — covering discovery, design, development, and launch. AI-integrated or multi-platform builds typically run 10–12 weeks.',
              },
            },
            {
              '@type': 'Question',
              name: 'What does An App Idea LLC build?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'An App Idea LLC builds mobile apps (iOS and Android via React Native), web applications, MVPs, and data visualization tools. The studio is founder-led by Demaceo Vincent, based in Denver, CO.',
              },
            },
            {
              '@type': 'Question',
              name: 'What technologies do you use?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Primary stack: React Native and Expo for mobile, Next.js and React for web, TypeScript throughout, PostgreSQL and Supabase for data, Vercel for deployment. AI features use Gemini and ElevenLabs.',
              },
            },
            {
              '@type': 'Question',
              name: 'Do you work with early-stage founders?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: "Yes — early-stage conversations are welcome. No finished spec or deck required. The first conversation is about figuring out fit. Send a few sentences about your idea and we'll go from there.",
              },
            },
            {
              '@type': 'Question',
              name: 'Do you work remotely?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. The studio is based in Denver, CO, but works with founders remotely across US, UK, and international time zones without friction.',
              },
            },
          ],
        },
      ]

    case '/about':
      return [
        {
          '@type': 'AboutPage',
          '@id': `${url}/#webpage`,
          url,
          name: meta.title,
          description: meta.description,
          isPartOf: { '@id': `${SITE.url}/#website` },
          about: { '@id': `${SITE.url}/#org` },
        },
        {
          '@type': 'Person',
          '@id': `${SITE.url}/#founder`,
          name: SITE.founder.name,
          jobTitle: 'Founder & Software Developer',
          description:
            'Demaceo Vincent is a solo software developer and founder of An App Idea LLC, a dev studio in Denver, Colorado. He builds mobile apps and web products end-to-end — interface, backend, auth, and deployment.',
          worksFor: { '@id': `${SITE.url}/#org` },
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Denver',
            addressRegion: 'CO',
            addressCountry: 'US',
          },
          knowsAbout: [
            'Mobile app development',
            'React Native',
            'TypeScript',
            'Full-stack development',
            'UI/UX design',
            'Product development',
            'MVP development',
          ],
        },
      ]

    case '/services':
      return [
        {
          '@type': 'CollectionPage',
          '@id': `${url}/#webpage`,
          url,
          name: meta.title,
          description: meta.description,
          isPartOf: { '@id': `${SITE.url}/#website` },
        },
        {
          '@type': 'ItemList',
          '@id': `${url}/#services`,
          name: 'Development Services — An App Idea LLC',
          description:
            'Four service categories: MVP development, product & UI engineering, business websites, and data visualization.',
          numberOfItems: services.length,
          itemListElement: services.map((s, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
              '@type': 'Service',
              name: s.title,
              description: s.description,
              provider: { '@id': `${SITE.url}/#org` },
              serviceOutput: s.deliverables.join(', '),
            },
          })),
        },
      ]

    case '/work':
      return [
        {
          '@type': 'CollectionPage',
          '@id': `${url}/#webpage`,
          url,
          name: meta.title,
          description: meta.description,
          isPartOf: { '@id': `${SITE.url}/#website` },
        },
        {
          '@type': 'ItemList',
          '@id': `${url}/#portfolio`,
          name: 'Portfolio — Shipped Applications',
          description:
            'Five products shipped end-to-end by An App Idea LLC founder Demaceo Vincent.',
          numberOfItems: caseStudies.length,
          itemListElement: caseStudies.map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
              '@type': 'SoftwareApplication',
              name: c.title,
              description: c.summary,
              applicationCategory: c.category,
              creator: { '@id': `${SITE.url}/#founder` },
              operatingSystem: c.stack.includes('React Native') ? 'iOS, Android' : 'Web',
              ...(c.liveUrl ? { url: c.liveUrl } : {}),
            },
          })),
        },
      ]

    case '/process':
      return [
        {
          '@type': 'WebPage',
          '@id': `${url}/#webpage`,
          url,
          name: meta.title,
          description: meta.description,
          isPartOf: { '@id': `${SITE.url}/#website` },
        },
        {
          '@type': 'HowTo',
          name: 'App & Web Development Process — An App Idea LLC',
          description:
            'A 4-phase development process from Discovery to Launch. Each phase ends with a tangible deliverable.',
          totalTime: 'P8W',
          step: processSteps.map((p, i) => ({
            '@type': 'HowToStep',
            position: String(i + 1),
            name: p.title,
            text: `${p.description} Deliverables include: ${p.deliverables.join(', ')}.`,
          })),
        },
      ]

    case '/contact':
      return [
        {
          '@type': 'ContactPage',
          '@id': `${url}/#webpage`,
          url,
          name: meta.title,
          description: meta.description,
          isPartOf: { '@id': `${SITE.url}/#website` },
        },
      ]

    default:
      return [
        {
          '@type': 'WebPage',
          '@id': `${url}/#webpage`,
          url,
          name: meta.title,
          description: meta.description,
          isPartOf: { '@id': `${SITE.url}/#website` },
        },
      ]
  }
}

// Builds the full JSON-LD @graph for a given route. The prerender script
// calls this once per route so each HTML file gets page-specific schemas
// (FAQPage, ItemList, HowTo, etc.) alongside the base Organization node.
export function buildStructuredData(route = '/'): string {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [...buildBaseGraph(), ...buildPageGraph(route)],
  }
  return JSON.stringify(data)
}
