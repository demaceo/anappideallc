import { act } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { MemoryRouter, StaticRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ContactForm } from '../components/ContactForm/ContactForm'

// The /contact page is prerendered, then hydrated in the browser. The form
// must produce the same markup in both, or React throws the server HTML away
// and re-renders the page. This server-renders the form, hydrates it, and
// fails on any hydration error or warning.
//
// It exists because two things in the form are easy to get wrong:
//  - the `?service=` pre-tick reads the URL, which the server never sees;
//  - the picker is closed and the quick form is shown on first render, with
//    nothing read from window, Date or MediaRecorder.

// Testing Library sets this for you; this file drives React's act() directly.
;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

afterEach(() => vi.restoreAllMocks())

async function hydrate(serverUrl: string, clientUrl: string) {
  const html = renderToString(
    <StaticRouter location={serverUrl}>
      <ContactForm />
    </StaticRouter>,
  )
  const container = document.createElement('div')
  container.innerHTML = html
  document.body.appendChild(container)

  const recoverable: unknown[] = []
  const errors = vi.spyOn(console, 'error').mockImplementation(() => {})
  let root!: ReturnType<typeof hydrateRoot>
  await act(async () => {
    root = hydrateRoot(
      container,
      <MemoryRouter initialEntries={[clientUrl]}>
        <ContactForm />
      </MemoryRouter>,
      { onRecoverableError: (e) => recoverable.push(e) },
    )
  })
  const result = { container, html, recoverable, consoleErrors: errors.mock.calls.map((c) => String(c[0])) }
  const unmount = async () => {
    await act(async () => {
      root.unmount()
    })
    container.remove()
  }
  return { ...result, unmount }
}

describe('ContactForm hydrates cleanly', () => {
  it('server-renders the quick form, with the picker closed and no guided questions', () => {
    const html = renderToString(
      <StaticRouter location="/contact">
        <ContactForm />
      </StaticRouter>,
    )
    expect(html).toContain('id="cf-message"')
    expect(html).toContain('id="cf-guide-link"')
    expect(html).toContain('Send message')
    expect(html).not.toContain('wizard-step-count')
    expect(html).not.toContain('contact-guided')
    expect(html).toMatch(/id="cf-services-panel"[^>]*hidden/)
    // The quick form is on screen: it must not carry the `hidden` attribute.
    expect(html).not.toMatch(/<form[^>]*class="contact-quick"[^>]*hidden/)
  })

  it('hydrates with no mismatch', async () => {
    const { recoverable, consoleErrors, unmount } = await hydrate('/contact', '/contact')
    expect(recoverable).toEqual([])
    expect(consoleErrors).toEqual([])
    await unmount()
  })

  it('hydrates with no mismatch when the URL has ?service=, then ticks it', async () => {
    // The server renders without the query; the client has it. Reading the URL
    // on the first client render would tick a service the HTML never had.
    const { container, recoverable, consoleErrors, unmount } = await hydrate(
      '/contact',
      '/contact?service=site-fixes',
    )
    expect(recoverable).toEqual([])
    expect(consoleErrors).toEqual([])
    // ...and once hydrated, the service is ticked.
    expect(container.querySelector('#cf-services-toggle')).toHaveTextContent('Fix My Existing Site')
    await unmount()
  })
})
