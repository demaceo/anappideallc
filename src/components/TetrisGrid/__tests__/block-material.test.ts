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
