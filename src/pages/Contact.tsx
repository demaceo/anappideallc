import { SITE } from '../data/site'
import { RouteHead } from '../components/SEO/RouteHead'
import { META } from '../lib/seo'

export default function Contact() {
  const subject = encodeURIComponent('App idea — initial contact')
  const body = encodeURIComponent(
    `Hi ${SITE.founder.name.split(' ')[0]},\n\nI have an idea for a [mobile app / website] and I'd like to talk through what it would take to ship it.\n\nA short description:\n\n— `,
  )

  return (
    <main>
      <RouteHead {...META['/contact']} />
      <h1>Contact</h1>
      <p>
        Got an app or website idea, or a project that needs a co-builder? Send
        a few sentences. I read everything and respond within 1–2 business days.
      </p>
      <section>
        <h2>Email</h2>
        <p>
          <a href={`mailto:${SITE.email}?subject=${subject}&body=${body}`}>
            {SITE.email}
          </a>
        </p>
      </section>
      <section>
        <h2>Where I am</h2>
        <p>{SITE.founder.location} · Mountain Time (US/Denver)</p>
      </section>
    </main>
  )
}
