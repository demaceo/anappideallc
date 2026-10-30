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

const VALID = { name: 'Sam', email: 'sam@example.com', description: 'An app for dog walkers' }
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
    expect(res.body).toEqual({ error: 'Failed to send message' })
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
    const res = await call({ name: 'Sam', phone: '555-0100', description: 'An idea' })
    expect(res.body).toEqual({ ok: true, confirmationSent: false })
    expect(send).toHaveBeenCalledTimes(1)
  })

  it('includes the budget in the inquiry email', async () => {
    send.mockResolvedValue(ok)
    await call({ ...VALID, budget: '$10k–$20k' })
    expect(send.mock.calls[0][0].html).toContain('$10k–$20k')
  })
})
