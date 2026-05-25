import { describe, it, expect } from 'vitest'
import { BLOCK_SEQUENCES, DEFAULT_CHAIN_DURATION_MS } from '../chain-context'
import type { BlockId } from '../../components/TetrisGrid/Block'

describe('chain-context', () => {
  it('exports a DEFAULT_CHAIN_DURATION_MS constant of 1200ms', () => {
    expect(DEFAULT_CHAIN_DURATION_MS).toBe(1200)
  })

  it('defines a sequence for each navigable block (excluding brand)', () => {
    const expected: BlockId[] = ['hero', 'about', 'work', 'services', 'process', 'contact']
    for (const id of expected) {
      const seq = BLOCK_SEQUENCES[id]
      expect(seq, `missing sequence for ${id}`).toBeTruthy()
      expect(seq!.length).toBeGreaterThan(0)
    }
  })

  it('hero sequence is 2000ms (marble + squash + bell + aurora grow)', () => {
    const heroSeq = BLOCK_SEQUENCES.hero!
    expect(heroSeq).toHaveLength(1)
    expect(heroSeq[0]).toEqual({ kind: 'wait', durationMs: 2000 })
  })

  it('about sequence is 1400ms (gives pendulum swing breathing room)', () => {
    const aboutSeq = BLOCK_SEQUENCES.about!
    expect(aboutSeq).toHaveLength(1)
    expect(aboutSeq[0]).toEqual({ kind: 'wait', durationMs: 1400 })
  })

  it('work sequence is 1500ms (gives marble + 5-domino cascade time)', () => {
    const workSeq = BLOCK_SEQUENCES.work!
    expect(workSeq).toHaveLength(1)
    expect(workSeq[0]).toEqual({ kind: 'wait', durationMs: 1500 })
  })

  it('services sequence is 1300ms (lever raise + flag unfurl)', () => {
    const seq = BLOCK_SEQUENCES.services!
    expect(seq).toHaveLength(1)
    expect(seq[0]).toEqual({ kind: 'wait', durationMs: 1300 })
  })

  it('process sequence is 1400ms (pulley wheel + weight lift)', () => {
    const seq = BLOCK_SEQUENCES.process!
    expect(seq).toHaveLength(1)
    expect(seq[0]).toEqual({ kind: 'wait', durationMs: 1400 })
  })

  it('contact sequence stays at DEFAULT_CHAIN_DURATION_MS (spring + letter fits comfortably)', () => {
    const seq = BLOCK_SEQUENCES.contact!
    expect(seq).toHaveLength(1)
    expect(seq[0]).toEqual({ kind: 'wait', durationMs: DEFAULT_CHAIN_DURATION_MS })
  })

  it('does not define a sequence for brand (it opens the Materials Panel instead)', () => {
    expect(BLOCK_SEQUENCES.brand).toBeUndefined()
  })
})
