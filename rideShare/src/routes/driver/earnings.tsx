import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getUserById } from '@/api/UserApi'
import { authStore } from '@/app/store'
import { DollarSign } from 'lucide-react'
import { format } from 'date-fns'

export const Route = createFileRoute('/driver/earnings')({
  component: RouteComponent,
})

function RouteComponent() {
  const userId = authStore.state.user?.id

  const { data: user, isLoading } = useQuery({
    queryKey: ['driver-earnings', userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId,
  })

  const earnings = user?.payments || []

  const totalEarnings = earnings.reduce(
    (acc, payment) => acc + payment.amount,
    0,
  )

  return (
    <section className="p-6 bg-gray-50 min-h-screen space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">Earnings</h2>
        <p className="text-gray-600 mb-4">
          Track your daily, weekly, and monthly earnings.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Total Earnings
          </h3>
          <div className="text-green-600 font-bold text-xl flex items-center gap-2">
            <DollarSign className="w-5 h-5" />${totalEarnings.toFixed(2)}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm text-left">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="px-4 py-2 font-medium">Date</th>
                <th className="px-4 py-2 font-medium">Amount</th>
                <th className="px-4 py-2 font-medium">Method</th>
                <th className="px-4 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">
                    Loading earnings...
                  </td>
                </tr>
              ) : earnings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">
                    No earnings data available.
                  </td>
                </tr>
              ) : (
                earnings.map((payment) => (
                  <tr key={payment.id} className="border-b last:border-b-0">
                    <td className="px-4 py-2 text-gray-700">
                      {format(new Date(payment.paidAt), 'dd MMM yyyy')}
                    </td>
                    <td className="px-4 py-2 text-green-600 font-medium">
                      ${payment.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 capitalize text-gray-700">
                      {payment.method.replace('_', ' ')}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          payment.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : payment.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
