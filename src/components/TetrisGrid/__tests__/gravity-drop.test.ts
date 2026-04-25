import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useGravityDrop } from '../useGravityDrop'

// WAAPI is not in happy-dom; mock it on the prototype.
function makeMockAnimate() {
  const mockAnim = {
    finished: Promise.resolve(),
    playState: 'finished' as AnimationPlayState,
    cancel: vi.fn(),
  }
  return vi.spyOn(HTMLElement.prototype, 'animate').mockReturnValue(
    mockAnim as unknown as Animation,
  )
}

// matchMedia is not in happy-dom either.
function mockMatchMedia(matches = false) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
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

function makeBlockEl(blockId: string, children: string[] = []): HTMLElement {
  const el = document.createElement('a')
  el.dataset.blockId = blockId
  for (const reveal of children) {
    const span = document.createElement('span')
    span.dataset.reveal = reveal
    el.appendChild(span)
  }
  return el
}

describe('useGravityDrop', () => {
  let animateSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    sessionStorage.clear()
    mockMatchMedia(false)
    animateSpy = makeMockAnimate()
  })

  afterEach(() => {
    animateSpy.mockRestore()
  })

  it('animates hero block with 600 ms delay', () => {
    const el = makeBlockEl('hero')
    renderHook(() => useGravityDrop([{ current: el }]))
    const heroCalls = animateSpy.mock.calls.filter(([, opts]) => opts.delay === 600)
    expect(heroCalls).toHaveLength(1)
  })

  it('animates brand block with 0 ms delay', () => {
    const el = makeBlockEl('brand')
    renderHook(() => useGravityDrop([{ current: el }]))
    const brandCalls = animateSpy.mock.calls.filter(([, opts]) => opts.delay === 0)
    expect(brandCalls).toHaveLength(1)
  })

  it('animates all seven blocks in the spec stagger order', () => {
    const SPEC_DELAYS: Record<string, number> = {
      brand: 0, about: 110, services: 210, work: 310,
      process: 390, contact: 460, hero: 600,
    }
    const refs = Object.keys(SPEC_DELAYS).map((id) => ({
      current: makeBlockEl(id),
    }))
    renderHook(() => useGravityDrop(refs))

    for (const [id, expectedDelay] of Object.entries(SPEC_DELAYS)) {
      const el = refs.find((r) => r.current.dataset.blockId === id)!.current
      const call = animateSpy.mock.calls.find(
        ([target, opts]) => target === el && opts.delay === expectedDelay,
      )
      expect(call, `${id} should be animated with delay ${expectedDelay}`).toBeDefined()
    }
  })

  it('hero block gets a longer duration than non-hero blocks', () => {
    const heroEl   = makeBlockEl('hero')
    const brandEl  = makeBlockEl('brand')
    renderHook(() => useGravityDrop([{ current: heroEl }, { current: brandEl }]))

    const heroDuration  = animateSpy.mock.calls.find(([t]) => t === heroEl)?.[1].duration as number
    const brandDuration = animateSpy.mock.calls.find(([t]) => t === brandEl)?.[1].duration as number
    expect(heroDuration).toBeGreaterThan(brandDuration)
  })

  it('hero first keyframe starts higher (-140%) than non-hero (-130%)', () => {
    const heroEl  = makeBlockEl('hero')
    const aboutEl = makeBlockEl('about')
    renderHook(() => useGravityDrop([{ current: heroEl }, { current: aboutEl }]))

    const heroFrames  = animateSpy.mock.calls.find(([t]) => t === heroEl)?.[0] as Keyframe[]
    const aboutFrames = animateSpy.mock.calls.find(([t]) => t === aboutEl)?.[0] as Keyframe[]
    expect((heroFrames[0].transform as string)).toContain('-140%')
    expect((aboutFrames[0].transform as string)).toContain('-130%')
  })

  it('hero block squash keyframe uses wider scaleX than non-hero', () => {
    const heroEl  = makeBlockEl('hero')
    const aboutEl = makeBlockEl('about')
    renderHook(() => useGravityDrop([{ current: heroEl }, { current: aboutEl }]))

    const heroFrames  = animateSpy.mock.calls.find(([t]) => t === heroEl)?.[0] as Keyframe[]
    const aboutFrames = animateSpy.mock.calls.find(([t]) => t === aboutEl)?.[0] as Keyframe[]

    const heroSquash  = heroFrames.find((f) => (f.transform as string).includes('scaleX(1.1'))
    const aboutSquash = aboutFrames.find((f) => (f.transform as string).includes('scaleX(1.06'))
    expect(heroSquash).toBeDefined()
    expect(aboutSquash).toBeDefined()
  })

  it('animates [data-reveal] children of each block after settle', () => {
    const el = makeBlockEl('brand', ['title', 'subtitle', 'cta'])
    renderHook(() => useGravityDrop([{ current: el }]))

    const childEls = Array.from(el.querySelectorAll('[data-reveal]'))
    for (const child of childEls) {
      const call = animateSpy.mock.calls.find(([t]) => t === child)
      expect(call, `${(child as HTMLElement).dataset.reveal} should be animated`).toBeDefined()
    }
  })

  it('child reveal delays are staggered 80 ms apart', () => {
    const el = makeBlockEl('brand', ['title', 'subtitle', 'cta'])
    renderHook(() => useGravityDrop([{ current: el }]))

    const children = Array.from(el.querySelectorAll('[data-reveal]'))
    const delays = children.map((child) => {
      const call = animateSpy.mock.calls.find(([t]) => t === child)
      return call?.[1].delay as number
    })
    expect(delays[1] - delays[0]).toBe(80)
    expect(delays[2] - delays[1]).toBe(80)
  })

  it('skips animation when SESSION_KEY is already set', () => {
    sessionStorage.setItem('introPlayed', '1')
    const el = makeBlockEl('brand')
    renderHook(() => useGravityDrop([{ current: el }]))
    expect(animateSpy).not.toHaveBeenCalled()
  })

  it('skips animation when RETURN_FLAG is set (line-clear will handle it)', () => {
    sessionStorage.setItem('app:lastNonRootPath', '/about')
    const el = makeBlockEl('brand')
    renderHook(() => useGravityDrop([{ current: el }]))
    expect(animateSpy).not.toHaveBeenCalled()
  })

  it('skips animation when prefers-reduced-motion is set', () => {
    mockMatchMedia(true) // matches: true → reduced motion
    const el = makeBlockEl('brand')
    renderHook(() => useGravityDrop([{ current: el }]))
    expect(animateSpy).not.toHaveBeenCalled()
  })
})
