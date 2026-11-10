/// <reference types="node" />
import fs from 'node:fs'
import path from 'node:path'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { services } from '../data/services'

// The Resend SDK resolves `{ data, error }` rather than throwing when the API
// rejects a send (see node_modules/resend: `type Response<T>`). The handler
// used to rely on try/catch alone, so a rejected send answered `{ ok: true }`.
const send = vi.fn()
vi.mock('resend', () => ({
  Resend: class {
    emails = { send }
  },
}))

const { default: handler } = await import('../../api/contact')

function call(body: Record<string, unknown>) {
  const res = {
    statusCode: 200,
    body: undefined as unknown,
    status(code: number) {
      this.statusCode = code
      return this
    },
    json(payload: unknown) {
      this.body = payload
      return this
    },
  }
  return handler({ method: 'POST', body } as VercelRequest, res as unknown as VercelResponse).then(() => res)
}

// `elapsedMs` is what the current form sends; a minute is a plausible human fill.
const VALID = { name: 'Sam', email: 'sam@example.com', description: 'An app for dog walkers', elapsedMs: 60_000 }
const ok = { data: { id: 'x' }, error: null, headers: null }
const rejected = {
  data: null,
  error: { name: 'invalid_api_key', message: 'API key is invalid', statusCode: 403 },
  headers: null,
}

describe('POST /api/contact', () => {
  beforeEach(() => {
    send.mockReset()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('reports failure when Resend rejects the inquiry instead of throwing', async () => {
    send.mockResolvedValueOnce(rejected)
    const res = await call(VALID)
    expect(res.statusCode).toBe(502)
    expect(res.body).toEqual({ error: 'Something broke on my end, not yours. Try again in a moment.' })
    // No confirmation goes out for an inquiry that never arrived.
    expect(send).toHaveBeenCalledTimes(1)
  })

  it('sends a fixed-copy confirmation that echoes nothing the visitor typed', async () => {
    send.mockResolvedValue(ok)
    const res = await call({ ...VALID, name: 'Visit evil.example', description: 'click http://evil.example' })
    expect(res.body).toEqual({ ok: true, confirmationSent: true })

    const confirmation = send.mock.calls[1][0]
    expect(confirmation.to).toBe('sam@example.com')
    expect(confirmation.replyTo).toBe('hello@anappidea.llc')
    expect(`${confirmation.subject}${confirmation.html}${confirmation.text}`).not.toMatch(/evil/)
  })

  it('still succeeds when only the confirmation is rejected', async () => {
    send.mockResolvedValueOnce(ok).mockResolvedValueOnce(rejected)
    const res = await call(VALID)
    expect(res.body).toEqual({ ok: true, confirmationSent: false })
  })

  it('skips the confirmation when the visitor left only a phone number', async () => {
    send.mockResolvedValue(ok)
    const res = await call({ name: 'Sam', phone: '555-0100', description: 'An idea', elapsedMs: 60_000 })
    expect(res.body).toEqual({ ok: true, confirmationSent: false })
    expect(send).toHaveBeenCalledTimes(1)
  })

  it('includes the budget in the inquiry email', async () => {
    send.mockResolvedValue(ok)
    await call({ ...VALID, budget: '$10k–$20k' })
    expect(send.mock.calls[0][0].html).toContain('$10k–$20k')
  })

  describe('bot screening', () => {
    beforeEach(() => {
      vi.spyOn(console, 'warn').mockImplementation(() => {})
    })

    it('drops a submission with the honeypot filled, answering like a success', async () => {
      const res = await call({ ...VALID, website: 'http://spam.example' })
      expect(res.body).toEqual({ ok: true, confirmationSent: false })
      expect(send).not.toHaveBeenCalled()
    })

    it('drops a submission faster than a person can write and send one', async () => {
      const res = await call({ ...VALID, elapsedMs: 800 })
      expect(res.body).toEqual({ ok: true, confirmationSent: false })
      expect(send).not.toHaveBeenCalled()
    })

    it('draws the line at 2 seconds: 1999ms is dropped, 2000ms is delivered', async () => {
      // Autofill plus a pasted message can be quick; dropping a real lead
      // silently is worse than letting a bot through, so the floor stays low.
      send.mockResolvedValue(ok)
      await call({ ...VALID, elapsedMs: 1999 })
      expect(send).not.toHaveBeenCalled()
      await call({ ...VALID, elapsedMs: 2000 })
      expect(send).toHaveBeenCalled()
    })

    it('screens before validation, so a bot learns nothing from error messages', async () => {
      const res = await call({ website: 'x' })
      expect(res.statusCode).toBe(200)
      expect(send).not.toHaveBeenCalled()
    })

    it('delivers a request without elapsedMs but sends it no confirmation', async () => {
      // A page cached from before the field existed must not lose its lead,
      // but a direct POST must not make this domain mail arbitrary addresses.
      send.mockResolvedValue(ok)
      const { elapsedMs: _omit, ...legacy } = VALID
      void _omit
      const res = await call(legacy)
      expect(res.body).toEqual({ ok: true, confirmationSent: false })
      expect(send).toHaveBeenCalledTimes(1)
      expect(send.mock.calls[0][0].to).toBe('hello@anappidea.llc')
    })
  })
})

describe('POST /api/contact: services and the guided flag', () => {
  beforeEach(() => {
    send.mockReset()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  const NO_IDEA = { name: 'Sam', email: 'sam@example.com', elapsedMs: 60_000 }

  it('lists the ticked services by title in the inquiry email', async () => {
    send.mockResolvedValue(ok)
    await call({ ...VALID, services: ['site-fixes', 'own-it'] })
    const html = send.mock.calls[0][0].html
    expect(html).toContain('Services')
    expect(html).toContain('Fix My Existing Site, Own It: Learn to Run Your Site')
  })

  it('escapes service titles that contain markup characters', async () => {
    send.mockResolvedValue(ok)
    await call({ ...VALID, services: ['custom-builds'] })
    expect(send.mock.calls[0][0].html).toContain('Apps &amp; Custom Software')
  })

  it('accepts services alone as the idea, and says there was no message', async () => {
    send.mockResolvedValue(ok)
    const res = await call({ ...NO_IDEA, services: ['business-websites'] })
    expect(res.statusCode).toBe(200)
    const html = send.mock.calls[0][0].html
    expect(html).toContain('A Website for Your Business')
    expect(html).toContain('They did not write a message')
    expect(html).not.toContain('Their idea')
  })

  it('does not claim "no message" when a voice note stands in for one', async () => {
    send.mockResolvedValue(ok)
    await call({ ...NO_IDEA, audio: { base64: 'AAAA', mimeType: 'audio/webm', durationSec: 3 } })
    expect(send.mock.calls[0][0].html).not.toContain('They did not write a message')
  })

  it('rejects a request whose services are all unknown, with the new copy', async () => {
    const res = await call({ ...NO_IDEA, services: ['not-a-service', '<script>'] })
    expect(res.statusCode).toBe(400)
    expect(res.body).toEqual({
      error: 'Pick a service, add a sentence about what you need, or leave a quick voice note, so I know where to start.',
    })
    expect(send).not.toHaveBeenCalled()
  })

  it('drops unknown ids and repeats, never putting visitor text in the email', async () => {
    send.mockResolvedValue(ok)
    await call({ ...VALID, services: ['own-it', 'own-it', 'evil <b>x</b>'] })
    const html = send.mock.calls[0][0].html
    expect(html).toContain('Own It: Learn to Run Your Site')
    expect(html).not.toContain('evil')
    expect(html.match(/Own It: Learn to Run Your Site/g)).toHaveLength(1)
  })

  it('ignores non-string elements in services and platforms instead of throwing', async () => {
    // A non-string used to throw inside escHtml, outside the try block.
    send.mockResolvedValue(ok)
    const res = await call({
      ...VALID,
      services: [42, null, { a: 1 }, 'site-fixes'],
      platforms: [1, 'ios', null],
    })
    expect(res.statusCode).toBe(200)
    const html = send.mock.calls[0][0].html
    expect(html).toContain('Fix My Existing Site')
    expect(html).toContain('iOS App Store')
  })

  it('ignores services that are not an array', async () => {
    send.mockResolvedValue(ok)
    const res = await call({ ...VALID, services: 'site-fixes' })
    expect(res.statusCode).toBe(200)
    expect(send.mock.calls[0][0].html).not.toContain('Fix My Existing Site')
  })

  it('adds a guided-questions row only when usedGuide is exactly true', async () => {
    send.mockResolvedValue(ok)
    await call({ ...VALID, usedGuide: true })
    expect(send.mock.calls[0][0].html).toContain('Used the guided questions')

    send.mockClear()
    await call({ ...VALID, usedGuide: 'true' })
    await call({ ...VALID })
    for (const [msg] of send.mock.calls) {
      if (msg.to === 'hello@anappidea.llc') expect(msg.html).not.toContain('Used the guided questions')
    }
  })

  it('keeps the API label map in step with src/data/services.ts', () => {
    // The function cannot import from src/ (see BOOKING_URL in api/contact.ts),
    // so it carries its own copy. This is what stops the two drifting apart.
    const source = fs.readFileSync(path.resolve(__dirname, '../../api/contact.ts'), 'utf8')
    for (const s of services) {
      const entry = `'${s.id}': '${s.title.replace(/'/g, "\\'")}'`
      expect(source, `SERVICE_LABELS is missing or stale for "${s.id}"`).toContain(entry)
    }
  })
})
