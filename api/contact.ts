/// <reference types="node" />
import { Resend } from 'resend'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const resend = new Resend(process.env.RESEND_API_KEY)

const TO_EMAIL = process.env.TO_EMAIL ?? 'hello@anappidea.llc'
const FROM_EMAIL = process.env.FROM_EMAIL ?? 'hello@anappidea.llc'

// Reject voice notes larger than this once base64-decoded (~6 MB) so a single
// request can't blow past the platform body limit or the email size cap.
const MAX_AUDIO_BYTES = 6 * 1024 * 1024

interface AudioPayload {
  base64?: string
  mimeType?: string
  durationSec?: number
}

const PROJECT_TYPE_LABELS: Record<string, string> = {
  website: 'A website',
  app: 'A mobile app',
  both: 'Both an app and a website',
  unsure: 'Not sure yet',
}

const PLATFORM_LABELS: Record<string, string> = {
  ios: 'iOS App Store',
  android: 'Google Play',
  web: 'Web version',
}

const IMPORTANCE_LABELS: Record<string, string> = {
  unsure: 'Not sure',
  nice: 'Nice to have',
  important: 'Important',
  critical: 'Must-have',
}

const PREFERRED_LABELS: Record<string, string> = {
  email: 'Email',
  phone: 'Phone call',
  text: 'Text',
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const body = (req.body ?? {}) as Record<string, unknown>
  const name = typeof body.name === 'string' ? body.name : ''
  const email = typeof body.email === 'string' ? body.email : ''
  const phone = typeof body.phone === 'string' ? body.phone : ''
  const otherContact = typeof body.otherContact === 'string' ? body.otherContact : ''
  const preferredContact = typeof body.preferredContact === 'string' ? body.preferredContact : ''

  // The "message" of intent can arrive as `description` (wizard) or the legacy
  // `message` field. Either is fine; the voice note can stand in for both.
  const description =
    (typeof body.description === 'string' && body.description) ||
    (typeof body.message === 'string' && body.message) ||
    ''

  const projectType = typeof body.projectType === 'string' ? body.projectType : ''
  const platforms = Array.isArray(body.platforms) ? (body.platforms as string[]) : []
  const category = typeof body.category === 'string' ? body.category : ''
  const seoImportance = typeof body.seoImportance === 'string' ? body.seoImportance : ''
  const geoImportance = typeof body.geoImportance === 'string' ? body.geoImportance : ''
  const audience = typeof body.audience === 'string' ? body.audience : ''
  const audio = (body.audio ?? null) as AudioPayload | null

  if (!name.trim()) {
    return res.status(400).json({ error: 'Name is required' })
  }

  // Email or phone is enough — a visitor can reach out by whichever they prefer.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const hasEmail = email.trim() !== ''
  const hasPhone = phone.trim() !== ''
  if (hasEmail && !emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' })
  }
  if (!hasEmail && !hasPhone) {
    return res.status(400).json({ error: 'An email or phone number is required' })
  }

  const hasAudio = !!audio?.base64
  if (!description.trim() && !hasAudio) {
    return res.status(400).json({ error: 'Tell me a little about your idea, or leave a voice note' })
  }

  // Build the summary rows from whatever the visitor chose to share.
  const rows: Array<[string, string]> = []
  if (projectType) rows.push(['Project type', PROJECT_TYPE_LABELS[projectType] ?? projectType])
  if (platforms.length) {
    rows.push(['Platforms', platforms.map((p) => PLATFORM_LABELS[p] ?? p).join(', ')])
  }
  if (category) rows.push(['Category', category])
  if (seoImportance) rows.push(['SEO importance', IMPORTANCE_LABELS[seoImportance] ?? seoImportance])
  if (geoImportance) rows.push(['GEO importance', IMPORTANCE_LABELS[geoImportance] ?? geoImportance])
  if (audience) rows.push(['Target audience', audience])

  const summaryHtml = rows.length
    ? `<table style="border-collapse:collapse;margin:0 0 18px">${rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:4px 16px 4px 0;color:#6b6355;font-size:13px;vertical-align:top;white-space:nowrap"><strong>${escHtml(k)}</strong></td><td style="padding:4px 0;font-size:14px">${escHtml(v)}</td></tr>`,
      )
      .join('')}</table>`
    : ''

  // Extra ways the visitor offered to be reached, shown right under "From".
  const contactBits: string[] = []
  if (phone.trim()) contactBits.push(`<strong>Phone:</strong> ${escHtml(phone)}`)
  if (otherContact.trim()) contactBits.push(`<strong>Other:</strong> ${escHtml(otherContact)}`)
  if (preferredContact) {
    contactBits.push(`<strong>Prefers:</strong> ${escHtml(PREFERRED_LABELS[preferredContact] ?? preferredContact)}`)
  }
  const contactHtml = contactBits.length
    ? `<p style="margin:0 0 12px;color:#6b6355;font-size:13px">${contactBits.join(' &nbsp;·&nbsp; ')}</p>`
    : ''

  const descriptionHtml = description.trim()
    ? `<p style="margin:0 0 8px"><strong>Their idea:</strong></p><p style="white-space:pre-wrap;margin:0 0 18px">${escHtml(description)}</p>`
    : ''

  const audioHtml = hasAudio
    ? `<p style="margin:0 0 18px;color:#6b6355;font-size:13px">🎙️ A voice note is attached${audio?.durationSec ? ` (${Math.round(audio.durationSec)}s)` : ''
    }.</p>`
    : ''

  // Decode + size-check the voice note, if present.
  let attachments: Array<{ filename: string; content: Buffer }> | undefined
  if (hasAudio && audio?.base64) {
    const buffer = Buffer.from(audio.base64, 'base64')
    if (buffer.byteLength > MAX_AUDIO_BYTES) {
      return res.status(413).json({ error: 'Voice note is too large' })
    }
    const ext = audio.mimeType?.includes('mp4')
      ? 'm4a'
      : audio.mimeType?.includes('ogg')
        ? 'ogg'
        : 'webm'
    attachments = [{ filename: `voice-note.${ext}`, content: buffer }]
  }

  try {
    await resend.emails.send({
      from: `An App Idea <${FROM_EMAIL}>`,
      to: TO_EMAIL,
      // Only set a reply-to when we actually have an email to reply to.
      ...(hasEmail ? { replyTo: email } : {}),
      subject: `New project inquiry from ${name}`,
      html: `
        <p style="margin:0 0 12px"><strong>From:</strong> ${escHtml(name)}${hasEmail ? ` &lt;${escHtml(email)}&gt;` : ''}</p>
        ${contactHtml}
        ${summaryHtml}
        ${descriptionHtml}
        ${audioHtml}
      `,
      ...(attachments ? { attachments } : {}),
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
