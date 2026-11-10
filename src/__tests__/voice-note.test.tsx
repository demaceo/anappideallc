import { useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { VoiceNote, type VoiceNoteData } from '../components/VoiceNote/VoiceNote'

// happy-dom has no MediaRecorder, so these tests install a minimal fake that
// "records" instantly and hands back one chunk when stopped.
class FakeRecorder {
  static isTypeSupported = () => true
  state: 'inactive' | 'recording' = 'inactive'
  ondataavailable: ((e: { data: Blob }) => void) | null = null
  onstop: (() => void) | null = null
  start() {
    this.state = 'recording'
  }
  stop() {
    this.state = 'inactive'
    this.ondataavailable?.({ data: new Blob(['abc'], { type: 'audio/webm' }) })
    this.onstop?.()
  }
}

const track = { stop: vi.fn() }
const getUserMedia = vi.fn()

function installMic() {
  vi.stubGlobal('MediaRecorder', FakeRecorder)
  getUserMedia.mockResolvedValue({ getTracks: () => [track] })
  Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: { getUserMedia } })
}

beforeEach(() => {
  installMic()
  URL.createObjectURL = vi.fn(() => 'blob:fake')
  URL.revokeObjectURL = vi.fn()
})
afterEach(() => {
  vi.unstubAllGlobals()
  getUserMedia.mockReset()
})

function Harness({ onChange }: { onChange?: (v: VoiceNoteData | null) => void }) {
  const [value, setValue] = useState<VoiceNoteData | null>(null)
  return (
    <VoiceNote
      value={value}
      onChange={(v) => {
        setValue(v)
        onChange?.(v)
      }}
    />
  )
}

const button = () => document.querySelector('.voice-note-action') as HTMLButtonElement
const liveRegion = () => document.querySelector('.voice-note [aria-live=polite]')
const status = () => liveRegion()?.textContent

/** Press the button and wait for it to name its next action. */
async function press(next: RegExp) {
  fireEvent.click(button())
  await screen.findByRole('button', { name: next })
}

describe('VoiceNote: the offer', () => {
  it('opens with a short offer on the left and one named button, not a text link', () => {
    render(<Harness />)
    expect(
      screen.getByText('Easier to say it out loud? Tap the mic and record a voice note instead.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Record a voice note' })).toBe(button())
    // The offer comes first in the row, the button last.
    const row = document.querySelector('.voice-note-row') as HTMLElement
    expect(row.firstElementChild).toHaveClass('voice-note-text')
    expect(row.lastElementChild).toBe(button())
  })

  it('gives the icon-only button an accessible name and a hover title', () => {
    render(<Harness />)
    expect(button()).toHaveAccessibleName('Record a voice note')
    expect(button()).toHaveAttribute('title', 'Record a voice note')
    // The icon is decoration: the SVG is hidden from assistive tech.
    expect(button().querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })
})

describe('VoiceNote: record, stop, remove', () => {
  it('records, attaches and removes through one and the same button', async () => {
    const onChange = vi.fn()
    render(<Harness onChange={onChange} />)
    const original = button()

    await press(/stop recording/i)
    expect(button()).toBe(original)
    expect(document.querySelector('.voice-note-text')).toHaveTextContent(/^Recording\s*0:0\d \/ 2:00/)

    await press(/remove voice note and record again/i)
    expect(button()).toBe(original)
    expect(document.querySelector('.voice-note-text')).toHaveTextContent(/voice note attached/i)
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ mimeType: expect.any(String), blob: expect.any(Blob) }),
    )

    await press(/record a voice note/i)
    expect(button()).toBe(original)
    expect(onChange).toHaveBeenLastCalledWith(null)
  })

  it('keeps keyboard focus on the button through every state', async () => {
    // Separate buttons per state would be unmounted as it changes and drop
    // focus to the page, stranding a keyboard user mid-flow.
    render(<Harness />)
    button().focus()
    for (const next of [/stop recording/i, /remove voice note/i, /record a voice note/i]) {
      await press(next)
      expect(document.activeElement).toBe(button())
    }
  })

  it('shows the player only while a note is attached', async () => {
    render(<Harness />)
    expect(document.querySelector('.vn-player')).toBeNull()
    await press(/stop recording/i)
    expect(document.querySelector('.vn-player')).toBeNull()
    await press(/remove voice note/i)
    expect(document.querySelector('.vn-player')).not.toBeNull()
    await press(/record a voice note/i)
    expect(document.querySelector('.vn-player')).toBeNull()
  })

  it('shows the length of a note beside the attached message', async () => {
    render(<Harness />)
    await press(/stop recording/i)
    await press(/remove voice note/i)
    expect(document.querySelector('.voice-note-text')).toHaveTextContent(/voice note attached · 0:0\d/i)
  })

  it('stops the microphone when recording ends, so the browser drops its recording indicator', async () => {
    render(<Harness />)
    await press(/stop recording/i)
    await press(/remove voice note/i)
    expect(track.stop).toHaveBeenCalled()
  })
})

describe('VoiceNote: screen reader announcements', () => {
  it('tells a screen reader about each change, in a polite live region', async () => {
    render(<Harness />)
    const live = liveRegion()
    expect(live).toHaveClass('sr-only')
    // Announces the whole message each time, not just the part that changed.
    expect(live).toHaveAttribute('aria-atomic', 'true')
    // Not role="status": that role belongs to the "Message received" confirmation.
    expect(document.querySelector('.voice-note [role=status]')).toBeNull()

    await press(/stop recording/i)
    expect(status()).toBe('Recording started.')
    await press(/remove voice note/i)
    expect(status()).toMatch(/^Voice note attached, 1 second\.$/)
    await press(/record a voice note/i)
    expect(status()).toBe('Voice note removed.')
  })

  it('does not announce the running timer', async () => {
    render(<Harness />)
    await press(/stop recording/i)
    expect(document.querySelector('.voice-note-timer')).toHaveAttribute('aria-live', 'off')
  })
})

describe('VoiceNote: when it cannot record', () => {
  it('explains a blocked microphone as an alert, and leaves the button ready to try again', async () => {
    getUserMedia.mockRejectedValue(new DOMException('denied', 'NotAllowedError'))
    render(<Harness />)
    fireEvent.click(button())
    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(/microphone access was blocked/i)
    expect(alert).toHaveTextContent(/you can still type your message above/i)
    expect(button()).toHaveAccessibleName('Record a voice note')
  })

  it('says so, and keeps an inert button in place, in a browser without recording', () => {
    vi.stubGlobal('MediaRecorder', undefined)
    render(<Harness />)
    fireEvent.click(button())
    expect(screen.getByText(/voice notes aren.t supported in this browser/i)).toBeInTheDocument()
    // Kept (so focus is not dropped) but marked unavailable, and it does nothing.
    expect(button()).toHaveAttribute('aria-disabled', 'true')
    fireEvent.click(button())
    expect(getUserMedia).not.toHaveBeenCalled()
  })
})
