import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/driver/support')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/driver/support"!</div>
}
