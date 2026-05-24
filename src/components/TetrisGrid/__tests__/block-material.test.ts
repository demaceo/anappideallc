import fs from 'node:fs'
import path from 'node:path'
import { describe, it, expect } from 'vitest'

const BLOCK_CSS = fs.readFileSync(
  path.resolve(__dirname, '../Block.module.css'),
  'utf8',
)

describe('Block.module.css — bloom token bindings', () => {
  const sections = ['hero', 'brand', 'about', 'work', 'services', 'process', 'contact']

  for (const s of sections) {
    it(`block-${s} binds --bloom-dark to --c-${s}-mat-dark`, () => {
      const rule = new RegExp(
        `\\.block-${s}\\s*\\{[^}]*--bloom-dark:\\s*var\\(--c-${s}-mat-dark\\)`,
      )
      expect(BLOCK_CSS).toMatch(rule)
    })
    it(`block-${s} binds --bloom to --c-${s}-mat-base`, () => {
      const rule = new RegExp(
        `\\.block-${s}\\s*\\{[^}]*--bloom:\\s*var\\(--c-${s}-mat-base\\)`,
      )
      expect(BLOCK_CSS).toMatch(rule)
    })
    it(`block-${s} binds --bloom-bright to --c-${s}-mat-bright`, () => {
      const rule = new RegExp(
        `\\.block-${s}\\s*\\{[^}]*--bloom-bright:\\s*var\\(--c-${s}-mat-bright\\)`,
      )
      expect(BLOCK_CSS).toMatch(rule)
    })
  }
})

describe('Block.module.css — Editorial Hardware material', () => {
  it('.block background is a 135deg linear-gradient', () => {
    expect(BLOCK_CSS).toMatch(/\.block\s*\{[^}]*background:[^;]*linear-gradient\(\s*135deg/)
  })

  it('.block gradient references --bloom-dark at 0% and 100%', () => {
    expect(BLOCK_CSS).toMatch(/\.block\s*\{[^}]*--bloom-dark[^;]*?0%/)
    expect(BLOCK_CSS).toMatch(/\.block\s*\{[^}]*--bloom-dark[^;]*?100%/)
  })

  it('.block gradient references --bloom-bright at 50%', () => {
    expect(BLOCK_CSS).toMatch(/\.block\s*\{[^}]*--bloom-bright[^;]*?50%/)
  })

  it('.block gradient falls back through --block-bg for non-bloom themes', () => {
    expect(BLOCK_CSS).toMatch(/var\(--bloom-dark,\s*var\(--block-bg/)
  })

  it('.block::before has brushed micro-grain via 118deg repeating-linear-gradient', () => {
    expect(BLOCK_CSS).toMatch(
      /\.block::before\s*\{[^}]*repeating-linear-gradient\(\s*118deg,\s*transparent\s*0\s*2px,\s*rgba\(255,\s*255,\s*255,\s*0\.045\)\s*2px\s*3px\)/,
    )
  })

  it('.block::before has diagonal specular highlight 135deg', () => {
    expect(BLOCK_CSS).toMatch(
      /\.block::before\s*\{[^}]*linear-gradient\(\s*135deg,\s*rgba\(255,\s*255,\s*255,\s*0\.45\)\s*0%,\s*transparent\s*30%,\s*transparent\s*70%,\s*rgba\(0,\s*0,\s*0,\s*0\.25\)\s*100%\)/,
    )
  })

  it('.block::before uses mix-blend-mode: screen', () => {
    expect(BLOCK_CSS).toMatch(/\.block::before\s*\{[^}]*mix-blend-mode:\s*screen/)
  })

  it('.block::after renders the glass caustic floor spill', () => {
    expect(BLOCK_CSS).toMatch(
      /\.block::after\s*\{[^}]*radial-gradient\(\s*closest-side,\s*var\(--bloom-bright[^)]*\),\s*transparent\s*70%\)/,
    )
  })

  it('.block::after applies a 10px blur', () => {
    expect(BLOCK_CSS).toMatch(/\.block::after\s*\{[^}]*filter:\s*blur\(10px\)/)
  })

  it('.block::after positions below the block (bottom: -8%)', () => {
    expect(BLOCK_CSS).toMatch(/\.block::after\s*\{[^}]*bottom:\s*-8%/)
  })

  it('.block has Editorial Hardware shadow stack — pearl rim inset', () => {
    expect(BLOCK_CSS).toMatch(
      /\.block\s*\{[^}]*box-shadow:[^;]*inset\s+0\s+0\s+0\s+1px\s+rgba\(255,\s*255,\s*255,\s*0\.18\)/,
    )
  })

  it('.block has Editorial Hardware shadow stack — cushion offset', () => {
    expect(BLOCK_CSS).toMatch(
      /\.block\s*\{[^}]*box-shadow:[^;]*0\s+18px\s+0\s+rgba\(0,\s*0,\s*0,\s*0\.42\)/,
    )
  })

  it('.block has Editorial Hardware shadow stack — bloom halo', () => {
    expect(BLOCK_CSS).toMatch(
      /\.block\s*\{[^}]*box-shadow:[^;]*0\s+36px\s+70px\s+var\(--bloom,\s*transparent\)/,
    )
  })

  it('.block:hover intensifies the cushion shadow', () => {
    expect(BLOCK_CSS).toMatch(
      /\.block:hover\s*\{[^}]*box-shadow:[^;]*0\s+28px\s+0\s+rgba\(0,\s*0,\s*0/,
    )
  })

  it('.block:hover intensifies the bloom halo', () => {
    expect(BLOCK_CSS).toMatch(
      /\.block:hover\s*\{[^}]*box-shadow:[^;]*0\s+60px\s+100px\s+var\(--bloom,\s*transparent\)/,
    )
  })
})
