// The founder story, told one chapter per page. Each page renders its own
// chapter with <StoryChapter> and links to the next with <StoryNext>, so a
// visitor browsing in nav order reads the story start to finish. Edit the
// copy here, never inline in a page. Voice rules live in docs/brand-voice.md.
//
// The through-line is "the second job": running the tech on top of running
// the business. Chapter 1 names it, each chapter after takes a piece of it off
// the owner's plate, and chapter 7 closes on it.

export type StoryChapterId =
  | 'belief'
  | 'story'
  | 'proof'
  | 'work'
  | 'handoff'
  | 'ai'
  | 'door'

export type EvidenceId = 'employers' | 'venture' | 'approval' | 'ai-importance' | 'ai-cost'

export interface StoryChapter {
  id: StoryChapterId
  // The page this chapter lives on. Must be a real route.
  path: string
  // Short name used in the chapter label and the "Next chapter" link.
  title: string
  heading: string
  body: string[]
  // Optional first-person lines from the founder, in their own words. Leave
  // empty rather than writing them for the founder: the story never invents
  // biography.
  personal?: string[]
  // Sourced stats shown under the copy (see EVIDENCE below).
  evidence?: EvidenceId[]
  // One-line teaser for the NEXT chapter, shown on the "Next chapter" link.
  // Every chapter but the last has one.
  bridge?: string
}

export const STORY: StoryChapter[] = [
  {
    id: 'belief',
    path: '/',
    title: 'The second job',
    heading: 'Nobody hands you the second job. You just end up with it.',
    body: [
      "It's 10:40 on a Tuesday. The shop closed hours ago, and you're on video four of a tutorial about DNS records. Tomorrow you open at seven.",
      "That's the second job: the website, the booking system, the analytics, the AI everyone says you need. For Black and brown business owners, it usually lands with less money behind it and fewer people to call. The numbers say so.",
    ],
    evidence: ['employers', 'venture'],
    bridge: 'Why I started a studio about it',
  },
  {
    id: 'story',
    path: '/about',
    title: 'Why this studio exists',
    heading: 'Not one moment. An accumulation.',
    body: [
      "People ask what made me start this. There wasn't a single moment. It's an accumulation of experiences, personal and historical, about who gets resources and who gets left to figure it out.",
      "The gap isn't drive. Black and Hispanic owners apply for financing, pick up new tools, and build anyway. What's missing is the backing: the capital, and the people in your corner who can build the site and explain how it works.",
      "So that's what I do. I build it, I teach you to run it, and I don't disappear. Everyone's welcome here. I built this studio with Black and brown business owners in mind, and I'm not shy about saying so.",
    ],
    // The founder's own words go here (one or two true sentences about
    // something they saw or lived). Rendered after the first paragraph.
    personal: [],
    evidence: ['approval'],
    bridge: 'Five apps, one thread',
  },
  {
    id: 'proof',
    path: '/work',
    title: 'The proof',
    heading: "Every app here gets people what's already theirs",
    body: [
      'Think about the last time you had to fight for something you were owed: a refund, a callback, a straight answer from someone in charge.',
      "Everything I've built runs on that feeling. Money people are owed. A voice with their representatives. Control of their own data. A fair deal as a tenant. A small business that can be found and booked. That's what I want for yours.",
    ],
    bridge: "What I'll take off your plate",
  },
  {
    id: 'work',
    path: '/services',
    title: 'The work',
    heading: 'Built for you. Handed to you.',
    body: [
      'Picture a Monday where the website just works, bookings come in on their own, and you know what your numbers mean without asking anyone.',
      "Every engagement has two halves. First I build it: the website, the app, the AI layer. Then the Own It package teaches you to run it, so the second job gets smaller instead of bigger. Pricing works on a sliding scale based on your business's size and stage.",
    ],
    bridge: 'How the handoff works',
  },
  {
    id: 'handoff',
    path: '/process',
    title: 'The handoff',
    heading: 'You leave knowing how it works',
    body: [
      "Maybe you've been here before: a site you can't update, numbers you can't read, and a developer who stopped answering.",
      "That isn't a handoff. It's the second job with a password on it. So the last phase of every build is teaching. We sit with your site together until you can update it, read your analytics, and check its health on your own.",
    ],
    bridge: 'Where AI fits, honestly',
  },
  {
    id: 'ai',
    path: '/why-not-ai',
    title: 'AI on your terms',
    heading: "You're not behind on AI. You're underfunded for it.",
    body: [
      "The Federal Reserve's own survey found that Black-owned businesses using AI are more than twice as likely as white-owned ones to call it very important to their business. They also run into cost as an obstacle more often.",
      "So the drive is there. The backing isn't. I'll set AI up safely on what you already run, and teach you where it helps and where a person still needs to be in the loop.",
    ],
    evidence: ['ai-importance', 'ai-cost'],
    bridge: 'Your turn',
  },
  {
    id: 'door',
    path: '/contact',
    title: 'The door',
    heading: "Your business is the job. Let's take the second one off your plate.",
    body: [
      'Remember that Tuesday night tutorial? This is where it ends.',
      "The first consultation is free, and pricing works on a sliding scale based on your business's size and stage. No spec, no deck, no pressure. Everyone's welcome. And if you're a Black or brown business owner who's been told to figure the tech out alone, this studio was built for you.",
    ],
  },
]

// The line the story closes on (About and Contact).
export const STORY_CLOSING = 'If not me, then who?'

// The five apps that carry the mission, in the order the proof chapter tells
// them. Work.tsx also lists these case studies first.
export const STORY_PROOF: { slug: string; line: string }[] = [
  { slug: 'stlmnt-settlement-tracker', line: 'Settlement money people are owed, claimed without handing over their data.' },
  { slug: 'pinpoint-civic-engagement', line: 'A direct line to your representatives, and neighbors to organize with.' },
  { slug: 'payback-consumer-intelligence', line: 'Your personal data stays on your phone, and the insights stay yours.' },
  { slug: 'rentharbor-property-management', line: 'A fair, clear system for tenants and landlords, with community resources built in.' },
  { slug: 'unmasked-coaching', line: 'A small business site for a coaching practice centered on belonging: live booking, real SEO, and analytics from day one.' },
]

// Sourced facts behind the story. Every figure was checked against the
// primary source at the URL given; keep the wording to what the source says
// (it uses "Hispanic-owned", so we do too). Update `date` when you refresh one.
export interface Evidence {
  id: EvidenceId
  value: number
  decimals?: number
  suffix: string
  label: string
  source: string
  url: string
  date: string
}

const FED_SBCS_RACE_2026 =
  'https://www.fedsmallbusiness.org/-/media/project/clevelandfedtenant/fsbsite/reports/2026/2026-firms-in-focus-chartbooks/sbcs_chartbook2026_raceethnicity.pdf'

export const EVIDENCE: Record<EvidenceId, Evidence> = {
  employers: {
    id: 'employers',
    value: 3,
    suffix: '%',
    label: 'of U.S. employer businesses were majority Black-owned in 2022, while about 14% of Americans are Black.',
    source: 'Pew Research Center, from the Census Annual Business Survey',
    url: 'https://www.pewresearch.org/short-reads/2025/02/12/a-look-at-black-owned-businesses-in-the-us/',
    date: 'Feb 2025',
  },
  venture: {
    id: 'venture',
    value: 0.4,
    decimals: 1,
    suffix: '%',
    label: 'of U.S. startup funding went to startups with a Black founder in 2024.',
    source: 'Crunchbase News',
    url: 'https://news.crunchbase.com/diversity/startup-funding-share-black-founders-down-cleantech-healthcare/',
    date: 'Feb 2025',
  },
  approval: {
    id: 'approval',
    value: 32,
    suffix: '%',
    label: 'of Black-owned firms that applied for a loan, credit line, or cash advance got everything they asked for (Hispanic-owned: 33%). For white-owned firms: 57%.',
    source: 'Federal Reserve Small Business Credit Survey, 2025',
    url: FED_SBCS_RACE_2026,
    date: 'Apr 2026',
  },
  'ai-importance': {
    id: 'ai-importance',
    value: 43,
    suffix: '%',
    label: 'of Black-owned firms using AI call it very important to their core business. For white-owned firms: 18%.',
    source: 'Federal Reserve Small Business Credit Survey, 2025',
    url: FED_SBCS_RACE_2026,
    date: 'Apr 2026',
  },
  'ai-cost': {
    id: 'ai-cost',
    value: 28,
    suffix: '%',
    label: 'of Black-owned firms using AI name cost as a challenge (Hispanic-owned: 27%). For white-owned firms: 18%.',
    source: 'Federal Reserve Small Business Credit Survey, 2025',
    url: FED_SBCS_RACE_2026,
    date: 'Apr 2026',
  },
}

export function chapterById(id: StoryChapterId): { chapter: StoryChapter; index: number } {
  const index = STORY.findIndex((c) => c.id === id)
  return { chapter: STORY[index], index }
}
