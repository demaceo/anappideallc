import { render } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router'
import { describe, it, expect } from 'vitest'
import { useContext } from 'react'
import App from '../App'
import { MaterialContext } from '../lib/material-context'

/**
 * Probe component that renders a marker when MaterialContext is present.
 * Mounted as a child route of App so the test exercises App's actual
 * provider tree — proving MaterialProvider is wired, not just that App
 * doesn't throw.
 */
function ContextProbe() {
  const ctx = useContext(MaterialContext)
  return (
    <div data-testid="probe">{ctx ? 'has-provider' : 'no-provider'}</div>
  )
}

describe('App MaterialProvider integration', () => {
  it('wraps the route tree so child routes can read MaterialContext', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          Component: App,
          children: [{ index: true, Component: ContextProbe }],
        },
      ],
      { initialEntries: ['/'] },
    )
    const { getByTestId } = render(<RouterProvider router={router} />)
    expect(getByTestId('probe')).toHaveTextContent('has-provider')
  })
})
