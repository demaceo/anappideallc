import { caseStudies } from '../data/case-studies'
import { RouteHead } from '../components/SEO/RouteHead'
import { META } from '../lib/seo'

export default function Work() {
  return (
    <main>
      <RouteHead {...META['/work']} />
      <h1>Work</h1>
      <p>
        Five products shipped end-to-end — interface, backend, auth, payments,
        moderation, and deploy. Each one solves a real workflow rather than
        showcasing a trick.
      </p>
      <section>
        {caseStudies.map((c) => (
          <article key={c.slug}>
            <p>{c.category}</p>
            <h2>{c.title}</h2>
            <p>{c.summary}</p>
            <ul>
              {c.outcomes.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
            <p><strong>Stack:</strong> {c.stack.join(', ')}</p>
            {c.liveUrl && (
              <p><a href={c.liveUrl} target="_blank" rel="noopener noreferrer">Live Site</a></p>
            )}
            {c.repoUrl && (
              <p><a href={c.repoUrl} target="_blank" rel="noopener noreferrer">Repository</a></p>
            )}
          </article>
        ))}
      </section>
    </main>
  )
}
