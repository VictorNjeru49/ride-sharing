import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/user/ridehistory')({
  component: RideHistoryPage,
})

function RideHistoryPage() {
  const [filters, setFilters] = useState({
    rideType: 'All Rides',
    vehicleType: 'All Vehicle Types',
    date: '',
  })

  const rideData = [
    {
      type: 'Premium Ride',
      date: 'Dec 15, 2024 - 2:30 PM',
      from: 'Downtown Office Plaza',
      to: 'Central Airport Terminal',
      distance: '12.4 mi',
      duration: '28 min',
      driver: 'Michael R.',
      rating: '4.9',
      status: 'Completed',
      fare: '$24.50',
      fee: '$2.45',
      tip: '$5.00',
      total: '$31.95',
      card: '**** 4532',
    },
    {
      type: 'Economy Ride',
      date: 'Dec 12, 2024 - 8:15 AM',
      from: 'Home',
      to: 'City Mall',
      distance: '5.2 mi',
      duration: '18 min',
      driver: 'Sarah K.',
      rating: '5.0',
      status: 'Completed',
      fare: '$12.80',
      fee: '$1.28',
      tip: '$2.50',
      total: '$16.58',
      card: '**** 4532',
    },
    {
      type: 'SUV Ride',
      date: 'Dec 10, 2024 - 6:45 PM',
      from: 'Restaurant District',
      to: 'Concert Hall',
      distance: '—',
      duration: '—',
      driver: '—',
      rating: '—',
      status: 'Cancelled',
      fare: '$0.00',
      fee: '—',
      tip: '—',
      total: '$0.00',
      card: '—',
      reason:
        'Driver was unable to reach pickup location due to traffic conditions.',
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Ride History</h1>
      <p className="text-gray-600">Track all your rides and transactions</p>

      {/* Filter Controls */}
      <div className="flex gap-4 items-center flex-wrap">
        <select className="border px-3 py-2 rounded-md">
          <option>All Rides</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
        <select className="border px-3 py-2 rounded-md">
          <option>All Vehicle Types</option>
          <option>Economy</option>
          <option>Premium</option>
          <option>SUV</option>
        </select>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <Input type="date" className="w-[160px]" />
        </div>
        <Button>Apply Filters</Button>
      </div>

      {/* Ride Cards */}
      {rideData.map((ride, index) => (
        <Card key={index} className="shadow-sm border border-gray-200">
          <CardContent className="p-4 grid md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <h2 className="font-semibold text-sm text-gray-800">
                {ride.type}
              </h2>
              <p className="text-xs text-gray-500">{ride.date}</p>
              <div className="text-sm mt-2">
                <p>
                  <strong>From:</strong> {ride.from}
                </p>
                <p>
                  <strong>To:</strong> {ride.to}
                </p>
              </div>
              {ride.status === 'Cancelled' && (
                <p className="mt-2 text-sm text-red-500 bg-red-50 p-2 rounded-md">
                  {ride.reason}
                </p>
              )}
            </div>

            <div className="text-sm space-y-1">
              <p>
                <strong>Distance:</strong> {ride.distance}
              </p>
              <p>
                <strong>Duration:</strong> {ride.duration}
              </p>
              <p>
                <strong>Driver:</strong> {ride.driver}
              </p>
              <p>
                <strong>Rating:</strong> {ride.rating}
              </p>
            </div>

            <div className="text-sm space-y-1 border-l pl-4">
              <p>
                <strong>Ride Fare:</strong> {ride.fare}
              </p>
              <p>
                <strong>Service Fee:</strong> {ride.fee}
              </p>
              <p>
                <strong>Tip:</strong> {ride.tip}
              </p>
              <p>
                <strong>Total:</strong> {ride.total}
              </p>
              <p>
                <strong>Card:</strong> {ride.card}
              </p>
              <p>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${ride.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
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
