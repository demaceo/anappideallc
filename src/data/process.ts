// 4-phase workflow ported from the old MHI repo.

export interface ProcessStep {
  step: '01' | '02' | '03' | '04'
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
]
