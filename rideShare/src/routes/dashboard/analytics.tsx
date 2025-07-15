import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
  getUsers,
  getVehicles,
  getWallet,
  getUserPromoUsage,
  getSupportTicket,
  getRiderProfile,
  getRideRequests,
  getRideFeedbacks,
  getRideCancels,
  getRides,
  getRatings,
  getPromoCodes,
  getPayments,
  getNotifications,
  getLocations,
  getDriverProfiles,
  getDriverLocations,
  getDevices,
  getAdmins,
} from '@/api/UserApi'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts'
import { useMemo } from 'react'

export const Route = createFileRoute('/dashboard/analytics')({
  component: RouteComponent,
})

function RouteComponent() {
  const usersQuery = useQuery({ queryKey: ['users'], queryFn: getUsers })
  const vehiclesQuery = useQuery({
    queryKey: ['vehicles'],
    queryFn: getVehicles,
  })
  const walletsQuery = useQuery({ queryKey: ['wallets'], queryFn: getWallet })
  const paymentsQuery = useQuery({
    queryKey: ['payments'],
    queryFn: getPayments,
  })
  const ratingsQuery = useQuery({ queryKey: ['ratings'], queryFn: getRatings })
  const supportQuery = useQuery({
    queryKey: ['support'],
    queryFn: getSupportTicket,
  })
  const rideQuery = useQuery({ queryKey: ['rides'], queryFn: getRides })
  const UserPromoUsage = useQuery({
    queryKey: ['UserPromoUsage'],
    queryFn: getUserPromoUsage,
  })
  const RiderProfile = useQuery({
    queryKey: ['RiderProfile'],
    queryFn: getRiderProfile,
  })
  const RideRequests = useQuery({
    queryKey: ['RideRequests'],
    queryFn: getRideRequests,
  })
  const RideFeedbacks = useQuery({
    queryKey: ['RideFeedbacks'],
    queryFn: getRideFeedbacks,
  })
  const RideCancels = useQuery({
    queryKey: ['RideCancels'],
    queryFn: getRideCancels,
  })
  const PromoCodes = useQuery({
    queryKey: ['PromoCodes'],
    queryFn: getPromoCodes,
  })
  const Notifications = useQuery({
    queryKey: ['Notifications'],
    queryFn: getNotifications,
  })
  const Locations = useQuery({
    queryKey: ['Locations'],
    queryFn: getLocations,
  })
  const DriverProfiles = useQuery({
    queryKey: ['DriverProfiles'],
    queryFn: getDriverProfiles,
  })
  const DriverLocations = useQuery({
    queryKey: ['DriverLocations'],
    queryFn: getDriverLocations,
  })

  const Devices = useQuery({
    queryKey: ['Devices'],
    queryFn: getDevices,
  })
  const Admins = useQuery({
    queryKey: ['Admins'],
    queryFn: getAdmins,
  })

  const barData = useMemo(
    () => [
      { name: 'Users', count: usersQuery.data?.length || 0 },
      { name: 'Vehicles', count: vehiclesQuery.data?.length || 0 },
      { name: 'Rides', count: rideQuery.data?.length || 0 },
      { name: 'Support', count: supportQuery.data?.length || 0 },
      { name: 'UserPromoUsage', count: UserPromoUsage.data?.length || 0 },
      { name: 'RiderProfile', count: RiderProfile.data?.length || 0 },
      { name: 'RideRequests', count: RideRequests.data?.length || 0 },
      { name: 'RideFeedbacks', count: RideFeedbacks.data?.length || 0 },
      { name: 'RideCancels', count: RideCancels.data?.length || 0 },
      { name: 'PromoCodes', count: PromoCodes.data?.length || 0 },
      { name: 'Notifications', count: Notifications.data?.length || 0 },
      { name: 'Locations', count: Locations.data?.length || 0 },
      { name: 'DriverProfiles', count: DriverProfiles.data?.length || 0 },
      { name: 'DriverLocations', count: DriverLocations.data?.length || 0 },
      { name: 'Devices', count: Devices.data?.length || 0 },
      { name: 'Admins', count: Admins.data?.length || 0 },
    ],
    [usersQuery.data, vehiclesQuery.data, rideQuery.data, supportQuery.data],
  )

  const pieData = useMemo(
    () => [
      { name: 'Successful Payments', value: paymentsQuery.data?.length || 0 },
      { name: 'Wallets', value: walletsQuery.data?.length || 0 },
    ],
    [paymentsQuery.data, walletsQuery.data],
  )

  const lineData = useMemo(
    () =>
      ratingsQuery.data?.slice(0, 10).map((r, i) => ({
        name: `R${i + 1}`,
        score: r.score,
      })) || [],
    [ratingsQuery.data],
  )

  const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#0088FE']

  return (
    <div className="p-6 space-y-10 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>

      {/* Bar Chart */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">System Entities Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Finance Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {pieData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Ratings Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData}>
            <XAxis dataKey="name" />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#f97316"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
