import Devices from '@/components/devices'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/devices')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Devices />
}
