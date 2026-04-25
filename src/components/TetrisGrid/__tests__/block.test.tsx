import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { Block } from '../Block'
import type { BlockProps } from '../Block'

function renderBlock(props: Partial<BlockProps> = {}) {
  return render(
    <MemoryRouter>
      <Block id="hero" to="/" title="Test Title" {...props} />
    </MemoryRouter>,
  )
}

describe('Block', () => {
  it('adds data-reveal="title" to the title span', () => {
    const { getByText } = renderBlock({ title: 'Hello' })
    expect(getByText('Hello')).toHaveAttribute('data-reveal', 'title')
  })

  it('adds data-reveal="subtitle" to the subtitle span when present', () => {
    const { getByText } = renderBlock({ subtitle: 'Sub text' })
    expect(getByText('Sub text')).toHaveAttribute('data-reveal', 'subtitle')
  })

  it('adds data-reveal="cta" to the cta span when present', () => {
    const { getByText } = renderBlock({ cta: 'Click me' })
    expect(getByText('Click me →')).toHaveAttribute('data-reveal', 'cta')
  })

  it('renders no data-reveal="subtitle" when subtitle is absent', () => {
    const { container } = renderBlock()
    expect(container.querySelector('[data-reveal="subtitle"]')).toBeNull()
  })

  it('renders no data-reveal="cta" when cta is absent', () => {
    const { container } = renderBlock()
    expect(container.querySelector('[data-reveal="cta"]')).toBeNull()
  })

  it('renders tag elements when tags prop is provided', () => {
    const { container } = renderBlock({ tags: ['Civic Tech', 'Privacy', 'PropTech'] })
    const tags = container.querySelectorAll('[data-reveal="tags"] span')
    expect(tags).toHaveLength(3)
    expect(tags[0]).toHaveTextContent('Civic Tech')
    expect(tags[1]).toHaveTextContent('Privacy')
    expect(tags[2]).toHaveTextContent('PropTech')
  })

  it('renders no tags container when tags prop is absent', () => {
    const { container } = renderBlock()
    expect(container.querySelector('[data-reveal="tags"]')).toBeNull()
  })

  it('does not render cta when tags are provided', () => {
    const { container } = renderBlock({ cta: 'View work', tags: ['Civic Tech'] })
    expect(container.querySelector('[data-reveal="cta"]')).toBeNull()
  })
})
