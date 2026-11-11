// 5-phase workflow, written for the owner rather than for another developer.
// Each phase carries two timelines: a website (3–5 weeks end to end) and an
// app or custom build (7–13 weeks to build, plus launch). Showing only the app
// timeline made a small website look like a three-month project.

export interface ProcessStep {
  step: '01' | '02' | '03' | '04' | '05'
  title: string
  description: string
  substeps: string[]
  // Apps and custom builds.
  timeline: string
  // A business website.
  siteTimeline: string
  deliverables: string[]
}

export const processSteps: ProcessStep[] = [
  {
    step: '01',
    title: 'Talk It Through',
    description:
      'We talk about your business, your customers, and what you need the site or app to do. I tell you what I would build, what it costs, and how long it takes, before you pay anything.',
    substeps: [
      'A conversation about your business and your customers',
      'A look at what businesses like yours are doing online',
      "Agreeing what's in now and what can wait",
      'Your price and timeline, in writing',
    ],
    timeline: '1–2 weeks',
    siteTimeline: 'About 1 week',
    deliverables: [
      'A one-page plan',
      'Your price and timeline in writing',
      'A short list of what I need from you, like photos, text, and your logo',
    ],
  },
  {
    step: '02',
    title: "See It Before It's Built",
    description:
      'You see how it will look and work on a phone before I build it, and you tell me what to change. Nothing gets built that you have not seen.',
    substeps: [
      'Page layouts you can click through',
      'Your colors, logo, and photos in place',
      'You try it, and I fix whatever is confusing',
      'You approve the final look',
    ],
    timeline: '2–3 weeks',
    siteTimeline: 'About 1 week',
    deliverables: [
      'A clickable preview of your site or app',
      'Your approved design',
    ],
  },
  {
    step: '03',
    title: 'Build It',
    description:
      'I build it and test it on real phones and browsers, and check that it is fast and secure. You see progress along the way, so nothing is a surprise.',
    substeps: [
      'Built in short stretches, with a progress look each week',
      'Tested on phones, tablets, and computers',
      'Checked for speed and security',
      'Fixed and polished until it is right',
    ],
    timeline: '4–8 weeks',
    siteTimeline: '1–2 weeks',
    deliverables: [
      'A finished, working site or app',
      'Notes on how it was built, in plain language',
    ],
  },
  {
    step: '04',
    title: 'Go Live',
    description:
      'It goes on the internet under your name, and I check that everything works for real visitors. For 30 days after launch, I fix bugs at no charge.',
    substeps: [
      'Your domain and hosting set up in your name',
      'Visitor reports connected, so you can see who comes',
      'A final check on the live site',
      'A quick tour, so you know where everything is',
    ],
    timeline: '1–2 weeks',
    siteTimeline: 'A few days',
    deliverables: [
      'Your live site or app, in your own accounts',
      'A simple guide to where everything lives',
      '30 days of free bug fixes',
    ],
  },
  {
    step: '05',
    title: 'Hand It Over',
    description:
      "You don't leave with a login and a prayer. We walk through your site or app together until you can update it, read your numbers, and check its health on your own. Training is part of every website build.",
    substeps: [
      'A live walkthrough of how to change your pages and settings',
      'A tour of your numbers: where they live and what they mean',
      'The basics of checking your site is fast, online, and easy to find',
      "Where AI fits in your day, and where it doesn't",
      'Questions answered until it clicks',
    ],
    timeline: '1 week',
    siteTimeline: '1 week, alongside launch',
    deliverables: [
      'A plain-language guide for your setup',
      'Admin access and accounts in your name',
      'A monthly checklist for your site',
      'Optional monthly care plan, if you would rather not run it yourself',
    ],
  },
]
