import { fireEvent, render, screen } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { appRoutes as routes } from './helpers/app-routes'

// Counts mounts and unmounts of the voice note: unmounting it mid-recording
// would drop the take, so the form must keep it mounted while the guide runs.
const voice = vi.hoisted(() => ({ mounts: 0, unmounts: 0 }))
vi.mock('../components/VoiceNote/VoiceNote', async () => {
  const React = await import('react')
  return {
    VoiceNote: ({ value, onChange }: { value: unknown; onChange: (v: unknown) => void }) => {
      React.useEffect(() => {
        voice.mounts++
        return () => {
          voice.unmounts++
        }
      }, [])
      return React.createElement(
        'button',
        {
          type: 'button',
          'data-has-voice': value ? 'yes' : 'no',
          onClick: () =>
            onChange({ blob: new Blob(['abc'], { type: 'audio/webm' }), mimeType: 'audio/webm', durationSec: 2 }),
        },
        'Record a stub voice note',
      )
    },
  }
})

beforeEach(() => {
  voice.mounts = 0
  voice.unmounts = 0
})
afterEach(() => vi.unstubAllGlobals())

function renderContact() {
  return render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/contact'] })} />)
}

const guideLink = () => screen.getByRole('button', { name: /not sure what to say\? let me guide you/i })
const message = () => screen.getByLabelText(/in your words/i) as HTMLTextAreaElement
const servicesToggle = () => screen.getByRole('button', { name: /what are you looking for/i })
const cont = () => screen.getByRole('button', { name: /continue/i })
const stepCount = () => document.querySelector('.wizard-step-count')?.textContent
const quickForm = (c: HTMLElement) => c.querySelector('form.contact-quick') as HTMLFormElement

/** Walks the guide to its last step (the button reads "Write my first draft"). */
function toLastStep() {
  while (screen.queryByRole('button', { name: /write my first draft/i }) === null) fireEvent.click(cont())
}

function draftFor(type: RegExp, { budget }: { budget?: string } = {}) {
  fireEvent.click(guideLink())
  fireEvent.click(screen.getByRole('button', { name: type }))
  if (budget) {
    while (screen.queryByLabelText(/budget ballpark/i) === null) fireEvent.click(cont())
    fireEvent.change(screen.getByLabelText(/budget ballpark/i), { target: { value: budget } })
  }
  toLastStep()
  fireEvent.click(screen.getByRole('button', { name: /write my first draft/i }))
}

describe('Guided questions hand a draft back to the quick form', () => {
  it('fills the message, ticks the implied service and says where the text came from', () => {
    renderContact()
    draftFor(/a mobile app/i, { budget: '$4k' })

    expect(stepCount()).toBeUndefined() // back on the quick form
    expect(message().value).toBe(
      "I'm looking for help building a mobile app.\n\nBudget ballpark: $4k.",
    )
    expect(screen.getByText(/here's a first draft from your answers/i)).toBeInTheDocument()
    expect(servicesToggle()).toHaveTextContent('Apps & Custom Software')
  })

  it('describes the message box by the draft notice, and clears the notice on the first edit', () => {
    renderContact()
    draftFor(/a website/i)
    const note = screen.getByText(/here's a first draft/i)
    expect(message().getAttribute('aria-describedby')).toContain(note.id)

    fireEvent.change(message(), { target: { value: `${message().value} Thanks!` } })
    expect(screen.queryByText(/here's a first draft/i)).toBeNull()
    expect(message().getAttribute('aria-describedby') ?? '').not.toContain('cf-draft-note')
  })

  it('moves focus to the message box, with the caret at the end', () => {
    renderContact()
    draftFor(/a website/i)
    expect(document.activeElement).toBe(message())
    expect(message().selectionStart).toBe(message().value.length)
  })

  it('keeps what the visitor already wrote and adds the draft underneath', () => {
    renderContact()
    fireEvent.change(message(), { target: { value: 'My own words.' } })
    draftFor(/a website/i)
    expect(message().value).toBe("My own words.\n\nI'm looking for help with a website.")
    expect(screen.getByText(/i added a draft below what you wrote/i)).toBeInTheDocument()
  })

  it('replaces the previous draft in place when they run the guide again', () => {
    renderContact()
    draftFor(/a mobile app/i)
    fireEvent.change(message(), { target: { value: `Hello!\n\n${message().value}` } })
    // Run it again and answer differently.
    draftFor(/a website/i)
    expect(message().value).toBe("Hello!\n\nI'm looking for help with a website.")
    expect(message().value).not.toMatch(/mobile app/)
  })

  it('adds to the ticked services and never unticks one', () => {
    renderContact()
    fireEvent.click(servicesToggle())
    fireEvent.click(screen.getByRole('checkbox', { name: /own it/i }))
    draftFor(/a website/i)
    // The panel they opened is still open when they come back from the guide.
    expect(servicesToggle()).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('checkbox', { name: /a website for your business/i })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: /own it/i })).toBeChecked()
  })

  it('ticks nothing for "not sure", and the visitor can still untick what it did tick', () => {
    renderContact()
    draftFor(/i'm not sure yet/i)
    expect(servicesToggle()).toHaveTextContent('Pick any that fit')

    draftFor(/a website/i)
    fireEvent.click(servicesToggle())
    const box = screen.getByRole('checkbox', { name: /a website for your business/i })
    expect(box).toBeChecked()
    fireEvent.click(box)
    expect(box).not.toBeChecked()
  })

  it('writes no draft and shows no notice when nothing was answered', () => {
    renderContact()
    fireEvent.click(guideLink())
    toLastStep()
    fireEvent.click(screen.getByRole('button', { name: /write my first draft/i }))
    expect(message().value).toBe('')
    expect(screen.queryByText(/first draft/i)).toBeNull()
    expect(servicesToggle()).toHaveTextContent('Pick any that fit')
  })

  it('leaves out search answers that stopped applying when they switched to an app', () => {
    renderContact()
    fireEvent.click(guideLink())
    fireEvent.click(screen.getByRole('button', { name: /a website/i }))
    fireEvent.click(cont()) // how will people find it
    fireEvent.click(screen.getAllByRole('button', { name: 'Must-have' })[0])
    // Go back and change their mind.
    fireEvent.click(screen.getByRole('button', { name: /^back$/i }))
    fireEvent.click(screen.getByRole('button', { name: /a mobile app/i }))
    toLastStep()
    fireEvent.click(screen.getByRole('button', { name: /write my first draft/i }))
    expect(message().value).not.toMatch(/google/i)
  })
})

describe('Leaving the guide', () => {
  it('goes back to the quick form from step one, changing nothing, focus on the link', () => {
    renderContact()
    fireEvent.change(message(), { target: { value: 'Mine' } })
    fireEvent.click(guideLink())
    fireEvent.click(screen.getByRole('button', { name: /back to my message/i }))
    expect(stepCount()).toBeUndefined()
    expect(message().value).toBe('Mine')
    expect(screen.queryByText(/first draft/i)).toBeNull()
    expect(document.activeElement).toBe(guideLink())
  })

  it('steps back one question at a time', () => {
    renderContact()
    fireEvent.click(guideLink())
    fireEvent.click(screen.getByRole('button', { name: /a website/i }))
    fireEvent.click(cont())
    expect(stepCount()).toMatch(/02 \/ 05/)
    fireEvent.click(screen.getByRole('button', { name: /^back$/i }))
    expect(stepCount()).toMatch(/01 \/ 05/)
  })

  it('starts the guide from its first question again, with earlier answers still picked', () => {
    renderContact()
    draftFor(/a mobile app/i)
    fireEvent.click(guideLink())
    expect(stepCount()).toMatch(/01 \/ 05/)
    expect(screen.getByRole('button', { name: /a mobile app/i })).toHaveAttribute('aria-pressed', 'true')
  })
})

describe('Switching modes loses nothing', () => {
  it('keeps the typed message, contact details, ticks and voice note across a round trip', () => {
    const { container } = renderContact()
    fireEvent.change(message(), { target: { value: 'Typed first' } })
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Sam' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'sam@example.com' } })
    fireEvent.click(servicesToggle())
    fireEvent.click(screen.getByRole('checkbox', { name: /ai for your business/i }))
    fireEvent.click(screen.getByRole('button', { name: /record a stub voice note/i }))

    fireEvent.click(guideLink())
    // The quick form is hidden, not gone.
    expect(quickForm(container)).toHaveAttribute('hidden')
    fireEvent.click(screen.getByRole('button', { name: /back to my message/i }))
    expect(quickForm(container)).not.toHaveAttribute('hidden')

    expect(message().value).toBe('Typed first')
    expect(screen.getByLabelText('Name')).toHaveValue('Sam')
    expect(screen.getByLabelText('Email')).toHaveValue('sam@example.com')
    expect(servicesToggle()).toHaveTextContent('AI for Your Business')
    expect(screen.getByRole('button', { name: /record a stub voice note/i })).toHaveAttribute('data-has-voice', 'yes')
  })

  it('never unmounts the voice note, so an in-progress recording is not dropped', () => {
    renderContact()
    expect(voice.mounts).toBe(1)
    fireEvent.click(guideLink())
    toLastStep()
    fireEvent.click(screen.getByRole('button', { name: /write my first draft/i }))
    fireEvent.click(guideLink())
    fireEvent.click(screen.getByRole('button', { name: /back to my message/i }))
    expect(voice.mounts).toBe(1)
    expect(voice.unmounts).toBe(0)
  })

  it('moves focus to the guide when it opens, and shows only one set of questions', () => {
    renderContact()
    fireEvent.click(guideLink())
    const stage = screen.getByRole('group', { name: /step 1 of/i })
    expect(document.activeElement).toBe(stage)
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument()
  })

  it('does not steal focus on first load', () => {
    renderContact()
    expect(document.activeElement).toBe(document.body)
  })

  it('sends one message that includes the guided flag, from the quick form\'s Send', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ ok: true, confirmationSent: false }), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    renderContact()
    draftFor(/both/i)
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Sam' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'sam@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /send message/i }))
    await screen.findByRole('status')

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body.usedGuide).toBe(true)
    expect(body.services).toEqual(['business-websites', 'custom-builds'])
    expect(body.description).toContain("I'm looking for a mobile app and a website to go with it.")
  })

  it('does not send search or store answers for a project type they no longer apply to', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ ok: true, confirmationSent: false }), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    renderContact()
    fireEvent.click(guideLink())
    fireEvent.click(screen.getByRole('button', { name: /a website/i }))
    fireEvent.click(cont())
    fireEvent.click(screen.getAllByRole('button', { name: 'Must-have' })[0]) // SEO
    fireEvent.click(screen.getByRole('button', { name: /^back$/i }))
    fireEvent.click(screen.getByRole('button', { name: /a mobile app/i }))
    toLastStep()
    fireEvent.click(screen.getByRole('button', { name: /write my first draft/i }))
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Sam' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'sam@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /send message/i }))
    await screen.findByRole('status')

    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body.projectType).toBe('app')
    expect(body.seoImportance).toBe('')
    expect(body.geoImportance).toBe('')
  })

  it('stops sending the guided answers once the visitor empties the drafted message', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ ok: true, confirmationSent: false }), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    renderContact()
    draftFor(/a website/i, { budget: '$4k' })
    fireEvent.change(message(), { target: { value: '' } })
    fireEvent.change(message(), { target: { value: 'My own words instead.' } })
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Sam' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'sam@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /send message/i }))
    await screen.findByRole('status')

    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body.usedGuide).toBe(false)
    expect(body.projectType).toBe('')
    expect(body.audience).toBe('')
    expect(body.budget).toBeUndefined()
    expect(body.description).toBe('My own words instead.')
  })
})
