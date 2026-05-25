import styles from './HeroPortalWindow.module.css'

/**
 * HeroPortalWindow — the aurora cutout inside the Hero block. Mounted as
 * a sibling of the Hero block's title/subtitle/cta, positioned absolutely
 * inset from the block's edges. Renders only on modern-vibrant (other
 * themes hide it via CSS theme-scoping). Decorative — no interactive
 * content; the Hero block itself owns the click target.
 */
export function HeroPortalWindow() {
  return (
    <div className={styles.portal} aria-hidden="true">
      <div className={styles.aurora} />
      <div className={styles.stars} />
    </div>
  )
}
