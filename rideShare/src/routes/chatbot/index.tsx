import { createFileRoute } from '@tanstack/react-router'
import React, { useState } from 'react'
import { X, Send, User, Cpu } from 'lucide-react' 
import { Button } from '@/components/ui/button'


export const Route = createFileRoute('/chatbot/')({
  component: RouteComponent,
})

function RouteComponent() {
 const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
const [messages, setMessages] = useState<
  { sender: 'user' | 'bot'; text: string }[]
>([{ sender: 'bot', text: 'Hi there 👋\nHow can I help you today?' }])
  const [loading, setLoading] = useState(false)

  // Example: async function to send message to AI backend (Gemini or similar)
  async function fetchBotReply(userMessage: string): Promise<string> {
    // TODO: Replace this with your Gemini Bot API call
    // For example, a POST request to your backend proxying Gemini API
    // Here is a dummy placeholder response:
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`You said: "${userMessage}". (This is a simulated Gemini Bot reply.)`)
      }, 1000)
    })
  }

 const send = async () => {
   if (!draft.trim()) return
   const userMessage = draft.trim()
   setMessages((prev) => [...prev, { sender: 'user', text: userMessage }])
   setDraft('')
   setLoading(true)

   try {
     const botReply = await fetchBotReply(userMessage)
     setMessages((prev) => [...prev, { sender: 'bot', text: botReply }])
   } catch (error) {
     setMessages((prev) => [
       ...prev,
       { sender: 'bot', text: 'Sorry, something went wrong.' },
     ])
   } finally {
     setLoading(false)
   }
 }
  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50"
          aria-label="Open chatbot"
        >
          <img
            src="/images/chatbot.png"
            alt="Chatbot avatar"
            className="h-16 w-16 shadow-lg"
          />
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex w-108 max-w-full flex-col rounded-xl border bg-white shadow-lg dark:bg-gray-900">
          <header className="flex items-center justify-between rounded-t-xl bg-blue-600 px-3 py-2">
            <h2 className="flex items-center text-sm font-semibold text-white">
              Chatbot
            </h2>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="text-white hover:text-gray-200"
            >
              <X size={18} />
            </button>
          </header>

          <div className="flex max-h-64 flex-col gap-2 overflow-y-auto px-3 py-2">
            <div className="flex justify-end">
              <Button
                className="w-fit bg-red-500 text-white text-xs hover:bg-red-600"
                onClick={() => setMessages([])}
                disabled={loading}
              >
                Clear
              </Button>
            </div>

            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <Cpu className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1" />
                )}
                <p
                  className={`whitespace-pre-line rounded p-2 leading-4 dark:text-gray-100 ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  {m.text}
                </p>
                {m.sender === 'user' && (
                  <User className="h-5 w-5 text-green-600 dark:text-green-400 mt-1" />
                )}
              </div>
            ))}

            {loading && (
              <p className="text-sm italic text-gray-500 dark:text-gray-400">
                Bot is typing...
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 p-3">
            <textarea
              rows={2}
              placeholder="Your message…"
              className="flex-1 resize-none rounded-lg border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  if (!loading) send()
                }
              }}
              disabled={loading}
            />
            <button
              onClick={send}
              disabled={!draft.trim() || loading}
              aria-label="Send"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

