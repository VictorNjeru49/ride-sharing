import React, { useEffect, useState } from 'react'
import { createCheckoutSession } from '@/api/UserApi' // Make sure this returns { url }
import { authStore } from '@/app/store'
import { PaymentMethod } from '@/types/alltypes'

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

  const vehicle = localStorage.getItem('vehicle')
  return (
    <div className="border rounded p-4 mb-6 max-w-md mx-auto bg-gray-50">
      <h2 className="text-xl font-bold mb-2">Payment Details</h2>
      <ul className="text-left space-y-1">
        <li>
          <strong>User ID:</strong> {userId}
        </li>
        <li>
          <strong>Vehicle</strong> {vehicle}
        </li>
        <li>
          <strong>Ride ID:</strong> {rideId}
        </li>
        <li>
          <strong>Amount to Pay:</strong> {amount.toFixed(2)} {currency}
        </li>
      </ul>
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
    <div className="max-w-md mx-auto p-4 text-center">
      <h1 className="text-2xl mb-4 font-semibold">Pay for your ride</h1>

      {paymentData ? (
        <PaymentReport {...paymentData} />
      ) : (
        <p className="mb-4 text-red-600">
          Payment details are missing or invalid.
        </p>
      )}

      <button
        onClick={handleCheckout}
        disabled={loading || !paymentData}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Redirecting...' : 'Proceed to Checkout'}
      </button>

      {message && <div className="mt-4 text-red-600">{message}</div>}
    </div>
  )
}

export default PaymentsPage