import { motion } from 'motion/react'
import { processSteps } from '../data/process'
import styles from '../components/Page/Page.module.css'

export default function Process() {
  return (
    <main className={styles.page}>
      <motion.h1
        layoutId="block-process"
        className={styles.header}
        style={{ ['--block-bg' as string]: 'var(--c-process)', ['--block-fg' as string]: 'var(--c-process-fg)' }}
      >
        Process
      </motion.h1>

      <p className={styles.lede}>
        Four phases, one builder. Each step ends with a tangible deliverable so
        you always know where the project stands.
      </p>

      <section className={styles.section}>
        <div className={styles.cardGrid}>
          {processSteps.map((p) => (
            <article key={p.step} className={styles.card}>
              <span className={styles.sectionHeading}>
                {p.step} · {p.timeline}
              </span>
              <h3 className={styles.cardTitle}>{p.title}</h3>
              <p className={styles.cardDesc}>{p.description}</p>
              <ul className={styles.list}>
                {p.deliverables.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
