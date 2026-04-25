import { SITE } from '../../data/site'

interface RouteHeadProps {
  path: string
  title: string
  description: string
}

// Per-route head tags. Relies on React 19's built-in document metadata
// hoisting — putting <title>/<meta>/<link> in any component tree moves
// them to <head> at render time (works in SSG too).
export function RouteHead({ path, title, description }: RouteHeadProps) {
  const canonical = `${SITE.url}${path === '/' ? '' : path}`
  const ogImage = `${SITE.url}/og.png`

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* OpenGraph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE.name} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </>
  )
}
