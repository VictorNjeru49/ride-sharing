import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronDown, ChevronUp } from 'lucide-react'

export const Route = createFileRoute('/user/support')({
  component: RouteComponent,
})

type FAQ = {
  question: string
  answer: string
}

const faqList: FAQ[] = [
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

function RouteComponent() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [query, setQuery] = useState('')
  const [filtered, setFiltered] = useState<FAQ[]>(faqList)

  const handleSearch = () => {
    const results = faqList.filter((faq) =>
      faq.question.toLowerCase().includes(query.toLowerCase()),
    )
    setFiltered(results)
    setExpandedIndex(null)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">User Support FAQ</h1>

      <div className="flex gap-2 items-center">
        <Input
          placeholder="Ask a question…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={handleSearch}>Ask Bot</Button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center text-gray-500 mt-4">
          No matching questions found.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((faq, index) => (
            <Card key={index} className="border border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() =>
                    setExpandedIndex(expandedIndex === index ? null : index)
                  }
                >
                  <p className="font-medium">{faq.question}</p>
                  {expandedIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                {expandedIndex === index && (
                  <p className="mt-2 text-sm text-gray-700 dark:text-white">{faq.answer}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
