// Single source of truth for apps with published legal docs. Powers the
// /legal index, the per-app /legal/:app hub, and Support.tsx's inline
// "Policies & legal" list — all three used to keep their own copies of this
// array, which meant adding or renaming an app risked updating one and
// missing the others.
export interface LegalApp {
  slug: string
  name: string
  blurb: string
  privacy: string
  terms: string
}

export const legalApps: LegalApp[] = [
  {
    slug: 'yap',
    name: 'The Yap App',
    blurb: 'Live translation across 37 languages, built for real conversations.',
    privacy: '/legal/yap/privacy',
    terms: '/legal/yap/terms',
  },
  {
    slug: 'payback',
    name: 'Ôwn (Payback)',
    blurb: 'Local-first consumer insights, built so your data stays on your device.',
    privacy: '/legal/payback/privacy',
    terms: '/legal/payback/terms',
  },
  {
    slug: 'pinpoint',
    name: 'Pinpoint',
    blurb: 'Civic engagement, keeping communities connected to what matters locally.',
    privacy: '/legal/pinpoint/privacy',
    terms: '/legal/pinpoint/terms',
  },
  {
    slug: 'drayagepro',
    name: 'DrayagePro TMS',
    blurb: 'Transportation management built for drayage drivers and dispatchers.',
    privacy: '/legal/drayagepro/privacy',
    terms: '/legal/drayagepro/terms',
  },
  {
    slug: 'zoori',
    name: 'Zoori',
    blurb: 'Pet care tracking, from feeding schedules to vet visits.',
    privacy: '/legal/zoori/privacy',
    terms: '/legal/zoori/terms',
  },
  {
    slug: 'fengshui',
    name: 'Feng Shui',
    blurb: 'Spatial analysis that reads a room and suggests a better layout.',
    privacy: '/legal/fengshui/privacy',
    terms: '/legal/fengshui/terms',
  },
  {
    slug: 'stlmnt',
    name: 'STLMNT',
    blurb: 'A privacy-first tracker for class action settlement claims.',
    privacy: '/legal/stlmnt/privacy',
    terms: '/legal/stlmnt/terms',
  },
]

export const getLegalAppBySlug = (slug: string) =>
  legalApps.find((a) => a.slug === slug)
