import React, { useState } from 'react'
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
} from 'lucide-react'
import { Link, useRouterState, useNavigate } from '@tanstack/react-router'
import { UserRole } from '@/types/alltypes'
import { toast } from 'sonner'
import { authActions, authStore } from '@/app/store'
import { useLogout } from '@/api/LoginApi'
import { PersonPin } from '@mui/icons-material'

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

  // Admin nav with dropdown
  const adminNavItems: NavEntry[] = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <Home className="w-4 h-4" />,
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
      children : [
        {
          name: 'Profile',
          icon: <PersonPin className="w-4 h-4" />,
          path: '/dashboard/adminprofile',
        }
      ]
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
      name: 'Payments',
      path: '/user/payments',
      icon: <CreditCard className="w-4 h-4" />,
    },
    {
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
      children: [
        {
          name: 'Logout',
          icon: <LogOut className="w-4 h-4" />,
          path: '', // path is not used for logout button
        },
      ],
    },
  ]

  const driverNavItems: NavItemBase[] = [
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
      name: 'Earnings',
      path: '/driver/earnings',
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      name: 'Settings',
      path: '/driver/settings',
      icon: <Settings className="w-4 h-4" />,
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
    <aside className="w-64 bg-white shadow-md border-r hidden md:block">
      <div className="p-4 font-bold text-xl border-b">
        <Link to="/">🚗 RideShare</Link>
      </div>
      <nav className="flex flex-col p-4 space-y-2 text-sm font-medium">
        {navItems.map((item) => {
          if ('label' in item) {
            const isOpen = openDropdowns[item.label] ?? false
            return (
              <div key={item.label}>
                <button
                  type="button"
                  onClick={() => toggleDropdown(item.label)}
                  aria-expanded={isOpen}
                  className="flex items-center justify-between w-full px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
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
                            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 w-full text-left"
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
                          className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 ${
                            isActive
                              ? 'bg-blue-100 text-blue-600 font-semibold'
                              : 'text-gray-700'
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
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 w-full text-left"
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
              className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 ${
                isActive
                  ? 'bg-blue-100 text-blue-600 font-semibold'
                  : 'text-gray-700'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export default Layout
