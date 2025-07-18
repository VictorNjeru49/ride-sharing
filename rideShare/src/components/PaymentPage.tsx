import { useState } from 'react'
import { createCheckoutSession } from '@/api/UserApi' // Make sure this returns { url }
import { authStore } from '@/app/store'
import { PaymentMethod } from '@/types/alltypes'

function PaymentsPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const user = authStore.state.user

  async function handleCheckout() {
    setLoading(true)
    setMessage(null)

    try {
      const vehicleId = localStorage.getItem('vehicleId')
      const amountString = localStorage.getItem('Amount')

      if (!user?.id || !vehicleId || !amountString) {
        throw new Error('Missing user ID, ride ID, or amount in localStorage.')
      }

      const amount = Number(amountString)
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Invalid amount.')
      }

      // Call backend to create checkout session and get URL
      const { url } = await createCheckoutSession({
        userId: user.id,
        vehicleId,
        amount,
        method: PaymentMethod.STRIPE_CHECKOUT,
        currency: 'USD',
      })

      if (!url) {
        throw new Error('No checkout URL returned.')
      }

      // Redirect to Stripe-hosted checkout page
      window.location.href = url
    } catch (err: any) {
      setMessage(`Checkout failed: ${err.message || 'Something went wrong.'}`)
    }

    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto p-4 text-center">
      <h1 className="text-2xl mb-4 font-semibold">Pay for your ride</h1>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Redirecting...' : 'Proceed to Checkout'}
      </button>
      {message && <div className="mt-4 text-red-600">{message}</div>}
    </div>
  )
}

export default PaymentsPage
