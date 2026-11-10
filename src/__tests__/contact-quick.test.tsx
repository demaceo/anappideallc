import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { appRoutes as routes } from './helpers/app-routes'

// happy-dom has no MediaRecorder, so the real VoiceNote only shows its
// "unsupported" hint. A stub with one button stands in for a finished recording.
vi.mock('../components/VoiceNote/VoiceNote', async () => {
  const React = await import('react')
  return {
    VoiceNote: ({ onChange }: { onChange: (v: unknown) => void }) =>
      React.createElement(
        'button',
        {
          type: 'button',
          onClick: () =>
            onChange({ blob: new Blob(['abc'], { type: 'audio/webm' }), mimeType: 'audio/webm', durationSec: 4.2 }),
        },
        'Record a stub voice note',
      ),
  }
})

function renderRoute(path = '/contact') {
  return render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: [path] })} />)
}

const okFetch = () =>
  vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true, confirmationSent: false }), { status: 200 }))

const sentBody = (fetchMock: ReturnType<typeof vi.fn>) => JSON.parse(fetchMock.mock.calls[0][1].body)
const sendButton = () => screen.getByRole('button', { name: /send message/i })
const servicesToggle = () => screen.getByRole('button', { name: /what are you looking for/i })

function fillContact() {
  fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Sam' } })
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'sam@example.com' } })
}

afterEach(() => vi.unstubAllGlobals())

describe('Contact quick form: sending', () => {
  it('sends a message with the fields the API expects', async () => {
    const fetchMock = okFetch()
    vi.stubGlobal('fetch', fetchMock)
    renderRoute()
    fireEvent.change(screen.getByLabelText(/in your words/i), { target: { value: '  I need a booking page.  ' } })
    fillContact()
    fireEvent.change(screen.getByLabelText('Phone'), { target: { value: '555-0100' } })
    fireEvent.click(sendButton())
    await screen.findByRole('status')

    expect(fetchMock.mock.calls[0][0]).toBe('/api/contact')
    const body = sentBody(fetchMock)
    expect(body).toMatchObject({
      name: 'Sam',
      email: 'sam@example.com',
      phone: '555-0100',
      description: 'I need a booking page.', // trimmed
      services: [],
      usedGuide: false,
      audio: null,
      website: '',
    })
    expect(typeof body.elapsedMs).toBe('number')
  })

  it('lets a visitor send with only a service ticked, no message', async () => {
    const fetchMock = okFetch()
    vi.stubGlobal('fetch', fetchMock)
    renderRoute()
    fireEvent.click(servicesToggle())
    fireEvent.click(screen.getByRole('checkbox', { name: /fix my existing site/i }))
    fillContact()
    fireEvent.click(sendButton())
    await screen.findByRole('status')

    const body = sentBody(fetchMock)
    expect(body.services).toEqual(['site-fixes'])
    expect(body.description).toBe('')
  })

  it('lets a visitor send with only a voice note, no message', async () => {
    const fetchMock = okFetch()
    vi.stubGlobal('fetch', fetchMock)
    renderRoute()
    fireEvent.click(screen.getByRole('button', { name: /record a stub voice note/i }))
    fillContact()
    fireEvent.click(sendButton())
    const status = await screen.findByRole('status')

    const { audio, description } = sentBody(fetchMock)
    expect(description).toBe('')
    expect(audio.mimeType).toBe('audio/webm')
    expect(audio.durationSec).toBe(4)
    expect(audio.base64.length).toBeGreaterThan(0)
    expect(status).toHaveTextContent(/voice note and all/i)
  })

  it('sends the services in the studio\'s order, whatever order they were ticked in', async () => {
    const fetchMock = okFetch()
    vi.stubGlobal('fetch', fetchMock)
    renderRoute()
    fireEvent.click(servicesToggle())
    fireEvent.click(screen.getByRole('checkbox', { name: /ai for your business/i }))
    fireEvent.click(screen.getByRole('checkbox', { name: /a website for your business/i }))
    fireEvent.change(screen.getByLabelText(/in your words/i), { target: { value: 'Hi' } })
    fillContact()
    fireEvent.click(sendButton())
    await screen.findByRole('status')
    expect(sentBody(fetchMock).services).toEqual(['business-websites', 'ai-integration'])
  })

  it('does not send a second copy when submitted twice', async () => {
    // Enter now submits from any text field, so a double submit is easy to do.
    const fetchMock = vi.fn().mockReturnValue(new Promise(() => {})) // never settles: stays "sending"
    vi.stubGlobal('fetch', fetchMock)
    const { container } = renderRoute()
    fireEvent.change(screen.getByLabelText(/in your words/i), { target: { value: 'Hi' } })
    fillContact()
    const form = container.querySelector('form.contact-quick') as HTMLFormElement
    fireEvent.submit(form)
    fireEvent.submit(form)
    fireEvent.submit(form)
    // The button relabels and disables itself while the first send is in flight.
    await waitFor(() => expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled())
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('keeps everything the visitor typed when a send fails, so they can retry', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 500 })))
    renderRoute()
    fireEvent.change(screen.getByLabelText(/in your words/i), { target: { value: 'Keep me' } })
    fillContact()
    fireEvent.click(sendButton())
    await screen.findByRole('alert')
    expect(screen.getByLabelText(/in your words/i)).toHaveValue('Keep me')
    expect(screen.getByLabelText('Name')).toHaveValue('Sam')
    expect(sendButton()).not.toBeDisabled()
  })

  it('does not send when Enter is pressed on a service checkbox', () => {
    const fetchMock = okFetch()
    vi.stubGlobal('fetch', fetchMock)
    renderRoute()
    fireEvent.change(screen.getByLabelText(/in your words/i), { target: { value: 'Hi' } })
    fillContact()
    fireEvent.click(servicesToggle())
    fireEvent.keyDown(screen.getByRole('checkbox', { name: /own it/i }), { key: 'Enter' })
    expect(fetchMock).not.toHaveBeenCalled()
    expect(screen.getByRole('checkbox', { name: /own it/i })).toBeChecked()
  })
})

describe('Contact quick form: validation order follows the page', () => {
  const alertText = () => screen.getByRole('alert').textContent ?? ''

  it('asks for something to go on, then a name, then a way to reach them', async () => {
    renderRoute()
    fireEvent.click(sendButton())
    expect(alertText()).toMatch(/pick a service/i)

    fireEvent.change(screen.getByLabelText(/in your words/i), { target: { value: 'Hi' } })
    fireEvent.click(sendButton())
    expect(alertText()).toMatch(/add your name/i)

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Sam' } })
    fireEvent.click(sendButton())
    expect(alertText()).toMatch(/email or a phone number/i)

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'nope' } })
    fireEvent.click(sendButton())
    expect(alertText()).toMatch(/email looks off/i)
  })

  it('accepts a ticked service as something to go on', () => {
    renderRoute()
    fireEvent.click(servicesToggle())
    fireEvent.click(screen.getByRole('checkbox', { name: /own it/i }))
    fireEvent.click(sendButton())
    // Past the idea check: now it is the missing name.
    expect(screen.getByRole('alert')).toHaveTextContent(/add your name/i)
  })

  it('clears an idea error as soon as the visitor ticks a service', () => {
    renderRoute()
    fireEvent.click(sendButton())
    expect(screen.getByRole('alert')).toBeInTheDocument()
    fireEvent.click(servicesToggle())
    fireEvent.click(screen.getByRole('checkbox', { name: /own it/i }))
    expect(screen.queryByRole('alert')).toBeNull()
  })
})

describe('Contact quick form: ?service= pre-ticks from the Services page', () => {
  it('opens with that service ticked and shown on the closed toggle', () => {
    renderRoute('/contact?service=site-fixes')
    expect(servicesToggle()).toHaveTextContent('Fix My Existing Site')
    fireEvent.click(servicesToggle())
    expect(screen.getByRole('checkbox', { name: /fix my existing site/i })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: /own it/i })).not.toBeChecked()
  })

  it('sends the pre-ticked service', async () => {
    const fetchMock = okFetch()
    vi.stubGlobal('fetch', fetchMock)
    renderRoute('/contact?service=own-it')
    fillContact()
    fireEvent.click(sendButton())
    await screen.findByRole('status')
    expect(sentBody(fetchMock).services).toEqual(['own-it'])
  })

  it('ignores ids that are not services', () => {
    renderRoute('/contact?service=nope&service=<script>')
    expect(servicesToggle()).toHaveTextContent('Pick any that fit')
    fireEvent.click(servicesToggle())
    for (const box of screen.getAllByRole('checkbox')) expect(box).not.toBeChecked()
  })

  it('takes several, and the visitor can untick them', () => {
    renderRoute('/contact?service=site-fixes&service=own-it')
    fireEvent.click(servicesToggle())
    expect(screen.getByRole('checkbox', { name: /fix my existing site/i })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: /own it/i })).toBeChecked()
    fireEvent.click(screen.getByRole('checkbox', { name: /fix my existing site/i }))
    expect(screen.getByRole('checkbox', { name: /fix my existing site/i })).not.toBeChecked()
    // Unticking is theirs to keep: the link does not tick it again.
    expect(screen.getByRole('checkbox', { name: /own it/i })).toBeChecked()
  })

  it('adds the service from a newer ?service= link on top of what the visitor ticked', async () => {
    // Following a link to the same page does not remount the form, so the new
    // service must not be silently ignored once the visitor has ticked anything.
    const router = createMemoryRouter(routes, { initialEntries: ['/contact'] })
    render(<RouterProvider router={router} />)
    fireEvent.click(servicesToggle())
    fireEvent.click(screen.getByRole('checkbox', { name: /fix my existing site/i }))
    await act(() => router.navigate('/contact?service=own-it'))
    expect(screen.getByRole('checkbox', { name: /fix my existing site/i })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: /own it/i })).toBeChecked()
    // ...and an untick after that is still theirs to keep.
    fireEvent.click(screen.getByRole('checkbox', { name: /own it/i }))
    expect(screen.getByRole('checkbox', { name: /own it/i })).not.toBeChecked()
  })

  it('links every "Start here" on the Services page to its own service', () => {
    renderRoute('/services')
    const links = screen.getAllByRole('link', { name: /start here/i })
    expect(links.length).toBeGreaterThanOrEqual(5)
    for (const link of links) expect(link.getAttribute('href')).toMatch(/^\/contact\?service=[a-z-]+$/)
    const within0 = within(links[0].closest('.svc-item') as HTMLElement)
    expect(within0.getByRole('link', { name: /start here/i })).toBe(links[0])
  })
})
