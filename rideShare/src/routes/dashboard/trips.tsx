import Trips from '@/components/Trips'
import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/dashboard/trips')({
  component: Trips,
})


function RouteComponent() {

}


