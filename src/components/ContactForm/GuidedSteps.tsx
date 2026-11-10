import type { RefObject } from 'react'
import {
  IconSmartphone, IconMonitor, IconLayers, IconHelpCircle, IconUsers,
  IconTrendingUp, IconCompass, IconArrowLeft, IconArrowRight, IconCheck,
} from '../icons'
import { OTHER_CATEGORY } from '../../lib/contact-draft'
import type { FormData, Importance, Platform, ProjectType, SetField, StepKey } from './types'

const PROJECT_TYPES = [
  { value: 'website', label: 'A website', desc: 'Marketing site, store, portfolio, or web app', Icon: IconMonitor },
  { value: 'app', label: 'A mobile app', desc: 'iPhone and/or Android', Icon: IconSmartphone },
  { value: 'both', label: 'Both', desc: 'An app with a companion website', Icon: IconLayers },
  { value: 'unsure', label: "I'm not sure yet", desc: "Totally fine. That's what the call is for.", Icon: IconHelpCircle },
] as const

const PLATFORMS = [
  { value: 'ios', label: 'iOS App Store', desc: 'iPhone & iPad' },
  { value: 'android', label: 'Google Play', desc: 'Android phones & tablets' },
  { value: 'web', label: 'Web version too', desc: 'Runs in the browser' },
] as const

const CATEGORIES = [
  'Salon & beauty', 'Food & drink', 'Retail & online store', 'Health & wellness',
  'Coaching & consulting', 'Home & trade services', 'Real estate & property',
  'Nonprofit & community', 'Creative & media', 'Education & tutoring',
  'Events & booking', OTHER_CATEGORY,
]

const IMPORTANCE_OPTS = [
  { value: 'unsure', label: 'Not sure' },
  { value: 'nice', label: 'Nice to have' },
  { value: 'important', label: 'Important' },
  { value: 'critical', label: 'Must-have' },
] as const

interface GuidedStepsProps {
  data: FormData
  set: SetField
  togglePlatform: (p: Platform) => void
  toggleCategory: (c: string) => void
  steps: StepKey[]
  stepIdx: number
  /** The focusable step container, so the form can move focus to a new step. */
  stageRef: RefObject<HTMLDivElement | null>
  /** Continue, or, on the last step, write the draft. Also fires on Enter. */
  onSubmit: () => void
  onBack: () => void
  /** Back at the first step: leave the guided questions, keeping the form as it was. */
  onExit: () => void
}

// The question-by-question helper, for a visitor who does not know what to
// write. It asks the same questions as ever, then (instead of collecting
// contact details) hands its answers to the contact form as a draft message.
export function GuidedSteps({
  data,
  set,
  togglePlatform,
  toggleCategory,
  steps,
  stepIdx,
  stageRef,
  onSubmit,
  onBack,
  onExit,
}: GuidedStepsProps) {
  const step = steps[Math.min(stepIdx, steps.length - 1)]
  const isLast = stepIdx >= steps.length - 1

  return (
    <form
      className="contact-guided"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
      noValidate
    >
      <div
        className="wizard-stage"
        ref={stageRef}
        tabIndex={-1}
        role="group"
        aria-label={`Step ${stepIdx + 1} of ${steps.length}`}
      >
        {step === 'type' && (
          <div className="wizard-step">
            <span className="contact-form-eyebrow">Tell me about your business</span>
            <p className="wizard-question">What do you need?</p>
            <p className="wizard-help">
              Skip anything you like; "not sure" is always a fine answer. At the
              end I'll write a first draft of your message for you to edit. Need
              something else, like fixing a site or adding AI? Pick "not sure"
              and tick it on the next screen.
            </p>
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
            <p className="wizard-question">What kind of business is it?</p>
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
            {data.categories.includes(OTHER_CATEGORY) && (
              <input
                className="form-input wizard-inline-input"
                type="text"
                placeholder="What kind of business is it?"
                value={data.categoryOther}
                onChange={(e) => set('categoryOther', e.target.value)}
              />
            )}
          </div>
        )}

        {step === 'reach' && (
          <div className="wizard-step">
            <span className="contact-form-eyebrow">Getting found</span>
            <p className="wizard-question">How will people find it?</p>
            <p className="wizard-help">Most people haven't thought about this yet, and "not sure" is a perfectly good answer. Skip it if you like.</p>

            <div className="rating-row">
              <div className="rating-label">
                <span className="rating-label-icon"><IconTrendingUp size={16} /></span>
                <span className="rating-label-title">Showing up on Google</span>
                <span className="rating-label-desc">When someone searches for what you offer, your site appears near the top. (Often called SEO.)</span>
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
                <span className="rating-label-title">Getting recommended by AI assistants</span>
                <span className="rating-label-desc">When someone asks ChatGPT, Claude, or Google's AI for a suggestion, it names you. (Sometimes called GEO.)</span>
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
            <p className="wizard-help">A sentence is plenty: "neighbors within 10 miles," "new moms," "small landlords." Skip it if you're not sure.</p>
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

        {step === 'budget' && (
          <div className="wizard-step">
            <span className="contact-form-eyebrow">The fit</span>
            <p className="wizard-question">Got a budget ballpark in mind?</p>
            <p className="wizard-help">
              A rough range helps me scope the work, and "not sure yet" is a
              normal answer. Pricing is a sliding scale by your business's size
              and stage. Skip it if you like.
            </p>
            <div className="form-group">
              <label className="form-label" htmlFor="cf-budget">
                Budget ballpark <span className="form-label-opt">optional</span>
              </label>
              <input
                id="cf-budget"
                className="form-input"
                type="text"
                placeholder="A rough range, or “not sure yet.”"
                value={data.budget}
                onChange={(e) => set('budget', e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      <div className="wizard-nav">
        {stepIdx > 0 ? (
          <button type="button" className="wizard-back" onClick={onBack}>
            <IconArrowLeft size={14} /> Back
          </button>
        ) : (
          <button type="button" className="wizard-back" onClick={onExit}>
            <IconArrowLeft size={14} /> Back to my message
          </button>
        )}

        {/* Distinct keys so React swaps in a new element for the last step. */}
        {!isLast ? (
          <button key="next" type="submit" className="wizard-next">
            Continue <IconArrowRight size={14} />
          </button>
        ) : (
          <button key="finish" type="submit" className="wizard-next">
            Write my first draft <IconArrowRight size={14} />
          </button>
        )}
      </div>
    </form>
  )
}
