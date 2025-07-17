import { Outlet, createRootRouteWithContext, useMatchRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import Header from '../components/Header'

import TanStackQueryLayout from '../integrations/tanstack-query/layout.tsx'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}


export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent
})

function RootComponent() {
   const matchRoute = useMatchRoute()

    const hideHeader =
    matchRoute({ to: '/dashboard', fuzzy: true }) ||
    matchRoute({ to: '/Vehicles', fuzzy: true })
  return (
    <>
      {!hideHeader && <Header />}

      <Outlet />
      {/* <TanStackRouterDevtools /> */}

      {/* <TanStackQueryLayout /> */}
    </>
  )
}