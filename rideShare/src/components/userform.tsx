import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import type { Riderequest, userTypes } from '@/types/alltypes'
import { Button } from './ui/button'



export function TrackRideDialog({
  open,
  onClose,
  ride,
  onConfirm,
}: {
  open: boolean
  onClose: () => void
  ride: Riderequest | null
  user: userTypes | undefined
  onConfirm: () => void
}) {
  if (!ride) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Track Ride</DialogTitle>
          <DialogDescription>Details of your ongoing ride.</DialogDescription>
        </DialogHeader>

        <div className="space-y-2 mt-4">
          <p>
            <strong>Pickup:</strong>{' '}
            {ride.pickupLocation?.address || 'Not specified'}
          </p>
          <p>
            <strong>Destination:</strong>{' '}
            {ride.dropoffLocation?.address || 'Not specified'}
          </p>
          <p>
            <strong>Driver:</strong>{' '}
            {ride.assignedDriver?.user?.firstName || 'Not assigned'}
          </p>
          <p>
            <strong>Vehicle:</strong>{' '}
            {ride.preferredVehicleType || 'Not specified'}
          </p>
          <p>
            <strong>Requested At:</strong>{' '}
            {ride.requestedAt
              ? new Date(ride.requestedAt).toLocaleString()
              : 'N/A'}
          </p>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onConfirm}>Confirm Completion</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
