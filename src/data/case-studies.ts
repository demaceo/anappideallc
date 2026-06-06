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
      'Zoori is a bilingual (en/es) Expo app connecting Puerto Rico rescue organizations with adopters and fosterers via swipe matching, application management, messaging, and push notifications.',
    tags: ['Social Impact', 'Mobile', 'Firebase', 'Bilingual', 'Multi-role'],
    stack: ['Expo SDK 54', 'React Native 0.81', 'Expo Router v6', 'TanStack Query v5', 'Zustand v5', 'Firebase', 'Firestore', 'Cloud Functions', 'Resend', 'i18next', 'TypeScript'],
    outcomes: [
      'Built a three-sided platform — adopter, rescue organization, and admin — each with dedicated dashboards, workflows, and access controls backed by Firestore rules.',
      'Delivered swipe-based dog discovery alongside a traditional browse-and-filter flow, with match scoring, saved dogs, and swipe history.',
      'Added bilingual support (English and Spanish), in-app messaging per conversation, push notifications, and transactional email via Resend.',
    ],
    stats: [
      { label: 'Timeline', value: 'Expo SDK 54, new arch' },
      { label: 'Team', value: 'Adopter · Org · Admin roles' },
      { label: 'Platform', value: 'iOS · Android' },
      { label: 'Impact', value: 'Bilingual · Swipe + Browse' },
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
          'I structured the app around Expo Router file-based routing with strict role-based layouts for adopter, organization, and admin. Firebase Auth, Firestore, and Cloud Functions power the backend. TanStack Query v5 handles server state, Zustand manages swipe and preference state client-side, and Reanimated v4 drives the swipe gesture layer. i18next covers bilingual content with locale detection.',
      },
      {
        title: 'Outcome',
        content:
          'Zoori gives rescue organizations a full operations dashboard for dogs, applications, and messaging, while adopters get swipe-based and browse-based discovery tuned to their preferences. Bilingual support, push notifications, and transactional email make the platform usable for both English- and Spanish-speaking communities in Puerto Rico.',
      },
    ],
    cover: {
      eyebrow: 'Pet adoption & fostering',
      headline: 'Swipe-based dog discovery and rescue org operations — bilingual, role-aware, real-time.',
      chips: ['Expo SDK 54 new arch', 'Firebase + Firestore', 'TanStack Query v5', 'i18next (en/es)'],
      metrics: [
        { label: 'Roles', value: '3-sided app' },
        { label: 'Languages', value: 'English + Spanish' },
        { label: 'Discovery', value: 'Swipe + Browse' },
      ],
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
      'Unmasked Coaching is a React 19 coaching website with Three.js 3D backgrounds, Framer Motion animations, Calendly integration, cookie consent, and Vercel deployment.',
    tags: ['Web', 'Coaching', '3D', 'SEO', 'Vercel'],
    stack: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Three.js', 'React Three Fiber', 'React Calendly', 'Vercel'],
    outcomes: [
      'Built a polished coaching site with a Three.js silk background, Framer Motion page transitions, and a Calendly booking flow embedded in the contact section.',
      'Added full SEO coverage — sitemap, robots.txt, meta tags — alongside cookie consent and dedicated Privacy and Cookie Policy pages.',
      'Delivered a responsive, performance-optimized build with code splitting and lazy loading for optimal Lighthouse scores.',
    ],
    stats: [
      { label: 'Timeline', value: 'Solo client build' },
      { label: 'Team', value: 'Founder-led delivery' },
      { label: 'Platform', value: 'Web' },
      { label: 'Impact', value: 'Live booking · 3D UI' },
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
          'I built the site in React 19 with Vite and Tailwind, using Three.js and React Three Fiber for the interactive silk background and Framer Motion for section transitions. Calendly is embedded directly so visitors can book without leaving the page. Cookie consent and Privacy/Policy pages handle compliance out of the box.',
      },
      {
        title: 'Outcome',
        content:
          'Unmasked Coaching launched with a distinctive 3D visual identity, direct session booking, and SEO infrastructure in place — ready for organic traffic and referrals without additional configuration.',
      },
    ],
    cover: {
      eyebrow: 'Adoption-attuned coaching',
      headline: 'A 3D-accented coaching site with direct booking, full SEO, and privacy compliance.',
      chips: ['Three.js silk BG', 'Framer Motion', 'Calendly embed', 'Vercel deploy'],
      metrics: [
        { label: 'Booking', value: 'Calendly inline' },
        { label: 'Visual FX', value: 'Three.js + Reanimated' },
        { label: 'SEO', value: 'Sitemap + meta' },
      ],
    },
    liveUrl: 'https://unmasked-coaching.vercel.app',
  },
  {
    slug: 'timeless-coach-consult',
    title: 'Timeless Coach Consult',
    category: 'Coaching website',
    summary:
      'A fully static Next.js website for a certified life coach specializing in adoption, life transitions, and personal development — with a curated resource library, service packages, and an accessible contact form.',
    metaDescription:
      'Timeless Coaching & Consulting is a fully static Next.js 16 site with Tailwind CSS v4, Cormorant Garamond typography, a resource library, service packages, and WCAG-compliant design.',
    tags: ['Web', 'Next.js', 'Coaching', 'Static', 'Accessibility'],
    stack: ['Next.js 16', 'React 19', 'Tailwind CSS v4', 'TypeScript', 'Vercel', 'next/image', 'next/font'],
    outcomes: [
      'Delivered a fully static Next.js site with App Router — no backend required — ready for Vercel deployment with a custom domain.',
      'Built a multi-page structure: home, about, services with packages and FAQ, and a curated resources page with journal prompts.',
      'Used Cormorant Garamond and Raleway for a premium editorial typographic identity aligned with the coach\'s brand.',
    ],
    stats: [
      { label: 'Timeline', value: 'Static site, no backend' },
      { label: 'Team', value: 'Solo client build' },
      { label: 'Platform', value: 'Web' },
      { label: 'Impact', value: 'WCAG AA · Multi-page' },
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
          'I built the site with Next.js 16 App Router in fully static output mode. Tailwind CSS v4 handles the design system, with brand tokens defined as CSS custom properties. next/image optimizes the AVIF and JPEG assets, next/font loads Cormorant Garamond and Raleway without layout shift, and the contact form uses a client-side mailto fallback.',
      },
      {
        title: 'Outcome',
        content:
          "Timeless Coach Consult launched as a performant, WCAG AA-compliant static site on Vercel — covering Yvonne's bio, services, resource library, and contact without any backend or CMS overhead. The brand identity translated cleanly from her Wix reference into a modern editorial format.",
      },
    ],
    cover: {
      eyebrow: 'Certified life coaching',
      headline: 'A fully static Next.js coaching site with editorial typography, service packages, and a resource library.',
      chips: ['Next.js 16 static', 'Tailwind CSS v4', 'Cormorant Garamond', 'Vercel deploy'],
      metrics: [
        { label: 'Pages', value: '4 sections' },
        { label: 'Output', value: 'Fully static' },
        { label: 'Deploy', value: 'Vercel + CDN' },
      ],
    },
    liveUrl: 'https://www.timelesscoach-consult.com',
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

export const differentiators: Differentiator[] = [
  {
    title: 'Founder-level ownership',
    description:
      'You work directly with the person building your product. No handoffs between design, dev, and ops teams.',
  },
  {
    title: 'End-to-end engineering depth',
    description:
      'Interface design, database architecture, auth, API security, and deployment pipelines. All from the same builder. Nothing gets outsourced or glossed over.',
  },
  {
    title: 'Shipping discipline, not just code',
    description:
      'Every build includes CI, secret scanning, monitoring, and release processes. The product ships ready for real users, not just a demo audience.',
  },
  {
    title: 'Privacy and trust as defaults',
    description:
      'Data handling, encryption, moderation, and consent flows are built into the architecture from day one, not bolted on before launch.',
  },
]
