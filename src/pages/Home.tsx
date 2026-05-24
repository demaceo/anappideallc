import { TetrisGrid } from '../components/TetrisGrid/TetrisGrid'
import { VelvetStage } from '../components/VelvetStage/VelvetStage'
import { RouteHead } from '../components/SEO/RouteHead'
import { META } from '../lib/seo'

export default function Home() {
  return (
    <>
      <RouteHead {...META['/']} />
      <VelvetStage>
        <TetrisGrid />
      </VelvetStage>
    </>
  )
}
