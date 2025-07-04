import { createVehicles, deleteVehicles, getVehicles, updateUser, updateVehicles } from '@/api/UserApi'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useCrudOperations } from '@/hooks/crudops'
import type { Vehicle } from '@/types/alltypes'
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { toast, Toaster } from 'sonner'

export const Route = createFileRoute('/Vehicles/')({
  component: RouteComponent,
})
type Vehicles = {
  id: number
  vehicleImage: string
  make: string
  model: string
  plateNumber: string
  color: string
  capacity: number
  year: number
  vehicleType: string
}

// Sample enhanced vehicle data array
const vehicles: Vehicles[] = [
  {
    id: 1,
    vehicleImage:
      'https://media.dealervenom.com/jellies/Toyota/Corolla%20Hatchback/C456983_040_Front.png?auto=compress%2Cformat',
    make: 'Toyota',
    model: 'Corolla',
    plateNumber: 'ABC-1234',
    color: 'White',
    capacity: 5,
    year: 2020,
    vehicleType: 'Sedan',
  },
  {
    id: 2,
    vehicleImage:
      'https://di-uploads-pod21.dealerinspire.com/hendrickhondacharleston/uploads/2024/08/mlp-img-top-2025-civic-hybrid.png',
    make: 'Honda',
    model: 'Civic',
    plateNumber: 'DEF-5678',
    color: 'Black',
    capacity: 5,
    year: 2019,
    vehicleType: 'Sedan',
  },
  {
    id: 3,
    vehicleImage:
      'https://d2qldpouxvc097.cloudfront.net/image-by-path?bucket=a5-gallery-serverless-prod-chromebucket-1iz9ffi08lwxm&key=439073%2Ffront34%2Flg%2Fa0222d',
    make: 'Ford',
    model: 'Mustang',
    plateNumber: 'GHI-9012',
    color: 'Red',
    capacity: 4,
    year: 2021,
    vehicleType: 'Coupe',
  },
]

function RouteComponent() {
  const queryClient = useQueryClient()
  const { query } = useCrudOperations<
    Vehicle,
    Partial<Omit<Vehicle, 'id'>>,
    Partial<Omit<Vehicle, 'id'>>,
    string
  >(
    {
      all: ['vehicle'],
      details: (id: string) => ['users', id],
    },
    {
      fetchFn: () => getVehicles(),
      createFn: (userData) => createVehicles(userData),
      updateFn: (id, userData) => updateVehicles(id, userData),
      deleteFn: (userId: string) => deleteVehicles(userId),
    },
  )

 const allVehicle = query.data ?? [];

  function handleBookNow(vehicle: Vehicles) {
    toast.success(
      `Booking requested for ${vehicle.make} ${vehicle.model} (${vehicle.plateNumber})`,
    )
    // Replace alert with real booking logic or navigation
  }
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-8">
      <Toaster />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl w-full">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="border border-gray-200">
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
              <Button onClick={() => handleBookNow(vehicle)}>Book Now</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
