import { Link } from 'react-router'
import { SITE } from '../data/site'
import { RouteHead } from '../components/SEO/RouteHead'
import { META } from '../lib/seo'

export default function Home() {
  return (
    <main>
      <RouteHead {...META['/']} />
      <h1>{SITE.tagline}</h1>
      <p>{SITE.description}</p>
      <nav aria-label="Main navigation">
        <ul>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/work">Work</Link></li>
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/process">Process</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>
    </main>
  )
}
