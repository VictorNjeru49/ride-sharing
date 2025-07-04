import React, { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Users, Car, DollarSign, User, Edit2, Trash2, Plus } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useQueryClient } from '@tanstack/react-query'
import { useCrudOperations } from '@/hooks/crudops'
import type { Vehicle } from '@/types/alltypes'
import { CompactTable } from '@table-library/react-table-library/compact'
import { useTheme } from '@table-library/react-table-library/theme'
import { getTheme } from '@table-library/react-table-library/baseline'
import {
  createVehicles,
  deleteVehicles,
  getVehicles,
  updateVehicles,
} from '@/api/UserApi'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
;import { toast, Toaster } from 'sonner'
({ queryKey: ['vehicle'] })

export const Route = createFileRoute('/dashboard/vehicle')({
  component: RouteComponent,
})

function RouteComponent() {
  const theme = useTheme([
    getTheme(),
    {
      HeaderRow: `
            background-color: #eaf5fd;
          `,
      Row: `
            &:nth-of-type(odd) {
              background-color: #d2e9fb;
            }
    
            &:nth-of-type(even) {
              background-color: #eaf5fd;
            }
          `,
    },
  ])
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
      fetchFn: () => getVehicles(),
      createFn: (vehicleData) => createVehicles(vehicleData),
      updateFn: (id, vehicleData) => updateVehicles(id, vehicleData),
      deleteFn: (vehicleId: string) => deleteVehicles(vehicleId),
    },
  )

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [formData, setFormData] = useState<Partial<Omit<Vehicle, 'id'>>>({
    vehicleImage: '',
    make: '',
    model: '',
    plateNumber: '',
    color: '',
    capacity: 0,
    year: 0,
    vehicleType: '',
  })

  // Open dialog for create or edit
  function openDialog(vehicle?: Vehicle) {
    if (vehicle) {
      setEditingVehicle(vehicle)
      setFormData(vehicle)
    } else {
      setEditingVehicle(null)
      setFormData({
        vehicleImage: '',
        make: '',
        model: '',
        plateNumber: '',
        color: '',
        capacity: 0,
        year: 0,
        vehicleType: '',
      })
    }
    setIsDialogOpen(true)
  }

  function closeDialog() {
    setIsDialogOpen(false)
    setEditingVehicle(null)
  }

  // Handle form input changes
  function onChange(field: keyof typeof formData, value: any) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  async function handleSubmit() {
    try {
      if (editingVehicle) {
        await update.mutateAsync({ id: editingVehicle.id, payload: formData })
        toast.success(`Vehicle with ${editingVehicle.id} update successfully`)
      } else {
        await create.mutateAsync(formData)
        toast.success('Vehicle created successfully')
      }
      await queryClient.invalidateQueries({ queryKey: ['vehicle'] })
      closeDialog()
    } catch (error) {
      console.error('Error creating/updating vehicle:', error)
    }
  }

  async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await deleteVehicle.mutateAsync(id)
        await queryClient.invalidateQueries({ queryKey: ['vehicle'] })
      } catch (error) {
        console.error('Error deleting vehicle:', error)
      }
    }
  }

  // Define columns for react-table
  const COLUMNS = [
    {
      label: 'ID',
      renderCell: (item: Vehicle) => item.id,
    },
    {
      label: 'Image',
      renderCell: (item: Vehicle) => (
        <img
          src={item.vehicleImage}
          alt={`${item.make} ${item.model}`}
          className="w-20 h-12 object-cover rounded"
          title={`${item.make} ${item.model}`}
        />
      ),
    },
    {
      label: 'Make',
      renderCell: (item: Vehicle) => (
        <div className="max-w-xs truncate" title={item.make}>
          {item.make}
        </div>
      ),
    },
    {
      label: 'Model',
      renderCell: (item: Vehicle) => (
        <div className="max-w-xs truncate" title={item.model}>
          {item.model}
        </div>
      ),
    },
    {
      label: 'Plate Number',
      renderCell: (item: Vehicle) => item.plateNumber,
    },
    {
      label: 'Color',
      renderCell: (item: Vehicle) => item.color,
    },
    {
      label: 'Capacity',
      renderCell: (item: Vehicle) => item.capacity,
    },
    {
      label: 'Year',
      renderCell: (item: Vehicle) => item.year,
    },
    {
      label: 'Vehicle Type',
      renderCell: (item: Vehicle) => item.vehicleType,
    },
    {
      label: 'Actions',
      renderCell: (item: Vehicle) => (
        <div className="flex space-x-2">
          <button
            onClick={() => openDialog(item)}
            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(item.id)}
            disabled={deleteVehicle.isPending}
            className={`px-2 py-1 text-white rounded ${
              deleteVehicle.isPending
                ? 'bg-gray-400'
                : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {deleteVehicle.isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      ),
    },
  ]

  const data = useMemo(() => ({ nodes: query.data ?? [] }), [query.data])


  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Toaster/>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Active Drivers</CardTitle>
            <Users className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2,847</p>
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
            <p className="text-2xl font-bold">12,847</p>
            <p className="text-sm text-red-500">↓ 2% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Table and Controls */}
      <div className="mb-4 flex justify-end">
        <Button onClick={() => openDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Create Vehicle
        </Button>
      </div>

      <div className="overflow-x-auto rounded border border-gray-200">
        <CompactTable columns={COLUMNS} data={data} theme={theme} />
      </div>

      {/* Create/Edit Vehicle Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-lg animate-in zoom-in-90">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {editingVehicle ? 'Edit Vehicle' : 'Create Vehicle'}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[500px] w-full p-4">

          <div className="grid grid-cols-1 gap-4 py-4 text-black">
            <label className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-gray-700">
                Vehicle Image URL
              </span>
              <input
                type="text"
                value={formData.vehicleImage || ''}
                onChange={(e) => onChange('vehicleImage', e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </label>
            <label className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-gray-700">Make</span>
              <input
                type="text"
                value={formData.make || ''}
                onChange={(e) => onChange('make', e.target.value)}
                placeholder="Toyota"
                className="rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </label>
            <label className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-gray-700">Model</span>
              <input
                type="text"
                value={formData.model || ''}
                onChange={(e) => onChange('model', e.target.value)}
                placeholder="Corolla"
                className="rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </label>
            <label className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-gray-700">
                Plate Number
              </span>
              <input
                type="text"
                value={formData.plateNumber || ''}
                onChange={(e) => onChange('plateNumber', e.target.value)}
                placeholder="ABC-1234"
                className="rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </label>
            <label className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-gray-700">Color</span>
              <input
                type="text"
                value={formData.color || ''}
                onChange={(e) => onChange('color', e.target.value)}
                placeholder="White"
                className="rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </label>
            <label className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-gray-700">
                Capacity
              </span>
              <input
                type="number"
                value={formData.capacity || 0}
                onChange={(e) => onChange('capacity', Number(e.target.value))}
                min={1}
                placeholder="5"
                className="rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </label>
            <label className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-gray-700">Year</span>
              <input
                type="number"
                value={formData.year || 0}
                onChange={(e) => onChange('year', Number(e.target.value))}
                min={1900}
                max={new Date().getFullYear()}
                placeholder="2020"
                className="rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </label>
            <label className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-gray-700">
                Vehicle Type
              </span>
              <input
                type="text"
                value={formData.vehicleType || ''}
                onChange={(e) => onChange('vehicleType', e.target.value)}
                placeholder="Sedan"
                className="rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </label>
          </div>
          </ScrollArea>
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingVehicle ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
