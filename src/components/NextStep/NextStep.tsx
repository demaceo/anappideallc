import { ConsultCTA } from '../ConsultCTA/ConsultCTA'
import { MessageCTA } from '../MessageCTA/MessageCTA'

interface NextStepProps {
  heading: string
  eyebrow?: string
  title?: string
  blurb?: string
}

// The closing section on every page a prospect reads before deciding. Before
// this, About, Work, Services, Process and every case study ended with no call
// to action at all: a visitor convinced by the last paragraph had to find the
// floating button or the footer to act. One shape everywhere: the chartreuse
// booking band, then the lavender "write to me" strip.
export function NextStep({ heading, ...cta }: NextStepProps) {
  return (
    <section className="next-step" aria-label="Next step">
      <div className="section-header">
        <span className="section-num">Next step</span>
        <h2>{heading}</h2>
        <div className="section-rule" />
      </div>
      <ConsultCTA {...cta} />
      <MessageCTA />
    </section>
  )
}
