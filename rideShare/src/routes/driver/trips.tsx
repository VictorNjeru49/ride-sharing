import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getUserById } from '@/api/UserApi'
import { authStore } from '@/app/store'
import { Car, MapPin, Clock, DollarSign } from 'lucide-react'

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

  const trips = user?.ridesOffered || []

  return (
    <section className="p-6 min-h-screen bg-gray-50">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">My Trips</h2>
      <p className="text-gray-600 mb-6">
        View and manage all your past and upcoming rides.
      </p>

      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : trips.length === 0 ? (
        <p className="text-gray-500">No trips found.</p>
      ) : (
        <div className="grid gap-4">
          {trips.map((trip) => (
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
                  {trip.pickupLocation?.address} →{' '}
                  {trip.dropoffLocation?.address}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Distance: {trip.distanceKm} km
                </p>
              </div>
              <div className="flex flex-col items-start md:items-end gap-1">
                <div className="text-green-600 font-bold text-base flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />${trip.fare.toFixed(2)}
                </div>
                <div className="text-gray-500 text-sm flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(trip.startTime).toLocaleString()}
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
                  {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
