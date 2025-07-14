import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronDown, ChevronUp } from 'lucide-react'

export const Route = createFileRoute('/driver/support')({
  component: RouteComponent,
})

type FAQ = {
  question: string
  answer: string
}

const faqList: FAQ[] = [
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
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center">Driver Support FAQ</h1>

      <div className="flex  gap-2 items-center">
        <Input
          placeholder="Ask a question..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={handleSearch}>Ask Bot</Button>
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-wrap text-gray-500 text-center mt-4">
          No results found. Try a different question.
        </div>
      )}

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
                <p className="font-medium text-base">{faq.question}</p>
                {expandedIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </div>
              {expandedIndex === index && (
                <p className="mt-2 text-sm text-gray-700">{faq.answer}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
