import { useParams, Link, Navigate } from 'react-router'
import { SocialLinks } from '../../components/SocialLinks/SocialLinks'
import { FooterNav } from '../../components/FooterNav/FooterNav'
import { getLegalAppBySlug } from '../../data/legal-apps'
import { RouteHead } from '../../components/SEO/RouteHead'
import { META } from '../../lib/seo'
import { PageHeader } from '../../components/PageHeader/PageHeader'
import { IconLock, IconEdit } from '../../components/icons'

export default function LegalApp() {
  const { app: slug } = useParams<{ app: string }>()
  const app = slug ? getLegalAppBySlug(slug) : null

  if (!app) return <Navigate to="/legal" replace />

  return (
    <>
      <RouteHead {...META[`/legal/${app.slug}`]} />

      <PageHeader>
        <header className="masthead">
          <p className="overline">Legal · {app.name}</p>
          <h1>{app.name}</h1>
          <p className="subtitle">Privacy Policy &amp; Terms of Service</p>
          <p className="date-line">{app.blurb}</p>
        </header>
      </PageHeader>

      <main className="container" id="main-content" tabIndex={-1}>
        <div className="intro-block">
          <p>
            Privacy Policy and Terms of Service for {app.name}, published by
            An App Idea LLC.
          </p>
        </div>

        <Link to={app.privacy} className="feature-item feature-item--linked">
          <div className="feature-icon icon-navy">
            <IconLock size={20} />
          </div>
          <div className="feature-body">
            <span className="feature-eyebrow">Data &amp; privacy</span>
            <h3 className="feature-title">Privacy Policy</h3>
            <p>What data {app.name} collects, how it's stored, and how to request deletion.</p>
            <span className="feature-cta">Read the Privacy Policy</span>
          </div>
        </Link>

        <Link to={app.terms} className="feature-item feature-item--linked">
          <div className="feature-icon icon-gold">
            <IconEdit size={20} />
          </div>
          <div className="feature-body">
            <span className="feature-eyebrow">Usage &amp; liability</span>
            <h3 className="feature-title">Terms of Service</h3>
            <p>The agreement covering eligibility, acceptable use, and disclaimers for {app.name}.</p>
            <span className="feature-cta">Read the Terms of Service</span>
          </div>
        </Link>

        <div className="project-back-nav">
          <Link to="/legal" className="project-back-link">← All apps</Link>
        </div>
      </main>

      <footer className="sources-section">
        <div className="container">
          <div className="sources-header">
            <h3>Document info</h3>
            <div className="sources-header-rule" />
          </div>
          <ul className="source-list">
            <li>
              <strong>App</strong>
              {app.name}
            </li>
            <li>
              <strong>Publisher</strong>
              An App Idea LLC
            </li>
          </ul>
          <FooterNav />
          <SocialLinks />
        </div>
      </footer>
    </>
  )
}
