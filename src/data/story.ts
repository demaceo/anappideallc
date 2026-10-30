// The founder story, told one chapter per page. Each page renders its own
// chapter with <StoryChapter> and links to the next with <StoryNext>, so a
// visitor browsing in nav order reads the story start to finish. Edit the
// copy here, never inline in a page. Voice rules live in docs/brand-voice.md.

export type StoryChapterId =
  | 'belief'
  | 'story'
  | 'proof'
  | 'work'
  | 'handoff'
  | 'ai'
  | 'door'

export interface StoryChapter {
  id: StoryChapterId
  // The page this chapter lives on. Must be a real route.
  path: string
  // Short name used in the chapter label and the "Next chapter" link.
  title: string
  heading: string
  body: string[]
}

export const STORY: StoryChapter[] = [
  {
    id: 'belief',
    path: '/',
    title: 'The belief',
    heading: "Access shouldn't depend on who you are",
    body: [
      'For generations, Black and brown communities in the U.S. have been underfunded and under-resourced. Technology is where that gap shows most: in who gets funded, who gets built for, and who gets left to figure it out alone.',
      "So owners end up learning to code between customers. That's a second job nobody should have to take on. I'd rather take it off your plate.",
    ],
  },
  {
    id: 'story',
    path: '/about',
    title: 'Why this studio exists',
    heading: 'Not one moment. An accumulation.',
    body: [
      "People ask what made me start this. There wasn't a single moment. It's an accumulation of experiences, personal and historical, about who gets resources and who gets left to figure it out.",
      "Black and brown business owners are building with less capital, fewer networks, and fewer people in their corner who can build the site, explain the analytics, and say plainly where AI helps. That's the gap I work in.",
      'So here\'s the deal. I build your website or app. Then I teach you to run it: update it, read your numbers, check its health, and use AI in your day-to-day. You focus on your business. The technology works for you, and you understand it.',
      "Everyone's welcome here. I work with any small business owner who wants a builder in their corner. But I built this studio with Black and brown business owners in mind, and I'm not shy about saying so.",
    ],
  },
  {
    id: 'proof',
    path: '/work',
    title: 'The proof',
    heading: "Every app here gets people what's already theirs",
    body: [
      'Look across what I\'ve built and the same thread runs through it: access. Money people are owed. A voice with the people who represent them. Control of their own data. A fair deal as a tenant. A small business that can be found and booked.',
      "That's what I want for your business, too.",
    ],
  },
  {
    id: 'work',
    path: '/services',
    title: 'The work',
    heading: 'Built for you. Handed to you.',
    body: [
      "Every engagement has two halves. First I build it: the website, the app, the AI layer. Then, if you want it, the Own It package teaches you to run it yourself, so you're never stuck waiting on someone else to change a price or read your traffic.",
      "Pricing works on a sliding scale based on your business's size and stage. The first consultation is free.",
    ],
  },
  {
    id: 'handoff',
    path: '/process',
    title: 'The handoff',
    heading: 'You leave knowing how it works',
    body: [
      "Plenty of owners have been handed a login and a prayer: a site they can't update, numbers they can't read, and a developer who stopped answering. That isn't a handoff. It's another dependency.",
      'So the last phase of every build is teaching. We walk through your site together until you can update it, read your analytics, and check its health on your own.',
    ],
  },
  {
    id: 'ai',
    path: '/why-not-ai',
    title: 'AI on your terms',
    heading: 'AI is a tool for your business, not a replacement for it',
    body: [
      'AI can save a small business real hours: drafting replies, answering routine questions, clearing the busywork. It can also leak customer data and confidently get things wrong.',
      "Black and brown-owned businesses shouldn't be the last to get the upside or the first to get burned. I'll set it up safely, and teach you where it helps and where a person still needs to be in the loop.",
    ],
  },
  {
    id: 'door',
    path: '/contact',
    title: 'The door',
    heading: "Your business is the job. Let's handle the tech.",
    body: [
      "The first consultation is free, and pricing works on a sliding scale based on your business's size and stage. No spec, no deck, no pressure.",
      "Everyone's welcome. And if you're a Black or brown business owner who's been told to figure the tech out alone, this studio was built for you.",
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

export function chapterById(id: StoryChapterId): { chapter: StoryChapter; index: number } {
  const index = STORY.findIndex((c) => c.id === id)
  return { chapter: STORY[index], index }
}
