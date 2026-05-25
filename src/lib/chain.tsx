import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import {
  BLOCK_SEQUENCES,
  ChainContext,
  type ChainSequence,
  type ChainStep,
} from './chain-context'
import type { BlockId } from '../components/TetrisGrid/Block'

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Plays a single ChainStep using callbacks (not Promises) so completion
 * happens synchronously when the underlying timer fires — important for
 * tests using fake timers + sync `act`. Returns a teardown function the
 * caller can invoke to cancel the step (idempotent).
 *
 * Phase 5a only handles 'wait'; Phase 5b will add gadget step types.
 */
function playStep(
  step: ChainStep,
  signal: AbortSignal,
  onDone: () => void,
  onCancel: () => void,
): () => void {
  if (step.kind === 'wait') {
    if (signal.aborted) {
      onCancel()
      return () => {}
    }
    const id = setTimeout(() => {
      signal.removeEventListener('abort', abortHandler)
      onDone()
    }, step.durationMs)
    const abortHandler = () => {
      clearTimeout(id)
      onCancel()
    }
    signal.addEventListener('abort', abortHandler)
    return () => {
      clearTimeout(id)
      signal.removeEventListener('abort', abortHandler)
    }
  }
  // Exhaustive: TypeScript catches unhandled kinds at compile time
  const _exhaustive: never = step.kind
  onDone()
  return () => {
    void _exhaustive
  }
}

/**
 * Plays a ChainSequence step-by-step using `playStep`. Calls `onDone`
 * when every step has completed; calls `onCancel` if the signal is
 * aborted at any point.
 */
function playSequence(
  sequence: ChainSequence,
  signal: AbortSignal,
  onDone: () => void,
  onCancel: () => void,
) {
  let i = 0
  const next = () => {
    if (signal.aborted) {
      onCancel()
      return
    }
    if (i >= sequence.length) {
      onDone()
      return
    }
    const step = sequence[i++]
    playStep(step, signal, next, onCancel)
  }
  next()
}

export interface ChainProviderProps {
  children: ReactNode
}

/**
 * Provides the Rube Goldberg chain reaction state to descendants.
 * Blocks call `startChain(id, onComplete)` to launch their sequence
 * and defer navigation. The provider plays the configured sequence
 * (placeholder wait in Phase 5a; real gadgets in Phase 5b) then
 * invokes the onComplete callback. Escape key cancels in-flight
 * chains; prefers-reduced-motion skips them entirely.
 */
export function ChainProvider({ children }: ChainProviderProps) {
  const [activeBlock, setActiveBlock] = useState<BlockId | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // AbortController for the in-flight sequence. Cancelling rejects the
  // playSequence promise (without firing onComplete) and clears state.
  const controllerRef = useRef<AbortController | null>(null)

  const clearState = useCallback(() => {
    setActiveBlock(null)
    setIsPlaying(false)
    controllerRef.current = null
  }, [])

  const cancelChain = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.abort()
      clearState()
    }
  }, [clearState])

  const startChain = useCallback(
    (blockId: BlockId, onComplete: () => void) => {
      // No queuing — second start while playing is a no-op
      if (controllerRef.current) return

      const sequence = BLOCK_SEQUENCES[blockId]

      // No sequence defined OR reduced-motion → synchronous completion
      if (!sequence || sequence.length === 0 || prefersReducedMotion()) {
        onComplete()
        return
      }

      const controller = new AbortController()
      controllerRef.current = controller
      setActiveBlock(blockId)
      setIsPlaying(true)

      playSequence(
        sequence,
        controller.signal,
        () => {
          // Sequence finished successfully — only fire onComplete if not aborted
          if (!controller.signal.aborted) {
            clearState()
            onComplete()
          }
        },
        () => {
          // Cancelled mid-flight — do not fire onComplete (cancelChain
          // already cleared state, but be defensive in case of races).
        },
      )
    },
    [clearState],
  )

  // Escape key cancels in-flight chain
  useEffect(() => {
    if (!isPlaying) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cancelChain()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isPlaying, cancelChain])

  // Cancel on unmount to prevent setState-after-unmount
  useEffect(() => {
    return () => {
      controllerRef.current?.abort()
    }
  }, [])

  const value = useMemo(
    () => ({ activeBlock, isPlaying, startChain, cancelChain }),
    [activeBlock, isPlaying, startChain, cancelChain],
  )

  return <ChainContext.Provider value={value}>{children}</ChainContext.Provider>
}

export function useChain() {
  const ctx = useContext(ChainContext)
  if (!ctx) {
    throw new Error('useChain must be used inside <ChainProvider>')
  }
  return ctx
}
