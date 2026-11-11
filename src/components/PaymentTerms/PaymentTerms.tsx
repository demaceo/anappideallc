import { SITE } from '../../data/site'

// The questions a careful owner asks before hiring a developer, answered in
// writing: how do I pay, what do I own, what does it cost to keep running, and
// what if something breaks. The site never said any of it, so the buyers who
// most need a clear answer (the ones who have been left with a site they could
// not update) had to ask on a call or guess. Wording lives in SITE.terms so the
// page and the quote say the same thing. A definition list, because each item
// is a question's label and its answer.
const TERMS = [
  { key: 'payment', label: 'Payment' },
  { key: 'ownership', label: 'Ownership' },
  { key: 'running', label: 'Running costs' },
  { key: 'provide', label: 'Your part' },
  { key: 'appStores', label: 'Apps' },
  { key: 'afterLaunch', label: 'Support' },
] as const

export function PaymentTerms() {
  return (
    <section className="payment-terms" aria-labelledby="payment-terms-title">
      <div className="section-header">
        <span className="section-num">Money</span>
        <h2 id="payment-terms-title">Straight answers about money</h2>
        <div className="section-rule" />
      </div>
      <dl className="terms-list">
        {TERMS.map(({ key, label }) => {
          const term = SITE.terms[key]
          return (
            <div key={key} className="terms-item">
              <dt>{label}</dt>
              <dd>
                <h3 className="terms-title">{term.title}</h3>
                <p>{term.body}</p>
              </dd>
            </div>
          )
        })}
      </dl>
    </section>
  )
}
