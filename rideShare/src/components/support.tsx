import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { UserRole } from '@/types/alltypes'
import { fetchUserBotReply, getUserById } from '@/api/UserApi'
import { authStore } from '@/app/store'
import { useQuery } from '@tanstack/react-query'

type FAQ = {
  question: string
  answer: string
}

// type UserRole = 'RIDER' | 'DRIVER'

const faqListRider: FAQ[] = [
  {
    question: 'How do I book a ride?',
    answer:
      'Open the app, set your pickup and destination, and click on "Book Ride".',
  },
  {
    question: 'How do I cancel a ride?',
    answer:
      'Go to your active ride screen and click the "Cancel Ride" button. Cancellation fees may apply.',
  },
  {
    question: 'How can I pay for a ride?',
    answer:
      'We accept mobile money, credit/debit cards, and cash. You can set your default method in payment settings.',
  },
  {
    question: 'What if my driver is late?',
    answer:
      'You can contact the driver via the app. If the delay is unreasonable, cancel and rebook at no extra charge.',
  },
]

const faqListDriver: FAQ[] = [
  {
    question: 'How do I update my vehicle information?',
    answer:
      'To update your vehicle details, go to your profile > Vehicle Settings > Edit Vehicle Info.',
  },
  {
    question: 'Why is my payment delayed?',
    answer:
      'Payments are processed every Friday. Delays can occur due to bank holidays or incorrect bank info.',
  },
  {
    question: 'How do I contact rider support?',
    answer:
      'Use the in-app chat feature or call our 24/7 hotline from the Support tab.',
  },
  {
    question: 'Can I cancel a ride after accepting it?',
    answer:
      'Yes, but frequent cancellations may affect your driver rating and incentives.',
  },
]
interface FAQProps {
  userRole: UserRole
}

function FAQComponent({ userRole }: FAQProps) {
  const faqList = userRole === UserRole.DRIVER ? faqListDriver : faqListRider
  const userId = authStore.state.user?.id // or pass as prop

  // Fetch user data with requests based on role
  const { data: user } = useQuery({
    queryKey: ['user-requests', userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId,
  })

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [query, setQuery] = useState('')
  const [botReply, setBotReply] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAskBot = async () => {
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    setBotReply(null)
    setExpandedIndex(null)

    const lowerQuery = query.toLowerCase()
    if (
      lowerQuery.includes('show my bookings') ||
      lowerQuery.includes('my rides') ||
      lowerQuery.includes('my requests')
    ) {
      // Extract bookings/requests from user data
      if (userRole === UserRole.RIDER) {
        const activeRequests = user?.riderProfile?.rideRequests ?? []
        if (activeRequests.length === 0) {
          setBotReply('You have no active ride requests.')
        } else {
          // Format the requests nicely
          const formatted = activeRequests
            .map(
              (r: any, i: number) =>
                `${i + 1}. Ride to ${r.destination} on ${new Date(
                  r.requestedAt,
                ).toLocaleDateString()}. Status: ${r.status}`,
            )
            .join('\n')
          setBotReply(`Your active ride requests:\n${formatted}`)
        }
      } else if (userRole === UserRole.DRIVER) {
        const assignedRequests = user?.driverProfile?.assignedRequests ?? []
        if (assignedRequests.length === 0) {
          setBotReply('You have no assigned ride requests.')
        } else {
          const formatted = assignedRequests
            .map(
              (r: any, i: number) =>
                `${i + 1}. Ride for ${r.riderName} to ${r.destination} on ${new Date(
                  r.assignedAt,
                ).toLocaleDateString()}. Status: ${r.status}`,
            )
            .join('\n')
          setBotReply(`Your assigned ride requests:\n${formatted}`)
        }
      }
      setLoading(false)
      return
    }

    try {
      const reply = await fetchUserBotReply(query, userRole)
      setBotReply(reply)
    } catch (err) {
      setError('Failed to get response. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAskBot()
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">
        {userRole === UserRole.DRIVER
          ? 'Driver Support FAQ'
          : 'User Support FAQ'}
      </h1>

      <div className="flex gap-2 items-center">
        <Input
          placeholder="Ask a question…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Ask a question"
          disabled={loading}
        />
        <Button onClick={handleAskBot} disabled={loading || !query.trim()}>
          {loading ? 'Asking...' : 'Ask Bot'}
        </Button>
      </div>

      {error && (
        <p className="text-red-600 mt-2" role="alert">
          {error}
        </p>
      )}

      {botReply && (
        <Card className="border border-indigo-500 bg-indigo-50 shadow-md">
          <CardContent>
            <p className="text-indigo-900 whitespace-pre-wrap dark:text-white dark:bg-gray-700">{botReply}</p>
          </CardContent>
        </Card>
      )}

      {/* Optional: Show FAQ list below */}
      <div className="space-y-3 mt-6">
        {faqList.map((faq, index) => (
          <Card key={index} className="border border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() =>
                  setExpandedIndex(expandedIndex === index ? null : index)
                }
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setExpandedIndex(expandedIndex === index ? null : index)
                  }
                }}
                role="button"
                aria-expanded={expandedIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <p className="font-medium">{faq.question}</p>
                {expandedIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </div>
              {expandedIndex === index && (
                <p
                  id={`faq-answer-${index}`}
                  className="mt-2 text-sm text-gray-700 dark:text-white"
                >
                  {faq.answer}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default FAQComponent
