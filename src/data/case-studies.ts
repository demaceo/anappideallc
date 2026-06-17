// Case studies ported from the old MHI repo (lib/data/case-studies.ts).
// Lucide icon imports stripped, Tailwind theme strings stripped.
// Repo URLs that referenced the old org are kept as-is for now —
// update when the user's GitHub org migrates.

export interface CaseStudyMetric { label: string; value: string }
export interface CaseStudyStat { label: 'Timeline' | 'Team' | 'Platform' | 'Impact'; value: string }
export interface CaseStudySection { title: 'Problem' | 'Approach' | 'Outcome'; content: string }
export interface CaseStudyResourceLink { label: string; url: string; description: string }

// Optional per-project theming for the case-study detail page. Values are
// pulled from each app's own design tokens so the case study carries a nod to
// the product's real UI identity. `accent`/`gold` override the editorial
// --accent/--gold CSS vars (scoped to the detail page's <main>); `mark` colors
// the app icon tile; `gradient` paints the signature strip on the cover block;
// `dark` opts the cover block into a dark, immersive surface treatment.
export interface CaseStudyTheme {
  accent: string
  gold: string
  mark: string
  gradient?: string
  dark?: boolean
}

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
  theme?: CaseStudyTheme
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
      'A multi-role property management platform for tenants, landlords, and admins — rent payments, maintenance workflows, in-app messaging, and AI-generated community resource guides, with database-enforced access via Supabase Row Level Security and a PWA web build.',
    metaDescription:
      'RentHarbor is an Expo + Supabase property management platform with role-based access (tenant, landlord, admin), rent payments, maintenance workflows, AI community resource guides, and a Workbox PWA web build.',
    tags: ['PropTech', 'Multi-role', 'Supabase RLS', 'PWA'],
    stack: ['React Native', 'Expo SDK 54', 'Supabase', 'PostgreSQL', 'Row Level Security', 'Edge Functions', 'Gemini 2.5 Flash', 'react-native-maps', 'Workbox PWA'],
    outcomes: [
      'Designed a three-role product — tenant, landlord, and admin — each with its own dashboards, capabilities, and color-themed interface, backed by Postgres Row Level Security policies.',
      'Delivered rent payments across Venmo, bank transfer, and check, a full maintenance-request lifecycle (categories, priority, assignment, costs, scheduling), and per-role in-app messaging on one Supabase backend.',
      'Added AI-generated community resource guides via a Gemini edge function with an admin approval workflow, plus a Workbox-powered PWA web build alongside the native iOS and Android apps.',
    ],
    stats: [
      { label: 'Timeline', value: 'Multi-role SaaS build' },
      { label: 'Team', value: 'Tenant · Landlord · Admin' },
      { label: 'Platform', value: 'iOS · Android · Web PWA' },
      { label: 'Impact', value: 'Payments · Maintenance · AI resources' },
    ],
    sections: [
      {
        title: 'Problem',
        content:
          'Property management software is often either admin-heavy and outdated or lightweight enough that the role model breaks down under real use. RentHarbor needed one system that respected tenant, landlord, and admin boundaries without flattening the experience.',
      },
      {
        title: 'Approach',
        content:
          'I built the platform on Supabase Auth, PostgreSQL, Row Level Security, and Edge Functions, with Expo Router driving role-specific tenant, landlord, and admin layouts. Each role gets its own themed interface — blue for tenants, green for landlords, red for admins — and a Gemini-backed edge function generates localized community-resource guides that admins approve before they reach tenants.',
      },
      {
        title: 'Outcome',
        content:
          'RentHarbor supports rent payment, maintenance, messaging, and curated community resources from one role-aware backbone. Database-enforced RLS keeps the role model honest as features are added, and a Workbox PWA build extends the same product to the web.',
      },
    ],
    cover: {
      eyebrow: 'Role-aware property ops',
      headline: 'A tenant, landlord, and admin system with payments, maintenance, and AI community guides.',
      chips: ['Supabase RLS', 'Edge Functions', 'Gemini resources', 'PWA build'],
      metrics: [
        { label: 'Roles', value: '3 themed roles' },
        { label: 'Payments', value: 'Venmo · ACH · Check' },
        { label: 'Web', value: 'PWA build' },
      ],
    },
    theme: {
      accent: '#2563EB',
      gold: '#2ECC71',
      mark: '#2563EB',
      gradient: 'linear-gradient(180deg, #4A90E2 0%, #2ECC71 50%, #E74C3C 100%)',
    },
  },
  {
    slug: 'feng-shui-room-analysis',
    title: 'Feng Shui',
    category: 'Spatial AI',
    summary:
      'A spatial AI app that turns a hand-drawn room into a furnished 3D model, analyzes it with Gemini, and animates better layouts before the user commits.',
    metaDescription:
      'Feng Shui is a spatial AI app with a 9-step drawing-to-3D pipeline, a 72-item furniture catalog, server-side Gemini room analysis, and animated layout optimization.',
    tags: ['Spatial AI', '3D', 'Mobile', 'Design Systems'],
    stack: ['React Native', 'Expo SDK 54', 'Skia', 'Three.js', 'expo-gl', 'Gemini 2.0 Flash', 'Firebase Cloud Functions', 'Reanimated 4', 'Zustand + Zundo', 'simplify-js'],
    outcomes: [
      'Built a 9-step pipeline from freehand Skia drawing to simplified geometry, room annotation, furnishing, and a furnished 3D preview.',
      'Created a 72-item furniture catalog across 11 categories plus a wall, floor, and ceiling annotation system for doors, windows, outlets, vents, and lighting.',
      'Added server-side Gemini analysis (an overall score plus chi-flow, element-balance, command-position, and harmony sub-scores) with animated layout optimization that offers 2–3 scored alternatives before the user applies changes.',
    ],
    stats: [
      { label: 'Timeline', value: '9-step guided workflow' },
      { label: 'Team', value: 'Founder-led spatial UX' },
      { label: 'Platform', value: 'Mobile · 3D canvas' },
      { label: 'Impact', value: '72 items · AI layout options' },
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
          'I designed a 9-step flow — draw, refine, transform, annotate, furnish, preview, analyze, results, and optimize — wrapped in a vintage sumi-e ink-wash design system. Skia handles the freehand drawing surface, Three.js renders the space, and a Firebase Cloud Function calls Gemini server-side (the API key never ships to the client), returning structured evaluations across bagua zones, element balance, chi flow, command position, and a harmony score with ranked recommendations.',
      },
      {
        title: 'Outcome',
        content:
          'The result is a spatial AI product with real depth: users annotate walls and fixtures, place from a 72-item catalog, preview recommendations in motion, and choose between scored layout alternatives instead of guessing at a text-only suggestion — with a Room Studio beta adding inline 2D/3D editing and undo/redo.',
      },
    ],
    cover: {
      eyebrow: 'Room analysis and optimization',
      headline: 'From hand-drawn floor plan to furnished 3D model and AI layout guidance.',
      chips: ['Skia drawing', 'Three.js scene', 'Gemini Cloud Functions', 'Sumi-e design system'],
      metrics: [
        { label: 'Workflow', value: '9 steps' },
        { label: 'Catalog', value: '72 items' },
        { label: 'Alternatives', value: '2–3 layouts' },
      ],
    },
    theme: {
      accent: '#C44536',
      gold: '#B8860B',
      mark: '#C44536',
      gradient: 'linear-gradient(180deg, #4A7C4E 0%, #B8860B 50%, #C44536 100%)',
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
  {
    slug: 'drayage-drivers',
    title: 'Drayage Drivers',
    category: 'Logistics tech',
    summary:
      'A TMS and WMS mobile app for drayage brokers and admins, with a terminal-style UI, load board, carrier and customer CRM, PDF invoicing, and real-time warehouse inventory.',
    metaDescription:
      'DrayagePro is a logistics TMS/WMS app built with React Native and Expo, featuring a terminal-style UI, load management, carrier CRM, PDF invoicing, and role-based auth for drayage operations.',
    tags: ['Logistics', 'TMS', 'WMS', 'Mobile', 'Terminal UI'],
    stack: ['React Native', 'Expo SDK 54', 'Expo Router', 'Tamagui', 'Skia', 'Reanimated', 'AsyncStorage', 'TypeScript'],
    outcomes: [
      'Delivered a full TMS and WMS in one mobile app — load board, carrier records, customer CRM, invoicing, and warehouse inventory across iOS, Android, and web.',
      'Built a terminal-style UI component system with a command palette, keyboard shortcuts, sparklines, heatmaps, and a function-key action bar.',
      'Added role-based auth, PDF invoice generation with sharing, and a margin-aware billing system with credit limit management.',
    ],
    stats: [
      { label: 'Timeline', value: 'Solo build for Hudson Insights' },
      { label: 'Team', value: 'Admin + Broker roles' },
      { label: 'Platform', value: 'iOS · Android · Web' },
      { label: 'Impact', value: 'TMS + WMS in one app' },
    ],
    sections: [
      {
        title: 'Problem',
        content:
          'Drayage operations typically require switching between separate TMS and WMS tools, each with its own login and data silo. Hudson Insights needed a single mobile product that handled loads, carriers, customers, invoicing, and warehouse inventory under one role-aware system.',
      },
      {
        title: 'Approach',
        content:
          'I built the full TMS and WMS flows in a single Expo Router codebase, with a shared context layer for auth, data, theming, and the command palette. The terminal-style UI system — DataGrid, Gauge, Sparkline, Heatmap, FunctionBar, and 16 other components — runs on Skia on native and falls back cleanly on web. Keyboard shortcuts are handled separately per platform.',
      },
      {
        title: 'Outcome',
        content:
          'DrayagePro gives brokers and admins a single app for load lifecycle management, carrier and customer records, PDF invoice generation, and live warehouse inventory — without toggling between disconnected tools. The terminal aesthetic makes dense data readable while the command palette keeps power users fast.',
      },
    ],
    cover: {
      eyebrow: 'Logistics TMS & WMS',
      headline: 'One mobile app for load management, carrier CRM, invoicing, and warehouse inventory.',
      chips: ['Terminal UI', 'Expo SDK 54', 'Skia visualizations', 'PDF invoicing'],
      metrics: [
        { label: 'Roles', value: 'Admin + Broker' },
        { label: 'UI components', value: '16+ terminal' },
        { label: 'Modules', value: 'TMS + WMS' },
      ],
    },
  },
  {
    slug: 'zoori-pet-care',
    title: 'Zoori',
    category: 'Pet adoption platform',
    summary:
      'A bilingual dog adoption platform connecting Puerto Rico rescue organizations with adopters and fosterers, with swipe-based discovery, application workflows, in-app messaging, and an org and admin dashboard.',
    metaDescription:
      'Zoori is a bilingual (en/es) Expo app connecting Puerto Rico rescue organizations with adopters and fosterers via swipe matching, A–D match scoring, real-time messaging, push notifications, and RescueGroups.org listing sync.',
    tags: ['Social Impact', 'Mobile', 'Firebase', 'Bilingual', 'Multi-role'],
    stack: ['Expo SDK 54', 'React Native 0.81', 'React 19', 'Expo Router v6', 'TanStack Query v5', 'Zustand v5', 'React Hook Form + Zod v4', 'Reanimated 4', 'Gesture Handler v2', 'Firebase JS SDK v12', 'Cloud Functions', 'Resend', 'i18next', 'TypeScript'],
    outcomes: [
      'Built a three-sided platform — adopter, rescue organization, and admin — each with dedicated dashboards, workflows, moderation tools, and access controls backed by Firestore rules.',
      'Delivered gesture-driven swipe discovery plus an algorithmic For-You feed with A–D match scoring, a breed glossary with bookmark alerts, saved dogs, and swipe history.',
      'Added bilingual (en/es) support, real-time per-conversation messaging via Firestore listeners, 13 push-notification types, transactional email via Resend, and a RescueGroups.org listing sync.',
    ],
    stats: [
      { label: 'Timeline', value: 'Expo SDK 54, new arch' },
      { label: 'Team', value: 'Adopter · Org · Admin roles' },
      { label: 'Platform', value: 'iOS · Android' },
      { label: 'Impact', value: 'Bilingual · Swipe + match scoring' },
    ],
    sections: [
      {
        title: 'Problem',
        content:
          'Puerto Rico rescue organizations needed a shared system for managing dog listings and incoming applications. Adopters needed more than a static list — they needed discovery that matched lifestyle and preference. A single product had to serve all three sides without the role model collapsing.',
      },
      {
        title: 'Approach',
        content:
          'I structured the app around Expo Router file-based routing with strict role-based layouts for adopter, organization, and admin, wrapped in a coral, teal, and purple role-themed gradient system with Poppins typography. Firebase Auth, Firestore, and Cloud Functions power the backend. TanStack Query v5 handles server state, Zustand manages swipe and preference state client-side, and Reanimated v4 plus Gesture Handler v2 drive the swipe deck. A client-side scorer grades dog–adopter fit A–D to power the For-You feed, and i18next covers bilingual content with locale detection.',
      },
      {
        title: 'Outcome',
        content:
          'Zoori gives rescue organizations a full operations dashboard for dogs, applications, and messaging, while adopters get swipe and For-You discovery tuned to their preferences. Real-time messaging, push notifications, transactional email, a RescueGroups.org sync, and admin moderation make the platform usable for both English- and Spanish-speaking communities in Puerto Rico.',
      },
    ],
    cover: {
      eyebrow: 'Pet adoption & fostering',
      headline: 'Swipe-based dog discovery and rescue-org operations — bilingual, role-aware, real-time.',
      chips: ['Expo SDK 54 new arch', 'Firebase + Cloud Functions', 'TanStack Query v5', 'Role-themed gradients'],
      metrics: [
        { label: 'Roles', value: '3-sided app' },
        { label: 'Languages', value: 'English + Spanish' },
        { label: 'Discovery', value: 'Swipe + match score' },
      ],
    },
    theme: {
      accent: '#F4533C',
      gold: '#14B8A6',
      mark: '#F4533C',
      gradient: 'linear-gradient(180deg, #F4533C 0%, #8B5CF6 50%, #14B8A6 100%)',
    },
  },
  {
    slug: 'hitldi-platform',
    title: 'HITLDI',
    category: 'Data analytics',
    summary:
      'A data analytics platform tracking truck loan delinquency rates across market segments, with ML-powered nowcasting, economic indicator integration, and interactive dashboards for institutional investors.',
    metaDescription:
      'HITLDI is a data analytics platform for the Hudson Insights Truck-Loan Delinquency Index, with a FastAPI backend, React dashboard, Databricks medallion pipeline, and ML nowcasting.',
    tags: ['Data Analytics', 'ML', 'Finance', 'Web', 'Python'],
    stack: ['FastAPI', 'Python', 'React', 'TypeScript', 'Vite', 'Databricks', 'EIA API', 'FRED API', 'Cass Freight Index'],
    outcomes: [
      'Built a full medallion data pipeline (bronze → silver → gold) in Databricks, ingesting diesel prices, FRED economic indicators, and Cass Freight Index for index calculation.',
      'Delivered ML-powered nowcasting models for early delinquency prediction alongside a FastAPI backend with role-based access for analysts and investors.',
      'Created an interactive React dashboard with exportable reports (CSV, Excel, PDF) for institutional stakeholders.',
    ],
    stats: [
      { label: 'Timeline', value: 'Production analytics system' },
      { label: 'Team', value: 'Analyst + Investor roles' },
      { label: 'Platform', value: 'Web' },
      { label: 'Impact', value: 'ML nowcasting · Multi-format export' },
    ],
    sections: [
      {
        title: 'Problem',
        content:
          'Institutional investors tracking truck loan health had no purpose-built index. Hudson Insights needed a production system that ingested multiple external data sources, calculated a delinquency index with meaningful segmentation, and surfaced actionable signals before full reporting cycles closed.',
      },
      {
        title: 'Approach',
        content:
          'I built the data pipeline as a Databricks medallion architecture: raw ingestion in the bronze layer, normalization and transformation in silver, analytics and index calculation in gold, and ML nowcasting models in a dedicated tier. A FastAPI server exposes the index data to a React dashboard with role-based views for analysts and investors.',
      },
      {
        title: 'Outcome',
        content:
          'HITLDI gives institutional stakeholders an early-warning delinquency index backed by diesel prices, unemployment, GDP, and freight volume data — updated on the pipeline schedule and exportable in CSV, Excel, and PDF for integration into external reporting workflows.',
      },
    ],
    cover: {
      eyebrow: 'Truck loan delinquency index',
      headline: 'ML-powered delinquency nowcasting and economic indicator dashboards for institutional investors.',
      chips: ['Databricks medallion', 'FastAPI backend', 'ML nowcasting', 'Multi-format export'],
      metrics: [
        { label: 'Pipeline', value: 'Bronze → Gold' },
        { label: 'Data sources', value: 'EIA + FRED + Cass' },
        { label: 'Roles', value: 'Analyst + Investor' },
      ],
    },
  },
  {
    slug: 'unmasked-coaching',
    title: 'Unmasked Coaching',
    category: 'Coaching website',
    summary:
      'A personal coaching website with a 3D silk background, Calendly booking integration, animated testimonials, and full SEO — built for an adoption-attuned coach focused on belonging and authentic confidence.',
    metaDescription:
      'Unmasked Coaching is a React 19 coaching website with a Three.js silk-shader background, Framer Motion animations, an embedded Calendly booking flow, a custom cookie-consent banner, GA4 analytics, and Vercel deployment.',
    tags: ['Web', 'Coaching', '3D', 'SEO', 'Vercel'],
    stack: ['React 19', 'TypeScript', 'Vite 6', 'Tailwind CSS v4', 'Framer Motion', 'Three.js', 'React Three Fiber', 'React Router 7', 'React Calendly', 'Vercel'],
    outcomes: [
      'Built a coaching site with an animated Three.js silk-shader background (with a mobile-safe static fallback), Framer Motion section transitions, and a Calendly booking flow embedded in the contact section.',
      'Shipped full SEO — sitemap, robots.txt, Open Graph, and Person JSON-LD — alongside a custom cookie-consent banner and dedicated Privacy and Cookie Policy pages.',
      'Optimized delivery with route and component code-splitting, lazy loading, GA4 analytics, and an auto-playing, swipeable testimonials carousel.',
    ],
    stats: [
      { label: 'Timeline', value: 'Solo client build' },
      { label: 'Team', value: 'Founder-led delivery' },
      { label: 'Platform', value: 'Web' },
      { label: 'Impact', value: 'Live booking · silk UI' },
    ],
    sections: [
      {
        title: 'Problem',
        content:
          'The coach needed a site that communicated warmth, depth, and credibility without looking like a generic coaching template. The booking flow had to be frictionless, the SEO had to be real, and the visual experience had to stand out while remaining accessible.',
      },
      {
        title: 'Approach',
        content:
          'I built the site in React 19 with Vite and Tailwind v4, using Three.js and React Three Fiber for a custom four-color silk-shader background that disables on low-power devices and respects reduced-motion. Framer Motion drives section reveals and the testimonials carousel, and Calendly is embedded so visitors book a 30-minute session without leaving the page. A custom cookie banner plus Privacy and Cookie Policy pages handle compliance.',
      },
      {
        title: 'Outcome',
        content:
          'Unmasked Coaching launched at unmasked-coaching.com with a distinctive purple silk identity, direct session booking, GA4 analytics, and SEO infrastructure in place — heart-forward, adoption-attuned, and ready for organic traffic and referrals.',
      },
    ],
    cover: {
      eyebrow: 'Adoption-attuned coaching',
      headline: 'A silk-shader coaching site with direct booking, full SEO, and privacy compliance.',
      chips: ['Three.js silk shader', 'Framer Motion', 'Calendly embed', 'Vercel deploy'],
      metrics: [
        { label: 'Booking', value: 'Calendly inline' },
        { label: 'Visual FX', value: 'Three.js silk' },
        { label: 'SEO', value: 'Sitemap + JSON-LD' },
      ],
    },
    liveUrl: 'https://www.unmasked-coaching.com',
    theme: {
      accent: '#A855F7',
      gold: '#C499FF',
      mark: '#8B4C99',
      dark: true,
    },
  },
  {
    slug: 'timeless-coach-consult',
    title: 'Timeless Coach Consult',
    category: 'Coaching website',
    summary:
      'A backend-free Next.js 16 website for a certified life coach specializing in adoption, life transitions, and personal development — with a curated resource library, service packages and FAQ, and accessible mailto-based contact forms.',
    metaDescription:
      'Timeless Coaching & Consulting is a backend-free Next.js 16 site with Tailwind CSS v4, Cormorant Garamond typography, a resource library, service packages, mailto contact forms, and WCAG AAA text contrast.',
    tags: ['Web', 'Next.js', 'Coaching', 'No backend', 'Accessibility'],
    stack: ['Next.js 16', 'React 19', 'Tailwind CSS v4', 'TypeScript', 'Vercel', 'next/image', 'next/font'],
    outcomes: [
      'Delivered a backend-free Next.js 16 App Router site — home, about, services, and resources — ready for Vercel with a custom domain.',
      'Built service packages with an FAQ, a curated resource library (six recommended books plus reflection prompts), and the "3 Cs of Life" coaching framework.',
      'Used Cormorant Garamond and Raleway over a warm cream-and-forest palette for a premium editorial identity, with WCAG AAA text contrast (charcoal and forest on cream).',
    ],
    stats: [
      { label: 'Timeline', value: 'No backend or CMS' },
      { label: 'Team', value: 'Solo client build' },
      { label: 'Platform', value: 'Web' },
      { label: 'Impact', value: 'WCAG AAA · 4 pages' },
    ],
    sections: [
      {
        title: 'Problem',
        content:
          'Yvonne Howard needed a website that matched her coaching brand — thoughtful, premium, and accessible — without an unnecessary CMS or backend. The site needed service packages, a resource library, and a contact flow that worked without a form server.',
      },
      {
        title: 'Approach',
        content:
          'I built the site with the Next.js 16 App Router and Tailwind CSS v4, with brand tokens defined as CSS custom properties in globals.css. next/image optimizes the AVIF and JPEG hero art, next/font loads Cormorant Garamond and Raleway without layout shift, and both the contact and email-capture forms use a client-side mailto fallback — no API routes or CMS.',
      },
      {
        title: 'Outcome',
        content:
          "Timeless Coach Consult launched as a fast, accessible, backend-free site on Vercel — covering Yvonne's bio, services and packages, and a resource library — with the warm cream-and-forest brand translated cleanly from her Wix reference into a modern editorial layout.",
      },
    ],
    cover: {
      eyebrow: 'Certified life coaching',
      headline: 'A backend-free Next.js coaching site with editorial typography, service packages, and a resource library.',
      chips: ['Next.js 16 App Router', 'Tailwind CSS v4', 'Cormorant Garamond', 'Vercel deploy'],
      metrics: [
        { label: 'Pages', value: '4 sections' },
        { label: 'Backend', value: 'None (mailto)' },
        { label: 'Contrast', value: 'WCAG AAA' },
      ],
    },
    liveUrl: 'https://www.timelesscoach-consult.com',
    theme: {
      accent: '#2D4A3E',
      gold: '#C4714B',
      mark: '#2D4A3E',
      gradient: 'linear-gradient(180deg, #2D4A3E 0%, #7C9A7E 50%, #C4714B 100%)',
    },
  },
  {
    slug: 'portfolio',
    title: 'Portfolio',
    category: 'Personal portfolio',
    summary:
      'A personal developer portfolio with a retro Macintosh System 7 aesthetic — draggable windows, a command-palette skill modal, animated project gallery, and an integrated resume download with EmailJS contact.',
    metaDescription:
      'Demaceo Vincent\'s personal portfolio site built with Next.js 15 App Router, React 19, Framer Motion, and a nostalgic Macintosh System 7 design language. Includes interactive windows, project gallery, and resume export.',
    tags: ['Portfolio', 'Next.js', 'Web', 'Interactive', 'Design'],
    stack: ['Next.js 15', 'React 19', 'TypeScript', 'Framer Motion', 'CSS Modules', 'EmailJS', 'html2canvas', 'jsPDF', 'Tailwind CSS v4'],
    outcomes: [
      'Built an interactive portfolio with a Macintosh System 7-inspired UI — draggable windows, glass morphism panels, and a command-palette skill modal.',
      'Added an animated project gallery with modal presentations, a resume section with PDF export via html2canvas and jsPDF, and a contact form with EmailJS.',
      'Optimized for performance with feature-based architecture, Next.js 15 App Router image optimization, and lazy-loaded modal content.',
    ],
    stats: [
      { label: 'Timeline', value: 'Next.js 15 App Router' },
      { label: 'Team', value: 'Founder-led personal brand' },
      { label: 'Platform', value: 'Web' },
      { label: 'Impact', value: 'Mac UI · PDF export' },
    ],
    sections: [
      {
        title: 'Problem',
        content:
          'A developer portfolio needs to communicate both technical depth and design sensibility without looking like a template. The goal was a distinctive identity that doubled as a live demonstration of what I can build.',
      },
      {
        title: 'Approach',
        content:
          'I used Next.js 15 App Router with CSS Modules and Tailwind v4 for component-scoped styling. Framer Motion handles all the animations — window drags, modal transitions, skill pill reveals. The Macintosh System 7 aesthetic runs through every layer: font choices, border radii, button styles, and the desktop metaphor for the home screen.',
      },
      {
        title: 'Outcome',
        content:
          'The portfolio at demaceo.com gives visitors a desktop-style experience: draggable panels, a skill modal, an animated project gallery, and a downloadable resume — all in a Next.js 15 site that loads fast and scores well on Lighthouse.',
      },
    ],
    cover: {
      eyebrow: 'Personal developer portfolio',
      headline: 'Retro Mac System 7 UI meets modern Next.js — draggable windows, animated gallery, and PDF resume export.',
      chips: ['Next.js 15', 'Framer Motion', 'Mac System 7 UI', 'PDF export'],
      metrics: [
        { label: 'UI style', value: 'Mac System 7' },
        { label: 'Resume', value: 'PDF export' },
        { label: 'Contact', value: 'EmailJS form' },
      ],
    },
    liveUrl: 'https://demaceo.com',
  },
]

export const featuredCaseStudies = caseStudies.filter((c) => c.featured)
export const getCaseStudyBySlug = (slug: string) =>
  caseStudies.find((c) => c.slug === slug)

export interface Differentiator {
  title: string
  description: string
}

// Ordered by sharpness. The first two are the positioning edge — AI-native
// mobile and privacy-first architecture, both evidenced in the shipped work.
// The last two (ownership, discipline) are reframed as supporting proof
// rather than top-line claims, since every good solo dev makes them.
export const differentiators: Differentiator[] = [
  {
    title: 'AI-native mobile, integrated for real',
    description:
      'Most "AI-powered" apps wrap a single API call in a modal. I ship the harder version: streaming audio translation, on-device intelligence pipelines, multi-provider failover, and SSE voice responses, across Gemini, Groq, Deepgram, and ElevenLabs, in production.',
  },
  {
    title: 'Privacy-first architecture, evidenced not claimed',
    description:
      'AES-256-GCM encryption on-device, local-first storage with an encrypted vault, GDPR/CCPA compliance as defaults, and AI proxies hardened with OAuth verification and rate limits. The kind of data handling that matters in health, fintech, and anything personal.',
  },
  {
    title: 'One builder, interface to deploy',
    description:
      'You work directly with the person designing the screens, modeling the data, securing the API, and shipping the build. No handoffs between design, dev, and ops, and nothing glossed over in between.',
  },
  {
    title: 'Shipped for real users, not a demo',
    description:
      'Every build carries CI, secret scanning, monitoring, and a real release process. Eleven products across civic, logistics, translation, PropTech, and spatial AI have run that gauntlet, so I know what breaks at each layer.',
  },
]
