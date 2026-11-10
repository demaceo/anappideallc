import { describe, it, expect } from 'vitest'
import {
  buildDraftMessage,
  joinList,
  mergeDraft,
  servicesForProjectType,
  type GuidedAnswers,
} from '../contact-draft'

const EMPTY: GuidedAnswers = {
  projectType: '',
  platforms: [],
  categories: [],
  categoryOther: '',
  seo: '',
  geo: '',
  audience: '',
  budget: '',
}

const draft = (a: Partial<GuidedAnswers>) => buildDraftMessage({ ...EMPTY, ...a })

describe('joinList', () => {
  it.each([
    [[], ''],
    [['a'], 'a'],
    [['a', 'b'], 'a and b'],
    [['a', 'b', 'c'], 'a, b and c'],
  ])('joins %j as "%s"', (items, expected) => {
    expect(joinList(items)).toBe(expected)
  })
})

describe('buildDraftMessage', () => {
  it('writes nothing when nothing was answered', () => {
    expect(draft({})).toBe('')
  })

  it('opens each project type in the visitor\'s voice', () => {
    expect(draft({ projectType: 'website' })).toBe("I'm looking for help with a website.")
    expect(draft({ projectType: 'app' })).toBe("I'm looking for help building a mobile app.")
    expect(draft({ projectType: 'both' })).toBe("I'm looking for a mobile app and a website to go with it.")
    expect(draft({ projectType: 'unsure' })).toBe(
      "I'm not sure yet whether I need a website, an app, or something else, and I'd like to talk it through.",
    )
  })

  it('writes the website example as two paragraphs', () => {
    expect(
      draft({
        projectType: 'website',
        categories: ['Salon & beauty'],
        audience: 'neighbors within 10 miles',
        seo: 'important',
        budget: '$4k',
      }),
    ).toBe(
      "I'm looking for help with a website.\n\n" +
        "My business is in salon & beauty. It's for neighbors within 10 miles. " +
        'Showing up on Google is important to me. Budget ballpark: $4k.',
    )
  })

  it('writes the app example with platforms and several categories', () => {
    expect(
      draft({
        projectType: 'app',
        platforms: ['ios', 'android'],
        categories: ['Food & drink', 'Events & booking'],
        audience: 'college students',
        budget: 'not sure yet',
      }),
    ).toBe(
      "I'm looking for help building a mobile app. It should work on iPhone and Android.\n\n" +
        "My business is in food & drink and events & booking. It's for college students. " +
        'Budget ballpark: not sure yet.',
    )
  })

  it('writes the both example, with "Something else" replaced by what they typed', () => {
    expect(
      draft({
        projectType: 'both',
        platforms: ['ios', 'web'],
        categories: ['Something else'],
        categoryOther: 'Dog grooming',
        seo: 'critical',
        geo: 'nice',
      }),
    ).toBe(
      "I'm looking for a mobile app and a website to go with it. It should work on iPhone and the web.\n\n" +
        'My business is in Dog grooming. Showing up on Google is a must-have. ' +
        'Getting recommended by AI assistants like ChatGPT would be nice to have.',
    )
  })

  it('writes the "not sure" example as one sentence', () => {
    expect(draft({ projectType: 'unsure', seo: 'unsure', geo: 'unsure' })).toBe(
      "I'm not sure yet whether I need a website, an app, or something else, and I'd like to talk it through.",
    )
  })

  it('skips "not sure" and blank answers', () => {
    const text = draft({ projectType: 'website', seo: 'unsure', geo: '', audience: '   ', budget: '' })
    expect(text).toBe("I'm looking for help with a website.")
  })

  it('drops "Something else" when no text was typed, and keeps the rest', () => {
    expect(draft({ categories: ['Something else', 'Retail & online store'], categoryOther: '  ' })).toBe(
      'My business is in retail & online store.',
    )
    expect(draft({ categories: ['Something else'], categoryOther: '' })).toBe('')
  })

  it('does not mention platforms for a website, even if some were picked earlier', () => {
    expect(draft({ projectType: 'website', platforms: ['ios'] })).not.toMatch(/iPhone/)
  })

  it('does not mention Google or AI for an app-only project, even if answered earlier', () => {
    // The visitor can answer "how will people find it", then go back and switch
    // to "an app". The stale answers must not leak into the message.
    const text = draft({ projectType: 'app', seo: 'critical', geo: 'important' })
    expect(text).not.toMatch(/Google|AI assistants/)
  })

  it('keeps Google and AI for "both" and for a visitor who has not chosen a type', () => {
    expect(draft({ projectType: 'both', seo: 'nice' })).toMatch(/Showing up on Google would be nice to have/)
    expect(draft({ projectType: '', seo: 'important' })).toBe('Showing up on Google is important to me.')
  })

  it('strips trailing periods so a sentence does not double them', () => {
    expect(draft({ audience: 'new moms.', budget: '$2k..' })).toBe(
      "It's for new moms. Budget ballpark: $2k.",
    )
  })

  it('keeps a budget containing "$" characters untouched', () => {
    expect(draft({ budget: '$10k & up, or $& more' })).toBe('Budget ballpark: $10k & up, or $& more.')
  })

  it('uses no em dash', () => {
    const everything = draft({
      projectType: 'both',
      platforms: ['ios', 'android', 'web'],
      categories: ['Something else', 'Salon & beauty'],
      categoryOther: 'x',
      audience: 'y',
      seo: 'nice',
      geo: 'critical',
      budget: 'z',
    })
    expect(everything).not.toContain('—')
  })
})

describe('servicesForProjectType', () => {
  it.each([
    ['website', ['business-websites']],
    ['app', ['custom-builds']],
    ['both', ['business-websites', 'custom-builds']],
    ['unsure', []],
    ['', []],
  ] as const)('maps %s', (type, ids) => {
    expect(servicesForProjectType(type)).toEqual(ids)
  })
})

describe('mergeDraft', () => {
  it('uses the draft as the message when the box is empty or blank', () => {
    expect(mergeDraft('', null, 'Draft')).toEqual({ text: 'Draft', appended: false })
    expect(mergeDraft('  \n ', null, 'Draft')).toEqual({ text: 'Draft', appended: false })
  })

  it('changes nothing for an empty draft', () => {
    expect(mergeDraft('Mine', null, '')).toEqual({ text: 'Mine', appended: false })
    expect(mergeDraft('', null, '')).toEqual({ text: '', appended: false })
  })

  it('regenerates in place when the box still holds the previous draft', () => {
    expect(mergeDraft('Old draft', 'Old draft', 'New draft')).toEqual({ text: 'New draft', appended: false })
  })

  it('regenerates in place around text the visitor added to the draft', () => {
    const current = 'Hi, I am Sam.\n\nOld draft\n\nThanks!'
    expect(mergeDraft(current, 'Old draft', 'New draft')).toEqual({
      text: 'Hi, I am Sam.\n\nNew draft\n\nThanks!',
      appended: false,
    })
  })

  it('appends under text the visitor wrote themselves', () => {
    expect(mergeDraft('My own words.\n', null, 'Draft')).toEqual({
      text: 'My own words.\n\nDraft',
      appended: true,
    })
  })

  it('appends when the visitor edited the previous draft beyond recognition', () => {
    expect(mergeDraft('Totally rewritten', 'Old draft', 'New draft')).toEqual({
      text: 'Totally rewritten\n\nNew draft',
      appended: true,
    })
  })

  it('treats "$&" and "$1" in the new draft literally when replacing in place', () => {
    // String.replace(old, "$&") would insert the matched text instead.
    const next = 'Budget ballpark: $& or $1 or $$'
    expect(mergeDraft('Old draft', 'Old draft', next).text).toBe(next)
  })
})
