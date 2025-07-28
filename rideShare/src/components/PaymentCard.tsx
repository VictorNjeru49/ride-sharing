import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { type Payment, PaymentStatus } from '@/types/alltypes'

type PaymentCardProps = {
  payment: Payment
  onDelete?: (id: string) => void
  isDeleting?: boolean
}

export function PaymentCard({
  payment,
  onDelete,
  isDeleting,
}: PaymentCardProps) {
  if (!payment) return null 

  const displayDate = payment.paidAt ?? payment.createdAt
  const formattedDate = displayDate
    ? new Date(displayDate).toLocaleDateString()
    : 'Unknown Date'

  const statusColorMap: Record<PaymentStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-gray-200 text-gray-700',
    session_retrieved: 'bg-gray-100 text-white'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold capitalize">
          {payment.method?.replace(/_/g, ' ') ?? 'Unknown Method'}
        </CardTitle>
        <CardDescription>{formattedDate}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-2 text-sm">
        <div>
          <strong>Amount:</strong> {Number(payment.amount).toFixed(2)}{' '}
          {payment.currency?.toUpperCase() ?? 'USD'}
        </div>

        <div className="flex items-center gap-2">
          <strong>Status:</strong>
          {payment.status ? (
            <Badge className={statusColorMap[payment.status]}>
              {payment.status}
            </Badge>
          ) : (
            <Badge variant="outline">Unknown</Badge>
          )}
        </div>

        <div className="mt-3">
          <Button
            variant="destructive"
            size="sm"
            disabled={isDeleting}
            onClick={() => onDelete?.(payment.id)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
