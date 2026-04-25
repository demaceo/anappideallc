import { motion } from 'motion/react'
import { caseStudies } from '../data/case-studies'
import styles from '../components/Page/Page.module.css'

export default function Work() {
  return (
    <main className={styles.page}>
      <motion.h1
        layoutId="block-work"
        className={styles.header}
        style={{ ['--block-bg' as string]: 'var(--c-work)', ['--block-fg' as string]: 'var(--c-work-fg)' }}
      >
        Work
      </motion.h1>

      <p className={styles.lede}>
        Five products shipped end-to-end — interface, backend, auth, payments,
        moderation, and deploy. Each one solves a real workflow rather than
        showcasing a trick.
      </p>

      <section className={styles.section}>
        <div className={styles.cardGrid}>
          {caseStudies.map((c) => (
            <article key={c.slug} className={styles.card}>
              <span className={styles.sectionHeading}>{c.category}</span>
              <h3 className={styles.cardTitle}>{c.title}</h3>
              <p className={styles.cardDesc}>{c.summary}</p>
              <div className={styles.chips}>
                {c.stack.slice(0, 4).map((s) => (
                  <span key={s} className={styles.chip}>
                    {s}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
