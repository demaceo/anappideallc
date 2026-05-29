import { services } from '../data/services'
import { RouteHead } from '../components/SEO/RouteHead'
import { META } from '../lib/seo'

export default function Services() {
  return (
    <main>
      <RouteHead {...META['/services']} />
      <h1>Services</h1>
      <p>
        From a 6-week MVP to a production-grade interface, here's what I help
        founders ship.
      </p>
      <section>
        {services.map((s) => (
          <article key={s.id}>
            <h2>{s.title}</h2>
            <p>{s.description}</p>
            {s.metric && (
              <p><strong>{s.metric.value}</strong> {s.metric.label}</p>
            )}
            <ul>
              {s.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <p><strong>Technologies:</strong> {s.technologies.join(', ')}</p>
          </article>
        ))}
      </section>
    </main>
  )
}
