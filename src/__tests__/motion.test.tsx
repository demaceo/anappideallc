import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { renderToString } from 'react-dom/server'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { motionAllowed } from '../motion/useScrollScenes'
import { SCENES } from '../motion/scenes'
import { UNFOLD } from '../motion/scenes/unfold-paths'
import { UnfoldScene } from '../components/scenes/UnfoldScene'

function fakeWindow(reduce: boolean, io = true) {
  return {
    matchMedia: (q: string) => ({ matches: q.includes('reduce') ? reduce : false }),
    ...(io ? { IntersectionObserver: class {} } : {}),
  } as unknown as Window
}

describe('motion gate', () => {
  it('refuses motion when the visitor prefers reduced motion', () => {
    expect(motionAllowed(fakeWindow(true))).toBe(false)
  })

  it('refuses motion without a real browser (no window / no IntersectionObserver)', () => {
    expect(motionAllowed(null)).toBe(false)
    expect(motionAllowed(fakeWindow(false, false))).toBe(false)
  })

  it('allows motion otherwise', () => {
    expect(motionAllowed(fakeWindow(false))).toBe(true)
  })
})

describe('reduced motion never loads GSAP', () => {
  const realMatchMedia = window.matchMedia
  afterEach(() => {
    window.matchMedia = realMatchMedia
    vi.doUnmock('gsap')
    vi.resetModules()
  })

  it('mounts the whole app without importing gsap', async () => {
    const loaded = vi.fn()
    vi.doMock('gsap', () => {
      loaded()
      return {}
    })
    window.matchMedia = ((q: string) => ({
      matches: q.includes('reduce'),
      media: q,
      addEventListener() {},
      removeEventListener() {},
    })) as unknown as typeof window.matchMedia

    const { render } = await import('@testing-library/react')
    const { RouterProvider, createMemoryRouter } = await import('react-router')
    const { routes } = await import('../routes')
    render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/'] })} />)
    await new Promise((r) => setTimeout(r, 50))
    expect(loaded).not.toHaveBeenCalled()
  })
})

describe('scenes', () => {
  it('registers a timeline for every scene name used in markup', () => {
    expect(SCENES.unfold).toBeTypeOf('function')
  })

  // The markup is the finished picture, so prerendered and no-JS pages show
  // the complete scene rather than an empty box.
  it('server-renders Unfold in its finished state', () => {
    const html = renderToString(<UnfoldScene />)
    expect(html).toContain('data-scene="unfold"')
    expect(html).toContain('aria-hidden="true"')
    expect(html).toContain(`d="${UNFOLD.browser}"`)
    expect(html).toContain('data-uf="key"')
  })
})

// The old word-by-word / fade-in text reveals hid real copy behind animation.
// They're gone; keep them gone.
describe('no text-hiding reveals', () => {
  function files(dir: string): string[] {
    return readdirSync(dir).flatMap((f) => {
      const p = join(dir, f)
      if (p.includes('__tests__')) return []
      return statSync(p).isDirectory() ? files(p) : /\.(tsx?|css)$/.test(p) ? [p] : []
    })
  }
  it('has no data-split or data-reveal hooks anywhere in src', () => {
    for (const f of files(join(__dirname, '..'))) {
      expect(readFileSync(f, 'utf8'), f).not.toMatch(/data-(split|reveal)\b/)
    }
  })
})
