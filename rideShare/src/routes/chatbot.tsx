import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/chatbot')({
  component: RouteComponent,
})

function RouteComponent() {
  const [open, setOpen] = useState(true) // open immediately; toggleable
  const [draft, setDraft] = useState('') // input state
  const [msgs, setMsgs] = useState<string[]>([])

  const send = () => {
    if (!draft.trim()) return
    setMsgs([...msgs, draft.trim()])
    setDraft('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* ☰ Floating open / close button */}
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 right-6 z-50 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700"
        >
          💬
        </Button>
      </DialogTrigger>

      {/* 💬 Chat panel */}
      <DialogContent
        className="fixed bottom-4 right-6 m-0 w-[20rem] rounded-xl shadow-lg"
        // hideClose
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            RideBot&nbsp;Support
          </DialogTitle>
        </DialogHeader>

        {/* message history */}
        <div className="flex max-h-72 flex-col gap-2 overflow-y-auto pr-1">
          {msgs.map((m, i) => (
            <p
              key={i}
              className="self-end max-w-[80%] rounded-lg bg-blue-600 px-3 py-1 text-sm text-white"
            >
              {m}
            </p>
          ))}
        </div>

        {/* composer */}
        <div className="mt-2 flex gap-2">
          <Input
            placeholder="Type a message…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            className="flex-1"
            autoFocus
          />
          <Button onClick={send} disabled={!draft.trim()}>
            Send
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
