import { describe, it, expect } from 'vitest'
import { buildStructuredData } from '../seo'
import { SITE, SAME_AS, FOUNDER_SAME_AS, xHandle } from '../../data/site'

// Parses the JSON-LD string and returns the ProfessionalService org node.
function orgNode(route = '/') {
  const data = JSON.parse(buildStructuredData(route))
  return data['@graph'].find((n: { '@type': string }) => n['@type'] === 'ProfessionalService')
}

describe('structured data', () => {
  it('always emits a ProfessionalService org node tied to the domain', () => {
    const org = orgNode()
    expect(org).toBeTruthy()
    expect(org.name).toBe(SITE.name)
    expect(org.url).toBe(SITE.url)
  })

  it('only includes sameAs when at least one real profile URL is configured', () => {
    const org = orgNode()
    if (SAME_AS.length === 0) {
      // No profiles set yet → the property must be absent, never an empty
      // array or a placeholder, so nothing harmful ships to crawlers.
      expect(org.sameAs).toBeUndefined()
    } else {
      expect(org.sameAs).toEqual([...SAME_AS])
    }
  })

  it('SAME_AS contains only absolute http(s) URLs', () => {
    for (const url of SAME_AS) {
      expect(url).toMatch(/^https?:\/\//)
    }
  })

  it('excludes X/Twitter from the org sameAs while the handle is unset', () => {
    expect(SAME_AS.some((u) => /x\.com|twitter\.com/.test(u))).toBe(false)
  })

  it("attaches the founder's personal profiles to the Person node, not the org", () => {
    const org = orgNode()
    expect(org.founder['@type']).toBe('Person')
    if (FOUNDER_SAME_AS.length === 0) {
      expect(org.founder.sameAs).toBeUndefined()
    } else {
      expect(org.founder.sameAs).toEqual([...FOUNDER_SAME_AS])
      // The founder's GitHub belongs to the Person, never the organization.
      for (const url of FOUNDER_SAME_AS) {
        expect(SAME_AS).not.toContain(url)
      }
    }
  })
})

describe('xHandle (X/Twitter normalization)', () => {
  it('strips a leading @ and surrounding whitespace', () => {
    expect(xHandle('  @anappidea ')).toBe('anappidea')
  })

  it('accepts a bare handle', () => {
    expect(xHandle('anappidea')).toBe('anappidea')
  })

  it('extracts the handle from a full x.com / twitter.com URL', () => {
    expect(xHandle('https://x.com/anappidea')).toBe('anappidea')
    expect(xHandle('https://www.twitter.com/anappidea?ref=1')).toBe('anappidea')
  })

  it('returns "" for empty input or a lone @ (no junk URL)', () => {
    expect(xHandle('')).toBe('')
    expect(xHandle('@')).toBe('')
    expect(xHandle('   ')).toBe('')
  })
})
