import { motion } from 'motion/react'
import { services } from '../data/services'
import { RouteHead } from '../components/SEO/RouteHead'
import { META } from '../lib/seo'
import { VelvetVitrine } from '../components/VelvetVitrine/VelvetVitrine'
import styles from '../components/Page/Page.module.css'

export default function Services() {
  return (
    <VelvetVitrine>
      <motion.main
        className={styles.page}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
      <RouteHead {...META['/services']} />
      <motion.h1
        layoutId="block-services"
        className={styles.header}
        style={{ ['--block-bg' as string]: 'var(--c-services)', ['--block-fg' as string]: 'var(--c-services-fg)' }}
      >
        Services
      </motion.h1>

      <p className={styles.lede}>
        From a 6-week MVP to a production-grade interface, here's what I help
        founders ship.
      </p>

      <section className={styles.section}>
        <div className={styles.cardGrid}>
          {services.map((s) => (
            <article key={s.id} className={styles.card}>
              <h3 className={styles.cardTitle}>{s.title}</h3>
              <p className={styles.cardDesc}>{s.description}</p>
              {s.metric ? (
                <p>
                  <strong>{s.metric.value}</strong>{' '}
                  <span style={{ color: 'var(--fg-muted)' }}>{s.metric.label}</span>
                </p>
              ) : null}
              <div className={styles.chips}>
                {s.technologies.slice(0, 5).map((t) => (
                  <span key={t} className={styles.chip}>
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
      </motion.main>
    </VelvetVitrine>
  )
}
