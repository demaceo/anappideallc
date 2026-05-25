/// <reference types="node" />
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const CSS = fs.readFileSync(
  path.resolve(HERE, '../ThreadLine.module.css'),
  'utf8',
)

describe('ThreadLine.module.css', () => {
  it('.threadLayer is absolute-positioned, fills container, pointer-events:none', () => {
    expect(CSS).toMatch(/\.threadLayer\s*\{[^}]*position:\s*absolute/)
    expect(CSS).toMatch(/\.threadLayer\s*\{[^}]*inset:\s*0/)
    expect(CSS).toMatch(/\.threadLayer\s*\{[^}]*pointer-events:\s*none/)
  })

  it('.segment has 1.5px golden stroke by default', () => {
    expect(CSS).toMatch(/\.segment\s*\{[^}]*stroke:[^;]*255,\s*212,\s*0/)
    expect(CSS).toMatch(/\.segment\s*\{[^}]*stroke-width:\s*1\.5/)
  })

  it('defines a thread-shimmer keyframe animation', () => {
    expect(CSS).toMatch(/@keyframes\s+thread-shimmer/)
  })

  it('shimmer cycles stroke-opacity between 0.12 and 0.24', () => {
    expect(CSS).toMatch(/@keyframes\s+thread-shimmer[\s\S]*?0%[^}]*0\.12/)
    expect(CSS).toMatch(/@keyframes\s+thread-shimmer[\s\S]*?50%[^}]*0\.24/)
  })

  it('.segment runs thread-shimmer over 8s ease-in-out infinite', () => {
    expect(CSS).toMatch(/\.segment\s*\{[^}]*animation:\s*thread-shimmer\s+8s\s+ease-in-out\s+infinite/)
  })

  it('.segmentBright class boosts opacity to 0.55', () => {
    expect(CSS).toMatch(/\.segmentBright\s*\{[^}]*stroke-opacity:\s*0\.55/)
  })

  it('reduced-motion disables the shimmer animation', () => {
    expect(CSS).toMatch(/prefers-reduced-motion:\s*reduce[^}]*\.segment[^}]*animation:\s*none/s)
  })

  it('.segmentChainActive class is defined with full opacity', () => {
    expect(CSS).toMatch(/\.segmentChainActive\s*\{[^}]*stroke-opacity:\s*1/)
  })

  it('.segmentChainActive has thicker stroke', () => {
    expect(CSS).toMatch(/\.segmentChainActive\s*\{[^}]*stroke-width:\s*2/)
  })

  it('.segmentChainActive pauses the shimmer animation', () => {
    expect(CSS).toMatch(/\.segmentChainActive\s*\{[^}]*animation-play-state:\s*paused/)
  })
})
