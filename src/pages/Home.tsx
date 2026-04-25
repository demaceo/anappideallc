import { TetrisGrid } from '../components/TetrisGrid/TetrisGrid'
import { RouteHead } from '../components/SEO/RouteHead'
import { META } from '../lib/seo'

export default function Home() {
  return (
    <>
      <RouteHead {...META['/']} />
      <TetrisGrid />
    </>
  )
}
