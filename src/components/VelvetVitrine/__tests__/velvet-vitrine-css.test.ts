/// <reference types="node" />
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const CSS = fs.readFileSync(
  path.resolve(HERE, '../VelvetVitrine.module.css'),
  'utf8',
)

describe('VelvetVitrine.module.css — regressions', () => {
  it('vitrine wrapper has padding-top var(--inner-nav-height)', () => {
    expect(CSS).toMatch(/padding-top:\s*var\(--inner-nav-height/)
  })

  it('floor uses rotateX(48deg) tilt (matches VelvetStage)', () => {
    expect(CSS).toMatch(/rotateX\(48deg\)/)
  })

  it('atmosphere layers are hidden on non-modern-vibrant themes', () => {
    expect(CSS).toMatch(/html:not\(\[data-theme="modern-vibrant"\]\)/)
  })
})
