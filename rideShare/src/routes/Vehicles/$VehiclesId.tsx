import { createFileRoute } from '@tanstack/react-router'
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

export const Route = createFileRoute('/Vehicles/$VehiclesId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { VehiclesId } = useParams({ from: '/Vehicles/$VehiclesId' })

  const {
    data: vehicle,
    isLoading,
    error,
  } = useQuery<Vehicle>({
    queryKey: ['vehicle', VehiclesId],
    queryFn: () => getVehiclesById(VehiclesId),
    enabled: !!VehiclesId,
  })

  // ✅ Always declare hooks before any conditional return
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const todayStr = `${yyyy}-${mm}-${dd}`

  const hh = String(now.getHours()).padStart(2, '0')
  const min = String(now.getMinutes()).padStart(2, '0')
  const currentTimeStr = `${hh}:${min}`

  const minTime = date === todayStr ? currentTimeStr : '00:00'

  // ✅ Safe to return conditionals now
  if (isLoading)
    return <div className="text-center py-10">Loading vehicle details...</div>
  if (error)
    return (
      <div className="text-center text-red-600 py-10">
        Error loading vehicle details.
      </div>
    )
  if (!vehicle)
    return <div className="text-center py-10">Vehicle not found.</div>
  const steps = [
    'Select a car to book for your ride',
    'Confirm your Location',
    'Confirm your payment',
    'Wait for a reply and pickup',
  ]
  
  return (
    <>
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
        {/* Vehicle Details */}
        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold text-gray-900">
            {vehicle.make} {vehicle.model}
          </h1>
          <img
            src={vehicle.vehicleImage}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-64 object-cover rounded-lg shadow-md"
          />
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

        {/* Booking Form */}
        <form className="space-y-5">
          <label
            htmlFor="pickup"
            className="block text-sm font-medium text-gray-700"
          >
            Pickup Address
          </label>
          <input
            type="text"
            id="pickup"
            placeholder="Enter pickup address"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 `}
          />

          <label
            htmlFor="destination"
            className="block text-sm font-medium text-gray-700"
          >
            Destination
          </label>
          <input
            type="text"
            id="destination"
            placeholder="Enter destination"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 `}
          />

<div className="flex gap-4">
      <div className="flex-1">
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
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
        <label htmlFor="time" className="block text-sm font-medium text-gray-700">
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

          <label
            htmlFor="duration"
            className="block text-sm font-medium text-gray-700"
          >
            Duration
          </label>
          <select
            id="duration"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 `}
          >
            <option>1 hour</option>
            <option>2 hours</option>
            <option>Half day</option>
            <option>Full day</option>
          </select>

          <label
            htmlFor="specialRequests"
            className="block text-sm font-medium text-gray-700"
          >
            Any special requests
          </label>
          <textarea
            id="specialRequests"
            placeholder="Any special requests..."
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 `}
            rows={4}
          />

          {/* Payment Method section already has a label */}
          {/* Add labels for card inputs as well */}

          <label
            htmlFor="cardNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Card Number
          </label>
          <input
            type="text"
            id="cardNumber"
            placeholder="Card Number"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 `}
          />

          <div className="flex gap-4">
            <div className="flex-1">
              <label
                htmlFor="expiry"
                className="block text-sm font-medium text-gray-700"
              >
                MM/YY
              </label>
              <input
                type="text"
                id="expiry"
                placeholder="MM/YY"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 `}
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="cvv"
                className="block text-sm font-medium text-gray-700"
              >
                CVV
              </label>
              <input
                type="text"
                id="cvv"
                placeholder="CVV"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 `}
              />
            </div>
          </div>

          <Button className="w-full mt-6 py-3 text-lg font-semibold">
            Book Now & Pay
          </Button>
        </form>
      </div>
    </>
  )
}
