import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getRideRequests } from '@/api/UserApi'
import type { Riderequest } from '@/types/alltypes'

export const Route = createFileRoute('/driver/allrequest')({
  component: RouteComponent,
})

function RideCard({
  ride,
  action,
}: {
  ride: Riderequest
  action?: () => void
}) {
    console.log('rider', ride.rider)
  return (
    <Card className="mb-4">
      <CardContent className="space-y-2 p-4">
        <p>
          <strong>Status:</strong> {ride.status}
        </p>
        <p>
          <strong>Pickup:</strong> {ride.pickupLocation?.address}
        </p>
        <p>
          <strong>Dropoff:</strong> {ride.dropoffLocation?.address}
        </p>
        <p>
          <strong>Preferred Vehicle:</strong> {ride.preferredVehicleType}
        </p>
        <p>
          <strong>Requested At:</strong>{' '}
          {new Date(ride.requestedAt).toLocaleString()}
        </p>
        {ride.rider && (
          <p>
            <strong>Rider:</strong> {ride.rider.user?.firstName}{' '}
            {ride.rider.user?.lastName}
          </p>
        )}
        {ride.assignedDriver && (
          <p>
            <strong>Assigned Driver:</strong>{' '}
            {ride.assignedDriver.user?.firstName} {ride.assignedDriver.user?.lastName}
          </p>
        )}
        {!ride.assignedDriver && action && (
          <Button onClick={action}>Take Ride</Button>
        )}
      </CardContent>
    </Card>
  )
}

function RouteComponent() {
  const { data: rideRequests = [], isLoading } = useQuery({
    queryKey: ['rideRequests'],
    queryFn: getRideRequests,
  })

  const assigned = rideRequests.filter((r) => r.assignedDriver)
  const unassigned = rideRequests.filter((r) => !r.assignedDriver)

  if (isLoading) return <div>Loading ride requests...</div>

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-2">
          🚗 Unassigned Ride Requests
        </h2>
        {unassigned.length === 0 ? (
          <p className="text-muted-foreground">No unassigned rides</p>
        ) : (
          unassigned.map((ride) => (
            <RideCard
              key={ride.id}
              ride={ride}
              action={() => {
                // TODO: Hook up to mutation to take ride
                console.log('Take ride', ride.id)
              }}
            />
          ))
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">
          ✅ Assigned Ride Requests
        </h2>
        {assigned.length === 0 ? (
          <p className="text-muted-foreground">No assigned rides</p>
        ) : (
          assigned.map((ride) => <RideCard key={ride.id} ride={ride} />)
        )}
      </section>
    </div>
  )
}
