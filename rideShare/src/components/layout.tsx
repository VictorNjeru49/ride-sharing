import {
  Users,
  Car,
  DollarSign,
  User,
  Settings,
  BarChart,
  CreditCard,
  Home,
} from 'lucide-react'
import { Link, useRouterState } from '@tanstack/react-router'
import { UserRole } from '@/types/alltypes'

function Layout({ role }: { role: UserRole }) {
  const router = useRouterState()

  
  const adminNavItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <Home className="w-4 h-4" />,
    },
    {
      name: 'Drivers',
      path: '/dashboard/driver',
      icon: <Users className="w-4 h-4" />,
    },
    {
      name: 'Passengers',
      path: '/dashboard/passengers',
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
      name: 'Settings',
      path: '/dashboard/settings',
      icon: <Settings className="w-4 h-4" />,
    },
  ]

  const userNavItems = [
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
      name: 'Settings',
      path: '/user/settings',
      icon: <Settings className="w-4 h-4" />,
    },
  ]

  const driverNavItems = [
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

  // Select nav items based on role
  interface NavItem {
    name: string
    path: string
    icon: React.ReactNode
  }

  let navItems: NavItem[] = []
  if (role === UserRole.ADMIN) {
    navItems = adminNavItems
  } else if (role === UserRole.RIDER) {
    navItems = userNavItems
  } else if (role === UserRole.DRIVER) {
    navItems = driverNavItems
  } else {
    navItems = [] // or some default nav items or empty
  }


  return (
    <aside className="w-64 bg-white shadow-md border-r hidden md:block">
      <div className="p-4 font-bold text-xl border-b">
        <Link to="/">🚗 RideShare</Link>
      </div>
      <nav className="flex flex-col p-4 space-y-2 text-sm font-medium">
        {navItems.map((item) => {
          const isActive = router.location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 ${
                isActive
                  ? 'bg-blue-100 text-blue-600 font-semibold'
                  : 'text-gray-700'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export default Layout
