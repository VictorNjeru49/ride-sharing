import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getUserById } from '@/api/UserApi'
import { authStore } from '@/app/store'
import {
  Car,
  DollarSign,
  Star,
  Clock,
  Phone,
  ArrowRightLeft,
} from 'lucide-react'
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { RingLoader } from 'react-spinners'

export const Route = createFileRoute('/driver/')({
  component: RouteComponent,
})

function RouteComponent() {
  const userId = authStore.state.user?.id

  const { data: user, isLoading } = useQuery({
    queryKey: ['driver', userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId,
  })

  /* ───── Derived metrics ───── */
  const displayName = user?.firstName || 'Alex'

  const todayEarnings = React.useMemo(() => {
    if (!Array.isArray(user?.walletTransactions)) return '125.50'
    const sum = user.walletTransactions.reduce(
      (acc, p) => acc + (Number(p.amount) || 0),
      0,
    )
    return sum.toFixed(2)
  }, [user])

  const totalTrips = user?.driverProfile?.ridesOffered?.length ?? 8
  const avgRating = React.useMemo(() => {
    const ratings = user?.driverProfile?.rating
    if (!Array.isArray(ratings) || ratings.length === 0) return '4.9'

    const numericRatings = ratings
      .map((r) => Number(r.rating))
      .filter((n) => !isNaN(n))
    const avg =
      numericRatings.reduce((acc, r) => acc + r, 0) / numericRatings.length
    return avg.toFixed(1)
  }, [user])


  if (isLoading) {
    return (
      <div className="py-10 text-center">
        <RingLoader color="#3b82f6" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-muted/50 min-h-screen">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-semibold">Welcome back, {displayName}!</h1>
        <p className="text-muted-foreground text-sm">
          Here’s your summary for today.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Today’s Earnings"
          value={`$${todayEarnings}`}
          icon={<DollarSign className="w-5 h-5" />}
          tone="success"
        />
        <StatCard
          label="Trips Completed"
          value={totalTrips}
          icon={<Car className="w-5 h-5" />}
          tone="info"
        />
        <StatCard
          label="Avg Rating"
          value={avgRating}
          icon={<Star className="w-5 h-5" />}
          tone="warning"
        />
        <StatCard
          label="Hours Online"
          value="5h 20m"
          icon={<Clock className="w-5 h-5" />}
          tone="secondary"
        />
      </div>

      {/* Current Ride */}
      <Card>
        <CardHeader>
          <CardTitle>Current Ride</CardTitle>
          <CardDescription>Downtown → Airport</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 md:flex-row md:justify-between md:items-center">
          <p className="text-sm text-muted-foreground">
            Passenger: Jane Doe • 12.4 mi • ETA: 10&nbsp;mins
          </p>
          <div className="flex gap-3">
            <Button variant="default" className="flex gap-1 items-center">
              Call Rider <Phone className="w-4 h-4" />
            </Button>
            <Button variant="secondary">Navigate</Button>
          </div>
        </CardContent>
      </Card>

      {/* Actions + Trips */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <ActionButton
              label="Start Trip"
              icon={<Car className="w-6 h-6" />}
              tone="info"
            />
            <ActionButton
              label="Trip History"
              icon={<ArrowRightLeft className="w-6 h-6" />}
              tone="warning"
            />
          </CardContent>
        </Card>

        {/* Recent trips */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Trips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <TripItem from="Mall" to="Office" amount="$12.50" />
            <TripItem from="Restaurant" to="Home" amount="$18.90" />
            <TripItem from="Park" to="Mall" amount="$9.75" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────── */

function StatCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string
  value: string | number
  icon: React.ReactNode
  tone: 'success' | 'info' | 'warning' | 'secondary'
}) {
  const colorMap = {
    success: 'text-green-600',
    info: 'text-blue-600',
    warning: 'text-yellow-600',
    secondary: 'text-indigo-600',
  } as const

  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-muted-foreground text-sm">{label}</p>
        <div
          className={cn(
            'text-xl font-bold flex items-center gap-2',
            colorMap[tone],
          )}
        >
          {icon} {value}
        </div>
      </CardContent>
    </Card>
  )
}

function ActionButton({
  label,
  icon,
  tone,
}: {
  label: string
  icon: React.ReactNode
  tone: 'info' | 'warning'
}) {
  const variant = tone === 'info' ? 'default' : 'secondary'
  return (
    <Button variant={variant} className="flex flex-col items-center gap-1 py-6">
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </Button>
  )
}

function TripItem({
  from,
  to,
  amount,
}: {
  from: string
  to: string
  amount: string
}) {
  return (
    <div className="flex justify-between">
      <span>
        {from} → {to}
      </span>
      <span>{amount}</span>
    </div>
  )
}

export default RouteComponent
