import { createFileRoute, useSearch, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { confirmPayment, getStripeSessionById } from '@/api/UserApi'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/payment-success')({
  validateSearch: (search: Record<string, unknown>) => ({
    session_id: typeof search.session_id === 'string' ? search.session_id : '',
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { session_id } = useSearch({ from: '/payment-success' })
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>(
    'loading',
  )
  const [paymentIntentId, setPaymentIntentId] = useState<string>('')

  useEffect(() => {
    if (!session_id) {
      setStatus('failed')
      return
    }

    const confirm = async () => {
      try {
        const { paymentIntentId } = await getStripeSessionById(session_id)
        setPaymentIntentId(paymentIntentId)

        await confirmPayment(paymentIntentId)

        setStatus('success')
      } catch (err) {
        console.error('Payment confirmation failed:', err)
        setStatus('failed')
      }
    }

    confirm()
  }, [session_id])

  return (
    <div className="max-w-md mx-auto text-center p-6">
      {status === 'loading' && (
        <p className="text-gray-600 text-lg">Confirming payment...</p>
      )}

      {status === 'success' && (
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-green-600">
            Payment Successful
          </h1>
          <p className="text-gray-700">Thank you for your payment!</p>

          <div className="bg-gray-100 rounded p-4 text-left text-sm text-gray-600 space-y-1">
            <p>
              <strong>Session ID:</strong> {session_id}
            </p>
            <p>
              <strong>Payment Intent:</strong> {paymentIntentId}
            </p>
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <Button
              onClick={() => navigate({ to: '/' })}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Go to Home
            </Button>
            <Button
              onClick={() => navigate({ to: '/user/userprofile' })}
              variant="outline"
            >
              Go to Profile
            </Button>
          </div>
        </div>
      )}

      {status === 'failed' && (
        <div className="text-red-600 space-y-3">
          <h1 className="text-xl font-bold">Payment Failed</h1>
          <p>We couldn’t confirm your payment. Please contact support.</p>
          {session_id && (
            <p className="text-sm text-gray-500">Session ID: {session_id}</p>
          )}
        </div>
      )}
    </div>
  )
}
