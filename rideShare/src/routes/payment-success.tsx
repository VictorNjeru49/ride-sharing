import { createFileRoute, useSearch } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { confirmPayment, getStripeSessionById } from '@/api/UserApi'

export const Route = createFileRoute('/payment-success')({
  validateSearch: (search: Record<string, unknown>) => ({
    session_id: typeof search.session_id === 'string' ? search.session_id : '',
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { session_id } = useSearch({ from: '/payment-success' })
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>(
    'loading',
  )

  useEffect(() => {
    const handleConfirmation = async () => {
      try {
        // Get paymentIntentId from your backend using session_id
        const { paymentIntentId } = await getStripeSessionById(session_id)

        // Confirm payment via backend
        await confirmPayment(paymentIntentId)

        setStatus('success')
      } catch (error) {
        console.error('Payment confirmation failed:', error)
        setStatus('failed')
      }
    }

    if (session_id) {
      handleConfirmation()
    }
  }, [session_id])

  return (
    <div className="max-w-md mx-auto text-center p-4">
      {status === 'loading' && <p>Confirming payment...</p>}

      {status === 'success' && (
        <>
          <h1 className="text-2xl font-bold text-green-600">
            Payment Successful
          </h1>
          <p className="mt-2">Thank you for your payment!</p>
          <p className="mt-2 text-sm text-gray-500">Session ID: {session_id}</p>
        </>
      )}

      {status === 'failed' && (
        <div className="text-red-600">
          <h1 className="text-xl font-bold">Payment Failed</h1>
          <p className="mt-2">
            We couldn't confirm your payment. Please contact support.
          </p>
        </div>
      )}
    </div>
  )
}
