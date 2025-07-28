import Profiles from '@/components/Profiles'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/driver/driverprofile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Profiles />
}
