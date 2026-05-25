/// <reference types="node" />
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const BLOCK_CSS = fs.readFileSync(
  path.resolve(HERE, '../../TetrisGrid/Block.module.css'),
  'utf8',
)

describe('Swatch previews use the same material recipes', () => {
  const presets = ['steel', 'gold', 'frosted', 'bronze', 'ceramic']
  for (const preset of presets) {
    it(`recipe for ${preset} also targets [data-material-preview="${preset}"]`, () => {
      const pattern = new RegExp(
        `\\[data-material-preview="${preset}"\\]`,
      )
      expect(BLOCK_CSS).toMatch(pattern)
    })
  }

  it('Anodized swatch preview renders the default Editorial Hardware look', () => {
    expect(BLOCK_CSS).toMatch(/\[data-material-preview="anodized"\]\s*\{[^}]*linear-gradient\(\s*135deg/)
  })

  it('Showcase swatch preview uses a conic-gradient (multi-section hint)', () => {
    expect(BLOCK_CSS).toMatch(/\[data-material-preview="showcase"\]\s*\{[^}]*conic-gradient/)
  })
})
