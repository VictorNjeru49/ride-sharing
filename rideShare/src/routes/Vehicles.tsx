import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/Vehicles')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Outlet />
    </>
  )
}
