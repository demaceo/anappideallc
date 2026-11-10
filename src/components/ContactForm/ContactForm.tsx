import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { useLocation } from 'react-router'
import { SITE } from '../../data/site'
import { services as SERVICES } from '../../data/services'
import {
  buildDraftMessage,
  mergeDraft,
  servicesForProjectType,
  type GuidedAnswers,
} from '../../lib/contact-draft'
import type { ServiceOption } from '../ServicePicker/ServicePicker'
import type { VoiceNoteData } from '../VoiceNote/VoiceNote'
import { GuidedSteps } from './GuidedSteps'
import { QuickFields } from './QuickFields'
import {
  FIELD,
  INITIAL,
  type DraftNote,
  type FormData,
  type Mode,
  type Platform,
  type SetField,
  type Status,
  type StepKey,
} from './types'

// The studio's services, as checklist options. `services` in src/data is the
// single source: a service added or renamed there shows up here by itself.
const SERVICE_OPTIONS: ServiceOption[] = SERVICES.map((s) => ({
  id: s.id,
  title: s.title,
  hint: s.tagline ?? s.price?.label,
}))
const SERVICE_IDS = SERVICE_OPTIONS.map((o) => o.id)

/** The known ids among `ids`, once each, in the studio's order. */
const inServiceOrder = (ids: Iterable<string>) => {
  const wanted = new Set(ids)
  return SERVICE_IDS.filter((id) => wanted.has(id))
}

const noopSubscribe = () => () => {}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // strip the "data:...;base64," prefix
      resolve(result.slice(result.indexOf(',') + 1))
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

const reducedMotion = () =>
  typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Where focus goes after the form changes mode (set by the handler that
// changes it, read by the effect that runs once the new view is on screen).
type FocusTarget = 'stage' | 'message' | 'guide' | null

// The contact form: a quick message first, and the guided questions as an
// alternative for visitors who do not know what to write. One state, one send
// path. The guided route ends by drafting the message, then hands back to the
// quick form, so everyone sends from the same place.
export function ContactForm() {
  const [data, setData] = useState<FormData>(INITIAL)
  const [voice, setVoice] = useState<VoiceNoteData | null>(null)
  const [mode, setMode] = useState<Mode>('quick')
  const [stepIdx, setStepIdx] = useState(0)
  const [status, setStatus] = useState<Status>('idle')
  // Whether the API managed to email the visitor a confirmation. The success
  // view only promises one when it actually went out.
  const [confirmationSent, setConfirmationSent] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  // The id of the field a validation message belongs to. A message with a field
  // shows beside that field and moves focus there; without one (a failed send)
  // it shows by the Send button.
  const [errorField, setErrorField] = useState<string | null>(null)
  const [draftNote, setDraftNote] = useState<DraftNote>(null)
  // True once the message box was filled from the guided answers.
  const [usedGuide, setUsedGuide] = useState(false)

  // Ticked services. null until the visitor touches the checklist, so that a
  // `?service=` link (from the Services page) can pre-tick one without any
  // effect or state fight: the ticks are `userServices ?? preselected`.
  const [userServices, setUserServices] = useState<string[] | null>(null)
  const { search } = useLocation()
  // The server (prerender) knows no query string, so the first client render
  // must not either: reading `search` directly would tick a service on the
  // client that the HTML never had, and React would warn about the mismatch.
  // useSyncExternalStore uses the server snapshot while hydrating and the real
  // value right after.
  const clientSearch = useSyncExternalStore(noopSubscribe, () => search, () => '')
  const preselected = useMemo(
    () => inServiceOrder(new URLSearchParams(clientSearch).getAll('service')),
    [clientSearch],
  )
  const services = userServices ?? preselected

  // Bot screening (see api/contact.ts): when the form opened, and a honeypot
  // field real visitors never see. Both are read only at submit.
  const openedAt = useRef(0)
  useEffect(() => {
    openedAt.current = Date.now()
  }, [])
  const trapRef = useRef<HTMLInputElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  // A second submit while one is in flight (a double click, Enter twice) would
  // email the same message twice; `status` lags a render behind, a ref does not.
  const sendingRef = useRef(false)
  // The last draft written into the message box, so regenerating replaces it
  // instead of stacking a second one.
  const lastDraft = useRef<string | null>(null)
  const pendingFocus = useRef<FocusTarget>(null)

  // The platforms step only applies when there is an app in the mix, and the
  // search-visibility step only when there is a website in it (or the visitor
  // has not said): ranking on Google is a website question.
  const steps = useMemo<StepKey[]>(() => {
    const base: StepKey[] = ['type', 'platforms', 'reach', 'category', 'audience', 'budget']
    const hasApp = data.projectType === 'app' || data.projectType === 'both'
    const hasWeb = data.projectType !== 'app'
    return base.filter((s) => {
      if (s === 'platforms') return hasApp
      if (s === 'reach') return hasWeb
      return true
    })
  }, [data.projectType])
  const isLastStep = stepIdx >= steps.length - 1
  const guided = mode === 'guided'

  // Move focus when the view actually changes: to the new step while guided,
  // and back to the message (or the link that opened the guide) on leaving it.
  // Comparing with the previous view means focus is never stolen on first load.
  const prevView = useRef({ mode, stepIdx })
  useEffect(() => {
    const moved = prevView.current.mode !== mode || prevView.current.stepIdx !== stepIdx
    prevView.current = { mode, stepIdx }
    if (!moved) return

    if (mode === 'guided') {
      const stage = stageRef.current
      if (!stage) return
      // scrollIntoView honours `scroll-padding-top` (set to the sticky site
      // bar's clearance on <html>), so no manual offset maths is needed.
      stage.scrollIntoView?.({ block: 'start', behavior: reducedMotion() ? 'auto' : 'smooth' })
      stage.focus({ preventScroll: true })
      return
    }

    const target = pendingFocus.current
    pendingFocus.current = null
    if (target === 'guide') {
      document.getElementById('cf-guide-link')?.focus()
    } else if (target === 'message') {
      const box = document.getElementById(FIELD.message) as HTMLTextAreaElement | null
      if (box) {
        box.focus()
        // Caret at the end, so typing continues the draft rather than replacing it.
        box.setSelectionRange(box.value.length, box.value.length)
      }
    }
  }, [mode, stepIdx])

  // Take the visitor to the field that needs attention.
  useEffect(() => {
    if (errorField) document.getElementById(errorField)?.focus()
  }, [errorField])

  function clearErrors() {
    setErrorMsg(null)
    setErrorField(null)
  }

  function fail(message: string, field: string) {
    setErrorMsg(message)
    setErrorField(field)
  }

  // Typing is the visitor fixing the problem, so the message can go.
  const set: SetField = (key, value) => {
    clearErrors()
    setData((prev) => ({ ...prev, [key]: value }))
  }

  function changeMessage(value: string) {
    set('description', value)
    // Their own edit: it is no longer "a first draft from your answers".
    setDraftNote(null)
  }

  function changeServices(ids: string[]) {
    clearErrors()
    setUserServices(ids)
  }

  function changeVoice(next: VoiceNoteData | null) {
    clearErrors()
    setVoice(next)
  }

  function togglePlatform(p: Platform) {
    setData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(p) ? prev.platforms.filter((x) => x !== p) : [...prev.platforms, p],
    }))
  }

  function toggleCategory(c: string) {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.includes(c) ? prev.categories.filter((x) => x !== c) : [...prev.categories, c],
    }))
  }

  function enterGuided() {
    clearErrors()
    pendingFocus.current = 'stage'
    setStepIdx(0)
    setMode('guided')
  }

  function exitGuided() {
    clearErrors()
    pendingFocus.current = 'guide'
    setMode('quick')
  }

  // Turn the answers into a draft in the message box, tick the services they
  // imply, and hand back to the quick form to edit, add contact details, send.
  function finishGuided() {
    const answers: GuidedAnswers = {
      projectType: data.projectType,
      platforms: data.platforms,
      categories: data.categories,
      categoryOther: data.categoryOther,
      seo: data.seo,
      geo: data.geo,
      audience: data.audience,
      budget: data.budget,
    }
    const draft = buildDraftMessage(answers)
    if (draft) {
      const merged = mergeDraft(data.description, lastDraft.current, draft)
      lastDraft.current = draft
      setData((prev) => ({ ...prev, description: merged.text }))
      setDraftNote(merged.appended ? 'appended' : 'new')
      setUsedGuide(true)
      // Only ever adds to what they ticked; they can untick.
      setUserServices(inServiceOrder([...services, ...servicesForProjectType(data.projectType)]))
    }
    clearErrors()
    pendingFocus.current = 'message'
    // Re-entering starts from the first question, so they can tweak and redraft.
    setStepIdx(0)
    setMode('quick')
  }

  function guidedSubmit() {
    if (isLastStep) {
      finishGuided()
      return
    }
    clearErrors()
    setStepIdx((i) => i + 1)
  }

  function guidedBack() {
    clearErrors()
    setStepIdx((i) => Math.max(0, i - 1))
  }

  const emailEntered = data.email.trim() !== ''
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
  const phoneEntered = data.phone.trim() !== ''
  // Something to go on: a message, a voice note, or at least one service.
  const hasIdea = data.description.trim() !== '' || voice !== null || services.length > 0

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    if (sendingRef.current) return

    // Validate in the order the fields appear, and point the visitor at
    // whatever is missing with a specific reason: never a silent disabled
    // button or a generic error. Email or phone is enough.
    if (!hasIdea) {
      fail('Pick a service, add a sentence about what you need, or leave a quick voice note, so I know where to start.', FIELD.message)
      return
    }
    if (!data.name.trim()) {
      fail('Please add your name so I know who I’m talking to.', FIELD.name)
      return
    }
    if (emailEntered && !emailValid) {
      fail('That email looks off. Mind checking it?', FIELD.email)
      return
    }
    if (!emailEntered && !phoneEntered) {
      fail('Leave an email or a phone number so I have a way to reach you.', FIELD.email)
      return
    }

    clearErrors()
    sendingRef.current = true
    setStatus('sending')
    try {
      const audio = voice
        ? {
            base64: await blobToBase64(voice.blob),
            mimeType: voice.mimeType,
            durationSec: Math.round(voice.durationSec),
          }
        : null

      // Answers that no longer apply are not sent: a visitor can answer the
      // search questions, then go back and change to "an app".
      const hasApp = data.projectType === 'app' || data.projectType === 'both'
      const hasWeb = data.projectType !== 'app'

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          otherContact: data.otherContact,
          preferredContact: data.preferredContact,
          services,
          usedGuide,
          projectType: data.projectType,
          platforms: hasApp ? data.platforms : [],
          category: data.categories
            .map((c) => (c === 'Something else' ? data.categoryOther : c))
            .filter(Boolean)
            .join(', '),
          seoImportance: hasWeb ? data.seo : '',
          geoImportance: hasWeb ? data.geo : '',
          audience: data.audience,
          description: data.description.trim(),
          budget: data.budget,
          audio,
          website: trapRef.current?.value ?? '',
          elapsedMs: Date.now() - openedAt.current,
        }),
      })
      if (res.ok) {
        const body = (await res.json().catch(() => null)) as { confirmationSent?: boolean } | null
        setConfirmationSent(body?.confirmationSent === true)
        setStatus('sent')
      } else if (res.status === 429) {
        // The Vercel Firewall rate-limit rule answers before the function
        // runs, so there is no JSON body to read: say what happened instead of
        // blaming the server.
        setErrorMsg('That’s a few messages in a short time. Give it a minute and try again.')
        setStatus('error')
      } else {
        const body = (await res.json().catch(() => null)) as { error?: string } | null
        setErrorMsg(body?.error ?? 'Something broke on my end, not yours. Try again in a moment.')
        setStatus('error')
      }
    } catch {
      setErrorMsg('Couldn’t send. Check your connection and try again.')
      setStatus('error')
    } finally {
      sendingRef.current = false
    }
  }

  return (
    <section className="contact-stage" aria-label="Send me a message">
      {status !== 'sent' && (
        <header className="contact-stage-head">
          <h2 className="contact-stage-title">Send me a message</h2>
          <p className="contact-stage-sub">
            Say what you need in a few words, or let me ask the questions. I
            reply within 1–2 business days.
          </p>
        </header>
      )}

      {status === 'sent' ? (
        // A visitor who just sent their idea is at their most committed, and
        // this used to be a dead end: a thank-you line and nothing to do.
        // Now it says what happens next and offers the call straight away.
        <div className="contact-form" role="status">
          <span className="contact-form-eyebrow">Message received</span>
          <p className="contact-form-title">Thanks. I'll be in touch.</p>
          <ol className="contact-next-steps">
            <li>
              I read every message myself and reply within 1–2 business days
              {voice ? ', voice note and all' : ''}.
            </li>
            <li>Next, we set up a free 30-minute call to talk it through.</li>
            <li>
              You leave that call with a clear next step, whether or not it's
              with me.
            </li>
          </ol>
          {confirmationSent && (
            <p className="contact-form-sub">A confirmation is on its way to {data.email}.</p>
          )}
          <p className="contact-form-sub">
            Don't want to wait?{' '}
            <a
              href={SITE.booking.consultationUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-analytics="book-consultation-after-form"
            >
              Book your free call now →
            </a>
          </p>
        </div>
      ) : (
        <div className="contact-form wizard">
          <div className="wizard-progress">
            <span className="contact-card-label">Start your message</span>
            {guided && (
              <div className="wizard-progress-meta">
                <span className="wizard-step-count">
                  Step {String(stepIdx + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
                </span>
                <div className="wizard-ticks" aria-hidden="true">
                  {steps.map((s, i) => (
                    <span
                      key={s}
                      className={`wizard-tick${i === stepIdx ? ' current' : ''}${i < stepIdx ? ' done' : ''}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* The quick form stays mounted (just hidden) while the guided
              questions run. Unmounting it would drop an in-progress voice
              recording and the visitor's typed text, ticks and details; hidden
              keeps all of it, and the voice note keeps recording. */}
          <form className="contact-quick" hidden={guided} onSubmit={handleSubmit} noValidate>
            {/* Honeypot. Off-screen rather than display:none (some bots skip
                hidden inputs), out of the tab order, and hidden from assistive
                tech so no real visitor ever reaches it. The password-manager
                attributes keep their autofill out of it. */}
            <div className="form-trap" aria-hidden="true">
              <label htmlFor="cf-website">Leave this field empty</label>
              <input
                id="cf-website"
                ref={trapRef}
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                data-1p-ignore
                data-lpignore="true"
                defaultValue=""
              />
            </div>
            <QuickFields
              data={data}
              set={set}
              onMessageChange={changeMessage}
              serviceOptions={SERVICE_OPTIONS}
              services={services}
              onServicesChange={changeServices}
              voice={voice}
              onVoiceChange={changeVoice}
              draftNote={draftNote}
              onGuide={enterGuided}
              status={status}
              errorMsg={errorMsg}
              errorField={errorField}
            />
          </form>

          {guided && (
            <GuidedSteps
              data={data}
              set={set}
              togglePlatform={togglePlatform}
              toggleCategory={toggleCategory}
              steps={steps}
              stepIdx={stepIdx}
              stageRef={stageRef}
              onSubmit={guidedSubmit}
              onBack={guidedBack}
              onExit={exitGuided}
            />
          )}
        </div>
      )}
    </section>
  )
}
