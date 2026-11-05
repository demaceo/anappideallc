import { SITE } from '../../data/site'

// The site says "I'm a Black founder in Denver" and names the people it is
// built for, but showed no face, which is the first proof a visitor looks for.
// Two widths so phones don't download the large file; explicit dimensions so
// the page doesn't shift as it loads. Pass `eager` for a portrait that sits in
// the first screen, and `hero` for the Home masthead version: a tall portrait
// beside the headline on wide screens, a small avatar row on phones (where the
// masthead collapses as soon as the visitor scrolls).
export function FounderPortrait({ eager = false, hero = false }: { eager?: boolean; hero?: boolean }) {
  const { photo, name, location } = SITE.founder
  return (
    <figure className={`founder-portrait${hero ? ' founder-portrait--hero' : ''}`}>
      <img
        src={photo.src800}
        srcSet={`${photo.src400} 400w, ${photo.src800} 800w`}
        sizes={hero ? '(max-width: 899px) 64px, 320px' : '(max-width: 720px) 220px, 260px'}
        width={800}
        height={800}
        alt={photo.alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
      <figcaption>
        <strong>{name}</strong>
        <span>Founder · {location}</span>
      </figcaption>
    </figure>
  )
}
