import { SITE } from '../../data/site'
import { ServicePicker, type ServiceOption } from '../ServicePicker/ServicePicker'
import { VoiceNote, type VoiceNoteData } from '../VoiceNote/VoiceNote'
import { FIELD, type DraftNote, type FormData, type PreferredContact, type SetField, type Status } from './types'

const CONTACT_METHODS = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone call' },
  { value: 'text', label: 'Text' },
] as const

interface QuickFieldsProps {
  data: FormData
  set: SetField
  /** The message box changed: clears the "drafted from your answers" notice too. */
  onMessageChange: (value: string) => void
  serviceOptions: ServiceOption[]
  services: string[]
  onServicesChange: (ids: string[]) => void
  voice: VoiceNoteData | null
  onVoiceChange: (voice: VoiceNoteData | null) => void
  draftNote: DraftNote
  onGuide: () => void
  status: Status
  errorMsg: string | null
  errorField: string | null
}

// The default view of the contact form: say what you need, leave a way to
// reach you, send. Everything is optional except a way to be reached and some
// signal of what you want (a service ticked, a message, or a voice note).
//
// Order is message first and contact details last, so the "guide me" link sits
// near the top of a phone screen for someone who is stuck, and so that after
// the guided draft lands the next thing to do (add your details) is the next
// thing on screen.
export function QuickFields({
  data,
  set,
  onMessageChange,
  serviceOptions,
  services,
  onServicesChange,
  voice,
  onVoiceChange,
  draftNote,
  onGuide,
  status,
  errorMsg,
  errorField,
}: QuickFieldsProps) {
  // Ties an input to its message for assistive tech, only while it has one.
  const fieldA11y = (id: string) =>
    errorField === id
      ? { 'aria-invalid': true as const, 'aria-describedby': `${id}-error` }
      : {}
  // The message itself, right under the field it is about, so it is on screen
  // when focus lands there. A render function rather than a nested component,
  // so the alert is not remounted, and re-announced, on every render.
  const fieldError = (id: string) =>
    errorField === id && errorMsg ? (
      <p id={`${id}-error`} className="form-field-error" role="alert">
        {errorMsg}
      </p>
    ) : null

  // The message box can be described by both the drafted-from-answers notice
  // and a validation message at once.
  const messageDescribedBy =
    [draftNote ? 'cf-draft-note' : null, errorField === FIELD.message ? `${FIELD.message}-error` : null]
      .filter(Boolean)
      .join(' ') || undefined

  return (
    <>
      <ServicePicker
        options={serviceOptions}
        value={services}
        onChange={onServicesChange}
        label="What are you looking for?"
        help="Skip this if you're not sure. We can sort it out on the call."
      />

      <div className="form-group">
        <label className="form-label" htmlFor={FIELD.message}>In your words</label>
        <textarea
          id={FIELD.message}
          className="form-textarea"
          placeholder="e.g. “I want clients to book online instead of texting me.”"
          value={data.description}
          onChange={(e) => onMessageChange(e.target.value)}
          aria-invalid={errorField === FIELD.message ? true : undefined}
          aria-describedby={messageDescribedBy}
        />
        {fieldError(FIELD.message)}
        {draftNote && (
          <p id="cf-draft-note" className="contact-draft-note">
            {draftNote === 'appended'
              ? 'I added a draft below what you wrote. Keep whatever helps.'
              : "Here's a first draft from your answers. Change anything you like."}
          </p>
        )}
        {/* Directly under the message box: for a visitor who would rather
            say it than type it, this is where they are already looking. */}
        <VoiceNote value={voice} onChange={onVoiceChange} />
        <button
          type="button"
          id="cf-guide-link"
          className="contact-guide-link"
          onClick={onGuide}
          data-analytics="contact-guide-me"
        >
          Not sure what to say? Let me guide you
        </button>
      </div>

      <div className="contact-quick-details">
        <span className="contact-form-eyebrow">Where can I reach you?</span>
        <p className="wizard-help">
          Leave an email or a phone number, whichever you'd rather I use. Add
          both, or another handle, if you like.
        </p>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor={FIELD.name}>Name</label>
            <input
              id={FIELD.name}
              className="form-input"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              required
              value={data.name}
              onChange={(e) => set('name', e.target.value)}
              {...fieldA11y(FIELD.name)}
            />
            {fieldError(FIELD.name)}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor={FIELD.email}>Email</label>
            <input
              id={FIELD.email}
              className="form-input"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={data.email}
              onChange={(e) => set('email', e.target.value)}
              {...fieldA11y(FIELD.email)}
            />
            {fieldError(FIELD.email)}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="cf-phone">Phone</label>
            <input
              id="cf-phone"
              className="form-input"
              type="tel"
              autoComplete="tel"
              placeholder="(555) 123-4567"
              value={data.phone}
              onChange={(e) => set('phone', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="cf-other">
              Another way <span className="form-label-opt">optional</span>
            </label>
            <input
              id="cf-other"
              className="form-input"
              type="text"
              placeholder="LinkedIn, WhatsApp, Telegram…"
              value={data.otherContact}
              onChange={(e) => set('otherContact', e.target.value)}
            />
          </div>
        </div>
        <div className="form-group">
          <span className="form-label" id="cf-preferred-label">
            Best way to reach you <span className="form-label-opt">optional</span>
          </span>
          <div className="chip-grid" role="group" aria-labelledby="cf-preferred-label">
            {CONTACT_METHODS.map((m) => {
              const active = data.preferredContact === m.value
              return (
                <button
                  type="button"
                  key={m.value}
                  className={`chip${active ? ' selected' : ''}`}
                  // Tapping the active choice again clears it, keeping the field optional.
                  onClick={() => set('preferredContact', (active ? '' : m.value) as PreferredContact)}
                  aria-pressed={active}
                >
                  {m.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="form-submit-row">
        <button type="submit" className="form-submit-btn" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </button>
      </div>

      <p className="contact-privacy">
        What you type here is emailed to me so I can reply. I don't sell it,
        share it with advertisers, or add you to a mailing list. To have it
        deleted, email <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>

      {errorMsg && !errorField && (
        <p className="form-status error" role="alert">
          {errorMsg}{' '}
          {status === 'error' && (
            <>Or <a href={`mailto:${SITE.email}`}>email me directly</a>.</>
          )}
        </p>
      )}
    </>
  )
}
