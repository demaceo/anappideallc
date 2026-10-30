import { ConsultCTA } from '../ConsultCTA/ConsultCTA'

interface NextStepProps {
  heading: string
  eyebrow?: string
  title?: string
  blurb?: string
}

// The closing section on every page a prospect reads before deciding. Before
// this, About, Work, Services, Process and every case study ended with no call
// to action at all: a visitor convinced by the last paragraph had to find the
// floating button or the footer to act. One shape everywhere — book a call, or
// write via the guided form — so the next step never changes between pages.
export function NextStep({ heading, ...cta }: NextStepProps) {
  return (
    <section className="next-step" aria-label="Next step">
      <div className="section-header">
        <span className="section-num">Next step</span>
        <h2>{heading}</h2>
        <div className="section-rule" />
      </div>
      <ConsultCTA {...cta} />
    </section>
  )
}
