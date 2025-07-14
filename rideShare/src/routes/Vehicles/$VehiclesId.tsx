import { createFileRoute } from '@tanstack/react-router'
import { useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getVehiclesById, getLocations } from '@/api/UserApi'
import type { Vehicle, Location } from '@/types/alltypes'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import { Button } from '@/components/ui/button' // shadcn button
import { useEffect, useMemo, useState } from 'react'

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
  component: RouteComponent,
})


function RouteComponent() {
  const { VehiclesId } = useParams({ from: '/Vehicles/$VehiclesId' })

  // ---------------------------------------------------------------------------
  // Vehicle details
  // ---------------------------------------------------------------------------
  const {
    data: vehicle,
    isLoading: isVehicleLoading,
    error: vehicleError,
  } = useQuery<Vehicle>({
    queryKey: ['vehicle', VehiclesId],
    queryFn: () => getVehiclesById(VehiclesId),
    enabled: !!VehiclesId,
  })

  // ---------------------------------------------------------------------------
  // Locations list
  // ---------------------------------------------------------------------------
  const {
    data: locationsData,
    isLoading: isLocLoading,
    error: locError,
  } = useQuery<Location[]>({
    queryKey: ['locations'],
    queryFn: () => getLocations(),
  })

  // Always work with an array for rendering / calculations
  const locationOptions: Location[] = locationsData ?? []

  // ---------------------------------------------------------------------------
  // Date & time state
  // ---------------------------------------------------------------------------
  const [date, setDate] = useState<string>('')
  const [time, setTime] = useState<string>('')

  const now = new Date()
  const todayStr = now.toISOString().split('T')[0]
  const currentTimeStr = now.toTimeString().slice(0, 5)
  const minTime = date === todayStr ? currentTimeStr : '00:00'

  // ---------------------------------------------------------------------------
  // Pickup / destination selections (persisted)
  // ---------------------------------------------------------------------------
  const [pickupId, setPickupId] = useState<string>(
    () => localStorage.getItem('pickupLocationId') || '',
  )
  const [destId, setDestId] = useState<string>(
    () => localStorage.getItem('destinationLocationId') || '',
  )

  useEffect(() => {
    pickupId
      ? localStorage.setItem('pickupLocationId', pickupId)
      : localStorage.removeItem('pickupLocationId')
  }, [pickupId])
  useEffect(() => {
    destId
      ? localStorage.setItem('destinationLocationId', destId)
      : localStorage.removeItem('destinationLocationId')
  }, [destId])

  // ---------------------------------------------------------------------------
  // Distance calculation
  // ---------------------------------------------------------------------------
  const distanceKm = useMemo(() => {
    const p = locationOptions.find((l) => l.id === pickupId)
    const d = locationOptions.find((l) => l.id === destId)
    if (!p || !d) return 0
    return haversineKm(p.latitude, p.longitude, d.latitude, d.longitude)
  }, [locationOptions, pickupId, destId])

  // ---------------------------------------------------------------------------
  // Loading & error handling
  // ---------------------------------------------------------------------------
  if (isVehicleLoading || isLocLoading)
    return <div className="text-center py-10">Loading details…</div>
  if (vehicleError || locError)
    return (
      <div className="text-center text-red-600 py-10">
        Error loading data. Please try again.
      </div>
    )
  if (!vehicle)
    return <div className="text-center py-10">Vehicle not found.</div>

  // ---------------------------------------------------------------------------
  // UI constants
  // ---------------------------------------------------------------------------
  const steps = [
    'Select a car to book for your ride',
    'Confirm your Location',
    'Confirm your payment',
    'Wait for a reply and pickup',
  ]

  return (
    <>
      {/* Step indicator */}
      <Box sx={{ width: '100%' }} className="mb-8">
        <Stepper activeStep={1} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <div className="grid lg:grid-cols-2 gap-12 px-6 max-w-6xl mx-auto">
        {/* Vehicle card */}
        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold text-gray-900">
            {vehicle.make} {vehicle.model}
          </h1>
          <div className="relative">
            <img
              src={vehicle.vehicleImage}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
            <p className="absolute -bottom-5 text-center bg-blue-700 w-full p-4 text-white rounded-2xl">
              {' '}
              {vehicle.rentalrate}
            </p>
          </div>
          <ul className="mt-4 space-y-3 text-gray-700 text-base">
            <li>
              <strong className="font-semibold">Plate Number:</strong>{' '}
              {vehicle.plateNumber}
            </li>
            <li>
              <strong className="font-semibold">Color:</strong> {vehicle.color}
            </li>
            <li>
              <strong className="font-semibold">Capacity:</strong>{' '}
              {vehicle.capacity} persons
            </li>
            <li>
              <strong className="font-semibold">Year:</strong> {vehicle.year}
            </li>
            <li>
              <strong className="font-semibold">Type:</strong>{' '}
              {vehicle.vehicleType}
            </li>
          </ul>
        </div>

        {/* Booking form */}
        <form className="space-y-5">
          {/* Pickup */}
          <label
            htmlFor="pickup"
            className="block text-sm font-medium text-gray-700"
          >
            Pickup Address
          </label>
          <select
            id="pickup"
            value={pickupId}
            onChange={(e) => setPickupId(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select pickup location…</option>
            {locationOptions.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.address}
              </option>
            ))}
          </select>

          {/* Destination */}
          <label
            htmlFor="destination"
            className="block text-sm font-medium text-gray-700"
          >
            Destination
          </label>
          <select
            id="destination"
            value={destId}
            onChange={(e) => setDestId(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select destination…</option>
            {locationOptions.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.address}
              </option>
            ))}
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

          {/* Duration */}
          <label
            htmlFor="duration"
            className="block text-sm font-medium text-gray-700"
          >
            Duration
          </label>
          <select
            id="duration"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>1 hour</option>
            <option>2 hours</option>
            <option>Half day</option>
            <option>Full day</option>
          </select>

          {/* Special requests */}
          <label
            htmlFor="specialRequests"
            className="block text-sm font-medium text-gray-700"
          >
            Any special requests
          </label>
          <textarea
            id="specialRequests"
            placeholder="Any special requests…"
            rows={4}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Trip summary */}
          <div className="mt-6 space-y-3 text-sm text-gray-700">
            <p>
              <strong>Distance Covered:</strong>{' '}
              {distanceKm ? `${distanceKm.toFixed(2)} km` : 'N/A'}
            </p>
          </div>


          <div className="mt-6 space-y-3 text-sm text-gray-700">
            <strong>Service Fees</strong>
            {}
          </div>

          <div className="mt-6 space-y-3 text-sm text-gray-700">
            <strong>Tip Fees</strong>
            {}
          </div>
          <div className="mt-6 space-y-3 text-sm text-gray-700">
            <strong>Total Cost:</strong>
            {}
          </div>
          <Button
            type="button"
            className="w-full mt-6 py-3 text-lg font-semibold"
            disabled={!pickupId || !destId || distanceKm === 0}
          >
            Book Now & Pay
          </Button>
        </form>
      </div>
    </>
  )
}

export default RouteComponent
