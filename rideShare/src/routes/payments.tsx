import { createFileRoute } from '@tanstack/react-router'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
} from '@stripe/react-stripe-js'
import PaymentsPage from '@/components/PaymentPage'

const stripePromise = loadStripe('pk_test_YOUR_PUBLISHABLE_KEY')

export const Route = createFileRoute('/payments')({
    component: () => (
        <Elements stripe={stripePromise}>
          <PaymentsPage />
        </Elements>
      ),
})

// function RouteComponent() {
//   return <div>Hello "/payments"!</div>
// }
