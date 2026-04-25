import type { RouteObject } from 'react-router'
import App from './App'
import Home from './pages/Home'
import About from './pages/About'

export const routes: RouteObject[] = [
  {
    path: '/',
    Component: App,
    children: [
      { index: true, Component: Home },
      { path: 'about', Component: About },
    ],
  },
]

export const PRERENDER_PATHS = ['/', '/about']
