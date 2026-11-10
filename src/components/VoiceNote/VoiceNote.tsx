import { useEffect, useMemo, useRef, useState } from 'react'
import { IconMic, IconStop, IconTrash, IconCheck, IconPlay, IconPause } from '../icons'

// Hard cap so the recording stays small enough to ride along in the JSON
// request body (Resend attaches it to the email). At ~32 kbps Opus this is
// roughly 0.5 MB for the full two minutes.
const MAX_SECONDS = 120
const AUDIO_BITRATE = 32_000

export interface VoiceNoteData {
  blob: Blob
  mimeType: string
  durationSec: number
}

interface VoiceNoteProps {
  value: VoiceNoteData | null
  onChange: (data: VoiceNoteData | null) => void
}

type RecState = 'idle' | 'recording' | 'unsupported'

function fmt(s: number) {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

// Pick a MIME type the browser can actually record. Safari only does mp4/aac;
// Chrome/Firefox prefer webm/opus.
function pickMimeType(): string {
  if (typeof MediaRecorder === 'undefined') return ''
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus']
  return candidates.find((t) => MediaRecorder.isTypeSupported(t)) ?? ''
}

function isRecordingSupported(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof MediaRecorder !== 'undefined' &&
    !!pickMimeType()
  )
}

// Mini audio player for a recorded note. Kept as its own component and keyed by
// the recording's object URL, so its playback state resets cleanly whenever the
// recording changes — no reset effect needed.
function RecordedPlayer({ url, fallbackDuration }: { url: string; fallbackDuration: number }) {
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  function togglePlay() {
    const el = audioRef.current
    if (!el) return
    if (playing) {
      el.pause()
      setPlaying(false)
    } else {
      void el.play()
      setPlaying(true)
    }
  }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const el = audioRef.current
    if (!el || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    el.currentTime = ratio * duration
    setCurrentTime(ratio * duration)
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
        onEnded={() => { setPlaying(false); setCurrentTime(0) }}
      />
      <div className="vn-player">
        <button
          type="button"
          className="vn-play"
          onClick={togglePlay}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? <IconPause size={12} /> : <IconPlay size={12} />}
        </button>
        <div
          className="vn-progress"
          onClick={seek}
          role="slider"
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={duration || fallbackDuration}
          aria-valuenow={currentTime}
        >
          <div
            className="vn-progress-fill"
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          />
        </div>
        <span className="vn-time">
          {fmt(currentTime)} / {fmt(duration || fallbackDuration)}
        </span>
      </div>
    </>
  )
}

export function VoiceNote({ value, onChange }: VoiceNoteProps) {
  // Start as 'idle' on both server and client so the prerendered HTML matches
  // hydration; unsupported browsers fall back the moment Record is tapped.
  // The "recorded" UI is derived from `value` (the source of truth) rather than
  // internal state, so a saved note survives this component unmounting and
  // remounting when the visitor navigates between wizard steps.
  const [state, setState] = useState<RecState>('idle')
  const [elapsed, setElapsed] = useState(0)
  const [error, setError] = useState<string | null>(null)
  // What a screen reader is told when the recorder changes state. The visible
  // text changes too, but a change in the page is not announced by itself.
  const [announcement, setAnnouncement] = useState('')

  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startedRef = useRef(0)

  // Object URL for the audio preview, derived from the current value and
  // revoked on cleanup.
  const previewUrl = useMemo(() => (value ? URL.createObjectURL(value.blob) : null), [value])
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  // Tidy up the mic stream and timer if we unmount mid-recording.
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  function stopTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  async function startRecording() {
    setError(null)
    if (!isRecordingSupported()) {
      setState('unsupported')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const mimeType = pickMimeType()
      const recorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: AUDIO_BITRATE,
      })
      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      recorder.onstop = () => {
        stopTimer()
        streamRef.current?.getTracks().forEach((t) => t.stop())
        streamRef.current = null
        const duration = (Date.now() - startedRef.current) / 1000
        const blob = new Blob(chunksRef.current, { type: mimeType })
        if (blob.size > 0) {
          onChange({ blob, mimeType, durationSec: duration })
          // Floored, like the on-screen time, so the two never disagree.
          const secs = Math.max(1, Math.floor(duration))
          setAnnouncement(`Voice note attached, ${secs} ${secs === 1 ? 'second' : 'seconds'}.`)
        }
        setState('idle')
      }

      recorder.start()
      recorderRef.current = recorder
      startedRef.current = Date.now()
      setElapsed(0)
      setState('recording')
      setAnnouncement('Recording started.')
      timerRef.current = setInterval(() => {
        const secs = (Date.now() - startedRef.current) / 1000
        setElapsed(secs)
        if (secs >= MAX_SECONDS) stopRecording()
      }, 200)
    } catch {
      setError('Microphone access was blocked. You can still type your message above.')
      setState('idle')
    }
  }

  function stopRecording() {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop()
    }
  }

  function discard() {
    onChange(null)
    setElapsed(0)
    setState('idle')
    setAnnouncement('Voice note removed.')
  }

  const recording = state === 'recording'
  const unsupported = state === 'unsupported'
  const attached = !recording && !!value

  // ONE button for every state, so it stays the same element: keyboard focus
  // survives record -> stop -> remove -> record again. Separate buttons per
  // state would be unmounted as the state changes and drop focus to the page.
  // Its accessible name says what it will do next.
  const action = recording
    ? { label: 'Stop recording', onClick: stopRecording, Icon: IconStop }
    : attached
      ? { label: 'Remove voice note and record again', onClick: discard, Icon: IconTrash }
      : { label: 'Record a voice note', onClick: startRecording, Icon: IconMic }

  return (
    <div className="voice-note">
      <div className="voice-note-row">
        <div className="voice-note-text">
          {recording ? (
            <span className="voice-note-live">
              <span className="voice-note-pulse" aria-hidden="true" />
              Recording{' '}
              <span className="voice-note-timer" aria-live="off">
                {fmt(elapsed)} <span className="voice-note-max">/ {fmt(MAX_SECONDS)}</span>
              </span>
            </span>
          ) : attached ? (
            <span className="voice-note-saved">
              <IconCheck size={14} /> Voice note attached · {fmt(value.durationSec)}
            </span>
          ) : unsupported ? (
            <span>
              Voice notes aren&apos;t supported in this browser, but no worries: your
              typed message is plenty.
            </span>
          ) : (
            <span>Easier to say it out loud? Tap the mic and record a voice note instead.</span>
          )}
        </div>

        <button
          type="button"
          className={`voice-note-action${recording ? ' recording' : ''}${attached ? ' attached' : ''}${unsupported ? ' unavailable' : ''}`}
          aria-label={action.label}
          title={action.label}
          // Where recording is not supported the button stays (so focus is not
          // dropped) but does nothing, and says so.
          aria-disabled={unsupported || undefined}
          onClick={unsupported ? undefined : action.onClick}
        >
          <action.Icon size={22} />
        </button>
      </div>

      {attached && previewUrl && (
        <RecordedPlayer key={previewUrl} url={previewUrl} fallbackDuration={value.durationSec} />
      )}

      {error && (
        <p className="voice-note-hint error" role="alert">
          {error}
        </p>
      )}

      {/* A live region, but deliberately without role="status": that role is
          also what the "Message received" confirmation uses, and a second one
          that is always on the page makes "the status" ambiguous. */}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
    </div>
  )
}
