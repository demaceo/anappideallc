import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ChainProvider, useChain } from '../chain'
import type { ReactNode } from 'react'

const wrapper = ({ children }: { children: ReactNode }) => (
  <ChainProvider>{children}</ChainProvider>
)

describe('useChain', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('defaults to activeBlock null + isPlaying false', () => {
    const { result } = renderHook(() => useChain(), { wrapper })
    expect(result.current.activeBlock).toBeNull()
    expect(result.current.isPlaying).toBe(false)
  })

  it('startChain sets activeBlock and isPlaying, then clears + fires onComplete', () => {
    const { result } = renderHook(() => useChain(), { wrapper })
    const onComplete = vi.fn()

    act(() => {
      result.current.startChain('hero', onComplete)
    })

    expect(result.current.activeBlock).toBe('hero')
    expect(result.current.isPlaying).toBe(true)
    expect(onComplete).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(result.current.activeBlock).toBeNull()
    expect(result.current.isPlaying).toBe(false)
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('cancelChain clears state without firing onComplete', () => {
    const { result } = renderHook(() => useChain(), { wrapper })
    const onComplete = vi.fn()

    act(() => {
      result.current.startChain('work', onComplete)
    })
    expect(result.current.isPlaying).toBe(true)

    act(() => {
      result.current.cancelChain()
    })

    expect(result.current.activeBlock).toBeNull()
    expect(result.current.isPlaying).toBe(false)
    expect(onComplete).not.toHaveBeenCalled()
  })

  it('Escape key cancels the in-flight chain', () => {
    const { result } = renderHook(() => useChain(), { wrapper })
    const onComplete = vi.fn()

    act(() => {
      result.current.startChain('services', onComplete)
    })
    expect(result.current.isPlaying).toBe(true)

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    })

    expect(result.current.isPlaying).toBe(false)
    expect(onComplete).not.toHaveBeenCalled()
  })

  it('a second startChain while playing is a no-op (chains do not queue)', () => {
    const { result } = renderHook(() => useChain(), { wrapper })
    const firstComplete = vi.fn()
    const secondComplete = vi.fn()

    act(() => {
      result.current.startChain('hero', firstComplete)
    })
    expect(result.current.activeBlock).toBe('hero')

    act(() => {
      result.current.startChain('work', secondComplete)
    })

    // Active block remains hero — second call was ignored
    expect(result.current.activeBlock).toBe('hero')

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(firstComplete).toHaveBeenCalledTimes(1)
    expect(secondComplete).not.toHaveBeenCalled()
  })

  it('blocks with no sequence (e.g., brand) call onComplete immediately', () => {
    const { result } = renderHook(() => useChain(), { wrapper })
    const onComplete = vi.fn()

    act(() => {
      result.current.startChain('brand', onComplete)
    })

    // brand has no sequence → onComplete fires synchronously, no animation
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(result.current.isPlaying).toBe(false)
  })

  it('respects prefers-reduced-motion: reduce by skipping the sequence', () => {
    // Mock matchMedia to return reduced-motion
    const originalMatchMedia = window.matchMedia
    ;(window as Window & typeof globalThis).matchMedia = vi.fn((q: string) => ({
      matches: q.includes('reduce'),
      media: q,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })) as unknown as typeof window.matchMedia

    const { result } = renderHook(() => useChain(), { wrapper })
    const onComplete = vi.fn()

    act(() => {
      result.current.startChain('hero', onComplete)
    })

    // Reduced-motion → onComplete fires synchronously
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(result.current.isPlaying).toBe(false)

    ;(window as Window & typeof globalThis).matchMedia = originalMatchMedia
  })

  it('throws helpfully when useChain is called outside a provider', () => {
    expect(() => renderHook(() => useChain())).toThrow(/ChainProvider/)
  })

  it('unmounting mid-chain aborts the in-flight sequence and skips onComplete', () => {
    const { result, unmount } = renderHook(() => useChain(), { wrapper })
    const onComplete = vi.fn()

    act(() => {
      result.current.startChain('hero', onComplete)
    })
    expect(result.current.isPlaying).toBe(true)

    // Unmount BEFORE the timer advances — provider's cleanup effect aborts
    unmount()

    act(() => {
      vi.advanceTimersByTime(3000)
    })

    // Sequence was aborted on unmount; onComplete must not fire
    expect(onComplete).not.toHaveBeenCalled()
  })
})
