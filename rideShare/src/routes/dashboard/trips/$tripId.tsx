import React from 'react'
import { createFileRoute, useParams, useRouter } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getRides, getRideCancelById } from '@/api/UserApi'
import type { Ride } from '@/types/alltypes'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export const Route = createFileRoute('/dashboard/trips/$tripId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { tripId } = useParams({from: '/dashboard/trips/$tripId'})
  const router = useRouter()

  // Fetch the ride detail by filtering from all rides or call API for single ride (assuming getRides returns all)
  // Ideally, you would have a getRideById API, but here we filter from getRides for demo.
  const {
    data: rides,
    isLoading,
    error,
  } = useQuery<Ride[]>({
    queryKey: ['rides'],
    queryFn: () => getRides(),
  })

  const ride = rides?.find((r) => r.id === tripId)

  // Close dialog: navigate back to trips list
  const handleClose = () => {
    router.navigate({ to: '/dashboard/trips' })
  }

  if (isLoading)
    return (
      <div className="flex items-center justify-center p-10 text-gray-500">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading trip…
      </div>
    )
  if (error || !ride)
    return (
      <div className="p-6 text-center text-red-500">
        Error loading trip or trip not found.
        <Button className="mt-4" onClick={handleClose}>
          Back to Trips
        </Button>
      </div>
    )

  return (
    <Dialog open onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Trip Details - {ride.id.slice(0, 8)}…</DialogTitle>
          <DialogDescription>
            Detailed information about this trip.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4 text-sm">
          <p>
            <strong>Rider:</strong>{' '}
            {ride.rider?.user
              ? `${ride.rider.user.firstName} ${ride.rider.user.lastName}`
              : 'Unknown Rider'}
          </p>
          <p>
            <strong>Driver:</strong>{' '}
            {ride.driver?.user
              ? `${ride.driver.user.firstName} ${ride.driver.user.lastName}`
              : 'No Driver Assigned'}
          </p>
          <p>
            <strong>Pickup Location:</strong>{' '}
            {ride.pickupLocation?.address ?? 'N/A'}
          </p>
          <p>
            <strong>Dropoff Location:</strong>{' '}
            {ride.dropoffLocation?.address ?? 'N/A'}
          </p>
          <p>
            <strong>Date:</strong> {new Date(ride.startTime).toLocaleString()}
          </p>
          <p>
            <strong>Status:</strong> {ride.status}
          </p>
          <p>
            <strong>Fare:</strong> ${ride.fare.toFixed(2)}
          </p>

          {ride.cancellation && (
            <div className="p-2 bg-red-50 border border-red-200 rounded">
              <strong>Cancellation Reason:</strong> {ride.cancellation.reason}
              <br />
              <strong>Cancelled By:</strong> {ride.cancellation.cancelledBy}
              <br />
              <strong>Cancelled At:</strong>{' '}
              {new Date(ride.cancellation.cancelledAt).toLocaleString()}
            </div>
          )}

          {/* Add more fields as needed, e.g. payment, ratings, feedback */}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default RouteComponent
