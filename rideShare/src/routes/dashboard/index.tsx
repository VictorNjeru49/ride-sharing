import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Bell, Users, Car, DollarSign, User } from 'lucide-react'
import { useLogout } from '@/api/LoginApi'
import { useNavigate } from '@tanstack/react-router'
import { toast, Toaster } from 'sonner'
import { authActions, authStore } from '@/app/store'
import { UserRole, type userTypes } from '@/types/alltypes'
import { useCrudOperations } from '@/hooks/crudops'
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from '@/api/UserApi'
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  const userId = authStore.state.user?.id

  const { data: user, isLoading } = useQuery({
    queryKey: ['users', userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId,
  })

  const displayName = user?.firstName || 'Admin'
  

  const { query } = useCrudOperations<
    userTypes,
    Partial<userTypes>,
    Partial<userTypes>,
    string
  >(
    { all: ['Allusers', userId], details: (id) => ['users', id] },
    {
      fetchFn: getUsers,
      createFn: createUser,
      updateFn: updateUser,
      deleteFn: deleteUser,
    },
  )

  const datas = query.data || []
  const logout = useLogout()
  const navigate = useNavigate()

  const handleLogout = () => {
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
    })
  }

  console.log(`The array data: `, datas)
  if (isLoading) {
    return <div>Loading dashboard...</div>
  }
  
  
  return (
    <>
      {/* Main content */}
      <main className="flex-1 p-6">
        <Toaster />
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Dashboard Overview</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {displayName} manage your rideshare platform
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="w-5 h-5" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  {user?.profilePicture ? (
                    <AvatarImage src={user.profilePicture} />
                  ) : (
                    <AvatarFallback>
                      {(user?.firstName?.[0] || 'A') +
                        (user?.lastName?.[0] || '')}
                    </AvatarFallback>
                  )}
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>
                  <button
                    onClick={handleLogout}
                    // className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
                  >
                    Logout
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Active Drivers</CardTitle>
              <Users className="w-5 h-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {/* 2,847 */}
                {datas.filter((user) => user.role === UserRole.DRIVER).length}
              </p>
              <p className="text-sm text-green-600">↑ 12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Total Trips</CardTitle>
              <Car className="w-5 h-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">18,542</p>
              <p className="text-sm text-green-600">↑ 8% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Revenue</CardTitle>
              <DollarSign className="w-5 h-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">$284,750</p>
              <p className="text-sm text-green-600">↑ 15% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Active Users</CardTitle>
              <User className="w-5 h-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {datas.filter((user) => user.role === UserRole.RIDER).length}.
              </p>
              <p className="text-sm text-red-500">↓ 2% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts/Trends Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>Last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Insert chart here */}
              <div className="h-40 bg-gray-100 rounded-md" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex justify-between">
              <CardTitle>Trip Distribution</CardTitle>
              <Button variant="link" size="sm">
                View Details
              </Button>
            </CardHeader>
            <CardContent>
              {/* Insert chart here */}
              <div className="h-40 bg-gray-100 rounded-md" />
            </CardContent>
          </Card>
        </div>

        {/* Recent Trips and Top Drivers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex justify-between">
              <CardTitle>Recent Trips</CardTitle>
              <Button variant="link" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  name: 'Sarah Johnson',
                  route: 'Downtown → Airport',
                  amount: '$24.50',
                  status: 'Completed',
                },
                {
                  name: 'Mike Chen',
                  route: 'Mall → University',
                  amount: '$18.75',
                  status: 'In Progress',
                },
                {
                  name: 'Emily Davis',
                  route: 'Hotel → Station',
                  amount: '$32.20',
                  status: 'Completed',
                },
              ].map((trip, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-medium">{trip.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {trip.route}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{trip.amount}</p>
                    <p
                      className={`text-xs ${trip.status === 'Completed' ? 'text-green-600' : 'text-blue-600'}`}
                    >
                      {trip.status}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex justify-between">
              <CardTitle>Top Drivers</CardTitle>
              <Button variant="link" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  name: 'David Wilson',
                  rating: 4.9,
                  rides: 324,
                  earnings: '$2,847',
                },
                {
                  name: 'Alex Rodriguez',
                  rating: 4.8,
                  rides: 287,
                  earnings: '$2,634',
                },
                {
                  name: 'James Thompson',
                  rating: 4.7,
                  rides: 256,
                  earnings: '$2,421',
                },
              ].map((driver, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarImage
                        src={`https://i.pravatar.cc/150?img=${i + 2}`}
                      />
                      <AvatarFallback>
                        {driver.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{driver.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ⭐ {driver.rating} ({driver.rides} rides)
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold">{driver.earnings}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
      {/* </div> */}
    </>
  )
}
