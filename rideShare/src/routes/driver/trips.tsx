import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getUserById } from '@/api/UserApi'
import { authStore } from '@/app/store'
import { MapPin, Clock, DollarSign } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/driver/trips')({
  component: RouteComponent,
})

function RouteComponent() {
  const userId = authStore.state.user?.id

  const { data: user, isLoading } = useQuery({
    queryKey: ['driver-trips', userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId,
  })

  const displayName = user?.firstName ?? 'Alex'
  const trips = user?.driverProfile?.ridesOffered ?? []

  return (
    <section className="p-6 min-h-screen bg-muted/50 dark:bg-gray-900 space-y-6">
      <header>
        <h2 className="text-2xl font-semibold">{displayName} Trips</h2>
        <p className="text-muted-foreground text-sm">
          View and manage past & upcoming rides.
        </p>
      </header>

      {isLoading ? (
        <Skeleton className="w-full h-40" />
      ) : trips.length === 0 ? (
        <p className="text-muted-foreground">No trips found.</p>
      ) : (
        <div className="grid gap-4">
          {trips.map((trip) => {
            const pickup =
              trip.dropoffLocation?.requestsPickup
                ?.map((p) => p?.pickupLocation?.address)
                .filter(Boolean) || []
            const dropoff =
              trip.dropoffLocation?.requestsDropoff
                ?.map((d) => d?.dropoffLocation?.address)
                .filter(Boolean) || []

            const durationMin = (() => {
              if (!trip.startTime || !trip.endTime) return null
              const diff =
                new Date(trip.endTime).getTime() -
                new Date(trip.startTime).getTime()
              return Math.max(0, Math.round(diff / 60000))
            })()

            return (
              <Card key={trip.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    {pickup.join(', ') || 'Pickup unknown'} →{' '}
                    {dropoff.join(', ') || 'Dropoff unknown'}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Trip ID: {trip.id}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row md:justify-between gap-4">
                  <div className="space-y-1 text-sm">
                    <p>Distance: {trip.distanceKm ?? 'N/A'} km</p>
                    <p>
                      Start: {trip.pickupLocation?.address ?? 'Not specified'}
                    </p>
                    <p>
                      End: {trip.dropoffLocation?.address ?? 'Not specified'}
                    </p>
                    {durationMin !== null && <p>Duration: {durationMin} min</p>}
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-1">
                    <span className="text-green-600 dark:text-green-400 font-semibold flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />{' '}
                      {Number(trip.fare ?? 0).toFixed(2)}
                    </span>
                    <span className="text-muted-foreground text-sm flex items-center gap-1">
                      <Clock className="w-4 h-4" />{' '}
                      {trip.startTime
                        ? new Date(trip.startTime).toLocaleString()
                        : 'Unknown'}
                    </span>
                    <StatusPill status={trip.status} />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </section>
  )
}

function StatusPill({ status }: { status?: string }) {
  const map: Record<string, string> = {
    completed:
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    cancelled: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300',
    pending:
      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  }
  const cls = map[status ?? 'pending'] || map['pending']
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${cls}`}>
      {status ?? 'Unknown'}
    </span>
  )
}

export default RouteComponent
