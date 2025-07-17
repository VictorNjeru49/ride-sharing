import { createFileRoute, Outlet } from '@tanstack/react-router'




export const Route = createFileRoute('/chatbot')({
  component: RouteComponent,
})

function RouteComponent() {
 return (
  <Outlet/>
 )
}