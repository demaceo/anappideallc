import { EVIDENCE, type EvidenceId } from '../../data/story'

// Sourced stats under a story chapter: a big figure, one line of context, and
// a linked source with its date. The figure is the real number in the
// prerendered HTML (crawlable, no-JS safe); `data-count` is the hook a scroll
// counter can animate from.
export function Evidence({ ids }: { ids: EvidenceId[] }) {
  return (
    <ul className="evidence-list">
      {ids.map((id) => {
        const e = EVIDENCE[id]
        const figure = `${e.value.toFixed(e.decimals ?? 0)}${e.suffix}`
        return (
          <li key={id} className="evidence">
            <span
              className="evidence-value"
              data-count={e.value}
              data-decimals={e.decimals ?? 0}
              data-suffix={e.suffix}
            >
              {figure}
            </span>
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
