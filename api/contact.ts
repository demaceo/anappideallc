import { Resend } from 'resend'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const resend = new Resend(process.env.RESEND_API_KEY)

const TO_EMAIL = process.env.TO_EMAIL ?? 'hello@milehighinterface.com'
const FROM_EMAIL = process.env.FROM_EMAIL ?? 'contact@anappidea.llc'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, message } = (req.body ?? {}) as Record<string, string>

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' })
  }

  try {
    await resend.emails.send({
      from: `An App Idea <${FROM_EMAIL}>`,
      to: TO_EMAIL,
      replyTo: email,
      subject: `New message from ${name}`,
      html: `
        <p style="margin:0 0 12px"><strong>From:</strong> ${escHtml(name)} &lt;${escHtml(email)}&gt;</p>
        <p style="margin:0 0 8px"><strong>Message:</strong></p>
        <p style="white-space:pre-wrap;margin:0">${escHtml(message)}</p>
      `,
    })

    return res.json({ ok: true })
  } catch (err) {
    console.error('[contact] send error', err)
    return res.status(500).json({ error: 'Failed to send message' })
  }
}

function escHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
