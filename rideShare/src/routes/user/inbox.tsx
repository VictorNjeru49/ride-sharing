import Inbox from '@/components/inbox'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/inbox')({
  component: Inbox,
})

function RouteComponent() {
  return <div>Hello "/user/inbox"!</div>
}
