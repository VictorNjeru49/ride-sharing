import React, { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Download, Filter, MoreVertical } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useCrudOperations } from '@/hooks/crudops'
import {
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
} from '@/api/UserApi'
import { type Payment, PaymentMethod, PaymentStatus } from '@/types/alltypes'
import { RingLoader } from 'react-spinners'

export const Route = createFileRoute('/dashboard/payments')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null)

  // Form state for create/update
  const [formData, setFormData] = useState<Partial<Payment>>({})
  const [methodFilter, setMethodFilter] = React.useState<PaymentMethod | 'all'>(
    'all',
  )
  const [statusFilter, setStatusFilter] = React.useState<PaymentStatus | 'all'>(
    'all',
  )
  const [dateFilter, setDateFilter] = React.useState<
    'all' | 'today' | 'week' | 'month'
  >('all')

  // Pagination state
  const [page, setPage] = React.useState(1)

  const PAGE_SIZE = 10

  const {
    query: paymentsQuery,
    create,
    update,
    delete: remove,
  } = useCrudOperations<Payment, Partial<Payment>, Partial<Payment>, string>(
    {
      all: ['payments'],
      details: (id: string) => ['payments', id],
    },
    {
      fetchFn: () => getPayments(), // no params here
      createFn: (paymentData) => createPayment(paymentData),
      updateFn: (id, paymentData) => updatePayment(id, paymentData),
      deleteFn: (paymentId: string) => deletePayment(paymentId),
    },
  )

  if (paymentsQuery.isLoading) {
    return (
      <div className=" w-fit text-center py-10 m-auto">
        <RingLoader color="#0017ff" />
        Loading...
      </div>
    )
  }

  if (paymentsQuery.isError) {
    return <div>Error loading payments: {paymentsQuery.error?.message}</div>
  }

  const allPayments = paymentsQuery.data ?? []

  // Apply filters client-side
  const filteredPayments = allPayments.filter((p) => {
    // Filter by method
    if (methodFilter !== 'all' && p.method !== methodFilter) return false

    // Filter by status
    if (statusFilter !== 'all' && p.status !== statusFilter) return false

    // Filter by date
    if (dateFilter !== 'all') {
      const createdAt = new Date(p.createdAt)
      const now = new Date()
      switch (dateFilter) {
        case 'today': {
          const start = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
          )
          if (createdAt < start) return false
          break
        }
        case 'week': {
          const weekAgo = new Date()
          weekAgo.setDate(now.getDate() - 7)
          if (createdAt < weekAgo) return false
          break
        }
        case 'month': {
          const monthAgo = new Date()
          monthAgo.setMonth(now.getMonth() - 1)
          if (createdAt < monthAgo) return false
          break
        }
      }
    }

    return true
  })
  function handleMethodSelect(value: PaymentMethod | 'all') {
    setMethodFilter(value)
    setPage(1) // reset to first page on filter change
  }

  function handleStatusSelect(value: PaymentStatus | 'all') {
    setStatusFilter(value)
    setPage(1)
  }

  function handleDateSelect(value: 'all' | 'today' | 'week' | 'month') {
    setDateFilter(value)
    setPage(1)
  }
  const badgeColorClasses: Record<PaymentMethod, string> = {
    credit_card: 'text-blue-600 bg-blue-100',
    debit_card: 'text-blue-600 bg-blue-100',
    paypal: 'text-blue-600 bg-blue-100',
    bank_transfer: 'text-green-600 bg-green-100',
    cash: 'text-green-600 bg-green-100',
  }

  const statusColorClasses: Record<PaymentStatus, string> = {
    completed: 'text-green-600',
    pending: 'text-yellow-600',
    failed: 'text-red-600',
    cancelled: 'text-gray-600',
    refunded: 'text-red-600',
  }
    



  // Open modal for new payment
  function openCreateModal() {
    setEditingPayment(null)
    setFormData({})
    setIsModalOpen(true)
  }

  // Open modal for editing existing payment
  function openEditModal(payment: Payment) {
    setEditingPayment(payment)
    setFormData(payment)
    setIsModalOpen(true)
  }

  // Handle form input changes
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Submit handler for create/update
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      if (editingPayment) {
        // Update existing payment
        await update.mutateAsync({id: editingPayment.id, payload: formData})
      } else {
        // Create new payment
        await create.mutateAsync(formData)
      }
      setIsModalOpen(false)
    } catch (error) {
      console.error('Failed to save payment:', error)
    }
  }

  // Delete payment with confirmation
  async function handleDelete(paymentId: string) {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        await remove.mutateAsync(paymentId)
      } catch (error) {
        console.error('Failed to delete payment:', error)
      }
    }
  }
  // Pagination client-side
  const totalPayments = filteredPayments.length
  const totalPages = Math.ceil(totalPayments / PAGE_SIZE)
  const paginatedPayments = filteredPayments.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  )

  // Fix reduce sum typing
  const totalRevenue = paginatedPayments.reduce(
    (sum: number, p: Payment) =>
      sum + (isNaN(Number(p.amount)) ? 0 : Number(p.amount)),
    0,
  )

  // Pagination handlers
  function goToPage(p: number) {
    if (p < 1 || p > totalPages) return
    setPage(p)
  }

  // ... then render paginatedPayments instead of payments in the table and summary cards

  return (
    <div className="space-y-6">
      {/* Add button to create new payment */}
      <div className="flex justify-end">
        <Button onClick={openCreateModal}>New Payment</Button>
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
            <CardDescription className="text-green-600">
              +12.5% from last month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-700">
              ${totalRevenue.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Today's Transactions</CardTitle>
            <CardDescription className="text-blue-600">
              +8.2% from yesterday
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Use filteredPayments length for all filtered transactions */}
            <p className="text-2xl font-bold text-blue-700">
              {filteredPayments.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Payouts</CardTitle>
            <CardDescription className="text-orange-600">
              {/* Placeholder, replace with real data */}
              47 drivers waiting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-700">$8,945</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Failed Payments</CardTitle>
            <CardDescription className="text-red-600">
              Needs attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-700">
              {
                filteredPayments.filter(
                  (p) =>
                    p.status === PaymentStatus.FAILED ||
                    p.status === PaymentStatus.CANCELLED,
                ).length
              }
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2 flex-wrap">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {methodFilter === 'all'
                  ? 'All Transactions'
                  : methodFilter.replace('_', ' ')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                key="all-methods"
                onSelect={() => handleMethodSelect('all')}
              >
                All Transactions
              </DropdownMenuItem>
              {Object.values(PaymentMethod).map((method) => (
                <DropdownMenuItem
                  key={method}
                  onSelect={() => handleMethodSelect(method)}
                >
                  {method.replace('_', ' ')}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {dateFilter === 'all'
                  ? 'All Dates'
                  : dateFilter === 'today'
                    ? 'Today'
                    : dateFilter === 'week'
                      ? 'This Week'
                      : 'This Month'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => handleDateSelect('all')}>
                All Dates
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleDateSelect('today')}>
                Today
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleDateSelect('week')}>
                This Week
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleDateSelect('month')}>
                This Month
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {statusFilter === 'all' ? 'All Status' : statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                key="all-status"
                onSelect={() => handleStatusSelect('all')}
              >
                All Status
              </DropdownMenuItem>
              {Object.values(PaymentStatus).map((status) => (
                <DropdownMenuItem
                  key={status}
                  onSelect={() => handleStatusSelect(status)}
                >
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Transaction Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Transaction ID</th>
                <th>Method</th>
                <th>User</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPayments.map((payment) => (
                <tr key={payment.id} className="border-b hover:bg-gray-50">
                  <td className="py-3">{payment.id}</td>
                  <td>
                    <Badge
                      variant="secondary"
                      className={
                        badgeColorClasses[payment.method] ??
                        'text-gray-600 bg-gray-100'
                      }
                    >
                      {payment.method.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage
                          src={payment.user.profilePicture}
                          className="object-cover"
                        />
                        <AvatarFallback>
                          {payment.user.firstName} {payment.user.lastName}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{`${payment.user.firstName} ${payment.user.lastName}`}</p>
                        <p className="text-xs text-muted-foreground">
                          {payment.user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    {payment.currency} {Number(payment.amount).toFixed(2)}
                  </td>
                  <td
                    className={
                      statusColorClasses[payment.status] ?? 'text-gray-600'
                    }
                  >
                    {payment.status}
                  </td>
                  <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Edit"
                        onClick={() => openEditModal(payment)}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Delete"
                        onClick={() => handleDelete(payment.id)}
                      >
                        🗑️
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {(page - 1) * PAGE_SIZE + 1} to{' '}
              {Math.min(page * PAGE_SIZE, totalPayments)} of {totalPayments}{' '}
              results
            </p>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              {[...Array(totalPages).keys()].map((i) => (
                <Button
                  key={i + 1}
                  size="sm"
                  className={page === i + 1 ? 'bg-blue-600 text-white' : ''}
                  onClick={() => goToPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal for Create / Update */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded shadow-md w-full max-w-md"
          >
            <h2 className="text-xl font-bold mb-4">
              {editingPayment ? 'Edit Payment' : 'New Payment'}
            </h2>

            {/* Example form fields */}
            <label className="block mb-2">
              Method:
              <select
                name="method"
                value={formData.method || ''}
                onChange={handleInputChange}
                required
                className="w-full border p-2 rounded"
              >
                <option value="" disabled>
                  Select method
                </option>
                {Object.values(PaymentMethod).map((method) => (
                  <option key={method} value={method}>
                    {method.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </label>

            <label className="block mb-2">
              Status:
              <select
                name="status"
                value={formData.status || ''}
                onChange={handleInputChange}
                required
                className="w-full border p-2 rounded"
              >
                <option value="" disabled>
                  Select status
                </option>
                {Object.values(PaymentStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <label className="block mb-2">
              Amount:
              <input
                type="number"
                name="amount"
                value={formData.amount ?? ''}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                required
                className="w-full border p-2 rounded"
              />
            </label>

            {/* Add other fields as needed, e.g. currency, user, createdAt... */}

            <div className="flex justify-end gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingPayment ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
