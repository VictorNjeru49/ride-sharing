import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  getRideRequests,
  getUserById,
  updateRide,
  updateRideRequest,
} from '@/api/UserApi'
import type { Ride, Riderequest } from '@/types/alltypes'
import { authStore } from '@/app/store'
import { toast } from 'sonner'

export const Route = createFileRoute('/requests')({
  component: RequestsPage,
})

function RideCard({
  ride,
  onTakeRide,
}: {
  ride: Riderequest
  onTakeRide?: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  const latestPayment = ride.rider?.user?.payments?.[0]

  return (
    <>
      <Card className="mb-4">
        <CardContent className="space-y-2 p-4">
          <div className="relative">
            <p>
              <strong>Status:</strong> {ride.status}
            </p>
            <p>
              <strong>Pickup:</strong> {ride.pickupLocation?.address}
            </p>
            <p>
              <strong>Dropoff:</strong> {ride.dropoffLocation?.address}
            </p>
            <p className="absolute top-5 right-5 font-semibold">
              {latestPayment ? (
                <span className="text-green-600">{latestPayment.status}</span>
              ) : (
                <span className="text-gray-500">No payment info</span>
              )}
            </p>
          </div>

          <div className="flex space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsOpen(true)}>
              Preview
            </Button>
            {!ride.assignedDriver && onTakeRide && (
              <Button onClick={onTakeRide}>Take Ride</Button>
            )}
          </div>
        </CardContent>
      </Card>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4">Ride Details</h3>
            <div className="space-y-2">
              <p>
                <strong>Status:</strong> {ride.status}
              </p>
              <p>
                <strong>Pickup:</strong> {ride.pickupLocation?.address}
              </p>
              <p>
                <strong>Dropoff:</strong> {ride.dropoffLocation?.address}
              </p>
              <p>
                <strong>Vehicle:</strong> {ride.preferredVehicleType}
              </p>
              <p>
                <strong>Requested:</strong>{' '}
                {new Date(ride.requestedAt).toLocaleString()}
              </p>
              <p>
                <strong>Rider:</strong> {ride.rider?.user?.firstName}{' '}
                {ride.rider?.user?.lastName}
              </p>
              {ride.assignedDriver && (
                <p>
                  <strong>Driver:</strong> {ride.assignedDriver.user?.firstName}{' '}
                  {ride.assignedDriver.user?.lastName}
                </p>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="ghost" onClick={() => setIsOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function RequestsPage() {
  const queryClient = useQueryClient()
  const userId = authStore.state.user.id

  const { data: rideRequests = [], isLoading: loadingRequests } = useQuery({
    queryKey: ['rideRequests'],
    queryFn: getRideRequests,
  })

  const { data: driver, isLoading: loadingDriver } = useQuery({
    queryKey: ['driver', userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  })

  const updateRideRequestMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: Partial<Riderequest>
    }) => updateRideRequest(id, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['rideRequests'] }),
  })

  const updateRideMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Ride> }) =>
      updateRide(id, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['rideRequests'] }),
    onError: (error) => console.error('Update ride failed:', error),
  })

  const driverProfile = driver?.driverProfile

  useEffect(() => {
    if (driverProfile) {
      localStorage.setItem('driverProfile', JSON.stringify(driverProfile))
    }
  }, [driverProfile])

  const stored = localStorage.getItem('driverProfile')
  const resolvedDriver = driverProfile || (stored ? JSON.parse(stored) : null)

  const handleTakeRide = async (request: Riderequest) => {
    if (!resolvedDriver?.id) {
      toast.warning('🚫 No driver profile found.')
      return
    }

    try {
      // Update ride request
      await updateRideRequestMutation.mutateAsync({
        id: request.id,
        payload: {
          assignedDriver: resolvedDriver,
          status: 'Taken',
        },
      })

      // Find and update linked ride
      const rides = request.rider?.user?.riderProfile?.ridesTaken || []
      const ride = rides.find(
        (r) =>
          r.pickupLocation?.id === request.pickupLocation?.id &&
          r.dropoffLocation?.id === request.dropoffLocation?.id,
      )

      if (!ride) {
        toast.error('❌ No matching ride found.')
        return
      }

      await updateRideMutation.mutateAsync({
        id: ride.id,
        payload: {
          driver: resolvedDriver,
          status: 'In Progress',
        },
      })

      toast.success('✅ Ride taken successfully.')
    } catch (error) {
      console.error(error)
      toast.error('❌ Failed to assign ride.')
    }
  }

  if (loadingRequests || loadingDriver) return <div>Loading...</div>

  const unassigned = rideRequests.filter((r) => !r.assignedDriver)

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <section className="max-w-screen-xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          🚗 Unassigned Ride Requests
        </h2>

        {unassigned.length === 0 ? (
          <p className="text-center text-muted-foreground text-lg">
            No unassigned rides
          </p>
        ) : (
          unassigned.map((request) => (
            <RideCard
              key={request.id}
              ride={request}
              onTakeRide={() => handleTakeRide(request)}
            />
          ))
        )}
      </section>
    </div>
  )
}
