import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Star } from 'lucide-react'

export const Route = createFileRoute('/user/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-2xl font-bold">Dashboard</div>

      {/* Book Your Next Ride */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
        <div className="text-lg font-semibold mb-4">Book Your Next Ride</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <Input
            placeholder="Current location"
            className="bg-white text-black placeholder:text-gray-500"
          />
          <Input
            placeholder="Where to?"
            className="bg-white text-black placeholder:text-gray-500"
          />
          <Button className="bg-white text-blue-600 font-semibold">
            Find Rides
          </Button>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-sm text-gray-500">Total Rides</div>
            <div className="text-xl font-bold">247</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-sm text-gray-500">Wallet Balance</div>
            <div className="text-xl font-bold text-green-600">$125.50</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-sm text-gray-500">Your Rating</div>
            <div className="text-xl font-bold flex justify-center items-center gap-1">
              4.8 <Star className="w-4 h-4 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-sm text-gray-500">Monthly Savings</div>
            <div className="text-xl font-bold text-purple-600">$89.20</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Rides & Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="font-semibold mb-2">Recent Rides</div>
            <ul className="space-y-2 text-sm">
              <li className="bg-gray-100 p-2 rounded-md flex justify-between">
                <span>Downtown to Airport</span>
                <span className="text-gray-500">$24.50</span>
              </li>
              <li className="bg-gray-100 p-2 rounded-md flex justify-between">
                <span>Home to Office</span>
                <span className="text-gray-500">$12.30</span>
              </li>
              <li className="bg-gray-100 p-2 rounded-md flex justify-between">
                <span>Mall to Restaurant</span>
                <span className="text-gray-500">$8.75</span>
              </li>
            </ul>
            <div className="mt-2 text-right text-sm text-blue-600 font-medium cursor-pointer hover:underline">
              View All Rides
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="font-semibold mb-2">Quick Actions</div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Button variant="secondary">Add Money</Button>
              <Button variant="secondary">Repeat Ride</Button>
              <Button variant="secondary">Schedule Ride</Button>
              <Button variant="secondary">Refer Friend</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Ride Status */}
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Driver"
            className="w-12 h-12 rounded-full"
          />
          <div className="text-sm">
            <p className="font-medium">Michael Rodriguez</p>
            <p className="text-gray-500">Toyota Camry · ABC-123</p>
            <p className="text-yellow-600 text-xs font-semibold">
              ⭐ 4.9 · Arriving in 3 mins
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RouteComponent
