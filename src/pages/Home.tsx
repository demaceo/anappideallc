import { TetrisGrid } from '../components/TetrisGrid/TetrisGrid'
import { VelvetStage } from '../components/VelvetStage/VelvetStage'
import { HeroAuroraGrow } from '../components/HeroAuroraGrow/HeroAuroraGrow'
import { RouteHead } from '../components/SEO/RouteHead'
import { META } from '../lib/seo'

export default function Home() {
  return (
    <>
      <RouteHead {...META['/']} />
      <VelvetStage>
        <TetrisGrid />
        <HeroAuroraGrow />
      </VelvetStage>
    </>
  )
}
