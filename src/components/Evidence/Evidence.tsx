import { EVIDENCE, type EvidenceId } from '../../data/story'
import { Counter } from '../Counter/Counter'

// Sourced stats under a story chapter: a big figure, one line of context, and
// a linked source with its date. The figure is a <Counter>: the real number in
// the prerendered HTML, counting up on scroll when motion is allowed.
export function Evidence({ ids }: { ids: EvidenceId[] }) {
  return (
    <ul className="evidence-list">
      {ids.map((id) => {
        const e = EVIDENCE[id]
        return (
          <li key={id} className="evidence">
            <Counter className="evidence-value" value={e.value} decimals={e.decimals} suffix={e.suffix} />
            <p className="evidence-label">{e.label}</p>
            <a className="evidence-source" href={e.url} target="_blank" rel="noopener noreferrer">
              {e.source} · {e.date}
            </a>
          </li>
        )
      })}
    </ul>
  )
}
