import Inbox from '@/components/inbox'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/driver/inbox')({
  component: Inbox,
})

function RouteComponent() {
  return <div>Hello "/driver/inbox"!</div>
}
