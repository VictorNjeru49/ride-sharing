import { createFileRoute } from '@tanstack/react-router'
import Profiles from '@/components/Profiles'

export const Route = createFileRoute('/dashboard/adminprofile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Profiles />
}
