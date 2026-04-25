import { motion } from 'motion/react'
import { Link } from 'react-router'

export default function About() {
  return (
    <main className="spike-page">
      <motion.header layoutId="block-about" className="spike-header">
        About
      </motion.header>
      <p>
        Spike route — confirms <code>layoutId</code> morph between routes.
      </p>
      <Link to="/" className="spike-back">
        ← Back to grid
      </Link>
    </main>
  )
}
