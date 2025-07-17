// src/routes/payments.tsx or similar

import { createFileRoute } from '@tanstack/react-router'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import PaymentsPage from '@/components/PaymentPage'

// ⚠️ Replace with your actual publishable key from Stripe Dashboard
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_PUBLISHABLE_KEY',
)

export const Route = createFileRoute('/payments')({
  component: () => (
    <Elements stripe={stripePromise}>
      <PaymentsPage />
    </Elements>
  ),
})
