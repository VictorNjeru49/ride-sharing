import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getUserById } from '@/api/UserApi'
import { authStore } from '@/app/store'
import { DollarSign } from 'lucide-react'
import { format } from 'date-fns'
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/driver/earnings')({
  component: RouteComponent,
})

function RouteComponent() {
  const userId = authStore.state.user?.id

  const { data: user, isLoading } = useQuery({
    queryKey: ['driver-earnings', userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId,
  })

  const displayName = user?.firstName ?? 'Alex'
  const earnings = user?.payments ?? []
  const total = earnings.reduce((acc, p) => acc + p.amount, 0)

  return (
    <section className="p-6 min-h-screen bg-muted/50 dark:bg-gray-900 space-y-6">
      <header>
        <h2 className="text-2xl font-semibold">{displayName} Earnings</h2>
        <p className="text-muted-foreground text-sm">
          Track your daily, weekly & monthly earnings.
        </p>
      </header>

      {/* Total */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Total Earnings</CardTitle>
          <CardDescription className="text-green-600 dark:text-green-400 flex items-center gap-1 font-semibold">
            <DollarSign className="w-5 h-5" /> {Number(total).toFixed(2)}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Earnings History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <Skeleton className="w-full h-40" />
          ) : earnings.length === 0 ? (
            <p className="text-muted-foreground p-6">
              No earnings data available.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {['Date', 'Amount', 'Method', 'Status'].map((h) => (
                      <TableHead key={h}>{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {earnings.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        {format(new Date(p.paidAt), 'dd MMM yyyy')}
                      </TableCell>
                      <TableCell className="text-green-600 dark:text-green-400 font-medium">
                        ${Number(p.amount).toFixed(2)}
                      </TableCell>
                      <TableCell className="capitalize">
                        {p.method.replace('_', ' ')}
                      </TableCell>
                      <TableCell>
                        <StatusPill status={p.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}

function StatusPill({ status }: { status?: string }) {
  const map: Record<string, string> = {
    completed:
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    pending:
      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  }
  const cls = map[status ?? 'pending'] || map.pending
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${cls}`}>
      {status ?? 'pending'}
    </span>
  )
}

export default RouteComponent
