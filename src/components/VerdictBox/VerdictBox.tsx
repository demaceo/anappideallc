import type { ReactNode } from 'react'

// Callout box with a small category label above its body.
//
// The label used to be injected by CSS (`.verdict-box::before { content:
// 'Assessment' }` and friends). That made real, meaning-carrying words into
// generated content: not selectable, not translatable, invisible to
// text-extraction tools, and impossible to key off in tests. Decorative
// pseudo-content is fine — see the `content: <string> / <alt>` block in
// globals.css — but these labels are content, so they live in the DOM.
export type VerdictVariant = 'assessment' | 'note' | 'warning' | 'context' | 'contact'

const LABELS: Record<VerdictVariant, string> = {
  assessment: 'Assessment',
  note: 'Note',
  warning: 'Warning',
  context: 'Context',
  contact: 'Get in touch',
}

interface VerdictBoxProps {
  variant?: VerdictVariant
  children: ReactNode
  // Hook read by useBrutalistScroll for the scroll-reveal tween.
  'data-reveal'?: boolean | ''
}

export function VerdictBox({ variant = 'assessment', children, ...rest }: VerdictBoxProps) {
  // The modifier class names are unchanged so the existing per-variant styling
  // in globals.css keeps applying.
  const modifier = variant === 'assessment' ? '' : ` ${variant}`
  return (
    <div className={`verdict-box${modifier}`} {...rest}>
      <span className="verdict-box-label">{LABELS[variant]}</span>
      {children}
    </div>
  )
}
