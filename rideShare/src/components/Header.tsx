import { Link } from '@tanstack/react-router'
import { CarTaxiFrontIcon, Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from '@/components/theme-provider'

export default function Header() { 
  const { setTheme } = useTheme()

  return (
    <>
      <header className="w-full bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center space-x-2 font-bold text-lg text-blue-600">
            <CarTaxiFrontIcon className=" border-b-blue-700" />
            <Link to="/" className="hover:text-blue-800">
              RideShare
            </Link>
          </div>

          {/* Center: Navigation */}
          <nav className="hidden md:flex space-x-6 font-medium text-gray-700">
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
              to="/dashboard"
              className="hover:text-blue-600 hidden"
              activeProps={{ className: 'text-blue-600 font-bold' }}
            >
              Dashboard
            </Link>
          </nav>

          {/* Right: Auth + Theme */}
          <div className="flex items-center space-x-3">
            <Link to="/login">
              <Button
                variant="ghost"
                className="text-sm text-gray-800 hover:text-blue-600"
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
                <Button variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
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
      </header>
      <div className='absolute right-10 rounded-full -bottom-1/12'>
    <img src='../../images/chatbot.png' className='w-16'/>
      </div>
    </>
  )
}
