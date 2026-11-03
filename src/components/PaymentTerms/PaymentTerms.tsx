import { SITE } from '../../data/site'
import { IconCalendar, IconKey, IconGlobe, IconShieldCheck } from '../icons'

// The questions a careful owner asks before hiring a developer, answered in
// writing: how do I pay, what do I own, what does it cost to keep running, and
// what if something breaks. The site never said any of it, so the buyers who
// most need a clear answer (the ones who have been left with a site they could
// not update) had to ask on a call or guess. Wording lives in SITE.terms so the
// page and the quote say the same thing.
const CARDS = [
  { key: 'payment', eyebrow: 'Payment', Icon: IconCalendar, iconClass: 'icon-blue' },
  { key: 'ownership', eyebrow: 'Ownership', Icon: IconKey, iconClass: 'icon-gold' },
  { key: 'running', eyebrow: 'Running costs', Icon: IconGlobe, iconClass: 'icon-teal' },
  { key: 'afterLaunch', eyebrow: 'Support', Icon: IconShieldCheck, iconClass: 'icon-green' },
] as const

export function PaymentTerms() {
  return (
    <section className="payment-terms" aria-labelledby="payment-terms-title">
      <div className="section-header">
        <span className="section-num">Money</span>
        <h2 id="payment-terms-title">Straight answers about money</h2>
        <div className="section-rule" />
      </div>
      <div className="grid-2">
        {CARDS.map(({ key, eyebrow, Icon, iconClass }) => {
          const term = SITE.terms[key]
          return (
            <div key={key} className="feature-item">
              <div className={`feature-icon ${iconClass}`}>
                <Icon size={20} />
              </div>
              <div className="feature-body">
                <span className="feature-eyebrow">{eyebrow}</span>
                <h3 className="feature-title">{term.title}</h3>
                <p>{term.body}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
