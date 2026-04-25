import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { RefObject } from 'react'
import { useGyroParallax } from '../useGyroParallax'

// happy-dom doesn't ship matchMedia. Each test installs its own implementation
// keyed by query string so we can simulate (max-width: 1023px) and
// (prefers-reduced-motion: reduce) independently.
function mockMatchMedia(matches: Record<string, boolean>) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: matches[query] ?? false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

function makeRef(): RefObject<HTMLElement | null> {
  return { current: document.createElement('div') }
}

describe('useGyroParallax', () => {
  let originalDOE: typeof globalThis.DeviceOrientationEvent | undefined
  let touchstartSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    originalDOE = (globalThis as unknown as { DeviceOrientationEvent?: typeof DeviceOrientationEvent }).DeviceOrientationEvent
    touchstartSpy = vi.spyOn(document, 'addEventListener')
  })

  afterEach(() => {
    touchstartSpy.mockRestore()
    if (originalDOE) {
      ;(globalThis as unknown as { DeviceOrientationEvent: typeof DeviceOrientationEvent }).DeviceOrientationEvent = originalDOE
    } else {
      delete (globalThis as unknown as { DeviceOrientationEvent?: unknown }).DeviceOrientationEvent
    }
  })

  it('no-ops when prefers-reduced-motion is reduce', () => {
    mockMatchMedia({
      '(prefers-reduced-motion: reduce)': true,
      '(max-width: 1023px)': true,
    })
    const ref = makeRef()
    renderHook(() => useGyroParallax(ref))
    expect(touchstartSpy).not.toHaveBeenCalledWith('touchstart', expect.anything(), expect.anything())
  })

  it('no-ops when viewport is desktop (>=1024px)', () => {
    mockMatchMedia({
      '(prefers-reduced-motion: reduce)': false,
      '(max-width: 1023px)': false,
    })
    const ref = makeRef()
    renderHook(() => useGyroParallax(ref))
    expect(touchstartSpy).not.toHaveBeenCalledWith('touchstart', expect.anything(), expect.anything())
  })

  it('attaches touchstart listener when mobile + no reduced motion', () => {
    mockMatchMedia({
      '(prefers-reduced-motion: reduce)': false,
      '(max-width: 1023px)': true,
    })
    const ref = makeRef()
    renderHook(() => useGyroParallax(ref))
    expect(touchstartSpy).toHaveBeenCalledWith(
      'touchstart',
      expect.any(Function),
      expect.objectContaining({ once: true, passive: true }),
    )
  })

  it('cleanup removes the touchstart listener on unmount', () => {
    mockMatchMedia({
      '(prefers-reduced-motion: reduce)': false,
      '(max-width: 1023px)': true,
    })
    const removeSpy = vi.spyOn(document, 'removeEventListener')
    const ref = makeRef()
    const { unmount } = renderHook(() => useGyroParallax(ref))
    unmount()
    expect(removeSpy).toHaveBeenCalledWith('touchstart', expect.any(Function))
    removeSpy.mockRestore()
  })

  it('safely bails when DeviceOrientationEvent is undefined on first touch', async () => {
    mockMatchMedia({
      '(prefers-reduced-motion: reduce)': false,
      '(max-width: 1023px)': true,
    })
    delete (globalThis as unknown as { DeviceOrientationEvent?: unknown }).DeviceOrientationEvent

    const ref = makeRef()
    let storedHandler: EventListenerOrEventListenerObject | undefined
    touchstartSpy.mockImplementation(((event: string, handler: EventListenerOrEventListenerObject) => {
      if (event === 'touchstart') storedHandler = handler
    }) as typeof document.addEventListener)
    renderHook(() => useGyroParallax(ref))

    // Fire the touchstart handler — must not throw ReferenceError
    expect(() => {
      if (typeof storedHandler === 'function') storedHandler(new Event('touchstart'))
    }).not.toThrow()
  })
})
