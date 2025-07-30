import { Outlet, createRootRouteWithContext, useMatchRoute } from '@tanstack/react-router'

import Header from '../components/Header'


import type { QueryClient } from '@tanstack/react-query'
import { Chatbot } from '@/components/AI'

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
      <Chatbot/>
      {/* <TanStackRouterDevtools /> */}

      {/* <TanStackQueryLayout /> */}
    </>
  )
}