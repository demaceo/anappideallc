import { SITE } from '../data/site'
import { differentiators } from '../data/case-studies'
import { RouteHead } from '../components/SEO/RouteHead'
import { META } from '../lib/seo'

export default function About() {
  return (
    <main>
      <RouteHead {...META['/about']} />
      <h1>About</h1>
      <p>
        {SITE.name} is a dev studio in {SITE.founder.location}, run by{' '}
        {SITE.founder.name}. I help founders take an app or website idea from
        sketch to shipped product — interface, backend, and the operational
        plumbing that makes it credible.
      </p>
      <section>
        <h2>What sets the work apart</h2>
        {differentiators.map((d) => (
          <article key={d.title}>
            <h3>{d.title}</h3>
            <p>{d.description}</p>
          </article>
        ))}
      </section>
    </main>
  )
}
