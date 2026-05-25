/// <reference types="node" />
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const INDEX_HTML = fs.readFileSync(
  path.resolve(HERE, '../../index.html'),
  'utf8',
)

describe('index.html bootstrap scripts', () => {
  it('includes the existing theme bootstrap (regression check)', () => {
    expect(INDEX_HTML).toMatch(/document\.documentElement\.dataset\.theme/)
  })

  it('includes a material bootstrap that reads localStorage', () => {
    expect(INDEX_HTML).toMatch(/localStorage\.getItem\(['"]material['"]\)/)
  })

  it('sets data-material on documentElement before paint', () => {
    expect(INDEX_HTML).toMatch(/document\.documentElement\.dataset\.material/)
  })

  it('whitelists allowed material values', () => {
    expect(INDEX_HTML).toMatch(/anodized/)
    expect(INDEX_HTML).toMatch(/steel/)
    expect(INDEX_HTML).toMatch(/gold/)
    expect(INDEX_HTML).toMatch(/frosted/)
    expect(INDEX_HTML).toMatch(/bronze/)
    expect(INDEX_HTML).toMatch(/ceramic/)
    expect(INDEX_HTML).toMatch(/showcase/)
  })
})
