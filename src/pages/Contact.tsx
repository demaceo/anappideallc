import { useEffect, useMemo, useRef, useState } from 'react'
import { SocialLinks } from '../components/SocialLinks/SocialLinks'
import { SITE } from '../data/site'
import { RouteHead } from '../components/SEO/RouteHead'
import { META } from '../lib/seo'
import {
  IconEdit, IconSearch, IconSend, IconSmartphone, IconMonitor, IconLayers,
  IconHelpCircle, IconUsers, IconTrendingUp, IconCompass, IconArrowLeft,
  IconArrowRight, IconCheck,
} from '../components/icons'
import { PageHeader } from '../components/PageHeader/PageHeader'
import { ConsultCTA } from '../components/ConsultCTA/ConsultCTA'
import { VoiceNote, type VoiceNoteData } from '../components/VoiceNote/VoiceNote'

type Status = 'idle' | 'sending' | 'sent' | 'error'
type ProjectType = 'website' | 'app' | 'both' | 'unsure' | ''
type Platform = 'ios' | 'android' | 'web'
type Importance = '' | 'unsure' | 'nice' | 'important' | 'critical'
type PreferredContact = '' | 'email' | 'phone' | 'text'

interface FormData {
  projectType: ProjectType
  platforms: Platform[]
  categories: string[]
  categoryOther: string
  seo: Importance
  geo: Importance
  audience: string
  description: string
  name: string
  email: string
  phone: string
  otherContact: string
  preferredContact: PreferredContact
}

const INITIAL: FormData = {
  projectType: '',
  platforms: [],
  categories: [],
  categoryOther: '',
  seo: '',
  geo: '',
  audience: '',
  description: '',
  name: '',
  email: '',
  phone: '',
  otherContact: '',
  preferredContact: '',
}

const PROJECT_TYPES = [
  { value: 'website', label: 'A website', desc: 'Marketing site, store, portfolio, or web app', Icon: IconMonitor },
  { value: 'app', label: 'A mobile app', desc: 'iPhone and/or Android', Icon: IconSmartphone },
  { value: 'both', label: 'Both', desc: 'An app with a companion website', Icon: IconLayers },
  { value: 'unsure', label: "I'm not sure yet", desc: "That's completely fine. We'll figure it out together.", Icon: IconHelpCircle },
] as const

const PLATFORMS = [
  { value: 'ios', label: 'iOS App Store', desc: 'iPhone & iPad' },
  { value: 'android', label: 'Google Play', desc: 'Android phones & tablets' },
  { value: 'web', label: 'Web version too', desc: 'Runs in the browser' },
] as const

const CATEGORIES = [
  'E-commerce / retail', 'Marketplace', 'Social / community', 'Productivity / SaaS',
  'Health & fitness', 'Education', 'Finance / fintech', 'Food & restaurant',
  'Travel & local', 'Media / content', 'Booking / services', 'Something else',
]

const IMPORTANCE_OPTS = [
  { value: 'unsure', label: 'Not sure' },
  { value: 'nice', label: 'Nice to have' },
  { value: 'important', label: 'Important' },
  { value: 'critical', label: 'Must-have' },
] as const

const CONTACT_METHODS = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone call' },
  { value: 'text', label: 'Text' },
] as const

// The three prompts shown below the form — kept from the original page so the
// "what to include" guidance still lives here for people who'd rather just email.
const PROMPTS = [
  {
    icon: IconEdit,
    iconClass: 'icon-gold',
    eyebrow: 'The idea',
    title: 'What it does and who it\'s for',
    body: 'One to three sentences. What problem does it solve? Who\'s the primary user? What\'s the one thing it needs to do well?',
  },
  {
    icon: IconSearch,
    iconClass: 'icon-blue',
    eyebrow: 'Where you are',
    title: 'Stage, timeline, and any existing work',
    body: 'Sketches, wireframes, specs, or existing code: include whatever you have. A rough target date helps too, even if it\'s loose. None of it is required.',
  },
  {
    icon: IconSend,
    iconClass: 'icon-green',
    eyebrow: 'The fit',
    title: 'Budget ballpark, if you have one',
    body: 'A rough range helps scope the engagement. If you don\'t have a number yet, that\'s a normal place to start; just say so and we\'ll figure it out together.',
  },
] as const

type StepKey = 'type' | 'platforms' | 'reach' | 'category' | 'audience' | 'description' | 'details'

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

export default function Contact() {
  const [data, setData] = useState<FormData>(INITIAL)
  const [voice, setVoice] = useState<VoiceNoteData | null>(null)
  const [stepIdx, setStepIdx] = useState(0)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // The platforms step only applies when there's an app in the mix.
  const steps = useMemo<StepKey[]>(() => {
    const base: StepKey[] = ['type', 'platforms', 'reach', 'category', 'audience', 'description', 'details']
    const showPlatforms = data.projectType === 'app' || data.projectType === 'both'
    return base.filter((s) => (s === 'platforms' ? showPlatforms : true))
  }, [data.projectType])

  const step = steps[Math.min(stepIdx, steps.length - 1)]
  const isLast = stepIdx >= steps.length - 1

  // Move focus to the active step when the step actually changes, so keyboard
  // and screen-reader users land on the new question (and aren't stranded on a
  // button that just changed). Comparing the previous index means we never
  // steal focus on the initial render / page load.
  const stageRef = useRef<HTMLDivElement>(null)
  const prevStep = useRef(stepIdx)
  useEffect(() => {
    if (prevStep.current !== stepIdx) {
      stageRef.current?.focus({ preventScroll: true })
    }
    prevStep.current = stepIdx
  }, [stepIdx])

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }))
  }

  function togglePlatform(p: Platform) {
    setData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(p)
        ? prev.platforms.filter((x) => x !== p)
        : [...prev.platforms, p],
    }))
  }

  function toggleCategory(c: string) {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.includes(c)
        ? prev.categories.filter((x) => x !== c)
        : [...prev.categories, c],
    }))
  }

  function next() {
    setErrorMsg(null)
    if (!isLast) setStepIdx((i) => i + 1)
  }
  function back() {
    setErrorMsg(null)
    if (stepIdx > 0) setStepIdx((i) => i - 1)
  }

  const emailEntered = data.email.trim() !== ''
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
  const phoneEntered = data.phone.trim() !== ''
  const hasIdea = data.description.trim() !== '' || voice !== null

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!isLast) {
      next()
      return
    }

    // Validate at the end and point the visitor back to whatever's missing,
    // with a specific reason — never a silent disabled button or a generic error.
    // Email or phone is enough — whichever the visitor prefers.
    if (!data.name.trim()) {
      setErrorMsg('Please add your name so I know who I’m talking to.')
      return
    }
    if (emailEntered && !emailValid) {
      setErrorMsg('That email doesn’t look quite right — mind double-checking?')
      return
    }
    if (!emailEntered && !phoneEntered) {
      setErrorMsg('Leave an email or a phone number so I have a way to reach you.')
      return
    }
    if (!hasIdea) {
      setErrorMsg('Add a sentence about your idea (or a quick voice note) so I know what we’re talking about.')
      setStepIdx(steps.indexOf('description'))
      return
    }

    setErrorMsg(null)
    setStatus('sending')
    try {
      const audio = voice
        ? {
            base64: await blobToBase64(voice.blob),
            mimeType: voice.mimeType,
            durationSec: Math.round(voice.durationSec),
          }
        : null

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          otherContact: data.otherContact,
          preferredContact: data.preferredContact,
          projectType: data.projectType,
          platforms: data.platforms,
          category: data.categories
            .map((c) => (c === 'Something else' ? data.categoryOther : c))
            .filter(Boolean)
            .join(', '),
          seoImportance: data.seo,
          geoImportance: data.geo,
          audience: data.audience,
          description: data.description,
          audio,
        }),
      })
      if (res.ok) {
        setStatus('sent')
      } else {
        const body = (await res.json().catch(() => null)) as { error?: string } | null
        setErrorMsg(body?.error ?? 'Something broke on our end, not yours. Give it another try in a moment.')
        setStatus('error')
      }
    } catch {
      setErrorMsg('Couldn’t reach the server. Check your connection and try again.')
      setStatus('error')
    }
  }

  return (
    <>
      <RouteHead {...META['/contact']} />

      <PageHeader>
        <header className="masthead">
          <p className="overline">An App Idea LLC · Denver, Colorado</p>
          <h1>Let's <em>talk.</em></h1>
          <p className="subtitle">
            Got an app or website idea? Walk through a few quick questions,
            or just book a free call. I respond within 1–2 business days.
          </p>
          <p className="date-line">{SITE.email}</p>
        </header>
      </PageHeader>

      <main className="container">
        <div className="intro-block">
          <p>
            Early-stage conversations are welcome. The goal of the first
            exchange is to figure out whether we're a good fit. No deck
            or finished spec required.
          </p>
        </div>

        <ConsultCTA
          eyebrow="Prefer to talk?"
          title={SITE.booking.label}
          blurb="Skip the form and grab a free 30-minute call. Bring as much or as little as you've got."
        />

        {status === 'sent' ? (
          <div className="contact-form">
            <span className="contact-form-eyebrow">Message received</span>
            <p className="contact-form-title">Thanks. I'll be in touch.</p>
            <p className="contact-form-sub">
              Expect a reply within 1–2 business days{voice ? ', voice note and all' : ''}.
            </p>
          </div>
        ) : (
          <form className="contact-form wizard" onSubmit={handleSubmit} noValidate>
            <div className="wizard-progress">
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

            <div
              className="wizard-stage"
              ref={stageRef}
              tabIndex={-1}
              role="group"
              aria-label={`Step ${stepIdx + 1} of ${steps.length}`}
            >

            {step === 'type' && (
              <div className="wizard-step">
                <span className="contact-form-eyebrow">Tell me about your idea</span>
                <p className="wizard-question">What are you looking to build?</p>
                <p className="wizard-help">Every question here is optional, and "not sure" is always a fine answer.</p>
                <div className="choice-grid">
                  {PROJECT_TYPES.map(({ value, label, desc, Icon }) => (
                    <button
                      type="button"
                      key={value}
                      className={`choice-card${data.projectType === value ? ' selected' : ''}`}
                      onClick={() => set('projectType', value as ProjectType)}
                      aria-pressed={data.projectType === value}
                    >
                      <span className="choice-card-icon"><Icon size={20} /></span>
                      <span className="choice-card-label">{label}</span>
                      <span className="choice-card-desc">{desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 'platforms' && (
              <div className="wizard-step">
                <span className="contact-form-eyebrow">Where it should live</span>
                <p className="wizard-question">Which app stores are you aiming for?</p>
                <p className="wizard-help">Pick any that apply. Not sure? Leave it blank; I'll advise on what makes sense.</p>
                <div className="choice-grid two">
                  {PLATFORMS.map(({ value, label, desc }) => (
                    <button
                      type="button"
                      key={value}
                      className={`choice-card${data.platforms.includes(value as Platform) ? ' selected' : ''}`}
                      onClick={() => togglePlatform(value as Platform)}
                      aria-pressed={data.platforms.includes(value as Platform)}
                    >
                      <span className="choice-check">{data.platforms.includes(value as Platform) && <IconCheck size={14} />}</span>
                      <span className="choice-card-label">{label}</span>
                      <span className="choice-card-desc">{desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 'category' && (
              <div className="wizard-step">
                <span className="contact-form-eyebrow">The space it's in</span>
                <p className="wizard-question">What category does it fall into?</p>
                <p className="wizard-help">Pick as many as fit, a rough match is plenty.</p>
                <div className="chip-grid">
                  {CATEGORIES.map((c) => (
                    <button
                      type="button"
                      key={c}
                      className={`chip${data.categories.includes(c) ? ' selected' : ''}`}
                      onClick={() => toggleCategory(c)}
                      aria-pressed={data.categories.includes(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                {data.categories.includes('Something else') && (
                  <input
                    className="form-input wizard-inline-input"
                    type="text"
                    placeholder="What kind of project is it?"
                    value={data.categoryOther}
                    onChange={(e) => set('categoryOther', e.target.value)}
                  />
                )}
              </div>
            )}

            {step === 'reach' && (
              <div className="wizard-step">
                <span className="contact-form-eyebrow">Getting found</span>
                <p className="wizard-question">How much do these matter to you?</p>
                <p className="wizard-help">Most people aren't sure yet; these are things you might not have thought about, so here's the short version.</p>

                <div className="rating-row">
                  <div className="rating-label">
                    <span className="rating-label-icon"><IconTrendingUp size={16} /></span>
                    <span className="rating-label-title">SEO: Search Engine Optimization</span>
                    <span className="rating-label-desc">Helping people find you on Google when they search for what you offer.</span>
                  </div>
                  <div className="rating-options">
                    {IMPORTANCE_OPTS.map((o) => (
                      <button
                        type="button"
                        key={o.value}
                        className={`rating-opt${data.seo === o.value ? ' selected' : ''}`}
                        onClick={() => set('seo', o.value as Importance)}
                        aria-pressed={data.seo === o.value}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rating-row">
                  <div className="rating-label">
                    <span className="rating-label-icon"><IconCompass size={16} /></span>
                    <span className="rating-label-title">GEO: Generative Engine Optimization</span>
                    <span className="rating-label-desc">Helping AI assistants like ChatGPT, Claude, and Google's AI recommend you when people ask them for suggestions.</span>
                  </div>
                  <div className="rating-options">
                    {IMPORTANCE_OPTS.map((o) => (
                      <button
                        type="button"
                        key={o.value}
                        className={`rating-opt${data.geo === o.value ? ' selected' : ''}`}
                        onClick={() => set('geo', o.value as Importance)}
                        aria-pressed={data.geo === o.value}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 'audience' && (
              <div className="wizard-step">
                <span className="contact-form-eyebrow">Who it's for</span>
                <p className="wizard-question">Who's the target audience?</p>
                <p className="wizard-help">A sentence is plenty: "busy parents," "small landlords," "high-school students." Skip it if you're not sure.</p>
                <div className="form-group">
                  <label className="form-label" htmlFor="cf-audience">
                    <span className="form-label-icon"><IconUsers size={13} /></span> Target audience
                  </label>
                  <input
                    id="cf-audience"
                    className="form-input"
                    type="text"
                    placeholder="Who will use this, and what are they like?"
                    value={data.audience}
                    onChange={(e) => set('audience', e.target.value)}
                  />
                </div>
              </div>
            )}

            {step === 'description' && (
              <div className="wizard-step">
                <span className="contact-form-eyebrow">In your words</span>
                <p className="wizard-question">Tell me about it.</p>
                <p className="wizard-help">A few sentences is great. What does it do, and what made you want to build it? You can also leave a voice note below instead.</p>
                <div className="form-group">
                  <label className="form-label" htmlFor="cf-description">Your idea</label>
                  <textarea
                    id="cf-description"
                    className="form-textarea"
                    placeholder="What does it do, who's it for, and where are you in the process?"
                    value={data.description}
                    onChange={(e) => set('description', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <span className="form-label">Or talk it through (optional)</span>
                  <VoiceNote value={voice} onChange={setVoice} />
                </div>
              </div>
            )}

            {step === 'details' && (
              <div className="wizard-step">
                <span className="contact-form-eyebrow">Last step</span>
                <p className="wizard-question">Where can I reach you?</p>
                <p className="wizard-help">Leave an email or a phone number — whichever you'd rather I use. Add both, or another handle, if you like.</p>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="cf-name">Name</label>
                    <input
                      id="cf-name"
                      className="form-input"
                      type="text"
                      autoComplete="name"
                      placeholder="Your name"
                      required
                      value={data.name}
                      onChange={(e) => set('name', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="cf-email">Email</label>
                    <input
                      id="cf-email"
                      className="form-input"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={data.email}
                      onChange={(e) => set('email', e.target.value)}
                    />
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
                    <label className="form-label" htmlFor="cf-other">Another way <span className="form-label-opt">optional</span></label>
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
                  <span className="form-label" id="cf-preferred-label">Best way to reach you <span className="form-label-opt">optional</span></span>
                  <div className="chip-grid" role="group" aria-labelledby="cf-preferred-label">
                    {CONTACT_METHODS.map((m) => {
                      const active = data.preferredContact === m.value
                      return (
                        <button
                          type="button"
                          key={m.value}
                          className={`chip${active ? ' selected' : ''}`}
                          // Tapping the active choice again clears it — keeps the field optional.
                          onClick={() => set('preferredContact', active ? '' : m.value)}
                          aria-pressed={active}
                        >
                          {m.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <p className="wizard-summary-note">
                  Nervous you left something out? Don't be; send what you have and
                  we'll fill in the rest on the call.
                </p>
              </div>
            )}
            </div>

            <div className="wizard-nav">
              {stepIdx > 0 ? (
                <button type="button" className="wizard-back" onClick={back}>
                  <IconArrowLeft size={14} /> Back
                </button>
              ) : <span />}

              {!isLast ? (
                <button type="button" className="wizard-next" onClick={next}>
                  Continue <IconArrowRight size={14} />
                </button>
              ) : (
                <button
                  type="submit"
                  className="form-submit-btn"
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? 'Sending…' : 'Send message'}
                </button>
              )}
            </div>

            {errorMsg && (
              <p className="form-status error" role="alert">
                {errorMsg}{' '}
                {status === 'error' && (
                  <>Or <a href={`mailto:${SITE.email}`}>email me directly</a>.</>
                )}
              </p>
            )}
          </form>
        )}

        <div className="section-header">
          <span className="section-num">What to include</span>
          <h2>Three things worth mentioning</h2>
          <div className="section-rule" />
        </div>

        {PROMPTS.map((p) => {
          const PromptIcon = p.icon
          return (
            <div key={p.eyebrow} className="feature-item">
              <div className={`feature-icon ${p.iconClass}`}>
                <PromptIcon size={20} />
              </div>
              <div className="feature-body">
                <span className="feature-eyebrow">{p.eyebrow}</span>
                <h3 className="feature-title">{p.title}</h3>
                <p>{p.body}</p>
              </div>
            </div>
          )
        })}

        <div className="section-header">
          <span className="section-num">Location</span>
          <h2>Where I am</h2>
          <div className="section-rule" />
        </div>

        <div className="verdict-box note">
          <p>
            {SITE.founder.location} · Mountain Time (US/Denver).
            I work with founders remotely and have built across US, UK, and
            international time zones without friction.
          </p>
        </div>
      </main>

      <footer className="sources-section">
        <div className="container">
          <div className="sources-header">
            <h3>Contact details</h3>
            <div className="sources-header-rule" />
          </div>
          <ul className="source-list">
            <li>
              <strong>Email</strong>
              {SITE.email}
            </li>
            <li>
              <strong>Book a call</strong>
              Free first consultation
            </li>
            <li>
              <strong>Location</strong>
              {SITE.founder.location} · Mountain Time
            </li>
            <li>
              <strong>Response time</strong>
              1–2 business days
            </li>
          </ul>
          <SocialLinks />
        </div>
      </footer>
    </>
  )
}
