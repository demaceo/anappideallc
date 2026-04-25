import { motion } from 'motion/react'
import { Link } from 'react-router'

export default function Home() {
  return (
    <main className="spike-home">
      <h1>An App Idea LLC — Spike</h1>
      <p>Click the block to validate the layoutId morph + SSG round-trip.</p>
      <Link to="/about" className="spike-link">
        <motion.div layoutId="block-about" className="spike-block">
          About
        </motion.div>
      </Link>
    </main>
  )
}
