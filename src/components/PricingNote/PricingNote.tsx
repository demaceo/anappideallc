import { SITE } from '../../data/site'
import { VerdictBox } from '../VerdictBox/VerdictBox'

// The site had no cost signal anywhere, so every visitor had to book a call to
// learn whether they were in range. Hidden until SITE.pricing.range is filled
// in, so an empty value never ships as "$—".
export function PricingNote() {
  const { range, note } = SITE.pricing
  if (!range.trim()) return null
  return (
    <VerdictBox variant="note">
      <p>
        <strong>{range}</strong>
        {note.trim() && ` ${note}`}
      </p>
    </VerdictBox>
  )
}
