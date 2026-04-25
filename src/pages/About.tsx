import { motion } from 'motion/react'
import { SITE } from '../data/site'
import { differentiators } from '../data/case-studies'
import { RouteHead } from '../components/SEO/RouteHead'
import { META } from '../lib/seo'
import styles from '../components/Page/Page.module.css'

export default function About() {
  return (
    <main className={styles.page}>
      <RouteHead {...META['/about']} />
      <motion.h1
        layoutId="block-about"
        className={styles.header}
        style={{ ['--block-bg' as string]: 'var(--c-about)', ['--block-fg' as string]: 'var(--c-about-fg)' }}
      >
        About
      </motion.h1>

      <p className={styles.lede}>
        {SITE.name} is a solo dev studio in {SITE.founder.location}, run by{' '}
        {SITE.founder.name}. I help founders take an app or website idea from
        sketch to shipped product — interface, backend, and the operational
        plumbing that makes it credible.
      </p>

      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>What sets the work apart</h2>
        <div className={styles.cardGrid}>
          {differentiators.map((d) => (
            <article key={d.title} className={styles.card}>
              <h3 className={styles.cardTitle}>{d.title}</h3>
              <p className={styles.cardDesc}>{d.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
