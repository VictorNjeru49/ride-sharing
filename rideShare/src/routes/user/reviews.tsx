import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/reviews')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/user/reviews"!</div>
}
