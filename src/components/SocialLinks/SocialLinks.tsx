import { type ComponentType } from 'react'
import { SITE, xHandle } from '../../data/site'
import {
  IconInstagram,
  IconFacebook,
  IconThreads,
  IconTiktok,
  IconLinkedin,
  IconX,
} from '../icons'

interface SocialLink {
  label: string
  href: string
  Icon: ComponentType<{ size?: number }>
}

// Build the visible link set from SITE.social, dropping any profile that
// hasn't been configured yet. Mirrors the filtering used for SAME_AS so the
// footer never ships a placeholder or a dead link.
function buildLinks(): SocialLink[] {
  const { social } = SITE
  const handle = xHandle(social.twitter)
  const links: SocialLink[] = [
    { label: 'Instagram', href: social.instagram, Icon: IconInstagram },
    { label: 'Threads', href: social.threads, Icon: IconThreads },
    { label: 'TikTok', href: social.tiktok, Icon: IconTiktok },
    { label: 'Facebook', href: social.facebook, Icon: IconFacebook },
    { label: 'LinkedIn', href: social.linkedin, Icon: IconLinkedin },
    { label: 'X', href: handle ? `https://x.com/${handle}` : '', Icon: IconX },
  ]
  return links.filter((link) => /^https?:\/\//.test(link.href))
}

// Subtle row of social icon buttons for the site footer. Renders nothing when
// no profiles are configured, so it's safe to drop into every footer.
export function SocialLinks() {
  const links = buildLinks()
  if (links.length === 0) return null

  return (
    <div className="social-links-row">
      <span className="social-links-label">Follow</span>
      <nav className="social-links" aria-label="Social media">
        {links.map(({ label, href, Icon }) => (
          <a
            key={label}
            className="social-link"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
          >
            <Icon size={17} />
          </a>
        ))}
      </nav>
    </div>
  )
}
