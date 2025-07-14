import { useCallback, useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Star } from 'lucide-react'
import { authStore } from '@/app/store'
import { useQuery } from '@tanstack/react-query'
import { getUserById } from '@/api/UserApi'
import MapDialog from '@/components/locations'

export const Route = createFileRoute('/user/')({
  component: RouteComponent,
})

function RouteComponent() {
  const userId = authStore.state.user?.id

  const [currentLocation, setCurrentLocation] = useState<
    [number, number] | null
  >(null)
  const [pickupLocation, setPickupLocation] = useState<[number, number] | null>(
    null,
  )
  const [destinationLocation, setDestinationLocation] = useState<
    [number, number] | null
  >(null)
  const [loadingLocation, setLoadingLocation] = useState(false)
  const [open, setOpen] = useState<boolean>(false)
  const [pickerMode, setPickerMode] = useState<'pickup' | 'destination'>(
    'pickup',
  )

  const { data: user, isLoading } = useQuery({
    queryKey: ['riders', userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId,
  })

  const fetchCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Your browser does not support geolocation.')
      return
    }
    setLoadingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ]
        setCurrentLocation(coords)
        if (!pickupLocation) setPickupLocation(coords)
        setLoadingLocation(false)
      },
      (err) => {
        console.error(err)
        setLoadingLocation(false)
      },
    )
  }, [pickupLocation])

  useEffect(() => {
    fetchCurrentLocation()
  }, [fetchCurrentLocation])

  if (isLoading) return <div>Loading dashboard...</div>

  const walletBalance = user?.walletBalance ?? 0
  const userName = user?.firstName ?? 'User'

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-2xl font-bold">{userName} Dashboard</div>

      {/* Location Picker Dialog */}
      <MapDialog
        open={open}
        onOpenChange={setOpen}
        mode={pickerMode}
        setCoords={
          pickerMode === 'pickup' ? setPickupLocation : setDestinationLocation
        }
        currentCoords={
          pickerMode === 'pickup' ? pickupLocation : destinationLocation
        }
      />

      {/* Book Ride Controls */}
      <div className="flex gap-3">
        <Button
          variant={pickerMode === 'pickup' ? 'default' : 'outline'}
          onClick={() => {
            setPickerMode('pickup')
            setOpen(true)
          }}
        >
          Pick Pickup
        </Button>
        <Button
          variant={pickerMode === 'destination' ? 'default' : 'outline'}
          onClick={() => {
            setPickerMode('destination')
            setOpen(true)
          }}
        >
          Pick Destination
        </Button>
        <Button onClick={fetchCurrentLocation} disabled={loadingLocation}>
          {loadingLocation ? 'Locating…' : 'Use My Location'}
        </Button>
      </div>

      {/* Selected Location Preview */}
      <div className="text-sm space-y-1">
        <p>
          <strong>Current:</strong>{' '}
          {currentLocation ? currentLocation.join(', ') : '—'}
        </p>
        <p>
          <strong>Pickup:</strong>{' '}
          {pickupLocation ? pickupLocation.join(', ') : '—'}
        </p>
        <p>
          <strong>Destination:</strong>{' '}
          {destinationLocation ? destinationLocation.join(', ') : '—'}
        </p>
      </div>

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
            <div className="text-xl font-bold text-green-600">
              ${walletBalance.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-sm text-gray-500">Your Rating</div>
            <div className="text-xl font-bold flex justify-center items-center gap-1">
              {user?.riderProfile?.rating ?? '4.8'}{' '}
              <Star className="w-4 h-4 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-sm text-gray-500">Monthly Savings</div>
            <div className="text-xl font-bold text-purple-600">
              ${walletBalance.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ride History and Actions */}
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

      {/* Current Ride Info */}
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
