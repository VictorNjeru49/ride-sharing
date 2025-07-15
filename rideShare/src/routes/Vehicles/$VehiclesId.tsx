import { createFileRoute, redirect } from '@tanstack/react-router'
import { useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getVehiclesById } from '@/api/UserApi'
import type { Vehicle } from '@/types/alltypes'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import { Button } from '@/components/ui/button' // shadcn button
import { useState } from 'react'
import { authStore } from '@/app/store'
import {RingLoader} from 'react-spinners'

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
    //  beforeLoad: ({ location }) => {
    //     const { isVerified } = authStore.state
    //     console.log('isVerfied', isVerified)
    //     if (!isVerified) {
    //       throw redirect({
    //         to: '/login',
    //         search: {
    //           redirect: location.href,
    //         },
    //       })
    //     }
    //   },
  component: RouteComponent,
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
  const adjustedRate = baseRate * timeBandFactor[timeBand]
  const baseCost = distanceKm * adjustedRate
  const serviceFee = 2
  const tipFee = baseCost * 0.05
  const totalCost = baseCost + serviceFee + tipFee

  // Loading / error ----------------------------------------------------------
  if (isVehicleLoading) return <div className=" w-fit text-center py-10 m-auto">
    <RingLoader color="#0017ff" />
    Loading...
  </div>
  if (vehicleError)
    return (
      <div className="text-center text-red-600 py-10">Error loading data.</div>
    )
  if (!vehicle)
    return <div className="text-center py-10">Vehicle not found.</div>

  return (
    <>
      {/* Stepper */}
      <Box sx={{ width: '100%' }} className="mb-8">
        <Stepper activeStep={1} alternativeLabel>
          {['Select car', 'Confirm Location', 'Payment', 'Pickup'].map((l) => (
            <Step key={l}>
              <StepLabel>{l}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <div className="grid lg:grid-cols-2 gap-12 px-6 max-w-6xl mx-auto">
        {/* Vehicle details */}
        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold text-gray-900">
            {vehicle.make} {vehicle.model}
          </h1>
          <div className="relative">
            <img
              src={vehicle.vehicleImage}
              alt={vehicle.model}
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
            <p className="absolute -bottom-5 w-full bg-blue-700 text-center text-white p-4 rounded-2xl">
              Ksh {vehicle.rentalrate} / km
            </p>
          </div>
          <ul className="mt-6 space-y-2 text-gray-700 text-base">
            <li>
              <strong>Plate:</strong> {vehicle.plateNumber}
            </li>
            <li>
              <strong>Color:</strong> {vehicle.color}
            </li>
            <li>
              <strong>Capacity:</strong> {vehicle.capacity} persons
            </li>
            <li>
              <strong>Year:</strong> {vehicle.year}
            </li>
            <li>
              <strong>Type:</strong> {vehicle.vehicleType}
            </li>
          </ul>
        </div>

        {/* Booking summary & controls */}
        <form className="space-y-5">
          {/* Show stored addresses */}
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <strong>Pickup:</strong> {pickupAddress}
            </p>
            <p>
              <strong>Destination:</strong> {destAddress}
            </p>
          </div>

          {/* Time band */}
          <label
            htmlFor="timeband"
            className="block text-sm font-medium text-gray-700"
          >
            Time of Day
          </label>
          <select
            id="timeband"
            value={timeBand}
            onChange={(e) => setTimeBand(e.target.value as any)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="normal">Normal Hours (−30%)</option>
            <option value="rush">Rush Hours (+30%)</option>
            <option value="evening">Evening (−50%)</option>
            <option value="early">Early Morning (−50%)</option>
          </select>

          {/* Date & time */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700"
              >
                Date
              </label>
              <input
                type="date"
                id="date"
                min={todayStr}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="time"
                className="block text-sm font-medium text-gray-700"
              >
                Time
              </label>
              <input
                type="time"
                id="time"
                min={minTime}
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Cost breakdown */}
          <div className="mt-6 space-y-2 text-sm text-gray-700">
            <p>
              <strong>Distance:</strong>{' '}
              {distanceKm ? `${distanceKm.toFixed(2)} km` : 'Unavailable'}
            </p>
            <p>
              <strong>Service Fee:</strong> Ksh {serviceFee.toFixed(2)}
            </p>
            <p>
              <strong>Tip (5%):</strong> Ksh {tipFee.toFixed(2)}
            </p>
            <p>
              <strong>Total Cost:</strong>{' '}
              <span className="font-semibold text-blue-800">
                Ksh {totalCost.toFixed(2)}
              </span>
            </p>
          </div>

          <Button
            type="button"
            className="w-full py-3 text-lg font-semibold"
            disabled={!pickupCoords || !destCoords || distanceKm === 0}
          >
            Book Now & Pay
          </Button>
        </form>
      </div>
    </>
  )
}

export default RouteComponent
