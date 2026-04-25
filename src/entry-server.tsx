import { renderToString } from 'react-dom/server'
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from 'react-router'
import { routes } from './routes'

export async function render(url: string): Promise<string> {
  const handler = createStaticHandler(routes)
  const request = new Request(`http://localhost${url}`)
  const context = await handler.query(request)
  if (context instanceof Response) {
    throw new Error(`Unexpected redirect for ${url}: ${context.status}`)
  }
  const staticRouter = createStaticRouter(handler.dataRoutes, context)
  return renderToString(
    <StaticRouterProvider router={staticRouter} context={context} />,
  )
}
