import { CarTaxiFrontIcon, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from '@/components/theme-provider'
import { useState } from 'react'
import { X, Send } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export default function Header() {
  const { setTheme } = useTheme()
     const [open, setOpen] = useState(false)
     const [draft, setDraft] = useState('')
     const [messages, setMessages] = useState<string[]>([
       'Hi there 👋\nHow can I help you today?',
     ])

     const send = () => {
       if (!draft.trim()) return
       setMessages([...messages, draft.trim()])
       setDraft('')
     }

     const clearMessages = () => {
       setMessages([])
     }



  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-gray-900 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Left: Logo */}
        <div className="flex items-center space-x-2 text-lg font-bold text-blue-600">
          <CarTaxiFrontIcon />
          <Link to="/" className="hover:text-blue-800">
            RideShare
          </Link>
        </div>

        {/* Center: Nav */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Link
            to="/"
            className="hover:text-blue-600"
            activeProps={{ className: 'text-blue-600 font-bold' }}
          >
            Home
          </Link>
          <Link
            to="/Vehicles"
            className="hover:text-blue-600"
            activeProps={{ className: 'text-blue-600 font-bold' }}
          >
            Book Now
          </Link>
          <Link
            to="/about"
            className="hover:text-blue-600"
            activeProps={{ className: 'text-blue-600 font-bold' }}
          >
            About
          </Link>
            <Link
            to="/contact"
            className="hover:text-blue-600"
            activeProps={{ className: 'text-blue-600 font-bold' }}
          >
            Contact
          </Link>
          <Link
            to="/dashboard"
            className="hidden hover:text-blue-600"
            activeProps={{ className: 'text-blue-600 font-bold' }}
          >
            Dashboard
          </Link>
        </nav>

        {/* Right: Auth + Theme Toggle */}
        <div className="flex items-center space-x-3">
          <Link to="/login">
            <Button
              variant="ghost"
              className="text-sm text-gray-800 dark:text-gray-200"
            >
              Sign In
            </Button>
          </Link>
          <Link to="/register">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium">
              Sign Up
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ▶︎ Floating avatar button (visible only when closed) */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50"
          aria-label="Open chatbot"
        >
          <img
            src="/images/chatbot.png"
            alt=""
            className="h-16 w-16 rounded-full shadow-lg"
          />
        </button>
      )}

      {/* ▶︎ Chat window (visible only when open) */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex w-108 max-w-full flex-col rounded-xl border bg-white shadow-lg dark:bg-gray-900">
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
          <div className="flex max-h-64 flex-col gap-2 overflow-y-auto px-3 py-2">
            <div className="flex justify-end">
              <Button
                className="w-fit bg-red-500 text-white text-xs hover:bg-red-600"
                onClick={() => setMessages([])}
              >
                Clear
              </Button>
            </div>

            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${i % 2 ? 'justify-end' : 'justify-start'} text-sm`}
              >
                <p className="whitespace-pre-line rounded bg-gray-200 p-2 leading-4 dark:bg-gray-700 dark:text-gray-100">
                  {m}
                </p>
              </div>
            ))}
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
            />
            <button
              onClick={send}
              disabled={!draft.trim()}
              aria-label="Send"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
