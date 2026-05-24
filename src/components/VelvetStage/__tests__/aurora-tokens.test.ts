/// <reference types="node" />
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const TOKENS_CSS = fs.readFileSync(
  path.resolve(HERE, '../../../styles/tokens.css'),
  'utf8',
)

describe('Aurora composition tokens (modern-vibrant)', () => {
  it('defines --aurora-cyan with the spec rgba value', () => {
    expect(TOKENS_CSS).toMatch(/--aurora-cyan:\s*rgba\(80,\s*200,\s*255,\s*0\.35\)/)
  })
  it('defines --aurora-magenta with the spec rgba value', () => {
    expect(TOKENS_CSS).toMatch(/--aurora-magenta:\s*rgba\(217,\s*3,\s*104,\s*0\.5\)/)
  })
  it('defines --aurora-gold with the spec rgba value', () => {
    expect(TOKENS_CSS).toMatch(/--aurora-gold:\s*rgba\(255,\s*212,\s*0,\s*0\.32\)/)
  })
  it('defines --aurora-deepspace gradient', () => {
    expect(TOKENS_CSS).toMatch(/--aurora-deepspace:\s*linear-gradient\(180deg,\s*#03020a/)
  })
  it('aurora tokens live inside the modern-vibrant standalone block (not :root)', () => {
    // The modern-vibrant standalone block (added in Phase 1) starts with
    // [data-theme="modern-vibrant"] { and contains the mat tokens. Verify
    // aurora tokens are within that block too, not on :root.
    const standaloneBlock = TOKENS_CSS.match(
      /\[data-theme="modern-vibrant"\]\s*\{[^}]*--aurora-cyan/,
    )
    expect(standaloneBlock).toBeTruthy()
  })
})
