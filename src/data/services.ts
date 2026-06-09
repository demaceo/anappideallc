// Services offered by An App Idea LLC.
// Ported from the old MHI repo (lib/data/services.ts) — Tailwind gradients
// and Lucide icon imports stripped to keep the bundle lean.

export interface Service {
  id: string
  slug: string
  title: string
  description: string
  features: string[]
  technologies: string[]
  useCases: string[]
  deliverables: string[]
  metric?: { label: string; value: string }
}

export const services: Service[] = [
  {
    id: 'mvp-development',
    slug: 'mvp-development',
    title: 'MVP Development & Validation',
    description:
      'Rapidly validate product ideas with functional prototypes that attract users and secure funding.',
    features: [
      'Rapid prototyping with production-grade code',
      'Auth, authorization, and account management',
      'Database design and API development',
      'Payment integration (Stripe, PayPal)',
      'User analytics and behavior tracking',
      'Iterative weekly sprints with demos',
      'Scalability planning baked into the architecture',
    ],
    technologies: ['Next.js', 'Supabase', 'Prisma', 'PostgreSQL', 'Stripe', 'NextAuth', 'Vercel', 'Sentry'],
    useCases: [
      'Founders testing product-market fit',
      'Teams pitching to investors with a working demo',
      'Established businesses exploring new product lines',
    ],
    deliverables: [
      'Functional MVP application deployed to production',
      'Authentication, payments, and core feature set',
      'User feedback collection system',
      'Growth and scaling recommendations',
    ],
    metric: { label: 'Time to Launch', value: '6–8 weeks' },
  },
  {
    id: 'ui-engineering',
    slug: 'ui-engineering',
    title: 'Product & UI Engineering',
    description:
      'Turn ideas into production-ready interfaces with scalable architectures and modern frameworks.',
    features: [
      'Component-driven architecture with design systems',
      'Performance optimization and Core Web Vitals tuning',
      'Accessibility compliance (WCAG 2.1 AA)',
      'Cross-browser compatibility',
      'State management and data flow design',
      'Animation and micro-interaction craft',
    ],
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Radix UI', 'Zustand', 'React Query'],
    useCases: [
      'SaaS platforms with complex UI states',
      'Editorial and content management interfaces',
      'Customer portals with personalized dashboards',
    ],
    deliverables: [
      'Production-ready component library',
      'Design system documentation',
      'Performance audit and optimizations',
      'Automated testing suite',
    ],
    metric: { label: 'Accessibility', value: 'WCAG AA' },
  },
  {
    id: 'business-websites',
    slug: 'business-websites',
    title: 'Business Website Development',
    description:
      'Professional websites that establish credibility, convert visitors, and grow with your business.',
    features: [
      'SEO-optimized architecture and content strategy',
      'Headless CMS integration',
      'Contact forms and lead capture',
      'Email marketing integration',
      'Analytics and conversion tracking',
      'Sub-2-second page loads',
      'Mobile-first responsive design',
    ],
    technologies: ['Next.js', 'Sanity CMS', 'Contentful', 'Vercel', 'Plausible', 'Schema.org', 'Resend'],
    useCases: [
      'Professional services firms needing credibility',
      'Startups launching with a strong web presence',
      'Small businesses expanding online',
    ],
    deliverables: [
      'Deployed production website',
      'CMS training and documentation',
      'SEO configuration and sitemap',
      'Analytics dashboard configured',
    ],
    metric: { label: 'Page Load', value: '< 2s' },
  },
  {
    id: 'data-visualization',
    slug: 'data-visualization',
    title: 'Data Visualization & Analytics',
    description:
      'Turn complex datasets into compelling visual stories that drive insights and enable data-driven decisions.',
    features: [
      'Custom interactive charts and dashboards',
      'Real-time data streaming',
      'Multi-dimensional data exploration',
      'Export to PDF, PNG, and CSV',
      'Color-blind-friendly palettes',
      'Drill-down and filtering interactions',
    ],
    technologies: ['D3.js', 'Recharts', 'Apache ECharts', 'Plotly', 'WebGL', 'Canvas API', 'WebSockets'],
    useCases: [
      'Business intelligence dashboards',
      'Financial reporting and market analysis',
      'IoT sensor monitoring',
    ],
    deliverables: [
      'Interactive dashboard application',
      'Custom visualization component library',
      'Data pipeline integration docs',
      'Performance benchmarks',
    ],
    metric: { label: 'Data Points Handled', value: '10M+' },
  },
]
