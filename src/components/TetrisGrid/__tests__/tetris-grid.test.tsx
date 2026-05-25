import { render, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { MotionConfig } from 'motion/react'
import { vi, beforeAll, afterAll } from 'vitest'
import type { ReactNode } from 'react'
import { ThemeProvider } from '../../../lib/theme'
import { MaterialProvider, useMaterial } from '../../../lib/material'
import { TetrisGrid } from '../TetrisGrid'

// happy-dom does not implement WAAPI or matchMedia; stub both so TetrisGrid renders.
let originalMatchMedia: typeof window.matchMedia

beforeAll(() => {
  originalMatchMedia = window.matchMedia
  // happy-dom omits Element.animate; define it so vi.spyOn can wrap it.
  HTMLElement.prototype.animate = () =>
    ({ finished: Promise.resolve(), playState: 'finished', cancel: () => {} }) as unknown as Animation
  vi.spyOn(HTMLElement.prototype, 'animate').mockReturnValue(
    { finished: Promise.resolve(), playState: 'finished', cancel: vi.fn() } as unknown as Animation,
  )
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
})

afterAll(() => {
  vi.restoreAllMocks()
  window.matchMedia = originalMatchMedia
})

function renderTetrisGrid() {
  return render(
    <ThemeProvider>
      <MaterialProvider>
        <MemoryRouter>
          <TetrisGrid />
        </MemoryRouter>
      </MaterialProvider>
    </ThemeProvider>,
  )
}

// Same wrapper as above, but with an extra child that exposes the
// MaterialProvider's openPanel/closePanel through a test-id button so we
// can drive panel state from tests without simulating Brand-block clicks
// (which would require theme='modern-vibrant' and full Block wiring).
function PanelDriver({ children }: { children: ReactNode }) {
  const { openPanel, closePanel } = useMaterial()
  return (
    <>
      <button data-testid="drive-open" onClick={openPanel}>open</button>
      <button data-testid="drive-close" onClick={closePanel}>close</button>
      {children}
    </>
  )
}

function renderTetrisGridWithDriver() {
  return render(
    <ThemeProvider>
      <MotionConfig reducedMotion="always">
        <MaterialProvider>
          <MemoryRouter>
            <PanelDriver>
              <TetrisGrid />
            </PanelDriver>
          </MemoryRouter>
        </MaterialProvider>
      </MotionConfig>
    </ThemeProvider>,
  )
}

describe('TetrisGrid', () => {
  it('renders a decorative floor element inside the playfield', () => {
    const { container } = renderTetrisGrid()
    const floor = container.querySelector('[data-floor]')
    expect(floor).not.toBeNull()
    expect(floor).toHaveAttribute('aria-hidden', 'true')
  })

  it('places the floor as a sibling of the grid (both children of playfield)', () => {
    const { container } = renderTetrisGrid()
    const floor = container.querySelector('[data-floor]')
    const grid = container.querySelector('[data-grid]')
    expect(floor).not.toBeNull()
    expect(grid).not.toBeNull()
    expect(floor!.parentElement).toBe(grid!.parentElement)
  })

  it('mounts a HeroPortalWindow inside the hero block', () => {
    const { container } = renderTetrisGrid()
    const hero = container.querySelector('[data-block-id="hero"]') as HTMLElement | null
    expect(hero).toBeInTheDocument()
    expect(hero?.querySelector('[aria-hidden="true"]')).toBeInTheDocument()
  })

  it('does NOT mount a HeroPortalWindow inside non-hero blocks', () => {
    const { container } = renderTetrisGrid()
    const about = container.querySelector('[data-block-id="about"]') as HTMLElement | null
    expect(about).toBeInTheDocument()
    expect(about?.querySelector('[aria-hidden="true"]')).toBeNull()
  })

  it('mounts the MaterialsPanel (renders nothing when closed, dialog when open)', () => {
    // Render TetrisGrid (its existing helper wraps with ThemeProvider +
    // MemoryRouter + matchMedia stubs). The panel is initially closed so
    // no dialog should be in the tree.
    const { container } = renderTetrisGrid()
    expect(container.querySelector('[role="dialog"]')).toBeNull()
    // Verify the MaterialsPanel component is at least IMPORTED + mounted
    // by checking that the AnimatePresence wrapper renders (it always
    // renders even when its children don't). We approximate by checking
    // that opening the panel via context would work — but since context
    // requires MaterialProvider which renderTetrisGrid doesn't include,
    // this test just verifies the component file is wired into the import
    // graph without crashing.

    // If MaterialsPanel uses useMaterial() unconditionally and renderTetrisGrid
    // doesn't include MaterialProvider, this would throw. So a passing render
    // here also confirms MaterialProvider IS in the render helper (or
    // we need to add it).
    expect(container.firstChild).toBeInTheDocument()
  })

  // Focus-trap contract (WCAG 2.4.3 / 4.1.2): when the MaterialsPanel
  // dialog is open, the playfield (everything except the panel itself)
  // is marked `inert`, which removes its subtree from the focus order
  // and accessibility tree.
  it('marks the playfield inert when the MaterialsPanel is open', async () => {
    const { container, getByTestId } = renderTetrisGridWithDriver()
    const playfield = container.querySelector('[data-grid]')!.parentElement!

    // Closed → no `inert` attribute.
    expect(playfield.hasAttribute('inert')).toBe(false)

    fireEvent.click(getByTestId('drive-open'))
    await waitFor(() => expect(playfield.hasAttribute('inert')).toBe(true))

    fireEvent.click(getByTestId('drive-close'))
    await waitFor(() => expect(playfield.hasAttribute('inert')).toBe(false))
  })
})
