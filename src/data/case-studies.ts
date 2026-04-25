// Case studies ported from the old MHI repo (lib/data/case-studies.ts).
// Lucide icon imports stripped, Tailwind theme strings stripped.
// Repo URLs that referenced the old org are kept as-is for now —
// update when the user's GitHub org migrates.

export interface CaseStudyMetric { label: string; value: string }
export interface CaseStudyStat { label: 'Timeline' | 'Team' | 'Platform' | 'Impact'; value: string }
export interface CaseStudySection { title: 'Problem' | 'Approach' | 'Outcome'; content: string }
export interface CaseStudyResourceLink { label: string; url: string; description: string }

export interface CaseStudy {
  slug: string
  title: string
  category: string
  summary: string
  metaDescription: string
  tags: string[]
  stack: string[]
  outcomes: string[]
  stats: CaseStudyStat[]
  sections: CaseStudySection[]
  cover: {
    eyebrow: string
    headline: string
    chips: string[]
    metrics: CaseStudyMetric[]
  }
  liveUrl?: string
  repoUrl?: string
  resourceLinks?: CaseStudyResourceLink[]
  featured?: boolean
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'pinpoint-civic-engagement',
    title: 'Pinpoint',
    category: 'Civic tech',
    summary:
      'A civic engagement platform across iOS, Android, and web that combines official data, legislation, AI voice chat, surveys, and moderation tooling in one system.',
    metaDescription:
      'Pinpoint is a civic engagement platform with AI voice chat, legislation data, moderation workflows, and a shared mobile and web architecture.',
    tags: ['Civic Tech', 'Mobile + Web', 'AI Voice', 'Admin Ops'],
    stack: ['React Native', 'Expo', 'TypeScript', 'Express', 'Prisma', 'PostgreSQL', 'Gemini', 'ElevenLabs'],
    outcomes: [
      'Shipped one shared product across iOS, Android, and web instead of a disconnected set of prototypes.',
      'Built streaming AI official chat with personality modes and ElevenLabs voice responses.',
      'Added durable moderation workflows, searchable civic data proxies, and an operator-facing admin dashboard.',
    ],
    stats: [
      { label: 'Timeline', value: '12-month solo build' },
      { label: 'Team', value: 'Founder-led with admin tooling' },
      { label: 'Platform', value: 'iOS · Android · Web' },
      { label: 'Impact', value: 'AI chat · surveys · moderation' },
    ],
    sections: [
      {
        title: 'Problem',
        content:
          'Most civic products either expose raw public data without useful context or bolt AI onto a narrow chat surface. Pinpoint needed to unify officials, legislation, surveys, community features, and moderation across mobile and web without becoming a pile of disconnected screens.',
      },
      {
        title: 'Approach',
        content:
          'I built the stack around Expo, Express, Prisma, and PostgreSQL, then added direct Firebase token verification via Google JWKS, SSE-based Gemini chat, text-to-speech proxying, civic-data search proxies, and a durable moderation ledger. On the product side, the interface centers on a swipe-based dashboard, deep links, and dedicated admin workflows.',
      },
      {
        title: 'Outcome',
        content:
          'The result is a real platform rather than a civic-tech demo: one codebase serves iOS, Android, and web, AI chats stream with voice responses, moderation decisions stay auditable, and the release process is backed by CI, secret scanning, and reliable Railway deploys.',
      },
    ],
    cover: {
      eyebrow: 'Civic engagement platform',
      headline: 'Officials, legislation, AI voice chat, and moderation in one product.',
      chips: ['Expo SDK 54', 'Express API', 'Prisma ORM', 'Railway deploys'],
      metrics: [
        { label: 'AI voice', value: 'SSE + TTS' },
        { label: 'Search proxy', value: '6 hr cache' },
        { label: 'Ops trail', value: 'Decision ledger' },
      ],
    },
    featured: true,
  },
  {
    slug: 'payback-consumer-intelligence',
    title: 'Payback',
    category: 'Privacy-first analytics',
    summary:
      'A privacy-first consumer intelligence app that extracts signals on-device, stores them in an encrypted vault, and uses a guarded AI backend only for derived analysis.',
    metaDescription:
      'Payback is a privacy-first consumer intelligence platform with on-device data extraction, encrypted local storage, and a hardened AI proxy.',
    tags: ['Privacy', 'Analytics', 'AI Proxy', 'Mobile'],
    stack: ['React Native', 'Expo', 'TypeScript', 'expo-sqlite', 'AES-256-GCM', 'Node.js', 'PostgreSQL', 'Gemini 2.5 Pro'],
    outcomes: [
      'Kept raw Google Takeout and Meta export data on-device using AES-256-GCM encrypted SQLite.',
      'Normalized behavior into 135 categories across 10 pillars for consistent downstream analysis.',
      'Built resumable background processing plus a hardened AI proxy with OAuth verification, rate limits, timeout control, and API-key failover.',
    ],
    stats: [
      { label: 'Timeline', value: 'Background-resumable mobile app' },
      { label: 'Team', value: 'Founder-led privacy architecture' },
      { label: 'Platform', value: 'iOS · Android' },
      { label: 'Impact', value: '135 categories · 10 pillars' },
    ],
    sections: [
      {
        title: 'Problem',
        content:
          'Most consumer-intelligence products centralize raw personal data on a server and call that insight. Payback needed to produce useful analysis without reproducing the same surveillance pattern it was supposed to critique.',
      },
      {
        title: 'Approach',
        content:
          'I moved extraction, normalization, and checkpointed long-running work onto the device with ZIP parsing, media agents, resumable background jobs, and encrypted SQLite storage. The backend is intentionally narrow: it verifies Google OAuth tokens, rate-limits aggressively, supports dual-key Gemini failover, and only handles derived category sets instead of raw exports.',
      },
      {
        title: 'Outcome',
        content:
          'Payback turns Google and Meta exports into 135 behavioral categories across 10 pillars while keeping raw source data local. The interface, documentation, and backend all reinforce the same product promise: insight without surrendering the underlying archive.',
      },
    ],
    cover: {
      eyebrow: 'Privacy-first intelligence',
      headline: 'On-device extraction, encrypted storage, and a tightly scoped AI proxy.',
      chips: ['Encrypted SQLite', 'BGTaskScheduler', 'WorkManager', 'Gemini 2.5 Pro'],
      metrics: [
        { label: 'Signal map', value: '135 categories' },
        { label: 'Pillars', value: '10 models' },
        { label: 'AI proxy', value: 'Failover + limits' },
      ],
    },
    featured: true,
  },
  {
    slug: 'rentharbor-property-management',
    title: 'RentHarbor',
    category: 'PropTech',
    summary:
      'A multi-role property management platform for landlords, tenants, and admins with realtime messaging, payments, maintenance workflows, and 3D property previews.',
    metaDescription:
      'RentHarbor is a property management platform with role-based access, realtime operations, and 3D property visualization.',
    tags: ['PropTech', 'Realtime', '3D', 'Role-Based Access'],
    stack: ['React Native', 'Supabase', 'PostgreSQL', 'RLS', 'Three.js', 'React Three Fiber', 'expo-gl', 'Workbox'],
    outcomes: [
      'Designed a three-sided product model with separate landlord, tenant, and admin capabilities backed by database-enforced access rules.',
      'Delivered live messaging, maintenance updates, and payment status through realtime subscriptions.',
      'Extended the product with 3D property visualization and a PWA web build instead of stopping at mobile CRUD flows.',
    ],
    stats: [
      { label: 'Timeline', value: 'Multi-role SaaS build' },
      { label: 'Team', value: 'Landlords · tenants · admins' },
      { label: 'Platform', value: 'Mobile · Web PWA' },
      { label: 'Impact', value: 'Realtime ops · 3D previews' },
    ],
    sections: [
      {
        title: 'Problem',
        content:
          'Property management software is often either admin-heavy and outdated or lightweight enough that the role model breaks down under real use. RentHarbor needed one system that respected landlord, tenant, and admin boundaries without flattening the experience.',
      },
      {
        title: 'Approach',
        content:
          'I built the platform around Supabase Auth, PostgreSQL, Row Level Security, Realtime, and Edge Functions. Messaging, maintenance, and payment updates stream live, while a React Native plus Three.js layer brings interactive property previews into the product instead of treating them like detached marketing assets.',
      },
      {
        title: 'Outcome',
        content:
          'RentHarbor supports day-to-day property operations, approval gates, and live collaboration from the same product backbone. Database-enforced access control keeps the role model honest as new features and interfaces are added.',
      },
    ],
    cover: {
      eyebrow: 'Role-aware property ops',
      headline: 'A landlord, tenant, and admin system with realtime updates and 3D context.',
      chips: ['Supabase RLS', 'Realtime events', '3D previews', 'PWA build'],
      metrics: [
        { label: 'Roles', value: '3-sided app' },
        { label: 'Realtime', value: 'Live status' },
        { label: 'Visualization', value: '3D property' },
      ],
    },
  },
  {
    slug: 'feng-shui-room-analysis',
    title: 'Feng Shui',
    category: 'Spatial AI',
    summary:
      'A spatial AI app that turns a hand-drawn room into a furnished 3D model, analyzes it with Gemini, and animates better layouts before the user commits.',
    metaDescription:
      'Feng Shui is a spatial AI app with a drawing-to-3D pipeline, structured room analysis, and animated layout optimization.',
    tags: ['Spatial AI', '3D', 'Mobile', 'Design Systems'],
    stack: ['React Native', 'Skia', 'Three.js', 'expo-gl', 'Gemini 2.0 Flash', 'Firebase', 'Reanimated', 'simplify-js'],
    outcomes: [
      'Built a full pipeline from freehand drawing to simplified geometry, room annotation, furnishing, and 3D preview.',
      'Created a 69-item furniture catalog across 11 categories plus detailed wall, floor, and ceiling annotation systems.',
      'Added AI layout optimization that presents 2-3 animated alternatives with score comparisons before the user applies changes.',
    ],
    stats: [
      { label: 'Timeline', value: '10-step guided workflow' },
      { label: 'Team', value: 'Founder-led spatial UX' },
      { label: 'Platform', value: 'Mobile · 3D canvas' },
      { label: 'Impact', value: '69 items · AI layout options' },
    ],
    sections: [
      {
        title: 'Problem',
        content:
          'Most AI room tools ask for a photo and return generic advice. This product needed a workflow that let users describe a room precisely, understand why the guidance mattered, and compare alternatives before rearranging anything in the real world.',
      },
      {
        title: 'Approach',
        content:
          'I designed a 10-step flow from freehand drawing to simplified geometry, room naming, wall and fixture annotations, furnishing, 3D preview, AI analysis, and animated optimization. Skia handles the drawing surface, Three.js renders the space, and Gemini returns structured evaluations across bagua zones, element balance, chi flow, command position, and ranked recommendations.',
      },
      {
        title: 'Outcome',
        content:
          'The result is a spatial AI product with real depth: users can annotate walls and fixtures, place from a 69-item catalog, preview recommendations in motion, and choose between scored layout alternatives instead of guessing at a text-only suggestion.',
      },
    ],
    cover: {
      eyebrow: 'Room analysis and optimization',
      headline: 'From hand-drawn floor plan to furnished 3D model and AI layout guidance.',
      chips: ['Skia drawing', 'Three.js scene', 'Firebase functions', 'Reanimated previews'],
      metrics: [
        { label: 'Workflow', value: '10 steps' },
        { label: 'Catalog', value: '69 items' },
        { label: 'Alternatives', value: '2-3 layouts' },
      ],
    },
    featured: true,
  },
  {
    slug: 'yap-united-live-translation',
    title: 'Yap United',
    category: 'Realtime translation',
    summary:
      'A real-time translation app built for shared-device conversations, with Gemini Live audio streaming, ElevenLabs voices, and location-based community chat.',
    metaDescription:
      'Yap United is a real-time translation app with Gemini Live audio, multilingual voice output, and community chat zones.',
    tags: ['Translation', 'Realtime Audio', 'Voice', 'Community'],
    stack: ['React Native', 'Expo Router', 'Gemini Live API', 'Gemini 2.5 Flash', 'ElevenLabs', 'Firebase', 'expo-audio'],
    outcomes: [
      'Built both turn-based translation and hands-free live mode for real conversations on a shared device.',
      'Supported 15 languages end-to-end across transcription, translation, and voice output.',
      'Added per-user voice assignment, location-based community chat, and social moderation controls around the core translation flow.',
    ],
    stats: [
      { label: 'Timeline', value: 'Realtime audio pipeline' },
      { label: 'Team', value: 'Two-speaker shared-device UX' },
      { label: 'Platform', value: 'Mobile · Live audio' },
      { label: 'Impact', value: '15 languages · L/R routing' },
    ],
    sections: [
      {
        title: 'Problem',
        content:
          'Translation apps often break the rhythm of an actual conversation. Yap United needed to handle live voice, turn-taking, and multilingual community behavior without making people fight the interface.',
      },
      {
        title: 'Approach',
        content:
          'I built a dual-mode speech system: a turn-based flow for shared-device conversations and a Gemini Live pipeline for hands-free mode. Audio is recorded with Expo, translated with Gemini, voiced with ElevenLabs, and routed to the correct earbud side with reconnect and backoff handling when the live session drops.',
      },
      {
        title: 'Outcome',
        content:
          'Yap United supports 15 languages end-to-end, lets each user keep a distinct voice identity, and extends beyond translation with community zones, moderation controls, and non-Latin script handling that keeps the conversation usable under real conditions.',
      },
    ],
    cover: {
      eyebrow: 'Realtime voice translation',
      headline: 'Shared-device conversations, live mode, and multilingual voice output that holds up in motion.',
      chips: ['Gemini Live API', '15 languages', 'ElevenLabs TTS', 'Firebase chat'],
      metrics: [
        { label: 'Mode', value: 'Live + turns' },
        { label: 'Languages', value: '15 total' },
        { label: 'Audio', value: 'L/R routing' },
      ],
    },
  },
]

export const featuredCaseStudies = caseStudies.filter((c) => c.featured)
export const getCaseStudyBySlug = (slug: string) =>
  caseStudies.find((c) => c.slug === slug)

export interface Differentiator {
  title: string
  description: string
}

export const differentiators: Differentiator[] = [
  {
    title: 'Founder-level ownership',
    description:
      'You work directly with the person building your product. No handoffs between design, dev, and ops teams.',
  },
  {
    title: 'End-to-end engineering depth',
    description:
      'Interface design, database architecture, auth, API security, and deployment pipelines — all from the same builder. Nothing gets outsourced or glossed over.',
  },
  {
    title: 'Shipping discipline, not just code',
    description:
      'Every build includes CI, secret scanning, monitoring, and release processes. The product ships ready for real users, not just a demo audience.',
  },
  {
    title: 'Privacy and trust as defaults',
    description:
      'Data handling, encryption, moderation, and consent flows are built into the architecture from day one — not bolted on before launch.',
  },
]
