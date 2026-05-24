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
})
