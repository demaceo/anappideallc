import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { renderToString } from 'react-dom/server'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { motionAllowed } from '../motion/useScrollScenes'
import { SCENES } from '../motion/scenes'
import { UNFOLD } from '../motion/scenes/unfold-paths'
import { UnfoldScene } from '../components/scenes/UnfoldScene'
import { AccumulationScene } from '../components/scenes/AccumulationScene'
import { ThreadScene } from '../components/scenes/ThreadScene'
import { SplitScene } from '../components/scenes/SplitScene'
import { TimelineScene } from '../components/scenes/TimelineScene'
import { NetworkScene } from '../components/scenes/NetworkScene'
import { DoorScene } from '../components/scenes/DoorScene'
import { ACCUMULATION, DOOR, TIMELINE_SHAPES, networkSpoke } from '../motion/scenes/geometry'

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

  // Loads every page's chunk, not just Home: pages are lazy, so a page that
  // imported gsap at the top would otherwise slip past this test.
  it('mounts the app and loads every page without importing gsap', async () => {
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
    const { resolveAllLazyRoutes } = await import('../lib/resolveLazyRoutes')
    const allPages = await resolveAllLazyRoutes(routes)
    render(<RouterProvider router={createMemoryRouter(allPages, { initialEntries: ['/'] })} />)
    await new Promise((r) => setTimeout(r, 50))
    expect(loaded).not.toHaveBeenCalled()
    // resetModules() makes this reload the whole app's module graph cold,
    // which takes several seconds under parallel workers: past Vitest's 5s
    // default, though it passes in ~1s alone. The time is the import, not a
    // wait on anything flaky.
  }, 30_000)
})

// Each scene's finished-state marker: something only the END of its
// timeline shows, so a scene accidentally rendered in its opening state fails.
const SCENE_CASES = [
  { name: 'unfold', Comp: UnfoldScene, marker: `d="${UNFOLD.browser}"` },
  { name: 'accumulation', Comp: AccumulationScene, marker: `points="${ACCUMULATION[0].points}"` },
  { name: 'thread', Comp: ThreadScene, marker: 'data-p="frame"' },
  { name: 'split', Comp: SplitScene, marker: 'transform="translate(22 22)"' },
  { name: 'timeline', Comp: TimelineScene, marker: `d="${TIMELINE_SHAPES[1]}"` },
  { name: 'network', Comp: NetworkScene, marker: `d="${networkSpoke(0)}"` },
  { name: 'door', Comp: DoorScene, marker: `d="${DOOR.open}"` },
] as const

describe('scenes', () => {
  it('has exactly one component per registered timeline', () => {
    expect(SCENE_CASES.map((c) => c.name).sort()).toEqual(Object.keys(SCENES).sort())
  })

  for (const { name, Comp, marker } of SCENE_CASES) {
    it(`server-renders ${name} decorative and in its finished state`, () => {
      const html = renderToString(<Comp />)
      expect(html).toContain(`data-scene="${name}"`)
      expect(html).toContain('aria-hidden="true"')
      expect(html).toContain(marker)
      // Under the per-scene SVG budget.
      expect(html.length).toBeLessThan(15_000)
    })
  }

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
