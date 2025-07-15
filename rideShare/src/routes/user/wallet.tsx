import { createFileRoute } from '@tanstack/react-router'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Loader2, Trash2 } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useMemo } from 'react'
import { toast } from 'sonner'

import { getUserById, deletePayment } from '@/api/UserApi'
import { authStore } from '@/app/store'
import { type Payment, PaymentStatus } from '@/types/alltypes'

// -----------------------------------------------------------------------------
// Route registration
// -----------------------------------------------------------------------------
export const Route = createFileRoute('/user/wallet')({
  component: RouteComponent,
})

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------
function RouteComponent() {
  // ---------------------------------------------------------------------------
  // State & utils
  // ---------------------------------------------------------------------------
  const userId = authStore.state.user?.id
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // ---------------------------------------------------------------------------
  // Queries
  // ---------------------------------------------------------------------------
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['user-with-payments', userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId,
  })

  const payments: Payment[] = user?.payments ?? []

  // ---------------------------------------------------------------------------
  // Mutations
  // ---------------------------------------------------------------------------
  const { mutate: handleDelete, isPending: isDeleting } = useMutation({
    mutationFn: (paymentId: string) => deletePayment(paymentId),
    onSuccess: (_, paymentId) => {
      toast.success('Payment deleted successfully')
      // Optimistically update cache
      queryClient.setQueryData(['user-with-payments', userId], (old: any) => {
        if (!old) return old
        return {
          ...old,
          payments: old.payments.filter((p: Payment) => p.id !== paymentId),
        }
      })
    },
    onError: () => {
      toast.error('Failed to delete payment. Please try again.')
    },
  })

  // ---------------------------------------------------------------------------
  // Derived data
  // ---------------------------------------------------------------------------
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchesStatus =
        statusFilter === 'all' ? true : p.status === statusFilter
      const matchesSearch = searchTerm
        ? `${p.amount} ${p.currency}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          p.method.toLowerCase().includes(searchTerm.toLowerCase())
        : true
      return matchesStatus && matchesSearch
    })
  }, [payments, statusFilter, searchTerm])


  // ---------------------------------------------------------------------------
  // Render helpers
  // ---------------------------------------------------------------------------
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10 text-gray-500 m-auto mt-1/2">
        <Loader2 className="mr-2 h-20 w-20 animate-spin" /> Loading payment
        history…
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-500">
        Error loading payment history: {(error as Error).message}
      </div>
    )
  }

  return (
    <Card className="mx-auto mb-10 mt-6 w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Wallet & Payment History
        </CardTitle>
      </CardHeader>

      {/* Filters */}
      <div className="flex flex-col gap-4 px-6 pb-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input
            placeholder="Search amount or method…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="w-full sm:w-56">
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as PaymentStatus | 'all')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {Object.values(PaymentStatus).map((s) => (
                <SelectItem key={s} value={s} className="capitalize">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <CardContent className="overflow-x-auto p-0">
        {filteredPayments.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No payments found.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-16">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((p) => (
                <TableRow key={p.id} className="hover:bg-muted/50">
                  <TableCell className="truncate text-xs font-medium">
                    {p.id}
                  </TableCell>
                  <TableCell>
                    {Number(p.amount).toFixed(2)} {String(p.currency).toUpperCase()}
                  </TableCell>
                  <TableCell className="capitalize">
                    {p.method.replace('_', ' ')}
                  </TableCell>
                  <TableCell className="capitalize">{p.status}</TableCell>
                  <TableCell>
                    {new Date(p.paidAt ?? p.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="icon"
                      variant="ghost"
                      disabled={isDeleting}
                      onClick={() => handleDelete(p.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

export default RouteComponent
