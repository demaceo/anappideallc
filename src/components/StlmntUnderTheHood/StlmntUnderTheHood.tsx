import type { CSSProperties } from 'react'

// A web refactor of STLMNT's admin "Claims by status" visualization
// (app/(app)/admin/index.tsx → StatusBreakdown). Same data model — the
// claim lifecycle drawn as a stacked distribution bar plus a legend — wearing
// STLMNT's own "Editorial Ink" tokens so the case study carries the app's look.

type ClaimStatus = 'saved' | 'filed' | 'confirmed' | 'approved' | 'paid' | 'rejected'

// Claim lifecycle order, with `rejected` last — a terminal failure, not a stage.
const STATUS_ORDER: ClaimStatus[] = ['saved', 'filed', 'confirmed', 'approved', 'paid', 'rejected']

const STATUS_LABELS: Record<ClaimStatus, string> = {
  saved: 'Saved',
  filed: 'Filed',
  confirmed: 'Confirmed',
  approved: 'Approved',
  paid: 'Paid',
  rejected: 'Rejected',
}

// Illustrative distribution — the shape of a healthy claims funnel, not live data.
const SAMPLE: Record<ClaimStatus, number> = {
  saved: 412,
  filed: 286,
  confirmed: 174,
  approved: 96,
  paid: 138,
  rejected: 22,
}

// STLMNT keeps a deliberately restrained palette: two accents (ledger green for
// success, stamp red for rejection) over an ink ramp — no invented hues.
const INK = '#0A0A0A'
const LEDGER_GREEN = '#1F6B3B'
const STAMP_RED = '#B3261E'

function statusVisual(status: ClaimStatus): { color: string; opacity: number } {
  switch (status) {
    case 'paid':
      return { color: LEDGER_GREEN, opacity: 1 }
    case 'approved':
      return { color: LEDGER_GREEN, opacity: 0.5 }
    case 'rejected':
      return { color: STAMP_RED, opacity: 1 }
    case 'confirmed':
      return { color: INK, opacity: 0.55 }
    case 'filed':
      return { color: INK, opacity: 0.38 }
    case 'saved':
    default:
      return { color: INK, opacity: 0.22 }
  }
}

const pct = (n: number, total: number): number => (total > 0 ? Math.round((n / total) * 100) : 0)

export function StlmntUnderTheHood() {
  const counts = SAMPLE
  const total = STATUS_ORDER.reduce((sum, s) => sum + counts[s], 0)

  return (
    <div className="stlmnt-uth">
      <div className="stlmnt-uth-head">
        <span className="stlmnt-uth-eyebrow">Claims by status</span>
        <span className="stlmnt-uth-total">{total} total</span>
      </div>

      {/* Stacked distribution bar — the pipeline shape at a glance. */}
      <div
        className="stlmnt-uth-track"
        role="img"
        aria-label={`Claims by status — ${STATUS_ORDER.map(
          (s) => `${STATUS_LABELS[s]} ${pct(counts[s], total)}%`,
        ).join(', ')}`}
      >
        {STATUS_ORDER.map((s) => {
          const count = counts[s]
          if (!count) return null
          const v = statusVisual(s)
          return (
            <div
              key={s}
              className="stlmnt-uth-seg"
              title={`${STATUS_LABELS[s]} · ${count} · ${pct(count, total)}%`}
              style={{ width: `${(count / total) * 100}%`, background: v.color, opacity: v.opacity }}
            />
          )
        })}
      </div>

      {/* Legend: swatch · label · count · share. */}
      <ul className="stlmnt-uth-legend">
        {STATUS_ORDER.map((s) => {
          const v = statusVisual(s)
          return (
            <li key={s} className="stlmnt-uth-row">
              <span
                className="stlmnt-uth-swatch"
                style={{ background: v.color, opacity: v.opacity } as CSSProperties}
              />
              <span className="stlmnt-uth-label">{STATUS_LABELS[s]}</span>
              <span className="stlmnt-uth-count">{counts[s]}</span>
              <span className="stlmnt-uth-pct">{pct(counts[s], total)}%</span>
            </li>
          )
        })}
      </ul>

      <p className="stlmnt-uth-foot">
        Conversion {pct(counts.paid, total)}% · Rejection {pct(counts.rejected, total)}%
      </p>
      <p className="stlmnt-uth-note">
        The claims-by-status visualization from STLMNT's admin dashboard, refactored for the web in
        the app's Editorial Ink palette. Illustrative data.
      </p>
    </div>
  )
}
