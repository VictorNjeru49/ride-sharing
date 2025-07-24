// ✅ Converted to shadcn/ui
import { useMemo, useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Drawer } from '@/components/ui/drawer'
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from '@/components/ui/table'
import { useQueryClient } from '@tanstack/react-query'
import { useCrudOperations } from '@/hooks/crudops'
import type { Vehicle } from '@/types/alltypes'
import {
  createVehicles,
  deleteVehicles,
  getVehicles,
  updateVehicles,
} from '@/api/UserApi'
import { toast, Toaster } from 'sonner'
import { Trash2, PencilLine, Plus } from 'lucide-react'

export const Route = createFileRoute('/dashboard/vehicle')({
  component: RouteComponent,
})

function RouteComponent() {
  const queryClient = useQueryClient()
  const {
    create,
    query,
    update,
    delete: deleteVehicle,
  } = useCrudOperations<
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
      fetchFn: getVehicles,
      createFn: createVehicles,
      updateFn: updateVehicles,
      deleteFn: deleteVehicles,
    },
  )

  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 5

  const allData = query.data ?? []

  useEffect(() => setCurrentPage(0), [allData])

  const paginatedData = useMemo(() => {
    const start = currentPage * itemsPerPage
    return allData.slice(start, start + itemsPerPage)
  }, [allData, currentPage])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [formData, setFormData] = useState<Partial<Omit<Vehicle, 'id'>>>({})
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null)

  function openDialog(vehicle?: Vehicle) {
    if (vehicle) {
      setEditingVehicle(vehicle)
       setFormData({
         available: vehicle.available,
         capacity: vehicle.capacity,
         color: vehicle.color,
         make: vehicle.make,
         model: vehicle.model,
         plateNumber: vehicle.plateNumber,
         rentalrate: vehicle.rentalrate,
         vehicleImage: vehicle.vehicleImage,
         vehicleType: vehicle.vehicleType,
         year: vehicle.year,
       })
    } else {
      setEditingVehicle(null)
      setFormData({})
    }
    setIsDialogOpen(true)
  }

  function onChange(field: keyof typeof formData, value: any) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }
  async function handleSubmit() {
    try {
      // Explicitly convert numeric fields to numbers before sending


      const payload: Partial<Vehicle> = {
        available: formData.available,
        capacity: formData.capacity,
        color: formData.color,
        make: formData.make,
        model: formData.model,
        plateNumber: formData.plateNumber,
        rentalrate: formData.rentalrate,
        vehicleImage: formData.vehicleImage,
        vehicleType: formData.vehicleType,
        year: formData.year,
      }
      if (editingVehicle) {
        await update.mutateAsync({ id: editingVehicle.id, payload })
        toast.success('Vehicle updated successfully')
      } else {
        await create.mutateAsync(payload)
        toast.success('Vehicle created successfully')
      }
      await queryClient.invalidateQueries({ queryKey: ['vehicle'] })
      setIsDialogOpen(false)
    } catch (err) {
      toast.error('Failed to save vehicle')
    }
  }

  async function confirmDelete() {
    if (!vehicleToDelete) return
    try {
      await deleteVehicle.mutateAsync(vehicleToDelete)
      await queryClient.invalidateQueries({ queryKey: ['vehicle'] })
      toast.success('Vehicle deleted')
    } catch (err) {
      toast.error('Failed to delete')
    } finally {
      setIsDeleteOpen(false)
    }
  }

  return (
    <div className="p-4">
      <Toaster />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {['Active Users', 'Active Drivers', 'Total Trips', 'Revenue'].map(
          (title, idx) => (
            <Card key={idx}>
              <CardHeader className="flex items-center justify-between">
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">--</p>
                <p className="text-sm text-muted-foreground">Stat detail</p>
              </CardContent>
            </Card>
          ),
        )}
      </div>

      <div className="mb-4 flex justify-end">
        <Button onClick={() => openDialog()}>
          <Plus className="w-4 h-4 mr-2" /> Create Vehicle
        </Button>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            {[
              'ID',
              'Image',
              'Make',
              'Model',
              'Rate',
              'Plate',
              'Color',
              'Cap.',
              'Year',
              'Type',
              '',
            ].map((h, i) => (
              <TableCell key={i}>{h}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData.map((vehicle) => (
            <TableRow key={vehicle.id}>
              <TableCell>{vehicle.id}</TableCell>
              <TableCell>
                {vehicle.vehicleImage ? (
                  <img
                    src={vehicle.vehicleImage}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-20 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-20 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
                    No Image
                  </div>
                )}
              </TableCell>
              <TableCell>{vehicle.make}</TableCell>
              <TableCell>{vehicle.model}</TableCell>
              <TableCell>{vehicle.rentalrate}</TableCell>
              <TableCell>{vehicle.plateNumber}</TableCell>
              <TableCell>{vehicle.color}</TableCell>
              <TableCell>{vehicle.capacity}</TableCell>
              <TableCell>{vehicle.year}</TableCell>
              <TableCell>{vehicle.vehicleType}</TableCell>
              <TableCell className="flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => openDialog(vehicle)}
                >
                  <PencilLine className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setVehicleToDelete(vehicle.id)
                    setIsDeleteOpen(true)
                  }}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination and buttons */}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="space-y-4">
          <DialogHeader>
            <DialogTitle>
              {editingVehicle ? 'Edit Vehicle' : 'Create Vehicle'}
            </DialogTitle>
          </DialogHeader>
          {[
            'vehicleImage',
            'make',
            'model',
            'plateNumber',
            'color',
            'vehicleType',
          ].map((key) => (
            <Input
              key={key}
              placeholder={key}
              value={
                formData[key as keyof typeof formData] !== undefined
                  ? String(formData[key as keyof typeof formData])
                  : ''
              }
              onChange={(e) =>
                onChange(key as keyof typeof formData, e.target.value)
              }
            />
          ))}
          {['rentalrate', 'capacity', 'year'].map((key) => (
            <Input
              key={key}
              placeholder={key}
              type="number"
              value={
                formData[key as keyof typeof formData] !== undefined
                  ? String(formData[key as keyof typeof formData])
                  : ''
              }
              onChange={(e) => {
                const val = e.target.value
                onChange(
                  key as keyof typeof formData,
                  val === '' ? undefined : Number(val),
                )
              }}
            />
          ))}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="available"
              checked={!!formData.available}
              onCheckedChange={(v) => onChange('available', v)}
            />

            <label htmlFor="available" className="text-sm">
              Available
            </label>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={create.isPending || update.isPending}
            >
              {editingVehicle ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Drawer open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-2">Confirm Deletion</h2>
          <p>This action cannot be undone.</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  )
}
