import styles from './HeroPortalWindow.module.css'

/**
 * HeroPortalWindow — the aurora cutout inside the Hero block. Mounted as
 * a sibling of the Hero block's title/subtitle/cta, positioned absolutely
 * inset from the block's edges. Renders only on modern-vibrant (other
 * themes hide it via CSS theme-scoping). Decorative — no interactive
 * content; the Hero block itself owns the click target.
 *
 * Material independence (Phase 5 audit clarification): this overlay paints
 * *on top of* whatever material recipe the Hero block uses (Anodized,
 * Steel, Gold, Frosted, Bronze, Ceramic, Showcase). The cutout's deep-
 * space backing + cyan/magenta radials are opaque enough that Hero
 * visually reads as "aurora portal" regardless of the material below —
 * which makes Hero *appear* material-agnostic at a glance, even though
 * the material is in fact applied to the block's gradient and shadow.
 * This is intentional: the aurora portal is the brand anchor, and
 * decoupling it from material switching keeps the Hero's identity stable
 * while visitors explore presets.
 */
export function HeroPortalWindow() {
  return (
    <div className={styles.portal} aria-hidden="true">
      <div className={styles.aurora} />
      <div className={styles.stars} />
    </div>
  )
}
