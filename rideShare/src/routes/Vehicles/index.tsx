import { useState, useMemo } from 'react'
import FilterComponent from '@/components/FilterComponent'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useCrudOperations } from '@/hooks/crudops'
import type { Vehicle } from '@/types/alltypes'
import {
  getVehicles,
  createVehicles,
  updateVehicles,
  deleteVehicles,
} from '@/api/UserApi'
import { toast, Toaster } from 'sonner'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Sun, Moon, CarTaxiFrontIcon } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/Vehicles/')({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const [searchText, setSearchText] = useState('')
  const [filterBy, setFilterBy] = useState('all')


  const { query } = useCrudOperations<
    Vehicle,
    Partial<Omit<Vehicle, 'id'>>,
    Partial<Omit<Vehicle, 'id'>>,
    string
  >(
    {
      all: ['vehicle'],
      details: (id: string) => ['vehicles', id],
    },
    {
      fetchFn: () => getVehicles(),
      createFn: (userData) => createVehicles(userData),
      updateFn: (id, userData) => updateVehicles(id, userData),
      deleteFn: (userId: string) => deleteVehicles(userId),
    },
  )

  const allVehicles = query.data ?? []

  // Filter vehicles based on searchText and filterBy
  const filteredVehicles = useMemo(() => {
    if (!searchText.trim()) return allVehicles

    const lowerSearch = searchText.toLowerCase()

    return allVehicles.filter((vehicle) => {
      if (filterBy === 'all') {
        return (
          vehicle.make.toLowerCase().includes(lowerSearch) ||
          vehicle.model.toLowerCase().includes(lowerSearch) ||
          vehicle.color.toLowerCase().includes(lowerSearch) ||
          vehicle.plateNumber.toLowerCase().includes(lowerSearch) ||
          vehicle.capacity.toString().includes(lowerSearch) ||
          vehicle.year.toString().includes(lowerSearch) ||
          vehicle.vehicleType.toLowerCase().includes(lowerSearch)
        )
      } else {
        switch (filterBy) {
          case 'make':
            return vehicle.make.toLowerCase().includes(lowerSearch)
          case 'model':
            return vehicle.model.toLowerCase().includes(lowerSearch)
          case 'color':
            return vehicle.color.toLowerCase().includes(lowerSearch)
          case 'plate number':
            return vehicle.plateNumber.toLowerCase().includes(lowerSearch)
          case 'capacity':
            return vehicle.capacity.toString().includes(lowerSearch)
          case 'year':
            return vehicle.year.toString().includes(lowerSearch)
          case 'type':
            return vehicle.vehicleType.toLowerCase().includes(lowerSearch)
          default:
            return false
        }
      }
    })
  }, [allVehicles, searchText, filterBy])



  function handleBookNow(vehicle: Vehicle) {
    toast.success(
      `Booking requested for ${vehicle.make} ${vehicle.model} (${vehicle.plateNumber})`,
    )
    router.navigate({
      to: '/Vehicles/$VehiclesId',
      params: { VehiclesId: vehicle.id },
    })
  }


  return (
    <>
      <Toaster />
      <header className="w-full py-4 px-6 bg-white dark:bg-gray-900 shadow-sm flex justify-between items-center transition-colors duration-500">
        <div className="flex items-center space-x-2 text-lg font-bold text-blue-600">
          <CarTaxiFrontIcon />
          <Link to="/" className="hover:text-blue-800">
            RideShare
          </Link>
        </div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Vehicles
        </h1>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="relative"
              title="Toggle theme"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <FilterComponent
        searchText={searchText}
        filterBy={filterBy}
        setSearchText={setSearchText}
        setFilterBy={setFilterBy}
      />

      <div className="min-h-screen bg-gray-100 dark:bg-gray-800 flex justify-center items-start p-8 border transition-colors duration-500">
        <Toaster />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl w-full">
          {filteredVehicles.map((vehicle) => (
            <Card
              key={vehicle.id}
              className="border border-gray-200 dark:border-gray-700 transition-colors duration-500"
            >
              <img
                src={vehicle.vehicleImage}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="rounded-t-lg w-full h-48 object-cover"
              />
              <CardHeader>
                <CardTitle>
                  {vehicle.make} {vehicle.model}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <strong>Plate Number:</strong> {vehicle.plateNumber}
                </p>
                <p>
                  <strong>Color:</strong> {vehicle.color}
                </p>
                <p>
                  <strong>Capacity:</strong> {vehicle.capacity} persons
                </p>
                <p>
                  <strong>Year:</strong> {vehicle.year}
                </p>
                <p>
                  <strong>Type:</strong> {vehicle.vehicleType}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handleBookNow(vehicle)}
                  disabled={!vehicle.available}
                  variant={vehicle.available ? 'default' : 'outline'}
                  title={vehicle.available ? 'Book Now' : 'Unavailable'}
                >
                  Book Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
