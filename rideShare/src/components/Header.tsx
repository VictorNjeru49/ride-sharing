import { CarTaxiFrontIcon, Moon, Sun, Cpu, CircleUserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from '@/components/theme-provider'
import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { fetchBotReply } from '@/api/UserApi'
import { authStore, authActions } from '@/app/store'
import { useNavigate } from '@tanstack/react-router'
import { LogOut, User2, X, Send, Menu } from 'lucide-react'
import { UserRole } from '@/types/alltypes'
import { Sheet, SheetContent } from '@/components/ui/sheet'



export default function Header() {
  const navigate = useNavigate()
  const { user, tokens } = authStore.state
  const isLoggedIn = !!user.id && !!tokens.accessToken
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false)

  const { setTheme } = useTheme()
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
    <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-gray-900 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Left: Logo */}
        <div className="flex items-center space-x-2 lg:text-lg font-bold text-blue-600 md:text-xs">
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
        <div className="hidden  items-center space-x-3 md:hidden sm:hidden lg:flex">
          {!isLoggedIn ? (
            <>
              <Link to="/login">
                <Button variant="ghost" className="text-sm dark:text-gray-200">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm">
                  Sign Up
                </Button>
              </Link>
            </>
          ) : (
            /* ─ Logged‑in dropdown ─ */
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User2 className="w-5 h-5" />
                  <span className="sr-only">Account options</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-44">
                {/* Role‑aware landing link */}
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault()
                    const role = user.role
                    navigate({
                      to:
                        role === UserRole.RIDER
                          ? '/user'
                          : role === UserRole.DRIVER
                            ? '/driver'
                            : '/',
                    })
                  }}
                >
                  {user.role === UserRole.ADMIN
                    ? 'Dashboard'
                    : user.role === UserRole.DRIVER
                      ? 'Driver Home'
                      : 'My Profile'}
                </DropdownMenuItem>

                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault()
                    const role = user.role
                    navigate({
                      to:
                        role === UserRole.RIDER
                          ? '/user/wallet'
                          : role === UserRole.DRIVER
                            ? '/driver/earnings'
                            : '/',
                    })
                  }}
                >
                  Account
                </DropdownMenuItem>

                <DropdownMenuItem
                  onSelect={() => {
                    authActions.deleteUser()
                    navigate({ to: '/' })
                  }}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
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
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden text-gray-700 dark:text-gray-200"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

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
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden">
          <div className="absolute top-0 right-0 w-64 h-full bg-white dark:bg-gray-900 shadow-lg p-6 space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Menu
              </h2>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 dark:text-gray-200"
              >
                Home
              </Link>
              <Link
                to="/Vehicles"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 dark:text-gray-200"
              >
                Book Now
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 dark:text-gray-200"
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 dark:text-gray-200"
              >
                Contact
              </Link>
              <div className=" items-center space-x-3 ">
                {!isLoggedIn ? (
                  <>
                    <div className="flex flex-col ">
                      <Link to="/login">
                        <Button
                          variant="ghost"
                          className="text-sm dark:text-gray-200"
                        >
                          Sign In
                        </Button>
                      </Link>
                      <Link to="/register">
                        <Button className=" text-sm dark:text-gray-200 bg-transparent">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  </>
                ) : (
                  /* ─ Logged‑in dropdown ─ */
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <User2 className="w-5 h-5" />
                        <span className="sr-only">Account options</span>
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-44">
                      {/* Role‑aware landing link */}
                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.preventDefault()
                          const role = user.role
                          navigate({
                            to:
                              role === UserRole.RIDER
                                ? '/user'
                                : role === UserRole.DRIVER
                                  ? '/driver'
                                  : '/',
                          })
                        }}
                      >
                        {user.role === UserRole.ADMIN
                          ? 'Dashboard'
                          : user.role === UserRole.DRIVER
                            ? 'Driver Home'
                            : 'My Profile'}
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.preventDefault()
                          const role = user.role
                          navigate({
                            to:
                              role === UserRole.RIDER
                                ? '/user/wallet'
                                : role === UserRole.DRIVER
                                  ? '/driver/earnings'
                                  : '/',
                          })
                        }}
                      >
                        Account
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onSelect={() => {
                          authActions.deleteUser()
                          navigate({ to: '/' })
                        }}
                        className="text-red-600 focus:text-red-600"
                      >
                        <LogOut className="w-4 h-4 mr-2" /> Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
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
            </nav>
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
    </header>
  )
}
