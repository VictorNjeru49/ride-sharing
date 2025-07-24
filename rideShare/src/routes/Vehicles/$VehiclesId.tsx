import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { isLoggedIn } from '@/app/authPersistence'
import {
  createLocation,
  createRide,
  createRideRequest,
  getLocationById,
  getRiderProfileById,
  getUserById,
  getVehiclesById,
} from '@/api/UserApi'
import {
  type Ride,
  type Riderequest,
  type Vehicle,
} from '@/types/alltypes'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { authStore } from '@/app/store'
import { RingLoader } from 'react-spinners'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Sun, Moon, CarTaxiFrontIcon } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { toast, Toaster } from 'sonner'

const toRad = (d: number) => (d * Math.PI) / 180
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export const Route = createFileRoute('/Vehicles/$VehiclesId')({
  //  beforeLoad: ({ location }) => {
  //     const { isVerified } = authStore.state
  //     console.log('isVerfied', isVerified)
  //     console.log('user logged‑in?', isLoggedIn())
  //     if (!isVerified || !isLoggedIn()) {
  //       throw redirect({
  //         to: '/login',
  //         search: {
  //           redirect: location.href,
  //         },
  //       })
  //     }
  //   },
  component: RouteComponentWrapper,
})

function getCoords(key: string): [number, number] | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as [number, number]) : null
  } catch {
    return null
  }
}

export interface RideInput {
  rider: string
  pickupLocation: string
  dropoffLocation: string
  fare: number
  status: string
  distanceKm: number
  startTime: Date
  endTime: Date
  vehicle: string
}

interface RiderequestInput {
  rider: string // rider ID
  pickupLocation: string // location ID
  dropoffLocation: string // location ID
  status: string
  preferredVehicleType: string
}

// export const createRides = async (rideData: RideInput): Promise<Ride> => {
//   const response = await axios.post(`${API_BASE_URL}/ride`, rideData)
//   return response.data
// }

function RouteComponent() {
  const { VehiclesId } = useParams({ from: '/Vehicles/$VehiclesId' })
  const navigate = useNavigate()

  const {
    data: vehicle,
    isLoading: isVehicleLoading,
    error: vehicleError,
  } = useQuery<Vehicle>({
    queryKey: ['vehicle', VehiclesId],
    queryFn: () => getVehiclesById(VehiclesId),
    enabled: !!VehiclesId,
  })

  const userId = authStore.state.user.id
  console.log('user', userId)

  const {
    data: riderProfile,
    isLoading: isRiderLoading,
    error: riderError,
  } = useQuery({
    queryKey: ['riderProfile', userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  })
  console.log('riderProfile', riderProfile?.riderProfile)

  const pickupCoords = getCoords('pickupCoords')
  const destCoords = getCoords('destinationCoords')
  const pickupAddress = localStorage.getItem('pickupAddress') || '—'
  const destAddress = localStorage.getItem('destinationAddress') || '—'

  const distanceKm =
    pickupCoords && destCoords ? haversineKm(...pickupCoords, ...destCoords) : 0

  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [timeBand, setTimeBand] = useState<
    'normal' | 'rush' | 'evening' | 'early'
  >('normal')

  const now = new Date()
  const todayStr = now.toISOString().split('T')[0]
  const currentTimeStr = now.toTimeString().slice(0, 5)
  const minTime = date === todayStr ? currentTimeStr : '00:00'

  const timeBandFactor: Record<typeof timeBand, number> = {
    normal: 0.7,
    rush: 1.3,
    evening: 0.5,
    early: 0.5,
  }
  const baseRate = Number(vehicle?.rentalrate) ?? 0
  const adjustedRate = (baseRate / 10) * timeBandFactor[timeBand]
  const baseCost = distanceKm * adjustedRate
  const serviceFee = 2
  const tipFee = baseCost * 0.05
  const totalCost = baseCost + serviceFee + tipFee

  if (isVehicleLoading)
    return (
      <div className="w-fit text-center py-10 m-auto">
        <RingLoader color="#0017ff" />
        Loading...
      </div>
    )
  if (vehicleError)
    return (
      <div className="text-center text-red-600 py-10">Error loading data.</div>
    )
  if (!vehicle)
    return <div className="text-center py-10">Vehicle not found.</div>

  const handleBookNow = async () => {
    if (
      !pickupCoords ||
      !destCoords ||
      distanceKm === 0 ||
      !authStore.state.user ||
      !date ||
      !time
    ) {
      return toast.error('Missing location, user or time data.')
    }

    try {
      const rider = await getUserById(userId)
      if (!rider?.id) {
        return toast.error('User profile not found')
      }

      const riderProfile = rider.riderProfile?.id
      if (!riderProfile) {
        return toast.error('Rider profile not found')
      }
      const pickupLocation = await createLocation({
        address: pickupAddress,
        latitude: pickupCoords[0],
        longitude: pickupCoords[1],
      })

      const dropoffLocation = await createLocation({
        address: destAddress,
        latitude: destCoords[0],
        longitude: destCoords[1],
      })

      const isoDateTime = new Date(`${date}`)
      const fullRiderProfile = await getRiderProfileById(riderProfile)
      const fullPickupLocation = await getLocationById(pickupLocation.id)
      const fullDropoffLocation = await getLocationById(dropoffLocation.id)
       const fullVehicle = await getVehiclesById(VehiclesId)

      const ride: Partial<Ride> = {
        rider: fullRiderProfile,
        pickupLocation: pickupLocation,
        dropoffLocation: dropoffLocation,
        fare: totalCost,
        distanceKm,
        status: 'schedule',
        startTime: isoDateTime,
        endTime: new Date(isoDateTime.getTime() + 30 * 60 * 1000),
      }
      const fullRide = await createRide(ride)
      console.log('ride', fullRide)

      const rideRequestData: Partial<Riderequest> = {
        rider: fullRiderProfile,
        pickupLocation: fullPickupLocation,
        dropoffLocation: fullDropoffLocation,
        status: 'waiting',
        preferredVehicleType: vehicle.vehicleType,
        requestedAt: ride.startTime,
      }

      const riderequest = await createRideRequest(rideRequestData)

      console.log('Ride Request', riderequest)

      localStorage.setItem('vehicleId', VehiclesId)
      localStorage.setItem('Amount', totalCost.toString())
      localStorage.setItem('rideId', fullRide.id)
      localStorage.setItem('RIde', JSON.stringify(fullRide))
      localStorage.setItem('vehicle', JSON.stringify(vehicle))

      navigate({ to: '/payments' })
    } catch (error) {
      toast.error('Failed to create ride or locations.')
      console.error(error)
    }
  }

  if (isRiderLoading) return <div>Loading rider profile...</div>
  if (riderError || !riderProfile)
    return <div>Error loading rider profile.</div>

  return (
    <>
      <Toaster />

      {/* ───────────────────── Header ───────────────────── */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 border-b bg-white/80 backdrop-blur dark:bg-gray-900/80">
        <Link
          to="/Vehicles"
          className="flex items-center gap-2 text-lg font-bold text-blue-600"
        >
          <CarTaxiFrontIcon className="h-6 w-6" />
          Vehicles
        </Link>

        <h1 className="text-base md:text-xl font-semibold text-gray-900 dark:text-gray-100">
          {vehicle.make} {vehicle.model}
        </h1>

        {/* Theme toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline">
              <Sun className="h-5 w-5 dark:hidden" />
              <Moon className="h-5 w-5 hidden dark:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Light</DropdownMenuItem>
            <DropdownMenuItem>Dark</DropdownMenuItem>
            <DropdownMenuItem>System</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* ───────────────────── Main Grid ───────────────────── */}
      <div className="mx-auto max-w-6xl px-4 pb-10 grid lg:grid-cols-[2fr_1fr] gap-10">
        {/* Vehicle card */}
        <section className="space-y-6">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">
            {vehicle.make} {vehicle.model}
          </h2>

          <div className="relative">
            <img
              src={vehicle.vehicleImage}
              alt={vehicle.model}
              className="w-full h-80 object-cover rounded-xl shadow-lg"
            />
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 rounded-full shadow">
              Ksh {vehicle.rentalrate} / km
            </div>
          </div>

          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <li>
              <strong className="font-extrabold text-xm">Plate:</strong>{' '}
              {vehicle.plateNumber}
            </li>
            <li>
              <strong className="font-extrabold text-xm">Color:</strong>{' '}
              {vehicle.color}
            </li>
            <li>
              <strong className="font-extrabold text-xm">Capacity:</strong>{' '}
              {vehicle.capacity}
            </li>
            <li>
              <strong className="font-extrabold text-xm">Year:</strong>{' '}
              {vehicle.year}
            </li>
            <li>
              <strong className="font-extrabold text-xm">Type:</strong>{' '}
              {vehicle.vehicleType}
            </li>
          </ul>
        </section>

        {/* Sticky sidebar (booking) */}
        <aside className="lg:sticky lg:top-20 space-y-6">
          <div className="rounded-xl border bg-white dark:bg-gray-800 shadow-sm p-6 space-y-6">
            {/* Locations */}
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p>
                <strong className="font-extrabold ">Pickup:</strong> <br />{' '}
                {pickupAddress}
              </p>
              <p>
                <strong className="font-extrabold ">Destination:</strong> <br />{' '}
                {destAddress}
              </p>
            </div>

            {/* Time band */}
            <div className="space-y-1">
              <label htmlFor="timeband" className="text-sm font-medium">
                Time&nbsp;of&nbsp;Day
              </label>
              <select
                id="timeband"
                value={timeBand}
                onChange={(e) => setTimeBand(e.target.value as any)}
                className="w-full rounded-md border px-3 py-2 dark:bg-gray-700"
              >
                <option value="normal">Normal (−30%)</option>
                <option value="rush">Rush (+30%)</option>
                <option value="evening">Evening (−50%)</option>
                <option value="early">Early Morning (−50%)</option>
              </select>
            </div>

            {/* Date / time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="text-sm font-medium">
                  Date
                </label>
                <input
                  id="date"
                  type="datetime-local"
                  min={todayStr}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-md border px-3 py-2 dark:bg-gray-700"
                />
              </div>
              <div>
                <label htmlFor="time" className="text-sm font-medium">
                  Time
                </label>
                <input
                  id="time"
                  type="time"
                  min={minTime}
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-md border px-3 py-2 dark:bg-gray-700"
                />
              </div>
            </div>

            {/* Cost */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              <p className="py-1 flex justify-between">
                <span>Distance</span>
                <span>{distanceKm ? distanceKm.toFixed(2) : '—'} km</span>
              </p>
              <p className="py-1 flex justify-between">
                <span>Service Fee</span>
                <span>Ksh {serviceFee.toFixed(2)}</span>
              </p>
              <p className="py-1 flex justify-between">
                <span>Tip (5%)</span>
                <span>Ksh {tipFee.toFixed(2)}</span>
              </p>
              <p className="pt-2 flex justify-between font-semibold text-base">
                <span>Total</span>
                <span className="text-blue-700 dark:text-blue-400">
                  Ksh {totalCost.toFixed(2)}
                </span>
              </p>
            </div>
            <Button
              onClick={handleBookNow}
              className="w-full py-3 text-lg font-semibold"
              disabled={!pickupCoords || !destCoords || distanceKm === 0}
            >
              Book Now & Pay
            </Button>
          </div>
        </aside>
      </div>
    </>
  )
}

// Wrapper to add ThemeToggle outside main RouteComponent
function RouteComponentWrapper() {
  return <RouteComponent />
}

export default RouteComponentWrapper
