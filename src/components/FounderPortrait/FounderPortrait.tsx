import { SITE } from '../../data/site'

// The site says "I'm a Black founder in Denver" and names the people it is
// built for, but showed no face, which is the first proof a visitor looks for.
// Two widths so phones don't download the large file; explicit dimensions so
// the page doesn't shift as it loads. Pass `eager` for a portrait that sits in
// the first screen.
export function FounderPortrait({ eager = false }: { eager?: boolean }) {
  const { photo, name, location } = SITE.founder
  return (
    <figure className="founder-portrait">
      <img
        src={photo.src800}
        srcSet={`${photo.src400} 400w, ${photo.src800} 800w`}
        sizes="(max-width: 720px) 220px, 260px"
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
