import { render } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router'
import { describe, it, expect } from 'vitest'
import { useContext } from 'react'
import App from '../App'
import { ChainContext } from '../lib/chain-context'

function ChainProbe() {
  const ctx = useContext(ChainContext)
  return <div data-testid="probe">{ctx ? 'has-provider' : 'no-provider'}</div>
}

describe('App ChainProvider integration', () => {
  it('wraps the route tree so child routes can read ChainContext', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          Component: App,
          children: [{ index: true, Component: ChainProbe }],
        },
      ],
      { initialEntries: ['/'] },
    )
    const { getByTestId } = render(<RouterProvider router={router} />)
    expect(getByTestId('probe')).toHaveTextContent('has-provider')
  })
})
