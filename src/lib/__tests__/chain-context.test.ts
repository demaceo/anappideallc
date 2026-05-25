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

  it('hero sequence is a 1500ms wait (allowing marble drop + squash time)', () => {
    const heroSeq = BLOCK_SEQUENCES.hero!
    expect(heroSeq).toHaveLength(1)
    expect(heroSeq[0]).toEqual({ kind: 'wait', durationMs: 1500 })
  })

  it('other blocks remain at DEFAULT_CHAIN_DURATION_MS (1200ms placeholder)', () => {
    for (const id of ['about', 'work', 'services', 'process', 'contact'] as BlockId[]) {
      const seq = BLOCK_SEQUENCES[id]!
      expect(seq).toHaveLength(1)
      expect(seq[0]).toEqual({ kind: 'wait', durationMs: DEFAULT_CHAIN_DURATION_MS })
    }
  })

  it('does not define a sequence for brand (it opens the Materials Panel instead)', () => {
    expect(BLOCK_SEQUENCES.brand).toBeUndefined()
  })
})
