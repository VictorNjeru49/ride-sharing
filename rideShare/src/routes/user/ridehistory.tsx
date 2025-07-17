import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { authStore } from '@/app/store'
import { getUserById } from '@/api/UserApi'
import { format } from 'date-fns'
import { UserRole, type Ride } from '@/types/alltypes'
import { PropagateLoader, RingLoader } from 'react-spinners'

export const Route = createFileRoute('/user/ridehistory')({
  component: RideHistoryPage,
})

function RideHistoryPage() {
  const userId = authStore.state.user?.id

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['user‑with‑rides', userId],
    queryFn: () => getUserById(userId!), // assumes this returns profiles + rides
    enabled: !!userId,
  })

  const ridesTaken: Ride[] = useMemo(() => {
    if (!user) return []
    const allRides =
      user.role === UserRole.RIDER
        ? (user.riderProfile?.ridesTaken ?? [])
        : user.role === UserRole.DRIVER
          ? (user.driverProfile?.ridesTaken ?? [])
          : []
    return allRides.filter((r) => r.pickupLocation && r.dropoffLocation)
  }, [user])

  const [filters, setFilters] = useState({
    rideStatus: 'All Rides', // Completed | Cancelled
    vehicleType: 'All Vehicle Types',
    date: '', // ISO yyyy‑MM‑dd
  })

  const onFilterChange =
    (key: keyof typeof filters) =>
    (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) =>
      setFilters((prev) => ({ ...prev, [key]: e.target.value }))

  const filteredRides = useMemo(() => {
    return ridesTaken.filter((r) => {
      if (filters.rideStatus !== 'All Rides' && r.status !== filters.rideStatus)
        return false
      if (
        filters.vehicleType !== 'All Vehicle Types' &&
        r.driver?.vehicle.vehicleType !== filters.vehicleType
      )
        return false
      if (
        filters.date &&
        format(new Date(r.createdAt), 'yyyy‑MM‑dd') !== filters.date
      )
        return false
      return true
    })
  }, [ridesTaken, filters])

  if (isLoading) {
    return (
      <div className=" w-fit text-center py-10 m-auto">
        <PropagateLoader color="#0026ff" size={20} />
      </div>
    )
  }
  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        Error loading ride history.
      </div>
    )
  }
  if (!filteredRides.length) {
    return (
      <div className="p-6 text-center text-gray-600">
        No rides match the current filters.
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Ride History</h1>
      <p className="text-gray-600">Track all your rides and transactions</p>

      {/* 🔎 Filter Controls */}
      <div className="flex gap-4 items-center flex-wrap">
        <select
          className="border px-3 py-2 rounded-md"
          value={filters.rideStatus}
          onChange={onFilterChange('rideStatus')}
        >
          <option>All Rides</option>
          <option>completed</option>
          <option>cancelled</option>
        </select>

        <select
          className="border px-3 py-2 rounded-md"
          value={filters.vehicleType}
          onChange={onFilterChange('vehicleType')}
        >
          <option>All Vehicle Types</option>
          <option>economy</option>
          <option>premium</option>
          <option>suv</option>
        </select>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <Input
            type="date"
            className="w-[160px]"
            value={filters.date}
            onChange={onFilterChange('date')}
          />
        </div>

        <Button
          variant="outline"
          onClick={() =>
            setFilters({
              rideStatus: 'All Rides',
              vehicleType: 'All Vehicle Types',
              date: '',
            })
          }
        >
          Reset
        </Button>
      </div>

      {/* 🛣️ Ride Cards */}
      {filteredRides.map((ride) => (
        <Card key={ride.id} className="shadow-sm border border-gray-200">
          <CardContent className="p-4 grid md:grid-cols-3 gap-4">
            {/* Column 1 – route & cancellation info */}
            <div className="space-y-1">
              <h2 className="font-semibold text-sm text-gray-800 capitalize">
                {ride.driver?.vehicle?.vehicleType ?? 'Ride'}
              </h2>
              <p className="text-xs text-gray-500">
                {format(new Date(ride.createdAt), 'PP - p')}
              </p>

              <div className="text-sm mt-2">
                <p>
                  <strong>From:</strong> {ride.pickupLocation?.address ?? '—'}
                </p>
                <p>
                  <strong>To:</strong> {ride.dropoffLocation?.address ?? '—'}
                </p>
              </div>

              {ride.status === 'cancelled' && ride.cancellation && (
                <p className="mt-2 text-sm text-red-500 bg-red-50 p-2 rounded-md">
                  {ride.cancellation.reason}
                </p>
              )}
            </div>

            {/* Column 2 – metrics */}
            <div className="text-sm space-y-1">
              <p>
                <strong>Distance:</strong> {ride.distanceKm ?? '—'} km
              </p>
              <p>
                <strong>Duration:</strong>{' '}
                {ride.endTime && ride.startTime
                  ? `${Math.round(
                      (new Date(ride.endTime).getTime() -
                        new Date(ride.startTime).getTime()) /
                        60000,
                    )} min`
                  : '—'}
              </p>
              <p>
                <strong>Driver:</strong>{' '}
                {ride.ratings?.length
                  ? ride.ratings.map((r) => r.rater.firstName).join(', ')
                  : '—'}
              </p>

              <p>
                <strong>Rating:</strong>{' '}
                {ride.driver &&
                Array.isArray(ride.driver.rating) &&
                ride.driver.rating.length > 0
                  ? Number(ride.driver.rating[0].score).toFixed(1)
                  : '—'}
              </p>
            </div>

            {/* Column 3 – pricing & status */}
            <div className="text-sm space-y-1 border-l pl-4">
              <p>
                <strong>Ride Fare:</strong> ${Number(ride.fare).toFixed(2)}
              </p>
              <p>
                <strong>Service Fee:</strong> $
                {Number(ride.fare * 0.1).toFixed(2)}
              </p>
              <p>
                <strong>Tip:</strong>{' '}
                {ride.payment && ride.payment.amount > ride.fare
                  ? `$${(ride.payment.amount - ride.fare).toFixed(2)}`
                  : '$0.00'}
              </p>
              <p>
                <strong>Total:</strong> $
                {(Number(ride.fare) * Number(ride.distanceKm)).toFixed(2) ??
                  '_'}
              </p>
              <p>
                <strong>Card:</strong> **** {ride.payment?.currency ?? '—'}
              </p>

              <p>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    ride.status === 'completed'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  {ride.status}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
