import type { ReactNode } from 'react'
import { Link } from 'react-router'

interface MessageCTAProps {
  // Replaces the default one-liner where a page has more to say.
  children?: ReactNode
}

// Tier 2 of three call-to-action shapes: write to me. A lavender strip,
// quieter than the chartreuse booking band it usually sits under, for
// visitors who would rather write than talk. Links to the guided form.
export function MessageCTA({ children }: MessageCTAProps) {
  return (
    <div className="message-cta">
      <div className="message-cta-text">
        {children ?? <p>Rather write it down? Send a few sentences and I'll reply within 1–2 business days.</p>}
      </div>
      <Link to="/contact" className="message-cta-btn">
        Send me a message
      </Link>
    </div>
  )
}
