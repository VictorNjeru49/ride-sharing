import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { authStore } from '@/app/store'
import { getUserById } from '@/api/UserApi'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'

export const Route = createFileRoute('/user/trips')({
  component: RouteComponent,
})

function RouteComponent() {
  const user = authStore.state.user
  const userId = user?.id

  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  })

  const riderTrips = userData?.riderProfile?.ridesTaken ?? []

  if (isLoading)
    return <div className="p-6 text-center">Loading your trips…</div>
  if (error)
    return <div className="p-6 text-red-500">Failed to load trips.</div>
  if (!riderTrips.length)
    return <div className="p-6 text-gray-500">No trips found.</div>

  return (
    <Card className="mx-auto my-10 w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Your Trips</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Pickup</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Fare</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {riderTrips.map((ride) => (
              <TableRow key={ride.id}>
                <TableCell>
                  {new Date(ride.startTime).toLocaleDateString()}
                </TableCell>
                <TableCell>{ride.pickupLocation?.address || '-'}</TableCell>
                <TableCell>{ride.dropoffLocation?.address || '-'}</TableCell>
                <TableCell className="capitalize">{ride.status}</TableCell>
                <TableCell>{Number(ride.fare).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
