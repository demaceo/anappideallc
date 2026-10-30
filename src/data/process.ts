// 5-phase workflow. Phases 01–04 ported from the old MHI repo; 05 (Handoff
// & Teaching) is the founder-story promise that owners can run what we build.

export interface ProcessStep {
  step: '01' | '02' | '03' | '04' | '05'
  title: string
  description: string
  substeps: string[]
  timeline: string
  deliverables: string[]
}

export const processSteps: ProcessStep[] = [
  {
    step: '01',
    title: 'Discovery & Strategy',
    description:
      'We dig into your goals, users, and constraints to produce a clear, opinionated roadmap before any code is written.',
    substeps: [
      'Stakeholder interviews and requirements gathering',
      'Competitive analysis and market research',
      'User persona and journey mapping',
      'Technical feasibility assessment',
      'Project scope and timeline definition',
    ],
    timeline: '1–2 weeks',
    deliverables: [
      'Project brief and requirements document',
      'User research findings',
      'Technical architecture proposal',
      'Detailed timeline with milestones',
    ],
  },
  {
    step: '02',
    title: 'Design & Prototyping',
    description:
      'Requirements become interactive prototypes. We validate the concept with real users before development locks in.',
    substeps: [
      'Wireframing and information architecture',
      'Visual design and brand application',
      'Interactive prototype development',
      'Usability testing with target users',
      'Design system component definition',
    ],
    timeline: '2–3 weeks',
    deliverables: [
      'High-fidelity interactive prototypes',
      'Design system and component library',
      'Usability testing report',
      'Approved final designs and specs',
    ],
  },
  {
    step: '03',
    title: 'Development & Testing',
    description:
      'Sprint-based iterative builds with continuous testing. Code review, performance, and security are part of every sprint.',
    substeps: [
      'Sprint-based iterative development',
      'Code review and QA',
      'Unit, integration, and E2E testing',
      'Performance optimization and monitoring',
      'Security scanning and vulnerability fixes',
    ],
    timeline: '4–8 weeks',
    deliverables: [
      'Fully functional application',
      'Automated test suite',
      'Performance and security audit reports',
      'Technical documentation',
    ],
  },
  {
    step: '04',
    title: 'Launch & Support',
    description:
      'Deploy with confidence. Monitoring, analytics, and post-launch support keep things stable as the product meets reality.',
    substeps: [
      'Production deployment and DNS configuration',
      'Monitoring and analytics setup',
      'User training and documentation',
      'Post-launch bug fixes and optimizations',
      'Ongoing maintenance and feature work',
    ],
    timeline: '1–2 weeks + ongoing',
    deliverables: [
      'Deployed production application',
      'Monitoring dashboards and alerts',
      'User and admin documentation',
      'Support and maintenance plan',
    ],
  },
  {
    step: '05',
    title: 'Handoff & Teaching',
    description:
      "You don't leave with a login and a prayer. We walk through your site or app together until you can update it, read your analytics, and check its health on your own. Want to go deeper? That's the Own It package.",
    substeps: [
      'Live walkthrough of your admin, content, and settings',
      'Analytics tour: where your numbers live and what they mean',
      'Site-health basics: speed, uptime, and search visibility',
      'Where AI fits in your day-to-day, and where it doesn\'t',
      'Questions answered until it clicks',
    ],
    timeline: '1 week',
    deliverables: [
      'Plain-language handoff guide for your setup',
      'Admin access and accounts in your name',
      'Monthly site-health checklist',
      'Optional path into the Own It package',
    ],
  },
]
