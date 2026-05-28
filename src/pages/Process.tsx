import { processSteps } from '../data/process'
import { RouteHead } from '../components/SEO/RouteHead'
import { META } from '../lib/seo'

export default function Process() {
  return (
    <main>
      <RouteHead {...META['/process']} />
      <h1>Process</h1>
      <p>
        Four phases, one builder. Each step ends with a tangible deliverable so
        you always know where the project stands.
      </p>
      <section>
        {processSteps.map((p) => (
          <article key={p.step}>
            <p>{p.step} · {p.timeline}</p>
            <h2>{p.title}</h2>
            <p>{p.description}</p>
            <h3>Deliverables</h3>
            <ul>
              {p.deliverables.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </main>
  )
}
