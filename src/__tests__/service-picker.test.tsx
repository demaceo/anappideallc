import { useState } from 'react'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ServicePicker, type ServiceOption } from '../components/ServicePicker/ServicePicker'

const OPTIONS: ServiceOption[] = [
  { id: 'a', title: 'A Website', hint: 'Ready in 3–5 weeks' },
  { id: 'b', title: 'Fix My Site', hint: '$92/hour' },
  { id: 'c', title: 'Apps & Custom Software' },
]

function Harness({
  initial = [],
  onChange,
  onSubmit = () => {},
  onOuterKeyDown = () => {},
}: {
  initial?: string[]
  onChange?: (ids: string[]) => void
  onSubmit?: () => void
  onOuterKeyDown?: () => void
}) {
  const [value, setValue] = useState<string[]>(initial)
  return (
    <div onKeyDown={onOuterKeyDown}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
      >
        <ServicePicker
          options={OPTIONS}
          value={value}
          onChange={(ids) => {
            setValue(ids)
            onChange?.(ids)
          }}
          label="What are you looking for?"
          help="Skip this if you're not sure."
        />
        <input aria-label="Next field" />
      </form>
    </div>
  )
}

const toggleButton = () => screen.getByRole('button', { name: /what are you looking for/i })

describe('ServicePicker — a disclosure of checkboxes', () => {
  it('starts closed, with the toggle wired to a panel that exists', () => {
    const { container } = render(<Harness />)
    const toggle = toggleButton()
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    const panel = container.querySelector(`#${toggle.getAttribute('aria-controls')}`)
    expect(panel).not.toBeNull()
    expect(panel).toHaveAttribute('hidden')
  })

  it('keeps a closed panel out of the accessibility tree and tab order', () => {
    render(<Harness />)
    // Testing Library skips hidden elements, so no checkbox is reachable yet.
    expect(screen.queryAllByRole('checkbox')).toHaveLength(0)
    fireEvent.click(toggleButton())
    expect(screen.getAllByRole('checkbox')).toHaveLength(OPTIONS.length)
  })

  it('opens to a labelled group of native checkboxes, one per option', () => {
    render(<Harness />)
    fireEvent.click(toggleButton())
    expect(toggleButton()).toHaveAttribute('aria-expanded', 'true')
    const group = screen.getByRole('group', { name: /pick any that fit/i })
    const boxes = within(group).getAllByRole('checkbox')
    expect(boxes.map((b) => (b as HTMLInputElement).value)).toEqual(['a', 'b', 'c'])
    for (const box of boxes) expect(box.tagName).toBe('INPUT')
    expect(within(group).getByRole('checkbox', { name: /A Website/ })).toBeInTheDocument()
  })

  it('uses no listbox, combobox, option or select', () => {
    const { container } = render(<Harness />)
    fireEvent.click(toggleButton())
    expect(screen.queryByRole('listbox')).toBeNull()
    expect(screen.queryByRole('combobox')).toBeNull()
    expect(screen.queryAllByRole('option')).toHaveLength(0)
    expect(container.querySelector('select')).toBeNull()
  })

  it('names the toggle by its label and what is ticked', () => {
    render(<Harness initial={['b']} />)
    expect(toggleButton()).toHaveAccessibleName(/what are you looking for\? optional fix my site/i)
  })

  it('describes the toggle with the help text', () => {
    render(<Harness />)
    expect(toggleButton()).toHaveAccessibleDescription("Skip this if you're not sure.")
  })

  it('reports ticks in the options\' order, whatever order they were ticked in', () => {
    const onChange = vi.fn()
    render(<Harness onChange={onChange} />)
    fireEvent.click(toggleButton())
    fireEvent.click(screen.getByRole('checkbox', { name: /Apps & Custom Software/ }))
    fireEvent.click(screen.getByRole('checkbox', { name: /A Website/ }))
    expect(onChange).toHaveBeenLastCalledWith(['a', 'c'])
    fireEvent.click(screen.getByRole('checkbox', { name: /A Website/ }))
    expect(onChange).toHaveBeenLastCalledWith(['c'])
  })

  it('shows what is ticked on the closed toggle, and a prompt when nothing is', () => {
    render(<Harness />)
    expect(toggleButton()).toHaveTextContent('Pick any that fit')
    fireEvent.click(toggleButton())
    fireEvent.click(screen.getByRole('checkbox', { name: /A Website/ }))
    fireEvent.click(screen.getByRole('checkbox', { name: /Fix My Site/ }))
    fireEvent.click(toggleButton()) // close
    expect(toggleButton()).toHaveAttribute('aria-expanded', 'false')
    expect(toggleButton()).toHaveTextContent('A Website, Fix My Site')
  })

  it('keeps ticks when closed and reopened', () => {
    render(<Harness initial={['c']} />)
    fireEvent.click(toggleButton())
    expect(screen.getByRole('checkbox', { name: /Apps & Custom Software/ })).toBeChecked()
  })

  it('marks ticked rows so they can be styled', () => {
    const { container } = render(<Harness initial={['a']} />)
    fireEvent.click(toggleButton())
    expect(container.querySelectorAll('.service-picker-row.selected')).toHaveLength(1)
  })
})

describe('ServicePicker — keyboard', () => {
  it('toggles a checkbox with Enter, and never submits the form', () => {
    // In Chrome and Firefox, Enter in a checkbox submits the enclosing form,
    // which would send a half-written message.
    const onSubmit = vi.fn()
    const onChange = vi.fn()
    render(<Harness onSubmit={onSubmit} onChange={onChange} />)
    fireEvent.click(toggleButton())
    const box = screen.getByRole('checkbox', { name: /A Website/ })
    box.focus()
    const notPrevented = fireEvent.keyDown(box, { key: 'Enter' })
    expect(notPrevented).toBe(false) // preventDefault() was called
    expect(onSubmit).not.toHaveBeenCalled()
    expect(onChange).toHaveBeenLastCalledWith(['a'])
  })

  it('closes on Esc from inside the panel and returns focus to the toggle', () => {
    render(<Harness />)
    fireEvent.click(toggleButton())
    const box = screen.getByRole('checkbox', { name: /Fix My Site/ })
    box.focus()
    fireEvent.keyDown(box, { key: 'Escape' })
    expect(toggleButton()).toHaveAttribute('aria-expanded', 'false')
    expect(toggleButton()).toHaveFocus()
    expect(screen.queryAllByRole('checkbox')).toHaveLength(0)
  })

  it('stops Esc from reaching anything else on the page', () => {
    const outer = vi.fn()
    render(<Harness onOuterKeyDown={outer} />)
    fireEvent.click(toggleButton())
    fireEvent.keyDown(screen.getByRole('checkbox', { name: /A Website/ }), { key: 'Escape' })
    expect(outer).not.toHaveBeenCalled()
  })

  it('lets Esc through when the panel is already closed', () => {
    const outer = vi.fn()
    render(<Harness onOuterKeyDown={outer} />)
    fireEvent.keyDown(toggleButton(), { key: 'Escape' })
    expect(outer).toHaveBeenCalledTimes(1)
  })

  it('does not close when focus moves on to the next field', () => {
    // A panel that collapses as the visitor reaches for the next field would
    // shift the layout under their finger.
    render(<Harness />)
    fireEvent.click(toggleButton())
    screen.getByLabelText('Next field').focus()
    fireEvent.click(screen.getByLabelText('Next field'))
    expect(toggleButton()).toHaveAttribute('aria-expanded', 'true')
  })
})
