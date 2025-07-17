import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getUserById } from '@/api/UserApi'
import { authStore } from '@/app/store'
import { formatDistanceToNow } from 'date-fns'
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

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
    <section className="p-6 min-h-screen bg-muted/50 dark:bg-gray-900 space-y-6">
      <header>
        <h2 className="text-2xl font-semibold">Ride Requests</h2>
        <p className="text-muted-foreground text-sm">
          Manage and respond to ride requests from users.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Assigned Ride Requests</CardTitle>
          <CardDescription>Newest first</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <Skeleton className="w-full h-40" />
          ) : requests.length === 0 ? (
            <p className="text-muted-foreground p-6">
              No ride requests assigned yet.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {requests.map((req) => (
                <li key={req.id} className="p-4 hover:bg-muted/40">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1 text-sm">
                      <p className="font-medium">
                        Pickup location unknown → Dropoff location unknown
                      </p>
                      <p className="text-muted-foreground">
                        Requested{' '}
                        {req.requestedAt
                          ? formatDistanceToNow(new Date(req.requestedAt), {
                              addSuffix: true,
                            })
                          : '—'}
                      </p>
                      <p className="text-muted-foreground">
                        Preferred Vehicle: {req.preferredVehicleType ?? 'N/A'}
                      </p>
                    </div>
                    <StatusPill status={req.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </section>
  )
}

function StatusPill({ status }: { status?: string }) {
  const map: Record<string, string> = {
    pending:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    accepted:
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  }
  const cls = map[status ?? 'pending'] || map.pending
  return (
    <span
      className={`text-xs font-semibold capitalize px-3 py-1 rounded-full ${cls}`}
    >
      {status ?? 'unknown'}
    </span>
  )
}

export default RouteComponent
