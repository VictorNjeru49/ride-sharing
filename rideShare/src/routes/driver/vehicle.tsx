import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getUserById } from '@/api/UserApi'
import { authStore } from '@/app/store'
import { Car } from 'lucide-react'

export const Route = createFileRoute('/driver/vehicle')({
  component: RouteComponent,
})

function RouteComponent() {
  const userId = authStore.state.user?.id

  const { data: user, isLoading } = useQuery({
    queryKey: ['driver-vehicle', userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId,
  })

  const vehicle = user?.driverProfile?.vehicle

  return (
    <section className="p-6 bg-gray-50 min-h-screen space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">
          Vehicle Details
        </h2>
        <p className="text-gray-600 mb-4">
          View and update your vehicle information.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Current Vehicle
          </h3>
        </div>

        {isLoading ? (
          <div className="text-center text-gray-500 py-6">
            Loading vehicle details...
          </div>
        ) : !vehicle ? (
          <div className="text-center text-gray-500 py-6">
            No vehicle data found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p>
                <span className="font-medium text-gray-700">Make:</span>{' '}
                {vehicle.make}
              </p>
              <p>
                <span className="font-medium text-gray-700">Model:</span>{' '}
                {vehicle.model}
              </p>
              <p>
                <span className="font-medium text-gray-700">Year:</span>{' '}
                {vehicle.year}
              </p>
              <p>
                <span className="font-medium text-gray-700">Plate Number:</span>{' '}
                {vehicle.plateNumber}
              </p>
              <p>
                <span className="font-medium text-gray-700">Type:</span>{' '}
                {vehicle.vehicleType}
              </p>
              <p>
                <span className="font-medium text-gray-700">Capacity:</span>{' '}
                {vehicle.capacity} seats
              </p>
              <p>
                <span className="font-medium text-gray-700">Color:</span>{' '}
                {vehicle.color}
              </p>
            </div>
            <div className="flex justify-center">
              <img
                src={vehicle.vehicleImage}
                alt="Vehicle"
                className="rounded-xl w-full max-w-sm object-cover border border-gray-200"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
