import type { ReactNode } from 'react'
import { RouteHead } from '../SEO/RouteHead'
import { PageHeader } from '../PageHeader/PageHeader'
import { META } from '../../lib/seo'

interface LegalPageProps {
  path: string
  appLabel: string
  docType: 'privacy' | 'terms'
  subtitle: string
  dateLine: string
  children: ReactNode
}

export function LegalPage({ path, appLabel, docType, subtitle, dateLine, children }: LegalPageProps) {
  const heading =
    docType === 'privacy' ? (
      <>Privacy <em>Policy</em></>
    ) : (
      <>Terms of <em>Service</em></>
    )

  return (
    <>
      <RouteHead {...META[path]} />
      <PageHeader>
        <header className="masthead">
          <p className="overline">Legal · {appLabel}</p>
          <h1>{heading}</h1>
          <p className="subtitle">{subtitle}</p>
          <p className="date-line">{dateLine}</p>
        </header>
      </PageHeader>
      <main className="container" id="main-content" tabIndex={-1}>
        {children}
      </main>
    </>
  )
}
