import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getUserById } from '@/api/UserApi'
import { authStore } from '@/app/store'
import { Car, MapPin, Clock, DollarSign } from 'lucide-react'
import { RingLoader } from 'react-spinners'

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

  const displayName = user?.firstName || 'Alex'

  // Safely get ridesOffered array
  const trips = user?.driverProfile?.ridesOffered ?? []

  return (
    <section className="p-6 min-h-screen bg-gray-50">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        {displayName} Trips
      </h2>
      <p className="text-gray-600 mb-6">
        View and manage all your past and upcoming rides.
      </p>

      {isLoading ? (
        <div className=" w-fit text-center py-10 m-auto">
          <RingLoader color="#0017ff" />
          Loading...
        </div>
      ) : trips.length === 0 ? (
        <p className="text-gray-500">No trips found.</p>
      ) : (
        <div className="grid gap-4">
          {trips.map((trip) => {
            // Extract pickup and dropoff addresses safely
            const pickupAddresses =
              trip.dropoffLocation?.requestsPickup
                ?.map((pickup) => pickup?.pickupLocation?.address ?? '')
                .filter(Boolean) ?? []

            const dropoffAddresses =
              trip.dropoffLocation?.requestsDropoff
                ?.map((dropoff) => dropoff?.dropoffLocation?.address ?? '')
                .filter(Boolean) ?? []

            // Calculate duration in minutes if startTime and endTime exist
            let durationMinutes: number | null = null
            if (trip.startTime && trip.endTime) {
              const start = new Date(trip.startTime).getTime()
              const end = new Date(trip.endTime).getTime()
              durationMinutes = Math.max(0, Math.round((end - start) / 60000))
            }

            return (
              <div
                key={trip.id}
                className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div>
                  <div className="text-sm text-gray-500 mb-1">
                    Trip ID: {trip.id}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    {pickupAddresses.join(', ') ||
                      'Pickup location unknown'} →{' '}
                    {dropoffAddresses.join(', ') || 'Dropoff location unknown'}
                  </h3>

                  <p className="text-gray-500 text-sm mt-1">
                    Distance: {trip.distanceKm ?? 'N/A'} km
                  </p>

                  {/* New fields */}
                  <p className="text-gray-500 text-sm mt-1">
                    Start Location:{' '}
                    {trip.pickupLocation?.address ?? 'Not specified'}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    End Location:{' '}
                    {trip?.dropoffLocation?.address ?? 'Not specified'}
                  </p>
                  {durationMinutes !== null && (
                    <p className="text-gray-500 text-sm mt-1">
                      Duration: {durationMinutes} minute
                      {durationMinutes !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-start md:items-end gap-1">
                  <div className="text-green-600 font-bold text-base flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />$
                    {Number(trip.fare ?? 0).toFixed(2)}
                  </div>
                  <div className="text-gray-500 text-sm flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {trip.startTime
                      ? new Date(trip.startTime).toLocaleString()
                      : 'Start time unknown'}
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full mt-1 ${
                      trip.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : trip.status === 'cancelled'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {trip.status
                      ? trip.status.charAt(0).toUpperCase() +
                        trip.status.slice(1)
                      : 'Unknown status'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
