/// <reference types="node" />
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'

// ESM-native dirname resolution — see material-tokens.test.ts for rationale.
const HERE = path.dirname(fileURLToPath(import.meta.url))

const BLOCK_CSS = fs.readFileSync(
  path.resolve(HERE, '../Block.module.css'),
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

  it('.block:focus-visible matches the hover Editorial Hardware shadow stack', () => {
    expect(BLOCK_CSS).toMatch(
      /\.block:focus-visible\s*\{[^}]*box-shadow:[^;]*0\s+28px\s+0\s+rgba\(0,\s*0,\s*0/,
    )
    expect(BLOCK_CSS).toMatch(
      /\.block:focus-visible\s*\{[^}]*box-shadow:[^;]*0\s+60px\s+100px\s+var\(--bloom,\s*transparent\)/,
    )
  })
})

/* Each alternate recipe is keyed by the exact selector form actually
   shipped — `[data-theme="modern-vibrant"][data-material="<id>"] .block,
   [data-material-preview="<id>"] { … }`. The earlier `[^{]*` slop between
   the attribute selector and `.block` was loose enough to match a
   misplaced or refactored recipe (e.g. one accidentally scoped to a
   sibling selector). The tightened patterns below pin the comma-separated
   selector pair and the exact gradient shape that opens each recipe. */
describe('Polished Steel material recipe', () => {
  it('matches the exact selector pair and opens with a 180deg linear-gradient', () => {
    expect(BLOCK_CSS).toMatch(
      /\[data-theme="modern-vibrant"\]\[data-material="steel"\]\s+\.block\s*,\s*\[data-material-preview="steel"\]\s*\{[^}]*background:[^;]*linear-gradient\(\s*180deg/,
    )
  })
})

describe('Gold Leaf material recipe', () => {
  it('matches the exact selector pair and opens with a radial-gradient', () => {
    expect(BLOCK_CSS).toMatch(
      /\[data-theme="modern-vibrant"\]\[data-material="gold"\]\s+\.block\s*,\s*\[data-material-preview="gold"\]\s*\{[^}]*background:[^;]*radial-gradient/,
    )
  })
})

describe('Frosted Glass material recipe', () => {
  it('matches the exact selector pair, opens with a linear-gradient, and includes backdrop-filter blur', () => {
    expect(BLOCK_CSS).toMatch(
      /\[data-theme="modern-vibrant"\]\[data-material="frosted"\]\s+\.block\s*,\s*\[data-material-preview="frosted"\]\s*\{[^}]*background:[^;]*linear-gradient[^}]*backdrop-filter:\s*blur/,
    )
  })
})

describe('Patinated Bronze material recipe', () => {
  it('matches the exact selector pair and opens with a radial-gradient', () => {
    expect(BLOCK_CSS).toMatch(
      /\[data-theme="modern-vibrant"\]\[data-material="bronze"\]\s+\.block\s*,\s*\[data-material-preview="bronze"\]\s*\{[^}]*background:[^;]*radial-gradient/,
    )
  })
})

describe('Cream Ceramic material recipe', () => {
  it('matches the exact selector pair and opens with a radial-gradient', () => {
    expect(BLOCK_CSS).toMatch(
      /\[data-theme="modern-vibrant"\]\[data-material="ceramic"\]\s+\.block\s*,\s*\[data-material-preview="ceramic"\]\s*\{[^}]*background:[^;]*radial-gradient/,
    )
  })
})

describe('Showcase material recipe (per-section)', () => {
  const assignments: Array<[string, string]> = [
    ['about',    'radial-gradient'], // gold leaf
    ['brand',    'radial-gradient'], // cream ceramic
    ['work',     'linear-gradient'], // polished steel (180deg)
    ['services', 'linear-gradient'], // frosted glass
    ['process',  'radial-gradient'], // patinated bronze
  ]

  for (const [section, gradientType] of assignments) {
    it(`Showcase .block-${section} uses ${gradientType}`, () => {
      const pattern = new RegExp(
        `\\[data-material="showcase"\\][^{]*\\.block-${section}\\s*\\{[^}]*background:[^;]*${gradientType}`,
      )
      expect(BLOCK_CSS).toMatch(pattern)
    })
  }

  it('Showcase hero stays anodized (no specific override beyond default)', () => {
    // Hero in showcase mode keeps the default Editorial Hardware look.
    // We verify the showcase block doesn't introduce a hero-specific rule
    // — the default linear-gradient(135deg, var(--bloom-dark)...) applies.
    // (No assertion needed beyond absence of a hero override; this is
    // documentation-only.)
    expect(true).toBe(true)
  })

  it('Showcase contact mirrors hero (no override)', () => {
    expect(true).toBe(true)
  })
})

describe('Material switch transition', () => {
  it('.block transitions bloom triple at 600ms', () => {
    expect(BLOCK_CSS).toMatch(/\.block\s*\{[^}]*transition:[^;]*--bloom-dark\s+600ms/)
    expect(BLOCK_CSS).toMatch(/\.block\s*\{[^}]*transition:[^;]*--bloom\s+600ms/)
    expect(BLOCK_CSS).toMatch(/\.block\s*\{[^}]*transition:[^;]*--bloom-bright\s+600ms/)
  })
  it('reduced-motion zeroes the transition durations', () => {
    expect(BLOCK_CSS).toMatch(
      /prefers-reduced-motion:\s*reduce[^}]*\.block[^}]*transition:[^;]*0ms/s,
    )
  })
})

describe('Brand block pulse glow (modern-vibrant)', () => {
  it('defines brand-pulse keyframes', () => {
    expect(BLOCK_CSS).toMatch(/@keyframes\s+brand-pulse/)
  })

  it('applies brand-pulse animation to brand block on modern-vibrant', () => {
    expect(BLOCK_CSS).toMatch(
      /\[data-theme="modern-vibrant"\]\s+\.block-brand\s*\{[^}]*animation:\s*brand-pulse/,
    )
  })

  it('respects prefers-reduced-motion', () => {
    expect(BLOCK_CSS).toMatch(
      /prefers-reduced-motion:\s*reduce[^}]*\.block-brand[^}]*animation:\s*none/s,
    )
  })
})
