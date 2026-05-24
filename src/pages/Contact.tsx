import { motion } from 'motion/react'
import { SITE } from '../data/site'
import { RouteHead } from '../components/SEO/RouteHead'
import { META } from '../lib/seo'
import { AuroraChamber } from '../components/AuroraChamber/AuroraChamber'
import styles from '../components/Page/Page.module.css'

export default function Contact() {
  const subject = encodeURIComponent('App idea — initial contact')
  const body = encodeURIComponent(
    `Hi ${SITE.founder.name.split(' ')[0]},\n\nI have an idea for a [mobile app / website] and I'd like to talk through what it would take to ship it.\n\nA short description:\n\n— `,
  )

  return (
    <AuroraChamber>
      <main className={styles.page}>
        <RouteHead {...META['/contact']} />
        <motion.h1
          layoutId="block-contact"
          className={styles.header}
          style={{ ['--block-bg' as string]: 'var(--c-contact)', ['--block-fg' as string]: 'var(--c-contact-fg)' }}
        >
          Contact
        </motion.h1>

        <p className={styles.lede}>
          Got an app or website idea, or a project that needs a co-builder? Send
          a few sentences. I read everything and respond within 1–2 business days.
        </p>

        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Email</h2>
          <p>
            <a
              href={`mailto:${SITE.email}?subject=${subject}&body=${body}`}
              style={{ fontWeight: 800, fontSize: '1.25rem' }}
            >
              {SITE.email}
            </a>
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Where I am</h2>
          <p style={{ color: 'var(--fg-muted)' }}>
            {SITE.founder.location} · Mountain Time (US/Denver)
          </p>
        </section>
      </main>
    </AuroraChamber>
  )
}
