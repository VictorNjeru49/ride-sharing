import Inbox from '@/components/inbox'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/inbox')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Inbox/>
  )
}
