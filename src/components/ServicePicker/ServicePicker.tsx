import { useId, useRef, useState } from 'react'
import { inOrder } from '../../lib/ordered'

export interface ServiceOption {
  id: string
  title: string
  /** A short second line under the title, e.g. a tagline or a price. */
  hint?: string
}

interface ServicePickerProps {
  options: ServiceOption[]
  /** The ticked option ids. */
  value: string[]
  onChange: (ids: string[]) => void
  label: string
  /** Small print under the control. */
  help?: string
  /** Prefix for the element ids, so a page can hold more than one picker. */
  idPrefix?: string
}

// A dropdown-style disclosure holding real checkboxes: tick any that fit.
//
// Deliberately not a native <select multiple> (unusable on phones: a scrolling
// list you ctrl-click) and not an ARIA listbox/combobox (a lot of keyboard
// behaviour to reimplement, and screen readers handle it unevenly). A button
// that shows and hides a group of checkboxes is plain HTML that every browser
// and assistive tech already understands.
//
// The panel opens IN the page flow rather than floating over it, and does not
// close when the visitor taps elsewhere: a panel that collapses as they reach
// for the next field shifts the layout under their finger. It closes with the
// toggle or Esc.
export function ServicePicker({
  options,
  value,
  onChange,
  label,
  help,
  idPrefix = 'cf-services',
}: ServicePickerProps) {
  // Closed on first render so the prerendered HTML and the hydrated page match.
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  const reactId = useId()
  const toggleId = `${idPrefix}-toggle`
  const panelId = `${idPrefix}-panel`
  const labelId = `${reactId}-label`
  const valueId = `${reactId}-value`
  const helpId = `${reactId}-help`

  const chosen = options.filter((o) => value.includes(o.id))
  const summary = chosen.map((o) => o.title).join(', ')

  function toggle(id: string) {
    const next = new Set(value)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    // Always in the options' order, whatever order they were ticked in.
    onChange(inOrder(options.map((o) => o.id), next))
  }

  function closeAndRefocus() {
    setOpen(false)
    toggleRef.current?.focus()
  }

  return (
    <div
      className="service-picker"
      onKeyDown={(e) => {
        if (e.key === 'Escape' && open) {
          // Do not let Esc also reach anything else listening on the page.
          e.stopPropagation()
          closeAndRefocus()
        }
      }}
    >
      {/* Hidden from the accessibility tree because the button below is named
          from it (aria-labelledby still reads hidden elements): otherwise a
          screen reader says the label once as text and again as the name. */}
      <span className="form-label" id={labelId} aria-hidden="true">
        {label} <span className="form-label-opt">optional</span>
      </span>

      <button
        ref={toggleRef}
        id={toggleId}
        type="button"
        className="service-picker-toggle"
        aria-expanded={open}
        aria-controls={panelId}
        aria-labelledby={`${labelId} ${valueId}`}
        aria-describedby={help ? helpId : undefined}
        onClick={() => setOpen((o) => !o)}
      >
        <span id={valueId} className="service-picker-value">
          {summary || 'Pick any that fit'}
        </span>
        <span className="service-picker-caret" aria-hidden="true">+</span>
      </button>

      {/* `hidden` (not a CSS-only collapse) so a closed panel leaves the tab
          order and the accessibility tree. A plain div: no ARIA role needed. */}
      <div id={panelId} className="service-picker-panel" hidden={!open}>
        <fieldset className="service-picker-fieldset">
          <legend className="service-picker-legend">Pick any that fit</legend>
          {options.map((o) => {
            const checked = value.includes(o.id)
            return (
              <label key={o.id} className={`service-picker-row${checked ? ' selected' : ''}`}>
                <input
                  type="checkbox"
                  className="service-picker-check"
                  value={o.id}
                  checked={checked}
                  onChange={() => toggle(o.id)}
                  onKeyDown={(e) => {
                    // Enter in a checkbox submits the enclosing form in Chrome
                    // and Firefox, which would send the message half-written.
                    // Space already toggles; make Enter do the same instead.
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      toggle(o.id)
                    }
                  }}
                />
                <span className="service-picker-text">
                  <span className="service-picker-title">{o.title}</span>
                  {o.hint && <span className="service-picker-meta">{o.hint}</span>}
                </span>
              </label>
            )
          })}
        </fieldset>
      </div>

      {help && (
        <p id={helpId} className="service-picker-help">
          {help}
        </p>
      )}
    </div>
  )
}
