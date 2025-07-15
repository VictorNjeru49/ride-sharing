import { useCallback, useEffect, useState } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Star } from 'lucide-react'
import { authStore } from '@/app/store'
import { useQuery } from '@tanstack/react-query'
import { getUserById } from '@/api/UserApi'
import MapDialog from '@/components/locations'

export const Route = createFileRoute('/user/')({
  component: RouteComponent,
})

// -----------------------------------------------------------
// Helpers
// -----------------------------------------------------------
const toRad = (d: number) => (d * Math.PI) / 180
function haversineKm(
  [lat1, lon1]: [number, number],
  [lat2, lon2]: [number, number],
) {
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// Persist helpers ------------------------------------------------------------
function saveCoords(
  key: 'pickupCoords' | 'destinationCoords',
  coords: [number, number],
) {
  localStorage.setItem(key, JSON.stringify(coords))
}

function RouteComponent() {
  const router = useRouter()
  const userId = authStore.state.user?.id

  // -------------------------------------------------------------------------
  // Location states
  // -------------------------------------------------------------------------
  const [currentLocation, setCurrentLocation] = useState<
    [number, number] | null
  >(null)
  const [pickupLocation, setPickupLocation] = useState<[number, number] | null>(
    () => {
      try {
        const raw = localStorage.getItem('pickupCoords')
        return raw ? (JSON.parse(raw) as [number, number]) : null
      } catch {
        return null
      }
    },
  )
  const [destinationLocation, setDestinationLocation] = useState<
    [number, number] | null
  >(() => {
    try {
      const raw = localStorage.getItem('destinationCoords')
      return raw ? (JSON.parse(raw) as [number, number]) : null
    } catch {
      return null
    }
  })

  const [currentAddress, setCurrentAddress] = useState('')
  const [pickupAddress, setPickupAddress] = useState(
    localStorage.getItem('pickupAddress') || '',
  )
  const [destinationAddress, setDestinationAddress] = useState(
    localStorage.getItem('destinationAddress') || '',
  )

  const [loadingLocation, setLoadingLocation] = useState(false)
  const [open, setOpen] = useState(false)
  const [pickerMode, setPickerMode] = useState<'pickup' | 'destination'>(
    'pickup',
  )

  // -------------------------------------------------------------------------
  // Reverse‑geocode helper
  // -------------------------------------------------------------------------
  async function fetchAddress(lat: number, lon: number): Promise<string> {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
      )
      const data = await res.json()
      return data.display_name || ''
    } catch {
      return ''
    }
  }

  // -------------------------------------------------------------------------
  // Query user info
  // -------------------------------------------------------------------------
  const { data: user, isLoading } = useQuery({
    queryKey: ['riders', userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId,
  })

  // -------------------------------------------------------------------------
  // Geolocation fetch
  // -------------------------------------------------------------------------
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
        setLoadingLocation(false)
        // If no pickup set yet, default it
        if (!pickupLocation) {
          setPickupLocation(coords)
          saveCoords('pickupCoords', coords)
        }
      },
      () => setLoadingLocation(false),
    )
  }, [pickupLocation])

  // Auto‑locate on mount
  useEffect(() => {
    fetchCurrentLocation()
  }, [fetchCurrentLocation])

  // -------------------------------------------------------------------------
  // Store coords + addresses whenever they change
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (pickupLocation) saveCoords('pickupCoords', pickupLocation)
  }, [pickupLocation])
  useEffect(() => {
    if (destinationLocation)
      saveCoords('destinationCoords', destinationLocation)
  }, [destinationLocation])

  useEffect(() => {
    localStorage.setItem('pickupAddress', pickupAddress)
  }, [pickupAddress])
  useEffect(() => {
    localStorage.setItem('destinationAddress', destinationAddress)
  }, [destinationAddress])

  // -------------------------------------------------------------------------
  // Reverse‑geocode when coords change
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (currentLocation)
      fetchAddress(...currentLocation).then(setCurrentAddress)
  }, [currentLocation])
  useEffect(() => {
    if (pickupLocation) fetchAddress(...pickupLocation).then(setPickupAddress)
  }, [pickupLocation])
  useEffect(() => {
    if (destinationLocation)
      fetchAddress(...destinationLocation).then(setDestinationAddress)
  }, [destinationLocation])

  // -------------------------------------------------------------------------
  // Distance calculation and persistence
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (pickupLocation && destinationLocation) {
      const km = haversineKm(pickupLocation, destinationLocation)
      localStorage.setItem('distanceKm', km.toString())
    }
  }, [pickupLocation, destinationLocation])

  // -------------------------------------------------------------------------
  // Navigation helper
  // -------------------------------------------------------------------------
  const goToVehicles = () => router.navigate({ to: '/Vehicles' })

  // -------------------------------------------------------------------------
  // Loading guard
  // -------------------------------------------------------------------------
  if (isLoading) return <div>Loading dashboard…</div>

  const walletBalance = Number(user?.walletBalance ?? 0)
  const userName = user?.firstName ?? 'User'

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold">{userName} Dashboard</h1>

      {/* MapDialog */}
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

      {/* Book ride hero */}
      <Card
        className="overflow-hidden rounded-xl border-0 shadow-lg"
        style={{
          background:
            'linear-gradient(135deg,#2d6ef8 0%,#5560ff 40%,#8d3dff 100%)',
        }}
      >
        <CardContent className="p-6 md:p-8 space-y-6">
          <h2 className="text-white text-2xl font-semibold">
            Book Your Next Ride
          </h2>
          <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] items-end">
            {/* From */}
            <div className="space-y-1">
              <label className="text-white text-sm">From</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-green-400" />
                <input
                  readOnly
                  onClick={() => {
                    setPickerMode('pickup')
                    setOpen(true)
                  }}
                  value={pickupAddress || currentAddress}
                  placeholder="Current location"
                  className="w-full rounded-md bg-white/20 px-8 py-2 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
            </div>
            {/* To */}
            <div className="space-y-1">
              <label className="text-white text-sm">To</label>
              <div className="relative">
                <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-orange-400" />
                <input
                  readOnly
                  onClick={() => {
                    setPickerMode('destination')
                    setOpen(true)
                  }}
                  value={destinationAddress}
                  placeholder="Where to?"
                  className="w-full rounded-md bg-white/20 px-8 py-2 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
            </div>
            {/* CTA */}
            <Button
              className="mt-4 md:mt-6 bg-white text-blue-600 font-semibold hover:bg-gray-100"
              disabled={!pickupLocation || !destinationLocation}
              onClick={goToVehicles}
            >
              Find Rides
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-500">Total Rides</p>
            <p className="text-xl font-bold">247</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-500">Wallet Balance</p>
            <p className="text-xl font-bold text-green-600">
              ${walletBalance.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-500">Your Rating</p>
            <p className="text-xl font-bold flex justify-center items-center gap-1">
              {user?.riderProfile?.rating ?? '4.8'}{' '}
              <Star className="w-4 h-4 text-yellow-400" />
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-500">Monthly Savings</p>
            <p className="text-xl font-bold text-purple-600">
              ${walletBalance.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default RouteComponent
