import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { VercelRequest, VercelResponse } from '@vercel/node'

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

    it('drops a submission faster than a person can walk the wizard', async () => {
      const res = await call({ ...VALID, elapsedMs: 800 })
      expect(res.body).toEqual({ ok: true, confirmationSent: false })
      expect(send).not.toHaveBeenCalled()
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
