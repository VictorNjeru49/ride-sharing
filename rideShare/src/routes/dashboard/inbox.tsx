import Inbox from '@/components/inbox'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/inbox')({
  component: Inbox,
})

function RouteComponent() {
  return <div>Hello "/dashboard/inbox"!</div>
}
