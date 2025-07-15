import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getUserById } from '@/api/UserApi'
import { authStore } from '@/app/store'
import { format } from 'date-fns'
import { RingLoader } from 'react-spinners'

export const Route = createFileRoute('/driver/schedule')({
  component: RouteComponent,
})

function RouteComponent() {
  const userId = authStore.state.user?.id

  const { data: user, isLoading } = useQuery({
    queryKey: ['driver-schedule', userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId,
  })

  const scheduleHistory = user?.driverLocations || []

  return (
    <section className="p-6 bg-gray-50 min-h-screen space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">Schedule</h2>
        <p className="text-gray-600 mb-4">
          Plan your driving hours and availability.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Availability History
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm text-left">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="px-4 py-2 font-medium">Date</th>
                <th className="px-4 py-2 font-medium">Preferred Vehicle</th>
                <th className="px-4 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="text-center py-6 text-gray-500">
                    <div className=" w-fit text-center py-10 m-auto">
                      <RingLoader color="#0017ff" />
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : scheduleHistory.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-6 text-gray-500">
                    No schedule history available.
                  </td>
                </tr>
              ) : (
                scheduleHistory.map((entry) => (
                  <tr key={entry.id} className="border-b last:border-b-0">
                    <td className="px-4 py-2 text-gray-700">
                      {format(new Date(entry.requestedAt), 'dd MMM yyyy HH:mm')}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {entry.preferredVehicleType}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          entry.status === 'assigned'
                            ? 'bg-green-100 text-green-700'
                            : entry.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : entry.status === 'cancelled'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {entry.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
