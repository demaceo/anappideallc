import { createContext } from 'react'
import type { BlockId } from '../components/TetrisGrid/Block'

/** Phase 5a placeholder duration. Phase 5b's physics-driven sequences
 *  override this with their own per-step timing. */
export const DEFAULT_CHAIN_DURATION_MS = 1200

/** Hero's marble drop + squash needs more time than a generic placeholder. */
export const HERO_CHAIN_DURATION_MS = 1900

/** About's pendulum swing needs breathing room beyond the placeholder. */
export const ABOUT_CHAIN_DURATION_MS = 1400

/** Work's marble roll + 5-domino cascade needs more time than the placeholder. */
export const WORK_CHAIN_DURATION_MS = 1500

/** Services' lever raise + flag unfurl needs a small bump beyond the placeholder. */
export const SERVICES_CHAIN_DURATION_MS = 1300

/** Process's pulley wheel spin + weight lift needs slight breathing room. */
export const PROCESS_CHAIN_DURATION_MS = 1400

/**
 * Discriminated union for chain sequence steps. Phase 5a ships only
 * `wait` — a timed delay used as a placeholder while the infrastructure
 * is exercised end-to-end. Phase 5b adds `gadget` variants for the
 * actual physics-driven steps (marble, lever, domino, pendulum, etc.).
 */
export type ChainStep =
  | { kind: 'wait'; durationMs: number }
  // Future Phase 5b additions go here, e.g.:
  // | { kind: 'gadget'; gadget: 'marble' | 'lever' | …; config: GadgetConfig }

export type ChainSequence = readonly ChainStep[]

/**
 * Per-block chain sequences. Brand is intentionally absent — its click
 * is intercepted by the Materials Panel trigger in Phase 3, not the
 * chain reaction system.
 */
export const BLOCK_SEQUENCES: Partial<Record<BlockId, ChainSequence>> = {
  hero:     [{ kind: 'wait', durationMs: HERO_CHAIN_DURATION_MS }],
  about:    [{ kind: 'wait', durationMs: ABOUT_CHAIN_DURATION_MS }],
  work:     [{ kind: 'wait', durationMs: WORK_CHAIN_DURATION_MS }],
  services: [{ kind: 'wait', durationMs: SERVICES_CHAIN_DURATION_MS }],
  process:  [{ kind: 'wait', durationMs: PROCESS_CHAIN_DURATION_MS }],
  contact:  [{ kind: 'wait', durationMs: DEFAULT_CHAIN_DURATION_MS }],
}

export interface ChainContextValue {
  /** The block whose chain is currently playing, or null at rest. */
  activeBlock: BlockId | null
  /** True while a chain sequence is mid-flight. */
  isPlaying: boolean
  /**
   * Start the chain reaction for `blockId`. The provider plays the
   * sequence and, on completion, invokes `onComplete()` (typically a
   * `navigate(to)` from the calling Block). If a chain is already
   * playing, this is a no-op (chain reactions don't queue).
   *
   * Respects `prefers-reduced-motion: reduce`: when set, the sequence
   * is skipped entirely and `onComplete` is called synchronously.
   */
  startChain: (blockId: BlockId, onComplete: () => void) => void
  /** Cancel the in-flight chain. Calls neither onComplete nor navigation. */
  cancelChain: () => void
}

export const ChainContext = createContext<ChainContextValue | null>(null)
