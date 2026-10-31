import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, it, expect } from 'vitest'

// House style (docs/brand-voice.md): no em-dashes in copy a visitor reads.
// These files mix copy with code comments, which may use them, so comments
// are stripped before checking.
const FILES = ['src/pages/Contact.tsx', 'src/components/ConsultCTA/ConsultCTA.tsx', 'api/contact.ts']

const stripComments = (src: string) => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1')

describe('brand voice in contact and CTA copy', () => {
  it.each(FILES)('has no em-dashes in user-facing strings of %s', (file) => {
    const src = stripComments(readFileSync(join(__dirname, '..', '..', file), 'utf8'))
    expect(src).not.toMatch(/—/)
  })
})
