import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getVehiclesById } from '@/api/UserApi'
import type { Vehicle } from '@/types/alltypes'
import { Button } from '@/components/ui/button' // shadcn button
import { useState, useEffect, useMemo } from 'react'
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
import { Toaster } from 'sonner'


const toRad = (d: number) => (d * Math.PI) / 180
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371 // Earth radius (km)
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export const Route = createFileRoute('/Vehicles/$VehiclesId')({
  // beforeLoad: ({ location }) => {
  //   const { isVerified } = authStore.state
  //   if (!isVerified) {
  //     throw redirect({
  //       to: '/login',
  //       search: { redirect: location.href },
  //     })
  //   }
  // },
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

function RouteComponent() {
  const { VehiclesId } = useParams({ from: '/Vehicles/$VehiclesId' })
   const navigate = useNavigate()


  // Vehicle details -----------------------------------------------------------
  const {
    data: vehicle,
    isLoading: isVehicleLoading,
    error: vehicleError,
  } = useQuery<Vehicle>({
    queryKey: ['vehicle', VehiclesId],
    queryFn: () => getVehiclesById(VehiclesId),
    enabled: !!VehiclesId,
  })

  // Theme state

  // Locations pulled from localStorage ---------------------------------------
  const pickupCoords = getCoords('pickupCoords')
  const destCoords = getCoords('destinationCoords')
  const pickupAddress = localStorage.getItem('pickupAddress') || '—'
  const destAddress = localStorage.getItem('destinationAddress') || '—'

  const distanceKm =
    pickupCoords && destCoords ? haversineKm(...pickupCoords, ...destCoords) : 0

  // Date / Time --------------------------------------------------------------
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [timeBand, setTimeBand] = useState<
    'normal' | 'rush' | 'evening' | 'early'
  >('normal')

  const now = new Date()
  const todayStr = now.toISOString().split('T')[0]
  const currentTimeStr = now.toTimeString().slice(0, 5)
  const minTime = date === todayStr ? currentTimeStr : '00:00'

  // Cost calculations --------------------------------------------------------
  const timeBandFactor: Record<typeof timeBand, number> = {
    normal: 0.7,
    rush: 1.3,
    evening: 0.5,
    early: 0.5,
  }
  const baseRate = Number(vehicle?.rentalrate) ?? 0
  const adjustedRate = ((baseRate)/10) * timeBandFactor[timeBand]
  const baseCost = distanceKm * adjustedRate
  const serviceFee = 2
  const tipFee = baseCost * 0.05
  const totalCost = baseCost + serviceFee + tipFee

  // Loading / error ----------------------------------------------------------
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

  const handleBookNow = () => {
    localStorage.setItem('vehicleId', VehiclesId)
    localStorage.setItem('Amount', totalCost.toString())
    navigate({ to: '/payments' }) // navigate after saving
  }

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
                  type="date"
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
