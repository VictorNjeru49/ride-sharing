import React, { useEffect, useState } from 'react'
import { createCheckoutSession, getUserById } from '@/api/UserApi' // Make sure this returns { url }
import { authStore } from '@/app/store'
import { PaymentMethod } from '@/types/alltypes'
import { useQuery } from '@tanstack/react-query'

interface PaymentReportProps {
  userId: string
  rideId: string
  amount: number
  currency: string
}

const PaymentReport: React.FC<PaymentReportProps> = ({
  userId,
  rideId,
  amount,
  currency,
}) => {
  // Parse vehicle JSON safely
  const vehicleJson = localStorage.getItem('vehicle')
  const user = authStore.state.user.id

  const {data: userLog} = useQuery({
    queryKey: ['userset', user],
    queryFn: () => getUserById(user)
  })
  let vehicleObj: any = null
  try {
    vehicleObj = vehicleJson ? JSON.parse(vehicleJson) : null
  } catch {
    vehicleObj = null
  }

  return (
    <div className="border rounded-lg p-6 max-w-md mx-auto bg-white dark:bg-gray-800 shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Payment Details
      </h2>

      {/* User Info */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
          User Information
        </h3>
        <ul className="space-y-1 text-gray-800 dark:text-gray-200">
          <li className="hidden">
            <span className="font-semibold hidden">User ID:</span> {userId}
          </li>
          <li>
            <span className="font-semibold">User Name:</span>{' '}
            {userLog?.firstName} {userLog?.lastName}
          </li>
        </ul>
      </section>

      {/* Vehicle Details */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
          Vehicle Details
        </h3>
        {vehicleObj ? (
          <ul className="space-y-1 text-gray-800 dark:text-gray-200 text-left">
            <li>
              <span className="font-semibold">Make:</span> {vehicleObj.make}
            </li>
            <li>
              <span className="font-semibold">Model:</span> {vehicleObj.model}
            </li>
            <li>
              <span className="font-semibold">Plate Number:</span>{' '}
              {vehicleObj.plateNumber}
            </li>
            <li>
              <span className="font-semibold">Color:</span> {vehicleObj.color}
            </li>
            <li>
              <span className="font-semibold">Rental Rate:</span> Ksh{' '}
              {vehicleObj.rentalrate}
            </li>
          </ul>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">
            Vehicle info not available.
          </p>
        )}
      </section>

      {/* Ride Info */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
          Ride Information
        </h3>
        <ul className="space-y-1 text-gray-800 dark:text-gray-200 text-left">
          <li>
            <span className="font-semibold">Ride ID:</span> {rideId}
          </li>
        </ul>
      </section>

      {/* Amount */}
      <section className="pt-4 border-t border-gray-300 dark:border-gray-700 text-center">
        <p className="text-xl font-bold text-blue-700 dark:text-blue-400">
          Amount to Pay:
        </p>
        <p className="text-3xl font-extrabold mt-1 text-gray-900 dark:text-gray-100">
          {amount.toFixed(2)} {currency}
        </p>
      </section>
    </div>
  )
}

function PaymentsPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [paymentData, setPaymentData] = useState<{
    userId: string
    rideId: string
    amount: number
    currency: string
  } | null>(null)

  const user = authStore.state.user

  useEffect(() => {
    const vehicleId = localStorage.getItem('vehicleId')
    const amountString = localStorage.getItem('Amount')
    const rideId = localStorage.getItem('rideId')

    if (user?.id && vehicleId && amountString && rideId) {
      const amount = Number(amountString)
      if (!isNaN(amount) && amount > 0) {
        setPaymentData({
          userId: user.id,
          rideId,
          amount,
          currency: 'USD',
        })
      }
    }
  }, [user])

  async function handleCheckout() {
    if (!paymentData) {
      setMessage('Payment data is incomplete.')
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const { url } = await createCheckoutSession({
        userId: paymentData.userId,
        rideId: paymentData.rideId,
        amount: paymentData.amount,
        method: PaymentMethod.STRIPE_CHECKOUT,
        currency: paymentData.currency,
      })

      if (!url) {
        throw new Error('No checkout URL returned.')
      }

      window.location.href = url

      console.log('url checkout', url)
    } catch (err: any) {
      setMessage(`Checkout failed: ${err.message || 'Something went wrong.'}`)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-100 dark:bg-gray-900 min-h-screen flex flex-col justify-center">
      <h1 className="text-3xl font-semibold mb-8 text-center text-gray-900 dark:text-gray-100">
        Pay for your ride
      </h1>

      {paymentData ? (
        <PaymentReport {...paymentData} />
      ) : (
        <p className="mb-6 text-center text-red-600 dark:text-red-400">
          Payment details are missing or invalid.
        </p>
      )}

      <button
        onClick={handleCheckout}
        disabled={loading || !paymentData}
        className="mt-8 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors"
      >
        {loading ? 'Redirecting...' : 'Proceed to Checkout'}
      </button>

      {message && (
        <div className="mt-4 text-center text-red-600 dark:text-red-400">
          {message}
        </div>
      )}
    </div>
  )
}

export default PaymentsPage
