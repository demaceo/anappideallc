import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { vi, beforeAll, afterAll } from 'vitest'
import { ThemeProvider } from '../../../lib/theme'
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
      <MemoryRouter>
        <TetrisGrid />
      </MemoryRouter>
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
})
