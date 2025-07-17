import React, { useEffect, useState } from 'react'
import {
  Users,
  Car,
  DollarSign,
  User,
  Settings,
  BarChart,
  CreditCard,
  Home,
  ChevronDown,
  ChevronUp,
  LogOut,
  Star,
  UserRoundPen,
  History,
  ArrowRightLeft,
  CalendarDays,
  Truck,
  PhoneCall,
  MonitorSmartphone,
  Inbox,
} from 'lucide-react'
import { Link, useRouterState, useNavigate } from '@tanstack/react-router'
import { UserRole } from '@/types/alltypes'
import { toast } from 'sonner'
import { authActions, authStore } from '@/app/store'
import { useLogout } from '@/api/LoginApi'

type NavItemBase = {
  name: string
  path: string
  icon: React.ReactNode
}

type NavDropdown = {
  label: string
  icon?: React.ReactNode
  children: NavItemBase[]
}

type NavEntry = NavItemBase | NavDropdown

function Layout({ role }: { role: UserRole }) {
  const router = useRouterState()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const logout = useLogout()
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
    {},
  )

  const toggleDropdown = (label: string) => {
    setOpenDropdowns((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  const handleLogout = () => {
    const userId = authStore.state.user?.id
    if (!userId) {
      toast.error('User ID not found.')
      return
    }

    logout.mutate(userId, {
      onSuccess: () => {
        authActions.deleteUser()
        toast.success('Logged out successfully!')
        navigate({ to: '/login' })
      },
      onError: (error: any) => {
        toast.error(
          `Logout failed: ${error?.response?.data?.message || error.message}`,
        )
      },
    })
  }
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  // Admin nav with dropdown
  const adminNavItems: NavEntry[] = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <Home className="w-4 h-4" />,
    },
    {
      name: 'Inbox',
      path: '/dashboard/inbox',
      icon: <Inbox className="w-4 h-4" />,
    },
    {
      label: 'Management',
      icon: <Users className="w-4 h-4" />,
      children: [
        {
          name: 'Users',
          path: '/dashboard/users',
          icon: <Users className="w-4 h-4" />,
        },
        {
          name: 'Promocode',
          path: '/dashboard/promocode',
          icon: <User className="w-4 h-4" />,
        },
        {
          name: 'Trips',
          path: '/dashboard/trips',
          icon: <Car className="w-4 h-4" />,
        },
        {
          name: 'Vehicle',
          path: '/dashboard/vehicle',
          icon: <Car className="w-4 h-4" />,
        },
      ],
    },
    {
      name: 'Payments',
      path: '/dashboard/payments',
      icon: <CreditCard className="w-4 h-4" />,
    },
    {
      name: 'Analytics',
      path: '/dashboard/analytics',
      icon: <BarChart className="w-4 h-4" />,
    },
    {
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
      children: [
        {
          name: 'Profile',
          icon: <UserRoundPen className="w-4 h-4" />,
          path: '/dashboard/adminprofile',
        },
        {
          name: 'Devices',
          icon: <MonitorSmartphone className="w-4 h-4" />,
          path: '',
        },
        {
          name: 'Logout',
          icon: <LogOut className="w-4 h-4" />,
          path: '',
        },
      ],
    },
  ]

  const userNavItems: NavEntry[] = [
    {
      name: 'User Home',
      path: '/user/',
      icon: <Home className="w-4 h-4" />,
    },
    {
      name: 'My Trips',
      path: '/user/trips',
      icon: <Car className="w-4 h-4" />,
    },
    {
      name: 'Inbox',
      path: '/user/inbox',
      icon: <Inbox className="w-4 h-4" />,
    },
    {
      name: 'Wallet',
      path: '/user/wallet',
      icon: <CreditCard className="w-4 h-4" />,
    },
    {
      name: 'Review',
      path: '/user/reviews',
      icon: <Star className="w-4 h-4" />,
    },
    {
      name: 'Ride History',
      path: '/user/ridehistory',
      icon: <History className="w-4 h-4" />,
    },
    {
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
      children: [
        {
          name: 'Profile',
          icon: <UserRoundPen className="w-4 h-4" />,
          path: '/user/userprofile',
        },
        {
          name: 'Devices',
          icon: <MonitorSmartphone className="w-4 h-4" />,
          path: '/user/devices',
        },
        {
          name: 'Support',
          path: '/user/support',
          icon: <PhoneCall className="w-4 h-4" />,
        },
        {
          name: 'Logout',
          icon: <LogOut className="w-4 h-4" />,
          path: '',
        },
      ],
    },
  ]

  const driverNavItems: NavEntry[] = [
    {
      name: 'Driver Dashboard',
      path: '/driver',
      icon: <Home className="w-4 h-4" />,
    },
    {
      name: 'My Trips',
      path: '/driver/trips',
      icon: <Car className="w-4 h-4" />,
    },
    {
      name: 'Inbox',
      path: '/driver/inbox',
      icon: <Inbox className="w-4 h-4" />,
    },
    {
      name: 'Earnings',
      path: '/driver/earnings',
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      name: 'Ride Requests',
      path: '/driver/requests',
      icon: <ArrowRightLeft className="w-4 h-4" />,
    },
    {
      name: 'Schedule',
      path: '/driver/schedule',
      icon: <CalendarDays className="w-4 h-4" />,
    },
    {
      name: 'Vehicle Info',
      path: '/driver/vehicle',
      icon: <Truck className="w-4 h-4" />,
    },
    {
      label: 'Settings',
      path: '/driver/settings',
      icon: <Settings className="w-4 h-4" />,
      children: [
        {
          name: 'Support',
          path: '/driver/support',
          icon: <PhoneCall className="w-4 h-4" />,
        },
        {
          name: 'Profile',
          path: '/driver/driverprofile',
          icon: <User className="w-4 h-4" />,
        },
        {
          name: 'Devices',
          icon: <MonitorSmartphone className="w-4 h-4" />,
          path: '',
        },
        {
          name: 'Logout',
          path: '',
          icon: <LogOut className="w-4 h-4" />,
        },
      ],
    },
  ]

  let navItems: NavEntry[] = []
  if (role === UserRole.ADMIN) {
    navItems = adminNavItems
  } else if (role === UserRole.RIDER) {
    navItems = userNavItems
  } else if (role === UserRole.DRIVER) {
    navItems = driverNavItems
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden p-4 flex items-center justify-between bg-white dark:bg-gray-900 shadow border-b border-gray-200 dark:border-gray-700">
        <button
          className="text-gray-700 dark:text-gray-300"
          onClick={() => setMobileOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <span className="text-lg font-semibold text-gray-900 dark:text-white">
          🚗 RideShare
        </span>
      </div>

      {/* Main Wrapper */}
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 shadow-md border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col min-h-screen">
          <div className="p-4 font-bold text-xl border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <Link to="/" className="text-gray-900 dark:text-white">
              🚗 RideShare
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col flex-grow p-4 space-y-2 text-sm font-medium">
            {navItems.map((item) => {
              if ('label' in item) {
                const isOpen = openDropdowns[item.label] ?? false
                return (
                  <div key={item.label}>
                    <button
                      type="button"
                      onClick={() => toggleDropdown(item.label)}
                      aria-expanded={isOpen}
                      className="flex items-center justify-between w-full px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 dark:text-white dark:hover:bg-gray-700"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        {item.icon || <Users className="w-4 h-4" />}
                        {item.label}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="ml-6 mt-2 flex flex-col space-y-1">
                        {item.children.map((sub) => {
                          if (sub.name === 'Logout') {
                            return (
                              <button
                                key="logout-button"
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-700 text-gray-700 w-full text-left dark:text-white"
                                type="button"
                              >
                                {sub.icon}
                                {sub.name}
                              </button>
                            )
                          }

                          const isActive = router.location.pathname === sub.path
                          return (
                            <Link
                              key={sub.path}
                              to={sub.path}
                              className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white ${
                                isActive
                                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-semibold'
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {sub.icon}
                              {sub.name}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              }

              if (item.name === 'Logout') {
                return (
                  <button
                    key="logout-button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 w-full text-left dark:text-white"
                    type="button"
                  >
                    {item.icon}
                    {item.name}
                  </button>
                )
              }

              const isActive = router.location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-700 ${
                    isActive
                      ? 'bg-blue-200 text-blue-600 font-semibold'
                      : 'text-gray-700 dark:text-white'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center gap-3">
            <img
              src={
                authStore.state.avatar?.profilePicture ||
                'https://ui-avatars.com/api/?name=User'
              }
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
            />
            <div className="text-sm leading-tight text-gray-800 dark:text-gray-200">
              <p className="font-medium">
                {authStore.state.user?.email || 'Unknown'}
              </p>
              <p className="text-xs capitalize">
                {authStore.state.user?.role || 'N/A'}
              </p>
            </div>
          </div>
        </aside>
        {/* Main Content (placeholder) */}
        <div className="flex-1 p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          {/* Your outlet or main children goes here */}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-black/50">
          <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50 p-4 flex flex-col dark:bg-gray-700">
            <button
              className="self-end mb-4"
              onClick={() => setMobileOpen(false)}
            >
              ✕
            </button>
            <nav className="space-y-2 text-sm font-medium overflow-y-auto">
              {navItems.map((item) => {
                if ('label' in item) {
                  const isOpen = openDropdowns[item.label] ?? false
                  return (
                    <div key={item.label}>
                      <button
                        onClick={() => toggleDropdown(item.label)}
                        className="flex items-center justify-between w-full px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 dark:text-white dark:hover:bg-gray-900"
                      >
                        <span className="flex items-center gap-2 dark:text-white">
                          {item.icon}
                          {item.label}
                        </span>
                        {isOpen ? <ChevronUp /> : <ChevronDown />}
                      </button>
                      {isOpen && (
                        <div className="ml-6 mt-2 flex flex-col space-y-1">
                          {item.children.map((sub) =>
                            sub.name === 'Logout' ? (
                              <button
                                key="logout-button"
                                onClick={handleLogout}
                                className="text-left flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 dark:text-white dark:hover:bg-gray-900"
                              >
                                {sub.icon}
                                {sub.name}
                              </button>
                            ) : (
                              <Link
                                key={sub.path}
                                to={sub.path}
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 dark:text-white dark:hover:bg-gray-900"
                              >
                                {sub.icon}
                                {sub.name}
                              </Link>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  )
                }

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 dark:text-white dark:hover:bg-gray-900"
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </aside>
        </div>
      )}
    </>
  )
}

export default Layout
