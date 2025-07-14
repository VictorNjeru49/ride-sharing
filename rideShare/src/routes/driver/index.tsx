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

  const displayName = user?.firstName || 'Alex'

  const todayEarnings = (() => {
    if (!Array.isArray(user?.walletTransactions)) return '125.50'

    const sum = user.walletTransactions.reduce(
      (acc, p) => acc + (Number(p.amount) || 0),
      0,
    )

    return typeof sum === 'number' && !isNaN(sum) ? sum.toFixed(2) : '125.50'
  })()
  

    const totalTrips = user?.driverProfile?.ridesOffered?.length || 8

    const avgRating = user?.driverProfile?.rating || '4.9'
  

    if (isLoading) {
      return <div>Loading dashboard...</div>
    }
    
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome Back, {displayName}!
        </h1>
        <p className="text-gray-500 text-sm">Here’s your summary for today</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard
          label="Today’s Earnings"
          value={`$${todayEarnings}`}
          icon={<DollarSign className="w-5 h-5" />}
          color="green"
        />
        <SummaryCard
          label="Trips Completed"
          value={totalTrips}
          icon={<Car className="w-5 h-5" />}
          color="blue"
        />
        <SummaryCard
          label="Avg Rating"
          value={avgRating}
          icon={<Star className="w-5 h-5" />}
          color="yellow"
        />
        <SummaryCard
          label="Hours Online"
          value="5h 20m"
          icon={<Clock className="w-5 h-5" />}
          color="indigo"
        />
      </div>

      {/* Current Ride Section */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Current Ride</p>
            <h3 className="text-lg font-semibold text-gray-800">
              Downtown → Airport
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Passenger: Jane Doe • 12.4 mi • ETA: 10 mins
            </p>
          </div>
          <div className="flex gap-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">
              Call Rider <Phone className="inline-block w-4 h-4 ml-1" />
            </button>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
              Navigate
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions and Trip History */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <ActionButton
              icon={<Car className="w-6 h-6 mb-2" />}
              label="Start Trip"
              color="blue"
            />
            <ActionButton
              icon={<ArrowRightLeft className="w-6 h-6 mb-2" />}
              label="Trip History"
              color="yellow"
            />
          </div>
        </div>

        {/* Recent Trips */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Trips
          </h2>
          <ul className="space-y-3 text-sm text-gray-700">
            <TripItem from="Mall" to="Office" amount="$12.50" />
            <TripItem from="Restaurant" to="Home" amount="$18.90" />
            <TripItem from="Park" to="Mall" amount="$9.75" />
          </ul>
        </div>
      </div>
    </div>
  )
}

function SummaryCard({
  label,
  value,
  icon,
  color,
}: {
  label: string
  value: string | number
  icon: React.ReactNode
  color: string
}) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <p className="text-gray-500 text-sm">{label}</p>
      <div
        className={`text-xl font-bold text-${color}-600 flex items-center gap-2 mt-1`}
      >
        {icon}
        {value}
      </div>
    </div>
  )
}

function ActionButton({
  icon,
  label,
  color,
}: {
  icon: React.ReactNode
  label: string
  color: string
}) {
  return (
    <button
      className={`bg-${color}-100 text-${color}-700 font-medium p-4 rounded-xl flex flex-col items-center hover:bg-${color}-200`}
    >
      {icon}
      {label}
    </button>
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
    <li className="flex justify-between">
      <span>
        {from} → {to}
      </span>
      <span>{amount}</span>
    </li>
  )
}



