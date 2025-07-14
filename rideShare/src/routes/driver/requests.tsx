import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getUserById } from '@/api/UserApi'
import { authStore } from '@/app/store'
import { formatDistanceToNow } from 'date-fns'

export const Route = createFileRoute('/driver/requests')({
  component: RouteComponent,
})

function RouteComponent() {
  const userId = authStore.state.user?.id

  const { data: user, isLoading } = useQuery({
    queryKey: ['driver-requests', userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId,
  })

  const requests = user?.driverProfile?.assignedRequests ?? []

  return (
    <section className="p-6 bg-gray-50 min-h-screen space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">
          Ride Requests
        </h2>
        <p className="text-gray-600 mb-4">
          Manage and respond to ride requests from users.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Assigned Ride Requests
        </h3>

        {isLoading ? (
          <p className="text-gray-500">Loading ride requests...</p>
        ) : requests.length === 0 ? (
          <p className="text-gray-500">No ride requests assigned yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {requests.map((req) => (
              <li key={req.id} className="py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">
                      Pickup location unknown → Dropoff location unknown
                    </p>
                    <p className="text-sm text-gray-600">
                      Requested{' '}
                      {req.requestedAt
                        ? formatDistanceToNow(new Date(req.requestedAt), {
                            addSuffix: true,
                          })
                        : 'unknown time'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Preferred Vehicle: {req.preferredVehicleType ?? 'N/A'}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                      req.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : req.status === 'accepted'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {req.status ?? 'unknown'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
