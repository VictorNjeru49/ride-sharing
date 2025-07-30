import { X, Send, Cpu, CircleUserRound } from 'lucide-react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { useState } from 'react'
import { fetchBotReply } from '@/api/UserApi'
import { Button } from '@/components/ui/button'


export function Chatbot() {
      const [mobileSheetOpen, setMobileSheetOpen] = useState(false)
      const [open, setOpen] = useState(false)
      const [draft, setDraft] = useState('')
      const [messages, setMessages] = useState<
        { sender: 'user' | 'bot'; text: string }[]
      >([{ sender: 'bot', text: 'Hi there 👋\nHow can I help you today?' }])
      const [loading, setLoading] = useState(false)
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
    <div>
      {/* ▶︎ Floating avatar button (visible only when closed) */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="hidden md:block fixed bottom-6 right-6 z-50"
          aria-label="Open chatbot"
        >
          <img
            src="/images/chatbot.png"
            alt=""
            className="h-16 w-16 shadow-lg"
          />
        </button>
      )}
      {!mobileSheetOpen && (
        <button
          onClick={() => setMobileSheetOpen(true)}
          className="md:hidden fixed bottom-6 right-6 z-50 bg-blue-600 p-3 rounded-full shadow-lg"
          aria-label="Open mobile chatbot"
        >
          <Send className="h-5 w-5 text-white" />
        </button>
      )}

      {/* ▶︎ Chat window (visible only when open) */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex w-150 max-w-full flex-col rounded-xl border bg-white shadow-lg dark:bg-gray-900">
          {/* header */}
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

          {/* messages */}
          <div className="flex max-h-200 flex-col gap-2 overflow-y-auto px-3 py-2">
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
                  <CircleUserRound className="h-5 w-5 text-green-600 dark:text-green-400 mt-1" />
                )}
              </div>
            ))}

            {loading && (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                Chatbot is typing...
              </p>
            )}
          </div>

          {/* composer */}
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
                  send()
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
    
      {/* ───────── Mobile full‑screen sheet ───────── */}
      <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
        <SheetContent className="p-0">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <h2 className="text-base font-semibold">Chatbot</h2>
            <button
              onClick={() => setMobileSheetOpen(false)}
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages list (reuse your map code) */}
          <div className="flex flex-col gap-2 overflow-y-auto px-3 py-4 flex-1">
            {/* reuse messages.map(...) as you already did */}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 ${
                  m.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
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
                  <CircleUserRound className="h-5 w-5 text-green-600 dark:text-green-400 mt-1" />
                )}
              </div>
            ))}

            {loading && (
              <p className="text-sm text-muted-foreground italic">
                Chatbot is typing…
              </p>
            )}
          </div>

          {/* Composer */}
          <div className="flex items-center gap-2 p-3 border-t">
            <textarea
              rows={2}
              placeholder="Your message…"
              className="flex-1 resize-none rounded-lg border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  send()
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
        </SheetContent>
      </Sheet>
    </div>
  )
}
