/// <reference types="node" />
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const CSS = fs.readFileSync(
  path.resolve(HERE, '../VelvetStage.module.css'),
  'utf8',
)

describe('VelvetStage.module.css', () => {
  it('.stage is position: relative with perspective', () => {
    expect(CSS).toMatch(/\.stage\s*\{[^}]*position:\s*relative/)
    expect(CSS).toMatch(/\.stage\s*\{[^}]*perspective:\s*1400px/)
  })
  it('.floor is rotated 48deg with woven fabric texture', () => {
    expect(CSS).toMatch(/\.floor\s*\{[^}]*transform:\s*rotateX\(48deg\)/)
    expect(CSS).toMatch(/\.floor\s*\{[^}]*repeating-linear-gradient/)
  })
  it('.spot has a warm overhead radial gradient', () => {
    expect(CSS).toMatch(/\.spot\s*\{[^}]*radial-gradient/)
  })
  it('.vignette has inset box-shadow', () => {
    expect(CSS).toMatch(/\.vignette\s*\{[^}]*box-shadow:\s*inset/)
  })
  it('decorative layers are hidden on non-modern-vibrant themes', () => {
    expect(CSS).toMatch(/:not\(\[data-theme="modern-vibrant"\]\)/)
  })
})
