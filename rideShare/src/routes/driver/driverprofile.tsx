import Profiles from '@/components/Profiles'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/driver/driverprofile')({
  component: Profiles,
})

function RouteComponent() {
  return <div>Hello "/driver/driverprofile"!</div>
}
