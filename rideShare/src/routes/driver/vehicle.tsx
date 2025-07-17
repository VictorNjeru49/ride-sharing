import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getUserById } from '@/api/UserApi'
import { authStore } from '@/app/store'
import { PuffLoader } from 'react-spinners'

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
    <section className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen space-y-6">
      <header>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Vehicle Details
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          View and update your vehicle information.
        </p>
      </header>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Current Vehicle
          </h3>
        </div>

        {isLoading ? (
          <div className="w-fit text-center py-10 m-auto">
            <PuffLoader color="#3b82f6" size={40} />
            <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">
              Loading...
            </p>
          </div>
        ) : !vehicle ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-6">
            No vehicle data found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 text-gray-700 dark:text-gray-200">
              <Detail label="Make" value={vehicle.make} />
              <Detail label="Model" value={vehicle.model} />
              <Detail label="Year" value={vehicle.year} />
              <Detail label="Plate Number" value={vehicle.plateNumber} />
              <Detail label="Type" value={vehicle.vehicleType} />
              <Detail label="Capacity" value={`${vehicle.capacity} seats`} />
              <Detail label="Color" value={vehicle.color} />
            </div>
            <div className="flex justify-center">
              <img
                src={vehicle.vehicleImage}
                alt="Vehicle"
                className="rounded-xl w-full max-w-sm object-cover border border-gray-200 dark:border-gray-700"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function Detail({ label, value }: { label: string; value: string | number }) {
  return (
    <p>
      <span className="font-medium">{label}:</span> {value}
    </p>
  )
}
