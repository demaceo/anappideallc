// Turns the guided questions' answers into a first-draft message, so a visitor
// who does not know what to write gets something to edit instead of a blank
// box. Pure functions only (no React, no DOM): the contact form calls them and
// the tests drive them directly.
//
// Copy rules: plain sentences in the visitor's voice, no em dashes (the
// copy-voice test enforces that for this file), and nothing for an answer the
// visitor skipped or marked "not sure".

export type ProjectType = 'website' | 'app' | 'both' | 'unsure' | ''
export type Platform = 'ios' | 'android' | 'web'
export type Importance = '' | 'unsure' | 'nice' | 'important' | 'critical'

export interface GuidedAnswers {
  projectType: ProjectType
  platforms: Platform[]
  categories: string[]
  categoryOther: string
  seo: Importance
  geo: Importance
  audience: string
  budget: string
}

/** The label of the "Something else" business category, which carries free text. */
export const OTHER_CATEGORY = 'Something else'

const OPENING: Record<Exclude<ProjectType, ''>, string> = {
  website: "I'm looking for help with a website.",
  app: "I'm looking for help building a mobile app.",
  both: "I'm looking for a mobile app and a website to go with it.",
  unsure:
    "I'm not sure yet whether I need a website, an app, or something else, and I'd like to talk it through.",
}

const PLATFORM_PHRASE: Record<Platform, string> = {
  ios: 'iPhone',
  android: 'Android',
  web: 'the web',
}

const IMPORTANCE_PHRASE: Partial<Record<Importance, string>> = {
  nice: 'would be nice to have',
  important: 'is important to me',
  critical: 'is a must-have',
}

/** "a", "a and b", "a, b and c". */
export function joinList(items: string[]): string {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}

/** Trim, and drop trailing periods so a sentence can add its own. */
const clean = (text: string) => text.trim().replace(/[.\s]+$/, '')

/**
 * The service ids a guided answer implies. The visitor can always untick; this
 * is only ever added to what they already ticked.
 */
export function servicesForProjectType(type: ProjectType): string[] {
  switch (type) {
    case 'website':
      return ['business-websites']
    case 'app':
      return ['custom-builds']
    case 'both':
      return ['business-websites', 'custom-builds']
    default:
      return []
  }
}

/**
 * Two short paragraphs: what they want (and where it should run), then the
 * details. Returns '' when nothing was answered.
 */
export function buildDraftMessage(a: GuidedAnswers): string {
  const hasApp = a.projectType === 'app' || a.projectType === 'both'
  // Ranking on Google is a website question: skip it for an app-only project,
  // even if the visitor answered it before changing their mind.
  const hasWeb = a.projectType !== 'app'

  const lead: string[] = []
  if (a.projectType) lead.push(OPENING[a.projectType])
  if (hasApp && a.platforms.length) {
    lead.push(`It should work on ${joinList(a.platforms.map((p) => PLATFORM_PHRASE[p]))}.`)
  }

  const details: string[] = []
  const categories = a.categories
    .map((c) => (c === OTHER_CATEGORY ? clean(a.categoryOther) : c.toLowerCase()))
    .filter(Boolean)
  if (categories.length) details.push(`My business is in ${joinList(categories)}.`)
  if (clean(a.audience)) details.push(`It's for ${clean(a.audience)}.`)
  if (hasWeb) {
    const seo = IMPORTANCE_PHRASE[a.seo]
    if (seo) details.push(`Showing up on Google ${seo}.`)
    const geo = IMPORTANCE_PHRASE[a.geo]
    if (geo) details.push(`Getting recommended by AI assistants like ChatGPT ${geo}.`)
  }
  if (clean(a.budget)) details.push(`Budget ballpark: ${clean(a.budget)}.`)

  return [lead.join(' '), details.join(' ')].filter(Boolean).join('\n\n')
}

export interface MergedDraft {
  text: string
  /** True when the draft went after text the visitor had already written. */
  appended: boolean
}

/**
 * Puts a new draft into the message box without losing what the visitor typed.
 *  - Empty box: the draft is the message.
 *  - Box still holds the previous draft (edited around or not): replace it in
 *    place, so regenerating never stacks two drafts.
 *  - Otherwise the visitor wrote their own words: the draft goes underneath.
 * An empty draft changes nothing.
 */
export function mergeDraft(current: string, previousDraft: string | null, next: string): MergedDraft {
  if (!next) return { text: current, appended: false }
  if (!current.trim()) return { text: next, appended: false }
  if (previousDraft && current.includes(previousDraft)) {
    // A function replacement: with a plain string, "$&" or "$1" in the draft
    // (a budget of "$10k", say) would be read as a replacement pattern.
    return { text: current.replace(previousDraft, () => next), appended: false }
  }
  return { text: `${current.trimEnd()}\n\n${next}`, appended: true }
}
