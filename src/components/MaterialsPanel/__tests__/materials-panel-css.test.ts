/// <reference types="node" />
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const CSS = fs.readFileSync(
  path.resolve(HERE, '../MaterialsPanel.module.css'),
  'utf8',
)

describe('MaterialsPanel.module.css', () => {
  it('drawer is fixed to bottom of viewport', () => {
    expect(CSS).toMatch(/\.drawer\s*\{[^}]*position:\s*fixed/)
    expect(CSS).toMatch(/\.drawer\s*\{[^}]*bottom:\s*0/)
  })

  it('drawer has backdrop-filter blur', () => {
    expect(CSS).toMatch(/\.drawer\s*\{[^}]*backdrop-filter:\s*blur/)
  })

  it('drawer has gradient background per spec', () => {
    expect(CSS).toMatch(/\.drawer\s*\{[^}]*linear-gradient\(\s*180deg,\s*rgba\(20,\s*12,\s*30/)
  })

  it('top border is 1px white at low opacity', () => {
    expect(CSS).toMatch(/\.drawer\s*\{[^}]*border-top:\s*1px\s+solid\s+rgba\(255,\s*255,\s*255/)
  })

  it('swatch grid is 7 columns', () => {
    expect(CSS).toMatch(/\.swatches\s*\{[^}]*grid-template-columns:\s*repeat\(7,\s*1fr\)/)
  })
})
