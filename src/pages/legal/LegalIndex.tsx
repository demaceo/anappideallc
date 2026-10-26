import { Link } from 'react-router'
import { SocialLinks } from '../../components/SocialLinks/SocialLinks'
import { FooterNav } from '../../components/FooterNav/FooterNav'
import { legalApps } from '../../data/legal-apps'
import { RouteHead } from '../../components/SEO/RouteHead'
import { META } from '../../lib/seo'
import { PageHeader } from '../../components/PageHeader/PageHeader'
import { IconShieldCheck } from '../../components/icons'

export default function LegalIndex() {
  return (
    <>
      <RouteHead {...META['/legal']} />

      <PageHeader>
        <header className="masthead">
          <p className="overline">An App Idea LLC · Privacy &amp; terms</p>
          <h1>Legal</h1>
          <p className="subtitle">
            Privacy Policy and Terms of Service for every published app,
            all in one place.
          </p>
          <p className="date-line">Seven apps · privacy &amp; terms for each</p>
        </header>
      </PageHeader>

      <main className="container" id="main-content" tabIndex={-1}>
        <div className="intro-block">
          <p>
            Pick an app below to find its Privacy Policy and Terms of Service.
            Each covers what data is collected, how it's stored, and how to
            request deletion.
          </p>
        </div>

        {legalApps.map((app) => (
          <Link key={app.slug} to={`/legal/${app.slug}`} className="feature-item feature-item--linked">
            <div className="feature-icon icon-navy">
              <IconShieldCheck size={20} />
            </div>
            <div className="feature-body">
              <span className="feature-eyebrow">Legal</span>
              <h3 className="feature-title">{app.name}</h3>
              <p>{app.blurb}</p>
              <span className="feature-cta">View legal docs</span>
            </div>
          </Link>
        ))}
      </main>

      <footer className="sources-section">
        <div className="container">
          <div className="sources-header">
            <h3>Legal at a glance</h3>
            <div className="sources-header-rule" />
          </div>
          <ul className="source-list">
            {legalApps.map((app) => (
              <li key={app.slug}>
                <strong>{app.name}</strong>
                Privacy Policy &amp; Terms of Service
              </li>
            ))}
          </ul>
          <FooterNav />
          <SocialLinks />
        </div>
      </footer>
    </>
  )
}
