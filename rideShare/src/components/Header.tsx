import { CarTaxiFrontIcon, Moon, Sun, X } from 'lucide-react'
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
import { authStore, authActions } from '@/app/store'
import { useNavigate } from '@tanstack/react-router'
import { LogOut, User2, Menu } from 'lucide-react'
import { UserRole } from '@/types/alltypes'



export default function Header() {
  const navigate = useNavigate()
  const { user, tokens } = authStore.state
  const isLoggedIn = !!user.id && !!tokens.accessToken
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const { setTheme } = useTheme()


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
        <nav className="hidden md:hidden lg:flex space-x-6 text-sm font-medium text-gray-700 dark:text-gray-300">
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
          {/* Conditionally show Dashboard or Request link */}
          {isLoggedIn && user.role === UserRole.ADMIN && (
            <Link
              to="/dashboard"
              className="hover:text-blue-600"
              activeProps={{ className: 'text-blue-600 font-bold' }}
            >
              Dashboard
            </Link>
          )}
          {isLoggedIn && user.role === UserRole.DRIVER && (
            <Link
              to="/requests"
              className="hover:text-blue-600"
              activeProps={{ className: 'text-blue-600 font-bold' }}
            >
              Request
            </Link>
          )}
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
                    navigate({ to: '/login' })
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
          className="md:flex lg:hidden text-gray-700 dark:text-gray-200"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>
  {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden lg:hidden">
          <div className="absolute top-0 right-0 w-64 h-full bg-white dark:bg-gray-900 shadow-lg p-6 space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Menu
              </h2>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            <nav className="flex flex-col space-y-4 ">
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
                          className="text-sm dark:text-gray-200 dark:hover:bg-gray-700"
                        >
                          Sign In
                        </Button>
                      </Link>
                      <Link to="/register">
                        <Button className=" text-sm dark:text-gray-200 bg-transparent dark:hover:bg-gray-700">
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
  
    </header>
  )
}
