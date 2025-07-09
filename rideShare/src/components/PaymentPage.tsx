import React, { useState } from 'react'
import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'


function PaymentsPage() {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setMessage(null)

    if (!stripe || !elements) {
      setMessage('Stripe has not loaded yet.')
      setLoading(false)
      return
    }

    // 1. Call your backend to create a payment intent
    // Replace this URL with your backend endpoint
    const response = await fetch('/api/payments/create-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 1999, // amount in cents, e.g. $19.99
        currency: 'usd',
        userId: 'user-id-example',
        rideId: 'ride-id-example',
      }),
    })

    const { clientSecret } = await response.json()

    if (!clientSecret) {
      setMessage('Failed to create payment intent.')
      setLoading(false)
      return
    }

    // 2. Confirm card payment with Stripe.js
    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      setMessage('Card element not found.')
      setLoading(false)
      return
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
        },
      },
    )

    if (error) {
      setMessage(`Payment failed: ${error.message}`)
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setMessage('Payment succeeded!')
      // Optionally, call your backend to confirm payment, update DB, etc.
    } else {
      setMessage('Payment processing.')
    }

    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl mb-4">Pay for your ride</h1>
      <form onSubmit={handleSubmit}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': { color: '#aab7c4' },
              },
              invalid: { color: '#9e2146' },
            },
          }}
        />
        <button
          type="submit"
          disabled={!stripe || loading}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Pay $19.99'}
        </button>
      </form>
      {message && <div className="mt-4 text-red-600">{message}</div>}
    </div>
  )
}

export default PaymentsPage