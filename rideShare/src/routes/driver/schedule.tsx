import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getUserById } from '@/api/UserApi'
import { authStore } from '@/app/store'
import { format } from 'date-fns'
import { GridLoader } from 'react-spinners'

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

  const scheduleHistory = user?.driverLocations ?? []

  return (
    <section className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
          Schedule
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Plan your driving hours and availability.
        </p>
      </header>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Availability History
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                <th className="px-4 py-2 font-medium">Date</th>
                <th className="px-4 py-2 font-medium">Preferred Vehicle</th>
                <th className="px-4 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="text-center py-10">
                    <GridLoader color="#4F46E5" margin={1} size={12} />
                  </td>
                </tr>
              ) : scheduleHistory.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center py-6 text-gray-500 dark:text-gray-400"
                  >
                    No schedule history available.
                  </td>
                </tr>
              ) : (
                scheduleHistory.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-b dark:border-gray-700 last:border-b-0"
                  >
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                      {format(new Date(entry.requestedAt), 'dd MMM yyyy HH:mm')}
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                      {entry.preferredVehicleType || 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={entry.status} />
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

function StatusPill({ status }: { status?: string }) {
  const base = 'px-2 py-1 rounded-full text-xs font-semibold capitalize'
  switch (status) {
    case 'assigned':
      return (
        <span
          className={`${base} bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300`}
        >
          {status}
        </span>
      )
    case 'pending':
      return (
        <span
          className={`${base} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`}
        >
          {status}
        </span>
      )
    case 'cancelled':
      return (
        <span
          className={`${base} bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300`}
        >
          {status}
        </span>
      )
    default:
      return (
        <span
          className={`${base} bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300`}
        >
          {status || 'Unknown'}
        </span>
      )
  }
}
