import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/payment-cancel')({
  component: RouteComponent,
})

function RouteComponent() {
   return (
    <div className="max-w-md mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold text-red-600">❌ Payment Cancelled</h1>
      <p className="mt-4">Your payment was not completed. You can try again anytime.</p>
    </div>
   )
}
