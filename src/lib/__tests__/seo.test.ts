import { describe, it, expect } from 'vitest'
import { buildStructuredData } from '../seo'
import { SITE, SAME_AS } from '../../data/site'

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
})
