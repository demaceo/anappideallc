import { SITE, SAME_AS, FOUNDER_SAME_AS } from '../data/site'
import { services } from '../data/services'
import { caseStudies } from '../data/case-studies'
import { processSteps } from '../data/process'

// Per-route metadata. Used by RouteHead via React 19's built-in
// <title>/<meta> hoisting. Titles are keyword-first; descriptions
// are intent-driven and sized for SERP truncation (~155 chars).
export const META: Record<string, { title: string; description: string; path: string }> = {
  '/': {
    title: `${SITE.name}: AI-Native, Privacy-First Mobile App Studio | Denver`,
    description:
      'Denver studio building AI-native mobile apps with privacy built in: real-time AI, on-device encryption, React Native, shipped end-to-end by one builder. 12 apps shipped. MVPs in 6–8 weeks.',
    path: '/',
  },
  '/about': {
    title: `About: Demaceo Vincent, App Developer | ${SITE.name}`,
    description:
      'Demaceo Vincent builds AI-native mobile apps with privacy designed in: real-time AI on top, encrypted local-first data underneath. Founder-led, Denver. One builder, no handoffs.',
    path: '/about',
  },
  '/work': {
    title: `Work: 12 Shipped Apps & Web Products | ${SITE.name}`,
    description:
      '12 products shipped: STLMNT (settlement tracker), The Pinpoint App (civic tech), Payback (privacy analytics), Feng Shui (spatial AI), The Yap App (translation), Zoori, HITLDI, and more. React Native, TypeScript, full-stack.',
    path: '/work',
  },
  '/services': {
    title: `Services: Mobile App, MVP & Web Development | ${SITE.name}`,
    description:
      'Mobile app development, MVP validation, product & UI engineering, and data visualization. React Native, Next.js, TypeScript, Supabase. MVPs launch in 6–8 weeks from first conversation.',
    path: '/services',
  },
  '/process': {
    title: `Development Process: Discovery to Launch | ${SITE.name}`,
    description:
      '4-phase development process: Discovery (1–2 wks), Design (2–3 wks), Development (4–8 wks), Launch. Every phase ends with a tangible deliverable. Built for founders who want full visibility.',
    path: '/process',
  },
  '/contact': {
    title: `Hire a Mobile App Developer | ${SITE.name}, Denver, CO`,
    description:
      'Ready to build your mobile app or website? Contact Demaceo Vincent at An App Idea LLC. Early-stage conversations welcome. MVPs in 6–8 weeks. Reply within 1–2 business days.',
    path: '/contact',
  },
  '/why-not-ai': {
    title: `Why Not Just Use AI to Build Your App? | ${SITE.name}`,
    description:
      'Can AI build your app from a prompt? It gets you started, but wireframing, testing, security, App Store launch, and maintenance each need a dedicated human. The honest case for a builder over a chatbot.',
    path: '/why-not-ai',
  },
  '/support': {
    title: `Support & Help Center | ${SITE.name}`,
    description:
      'Support for every app by An App Idea LLC. Report a bug, delete your data, manage a subscription, or ask a question. Answered directly by the builder, within 1–2 business days. Privacy and terms for each app.',
    path: '/support',
  },
  '/work/stlmnt-settlement-tracker': {
    title: `STLMNT — Class Action Settlement Tracker | ${SITE.name}`,
    description:
      'Case study: STLMNT, a privacy-first class action settlement tracker built with Expo and Firebase — a curated catalog, eligibility self-check, KMS-encrypted claim autofill, on-device receipts, and copy-to-clipboard claim assist (never auto-filing).',
    path: '/work/stlmnt-settlement-tracker',
  },
  '/work/pinpoint-civic-engagement': {
    title: `The Pinpoint App — Civic Engagement Platform | ${SITE.name}`,
    description:
      'How Demaceo Vincent built The Pinpoint App: a civic engagement app across iOS, Android, and web — find your representatives, send guided outreach emails through a Postmark relay, and organize neighbors on a Firestore-backed Pinboard and group chats.',
    path: '/work/pinpoint-civic-engagement',
  },
  '/work/payback-consumer-intelligence': {
    title: `Payback — Privacy-First Consumer Intelligence | ${SITE.name}`,
    description:
      'Case study: Payback, a privacy-first consumer intelligence app with on-device AES-256 encrypted SQLite, 135 behavioral categories, and a hardened Gemini AI proxy.',
    path: '/work/payback-consumer-intelligence',
  },
  '/work/rentharbor-property-management': {
    title: `RentHarbor — Property Management Platform | ${SITE.name}`,
    description:
      'Case study: RentHarbor, a multi-role property management SaaS for landlords, tenants, and admins with Supabase RLS, realtime subscriptions, 3D previews, and a PWA build.',
    path: '/work/rentharbor-property-management',
  },
  '/work/feng-shui-room-analysis': {
    title: `Feng Shui — Spatial AI Room Analyzer | ${SITE.name}`,
    description:
      'Case study: Feng Shui, a spatial AI app that turns a hand-drawn floor plan into a furnished 3D model, analyzes it with Gemini, and animates alternative layouts with score comparisons.',
    path: '/work/feng-shui-room-analysis',
  },
  '/work/yap-united-live-translation': {
    title: `The Yap App — Real-Time Translation App | ${SITE.name}`,
    description:
      'Case study: The Yap App, a conversation-translation app with turn-based and hands-free Live Mode, a camera Sign Scanner, ElevenLabs voice cloning, and 37 supported languages — Gemini, Groq, and Deepgram behind Firebase Cloud Functions.',
    path: '/work/yap-united-live-translation',
  },
  '/work/drayage-drivers': {
    title: `Drayage Drivers — Logistics TMS & WMS App | ${SITE.name}`,
    description:
      'Case study: DrayagePro, a React Native TMS and WMS for drayage brokers with a terminal-style UI, load board, carrier CRM, PDF invoicing, and real-time warehouse inventory.',
    path: '/work/drayage-drivers',
  },
  '/work/zoori-pet-care': {
    title: `Zoori — Dog Adoption Platform | ${SITE.name}`,
    description:
      'Case study: Zoori, a bilingual Expo app connecting Puerto Rico rescue organizations with adopters via swipe-based discovery, application workflows, in-app messaging, and push notifications.',
    path: '/work/zoori-pet-care',
  },
  '/work/hitldi-platform': {
    title: `HITLDI — Truck Loan Delinquency Index | ${SITE.name}`,
    description:
      'Case study: HITLDI, a data analytics platform for the Hudson Insights Truck-Loan Delinquency Index with a Databricks medallion pipeline, FastAPI backend, and ML nowcasting.',
    path: '/work/hitldi-platform',
  },
  '/work/unmasked-coaching': {
    title: `Unmasked Coaching — Coaching Website | ${SITE.name}`,
    description:
      'Case study: Unmasked Coaching, a React 19 website with a Three.js silk background, Framer Motion animations, Calendly booking integration, and full SEO on Vercel.',
    path: '/work/unmasked-coaching',
  },
  '/work/timeless-coach-consult': {
    title: `Timeless Coach Consult — Life Coaching Website | ${SITE.name}`,
    description:
      'Case study: Timeless Coaching & Consulting, a fully static Next.js 16 site with Tailwind CSS v4, editorial typography, service packages, and a curated resource library.',
    path: '/work/timeless-coach-consult',
  },
  '/work/portfolio': {
    title: `Portfolio — demaceo.com | ${SITE.name}`,
    description:
      "Case study: Demaceo Vincent's personal portfolio with a Macintosh System 7-inspired UI, draggable windows, animated project gallery, and PDF resume export — built with Next.js 15.",
    path: '/work/portfolio',
  },
  '/legal/yap/privacy': {
    title: `Privacy Policy — The Yap App | ${SITE.name}`,
    description:
      'Privacy Policy for The Yap App (iOS & Android). Covers conversation data, voice cloning, Firebase/Gemini/ElevenLabs/Deepgram/Groq processing, device permissions, and your privacy rights. Published by An App Idea LLC.',
    path: '/legal/yap/privacy',
  },
  '/legal/yap/terms': {
    title: `Terms of Service — The Yap App | ${SITE.name}`,
    description:
      'Terms of Service for The Yap App (iOS & Android). Covers free and Pro subscription tiers, voice cloning requirements, translation accuracy disclaimer, and governing law (Colorado). Published by An App Idea LLC.',
    path: '/legal/yap/terms',
  },
  '/legal/payback/privacy': {
    title: `Privacy Policy — Ôwn (Payback) | ${SITE.name}`,
    description:
      'Privacy Policy for Ôwn (Payback Own) on iOS & Android. Local-first AES-256 encrypted architecture. Covers Google/Meta data processing, AI analysis via Gemini, GDPR, UK GDPR, CCPA, and India DPDP rights. Operated by Mile High Interface LLC.',
    path: '/legal/payback/privacy',
  },
  '/legal/payback/terms': {
    title: `Terms of Service — Ôwn (Payback) | ${SITE.name}`,
    description:
      'Terms of Service for Ôwn (Payback Own) on iOS & Android. 20-section agreement covering eligibility, AI analysis, data ownership, disclaimers, arbitration, and governing law (Colorado). Operated by Mile High Interface LLC.',
    path: '/legal/payback/terms',
  },
  '/legal/pinpoint/privacy': {
    title: `Privacy Policy — Pinpoint | ${SITE.name}`,
    description:
      'Privacy Policy for the Pinpoint civic engagement app (iOS & Android). Covers account info, location data, outreach messages, Firebase storage, and your rights. Operated by An App Idea LLC.',
    path: '/legal/pinpoint/privacy',
  },
  '/legal/pinpoint/terms': {
    title: `Terms of Service — Pinpoint | ${SITE.name}`,
    description:
      'Terms of Service for the Pinpoint civic engagement app (iOS & Android). Covers acceptable use, outreach to officials, user content, moderation, and governing law (Colorado). Operated by An App Idea LLC.',
    path: '/legal/pinpoint/terms',
  },
  '/legal/drayagepro/privacy': {
    title: `Privacy Policy — DrayagePro TMS | ${SITE.name}`,
    description:
      'Privacy Policy for DrayagePro TMS (iOS & Android). All business data is stored locally on your device. We do not collect, transmit, or sell your data. Published by An App Idea LLC.',
    path: '/legal/drayagepro/privacy',
  },
  '/legal/drayagepro/terms': {
    title: `Terms of Service — DrayagePro TMS | ${SITE.name}`,
    description:
      'Terms of Service for DrayagePro TMS (iOS & Android). Governing law: State of Colorado. Covers license, data ownership, acceptable use, disclaimers, and dispute resolution. Published by An App Idea LLC.',
    path: '/legal/drayagepro/terms',
  },
  '/legal/zoori/privacy': {
    title: `Privacy Policy — Zoori | ${SITE.name}`,
    description:
      'Privacy Policy for Zoori (iOS & Android). Covers adopter profiles, dog listings, compatibility scoring, Firebase/Expo/Resend processing, device permissions, and your data rights. Published by An App Idea LLC.',
    path: '/legal/zoori/privacy',
  },
  '/legal/zoori/terms': {
    title: `Terms of Service — Zoori | ${SITE.name}`,
    description:
      'Terms of Service for Zoori (iOS & Android). Covers adopter and organization roles, user conduct, content licensing, platform moderation, disclaimers, and governing law (Puerto Rico). Published by An App Idea LLC.',
    path: '/legal/zoori/terms',
  },
  '/legal/fengshui/privacy': {
    title: `Privacy Policy — Feng Shui | ${SITE.name}`,
    description:
      'Privacy Policy for the Feng Shui app (iOS). Anonymous accounts, AI-powered room analysis via Google Gemini, no tracking or advertising. Published by An App Idea LLC.',
    path: '/legal/fengshui/privacy',
  },
  '/legal/fengshui/terms': {
    title: `Terms of Service — Feng Shui | ${SITE.name}`,
    description:
      'Terms of Service for the Feng Shui app (iOS). AI-generated analysis is for informational/entertainment purposes only. Governing law: Colorado. Published by An App Idea LLC.',
    path: '/legal/fengshui/terms',
  },
  '/legal/stlmnt/privacy': {
    title: `Privacy Policy — STLMNT | ${SITE.name}`,
    description:
      'Privacy Policy for STLMNT, the class action settlement tracker (iOS & Android). Covers your account, optional autofill profile, claims, and receipts. Sensitive fields are KMS-encrypted; no bank, SSN, or card numbers — ever; receipts stay on-device. Operated by Mile High Interface LLC.',
    path: '/legal/stlmnt/privacy',
  },
  '/legal/stlmnt/terms': {
    title: `Terms of Service — STLMNT | ${SITE.name}`,
    description:
      'Terms of Service for STLMNT (iOS & Android). STLMNT is not a legal service and never files claims for you — you submit every claim yourself on the official site. Covers eligibility, accuracy disclaimers, payouts, and governing law (Colorado). Operated by Mile High Interface LLC.',
    path: '/legal/stlmnt/terms',
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
        'AI-native mobile app development',
        'AI integration',
        'On-device AI',
        'Privacy-first architecture',
        'On-device encryption',
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
                text: 'Most MVPs take 6–8 weeks from first conversation to production deploy, covering discovery, design, development, and launch. AI-integrated or multi-platform builds typically run 10–12 weeks.',
              },
            },
            {
              '@type': 'Question',
              name: 'What does An App Idea LLC build?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'An App Idea LLC builds AI-native mobile apps (iOS and Android via React Native) with privacy-first architecture, plus web applications and MVPs. The studio leans toward products that empower people and build community, and is founder-led by Demaceo Vincent, based in Denver, CO.',
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
                text: "Yes, early-stage conversations are welcome. No finished spec or deck required. The first conversation is about figuring out fit. Send a few sentences about your idea and we'll go from there.",
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
            'Demaceo Vincent is a solo software developer and founder of An App Idea LLC, a dev studio in Denver, Colorado. He builds mobile apps and web products end-to-end: interface, backend, auth, and deployment.',
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
          name: 'Development Services · An App Idea LLC',
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
          name: 'Portfolio · Shipped Applications',
          description:
            'Twelve products shipped end-to-end by An App Idea LLC founder Demaceo Vincent.',
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
          name: 'App & Web Development Process · An App Idea LLC',
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

    case '/why-not-ai':
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
              name: 'Can AI build my app for me?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'AI can get you a useful head start: a rough screen or a code sketch from a prompt. But that\'s roughly the first 20% of the work. Wireframing with real users, designing the data and security model, passing App Store review, deploying, debugging, and maintaining the app each require a dedicated, accountable human. Skipping them just moves the cost somewhere more expensive.',
              },
            },
            {
              '@type': 'Question',
              name: 'Why hire a developer instead of just using ChatGPT or an AI app builder?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'A prompt gives you what you asked for; it can\'t tell you which features to cut, watch a confused user struggle and fix the flow, or stand behind the security of your users\' data. A developer uses AI as a power tool inside a process they own (wireframing, testing, securing, shipping, and maintaining), so you get modern speed plus a person accountable for the outcome.',
              },
            },
            {
              '@type': 'Question',
              name: 'I already started my app with AI: is that wasted?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Not at all. An AI draft is a great starting point and often clarifies what you want. Bring it to a free consultation and we\'ll map the path from your current draft to a launched, secure, maintainable product.',
              },
            },
            {
              '@type': 'Question',
              name: 'What does building an app actually involve beyond writing code?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Wireframing, usability testing, architecture and data modeling, authentication, payments, security and privacy, App Store and Google Play submission, deployment and build pipelines, monitoring, debugging, and ongoing maintenance. Each is a discipline of its own, and all of them require a dedicated human.',
              },
            },
          ],
        },
      ]

    case '/support':
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
              name: 'How do I get support for an An App Idea LLC app?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: `Email ${SITE.email} with the app name, your device and OS version, and a short description of the issue. Support is handled directly by the builder, ${SITE.founder.name}, with a reply within 1–2 business days.`,
              },
            },
            {
              '@type': 'Question',
              name: 'How do I delete my account or personal data?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: `Email ${SITE.email} from the address associated with your account to request deletion of your account or personal data. Each app's privacy policy details exactly what is stored and how deletion is handled.`,
              },
            },
            {
              '@type': 'Question',
              name: 'How do I manage a subscription or request a refund?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Subscriptions, renewals, and refunds are managed by the Apple App Store or Google Play, depending on where you purchased. If a paid feature is not unlocking after purchase, email support and it will be resolved.',
              },
            },
            {
              '@type': 'Question',
              name: 'How long does support take to respond?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Most messages get a reply within 1–2 business days, often sooner. There is no ticket system or chatbot; you reach the person who built the app.',
              },
            },
          ],
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
