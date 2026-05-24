// src/components/TetrisGrid/__tests__/material-tokens.test.ts
import fs from 'node:fs'
import path from 'node:path'
import { describe, it, expect } from 'vitest'

const TOKENS_CSS = fs.readFileSync(
  path.resolve(__dirname, '../../../styles/tokens.css'),
  'utf8',
)

describe('Editorial Hardware bloom tokens (modern-vibrant)', () => {
  it('reads tokens.css successfully', () => {
    expect(TOKENS_CSS.length).toBeGreaterThan(100)
    expect(TOKENS_CSS).toContain('[data-theme="modern-vibrant"]')
  })

  it('defines --c-hero-mat-dark with #8a0144', () => {
    expect(TOKENS_CSS).toMatch(/--c-hero-mat-dark:\s*#8a0144/i)
  })
  it('defines --c-hero-mat-base with #d90368', () => {
    expect(TOKENS_CSS).toMatch(/--c-hero-mat-base:\s*#d90368/i)
  })
  it('defines --c-hero-mat-bright with #ff5e98', () => {
    expect(TOKENS_CSS).toMatch(/--c-hero-mat-bright:\s*#ff5e98/i)
  })

  it('defines --c-brand-mat-dark with #a89a82', () => {
    expect(TOKENS_CSS).toMatch(/--c-brand-mat-dark:\s*#a89a82/i)
  })
  it('defines --c-brand-mat-base with #f1e9da', () => {
    expect(TOKENS_CSS).toMatch(/--c-brand-mat-base:\s*#f1e9da/i)
  })
  it('defines --c-brand-mat-bright with #ffffff', () => {
    expect(TOKENS_CSS).toMatch(/--c-brand-mat-bright:\s*#ffffff/i)
  })

  it('defines --c-about-mat-dark with #b07700', () => {
    expect(TOKENS_CSS).toMatch(/--c-about-mat-dark:\s*#b07700/i)
  })
  it('defines --c-about-mat-base with #ffb800', () => {
    expect(TOKENS_CSS).toMatch(/--c-about-mat-base:\s*#ffb800/i)
  })
  it('defines --c-about-mat-bright with #ffe066', () => {
    expect(TOKENS_CSS).toMatch(/--c-about-mat-bright:\s*#ffe066/i)
  })

  it('defines --c-work-mat-dark with #0d3d2b', () => {
    expect(TOKENS_CSS).toMatch(/--c-work-mat-dark:\s*#0d3d2b/i)
  })
  it('defines --c-work-mat-base with #1f6f50', () => {
    expect(TOKENS_CSS).toMatch(/--c-work-mat-base:\s*#1f6f50/i)
  })
  it('defines --c-work-mat-bright with #4cb589', () => {
    expect(TOKENS_CSS).toMatch(/--c-work-mat-bright:\s*#4cb589/i)
  })

  it('defines --c-services-mat-dark with #006e68', () => {
    expect(TOKENS_CSS).toMatch(/--c-services-mat-dark:\s*#006e68/i)
  })
  it('defines --c-services-mat-base with #00b4aa', () => {
    expect(TOKENS_CSS).toMatch(/--c-services-mat-base:\s*#00b4aa/i)
  })
  it('defines --c-services-mat-bright with #5be3dc', () => {
    expect(TOKENS_CSS).toMatch(/--c-services-mat-bright:\s*#5be3dc/i)
  })
})
