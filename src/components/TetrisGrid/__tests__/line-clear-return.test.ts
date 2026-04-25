import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { MemoryRouter } from 'react-router'
import React from 'react'
import { useLineClearController } from '../useLineClear'
import type { BlockRef } from '../useLineClear'
import type { BlockId } from '../Block'

type AnimateArgs = [Keyframe[], KeyframeAnimationOptions]

function makeMockAnimate() {
  if (!HTMLElement.prototype.animate) {
    HTMLElement.prototype.animate = () => ({ finished: Promise.resolve(), playState: 'finished', cancel: () => {} }) as unknown as Animation
  }
  const mockAnim = {
    finished: Promise.resolve(),
    playState: 'finished' as AnimationPlayState,
    cancel: vi.fn(),
  }
  return vi.spyOn(HTMLElement.prototype, 'animate').mockReturnValue(
    mockAnim as unknown as Animation,
  )
}

function mockMatchMedia(matches = false) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches, media: query, onchange: null,
      addListener: vi.fn(), removeListener: vi.fn(),
      addEventListener: vi.fn(), removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

function makeBlockRefs(ids: BlockId[]): BlockRef[] {
  return ids.map((id) => {
    const el = document.createElement('a')
    el.dataset.blockId = id
    const title = document.createElement('span')
    title.dataset.reveal = 'title'
    el.appendChild(title)
    return { id, ref: { current: el } }
  })
}

const ALL_IDS: BlockId[] = ['brand', 'about', 'services', 'work', 'process', 'contact', 'hero']

describe('useLineClear — return animation', () => {
  let animateSpy: ReturnType<typeof makeMockAnimate>

  function callsForEl(el: Element): AnimateArgs[] {
    return animateSpy.mock.contexts.reduce<AnimateArgs[]>((acc, ctx, i) => {
      if (ctx === el) acc.push(animateSpy.mock.calls[i] as AnimateArgs)
      return acc
    }, [])
  }

  beforeEach(() => {
    sessionStorage.clear()
    mockMatchMedia(false)
    animateSpy = makeMockAnimate()
    sessionStorage.setItem('app:lastNonRootPath', '/about')
  })

  afterEach(() => {
    animateSpy.mockRestore()
  })

  function runReturnHook(ids: BlockId[] = ALL_IDS) {
    const blockRefs = makeBlockRefs(ids)
    renderHook(() => useLineClearController(blockRefs), {
      wrapper: ({ children }) =>
        React.createElement(MemoryRouter, { initialEntries: ['/'] }, children),
    })
    return blockRefs
  }

  it('fires return animation when RETURN_FLAG is set', () => {
    runReturnHook()
    expect(animateSpy).toHaveBeenCalled()
  })

  it('does NOT fire return animation when RETURN_FLAG is absent', () => {
    sessionStorage.removeItem('app:lastNonRootPath')
    const refs = runReturnHook()
    const blockEls = refs.map((r) => r.ref.current!)
    const blockCalls = blockEls.flatMap((el) => callsForEl(el))
    expect(blockCalls).toHaveLength(0)
  })

  it('animates hero with 420 ms delay', () => {
    const refs = runReturnHook()
    const heroEl = refs.find((r) => r.id === 'hero')!.ref.current!
    const heroCalls = callsForEl(heroEl).filter(([, opts]) => opts.delay === 420)
    expect(heroCalls).toHaveLength(1)
  })

  it('animates brand with 0 ms delay', () => {
    const refs = runReturnHook()
    const brandEl = refs.find((r) => r.id === 'brand')!.ref.current!
    const brandCalls = callsForEl(brandEl).filter(([, opts]) => opts.delay === 0)
    expect(brandCalls).toHaveLength(1)
  })

  it('all seven blocks are animated in the spec stagger order', () => {
    const SPEC_DELAYS: Record<BlockId, number> = {
      brand: 0, about: 60, services: 120, work: 180,
      process: 240, contact: 300, hero: 420,
    }
    const refs = runReturnHook()
    for (const [id, expectedDelay] of Object.entries(SPEC_DELAYS)) {
      const el = refs.find((r) => r.id === id)!.ref.current!
      const call = callsForEl(el).find(([, opts]) => opts.delay === expectedDelay)
      expect(call, `${id} should have delay ${expectedDelay}`).toBeDefined()
    }
  })

  it('hero squash keyframe uses scaleX(1.10) scaleY(0.87)', () => {
    const refs = runReturnHook()
    const heroEl = refs.find((r) => r.id === 'hero')!.ref.current!
    const heroMainCall = callsForEl(heroEl).find(([, opts]) => opts.delay === 420)
    const frames = heroMainCall?.[0] as Keyframe[]
    const squashFrame = frames.find((f) => (f.transform as string).includes('scaleX(1.10)'))
    expect(squashFrame).toBeDefined()
    expect(squashFrame!.transform as string).toContain('scaleY(0.87)')
  })

  it('non-hero squash keyframe uses scaleX(1.06) scaleY(0.90)', () => {
    const refs = runReturnHook()
    const brandEl = refs.find((r) => r.id === 'brand')!.ref.current!
    const brandMainCall = callsForEl(brandEl).find(([, opts]) => opts.delay === 0)
    const frames = brandMainCall?.[0] as Keyframe[]
    const squashFrame = frames.find((f) => (f.transform as string).includes('scaleX(1.06)'))
    expect(squashFrame).toBeDefined()
    expect(squashFrame!.transform as string).toContain('scaleY(0.90)')
  })

  it('animates [data-reveal] children after each block settles', () => {
    const refs = runReturnHook()
    const brandEl = refs.find((r) => r.id === 'brand')!.ref.current!
    const titleSpan = brandEl.querySelector('[data-reveal="title"]')!
    const childCalls = callsForEl(titleSpan)
    expect(childCalls.length).toBeGreaterThan(0)
  })

  it('does not fire return animation when prefers-reduced-motion is set', () => {
    mockMatchMedia(true)
    const refs = runReturnHook()
    const blockEls = refs.map((r) => r.ref.current!)
    const blockCalls = blockEls.flatMap((el) => callsForEl(el))
    expect(blockCalls).toHaveLength(0)
  })
})
