import React, { useMemo, useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card' // Keep your existing Card components
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

// MUI imports
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  TablePagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Drawer,
  Typography,
  IconButton,
  FormControlLabel,
  Checkbox,
} from '@mui/material'

import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Close as CloseIcon,
} from '@mui/icons-material'

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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 5

  // Vehicles data
  const allData = query.data ?? []

  // Reset to first page if data changes
  useEffect(() => {
    setCurrentPage(0)
  }, [allData])

  // Paginated slice
  const paginatedData = useMemo(() => {
    const startIdx = currentPage * itemsPerPage
    return allData.slice(startIdx, startIdx + itemsPerPage)
  }, [allData, currentPage])

  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [formData, setFormData] = useState<Partial<Omit<Vehicle, 'id'>>>({
    vehicleImage: '',
    make: '',
    model: '',
    rentalrate: 0,
    plateNumber: '',
    color: '',
    capacity: 0,
    year: 0,
    vehicleType: '',
  })

  // Delete drawer states
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false)
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null)

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
        rentalrate: 0,
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

  function onChange(field: keyof typeof formData, value: any) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  async function handleSubmit() {
    try {
      if (editingVehicle) {
        const payload: Partial<Vehicle> = {
          vehicleImage: formData.vehicleImage,
          make: formData.make,
          model: formData.model,
          rentalrate: Number(formData.rentalrate),
          plateNumber: formData.plateNumber,
          color: formData.color,
          available: formData.available,
          capacity: formData.capacity,
          year: formData.year,
          vehicleType: formData.vehicleType
        }

        await update.mutateAsync({
          id: editingVehicle.id,
          payload,
        })
        toast.success(
          `Vehicle with ID ${editingVehicle.id} updated successfully`,
        )
      } else {
        await create.mutateAsync(formData)
        toast.success('Vehicle created successfully')
      }
      await queryClient.invalidateQueries({ queryKey: ['vehicle'] })
      closeDialog()
    } catch (error) {
      console.error('Error creating/updating vehicle:', error)
      toast.error('Failed to save vehicle')
    }
  }

  async function confirmDelete() {
    if (!vehicleToDelete) return

    try {
      await deleteVehicle.mutateAsync(vehicleToDelete)
      await queryClient.invalidateQueries({ queryKey: ['vehicle'] })
      toast.success('Vehicle deleted successfully')
    } catch (error) {
      console.error('Error deleting vehicle:', error)
      toast.error('Failed to delete vehicle')
    } finally {
      setIsDeleteDrawerOpen(false)
      setVehicleToDelete(null)
    }
  }

  function handleDelete(id: string) {
    setVehicleToDelete(id)
    setIsDeleteDrawerOpen(true)
  }

  // Pagination change handler
  const handleChangePage = (_event: unknown, newPage: number) => {
    setCurrentPage(newPage)
  }

  return (
    <>
      <Toaster />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Active Users</CardTitle>
            {/* You can replace with MUI icons or keep your icons */}
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">12,847</p>
            <p className="text-sm text-red-500">↓ 2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Active Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2,847</p>
            <p className="text-sm text-green-600">↑ 12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Total Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">18,542</p>
            <p className="text-sm text-green-600">↑ 8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$284,750</p>
            <p className="text-sm text-green-600">↑ 15% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="mb-4 flex justify-end">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => openDialog()}
        >
          Create Vehicle
        </Button>
      </div>

      {/* Vehicle Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Make</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Rate</TableCell>
              <TableCell>Plate Number</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Vehicle Type</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell>{vehicle.id}</TableCell>
                <TableCell>
                  <img
                    src={vehicle.vehicleImage}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    style={{
                      width: 80,
                      height: 48,
                      objectFit: 'cover',
                      borderRadius: 4,
                    }}
                    title={`${vehicle.make} ${vehicle.model}`}
                  />
                </TableCell>
                <TableCell>{vehicle.make}</TableCell>
                <TableCell>{vehicle.model}</TableCell>
                <TableCell> {vehicle.rentalrate}</TableCell>
                <TableCell>{vehicle.plateNumber}</TableCell>
                <TableCell>{vehicle.color}</TableCell>
                <TableCell>{vehicle.capacity}</TableCell>
                <TableCell>{vehicle.year}</TableCell>
                <TableCell>{vehicle.vehicleType}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => openDialog(vehicle)}
                    aria-label="edit"
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(vehicle.id)}
                    aria-label="delete"
                    size="small"
                    disabled={deleteVehicle.isPending}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {paginatedData.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  No vehicles found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={allData.length}
          page={currentPage}
          onPageChange={handleChangePage}
          rowsPerPage={itemsPerPage}
          rowsPerPageOptions={[itemsPerPage]}
        />
      </TableContainer>

      {/* Create/Edit Vehicle Dialog */}
      <Dialog open={isDialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingVehicle ? 'Edit Vehicle' : 'Create Vehicle'}
        </DialogTitle>
        <DialogContent dividers>
          <form noValidate autoComplete="off">
            <TextField
              label="Vehicle Image URL"
              fullWidth
              margin="normal"
              value={formData.vehicleImage || ''}
              onChange={(e) => onChange('vehicleImage', e.target.value)}
            />
            <TextField
              label="Make"
              fullWidth
              margin="normal"
              value={formData.make || ''}
              onChange={(e) => onChange('make', e.target.value)}
            />
            <TextField
              label="Model"
              fullWidth
              margin="normal"
              value={formData.model || ''}
              onChange={(e) => onChange('model', e.target.value)}
            />
            <TextField
              label="Rental Rate"
              type='number'
              fullWidth
              margin="normal"
              value={formData.rentalrate || 0}
              onChange={(e) => onChange('rentalrate', Number(e.target.value))}
            />
            <TextField
              label="Plate Number"
              fullWidth
              margin="normal"
              value={formData.plateNumber || ''}
              onChange={(e) => onChange('plateNumber', e.target.value)}
            />
            <TextField
              label="Color"
              fullWidth
              margin="normal"
              value={formData.color || ''}
              onChange={(e) => onChange('color', e.target.value)}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!formData.available}
                  onChange={(e) => onChange('available', e.target.checked)}
                  color="primary"
                />
              }
              label="Available"
            />
            <TextField
              label="Capacity"
              type="number"
              fullWidth
              margin="normal"
              value={formData.capacity || 0}
              onChange={(e) => onChange('capacity', Number(e.target.value))}
              inputProps={{ min: 1 }}
            />
            <TextField
              label="Year"
              type="number"
              fullWidth
              margin="normal"
              value={formData.year || 0}
              onChange={(e) => onChange('year', Number(e.target.value))}
              inputProps={{ min: 1900, max: new Date().getFullYear() }}
            />
            <TextField
              label="Vehicle Type"
              fullWidth
              margin="normal"
              value={formData.vehicleType || ''}
              onChange={(e) => onChange('vehicleType', e.target.value)}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingVehicle ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Drawer */}
      <Drawer
        anchor="right"
        open={isDeleteDrawerOpen}
        onClose={() => setIsDeleteDrawerOpen(false)}
      >
        <div style={{ width: 300, padding: 16 }}>
          <Typography variant="h6" gutterBottom>
            Are you absolutely sure?
          </Typography>
          <Typography variant="body2" gutterBottom>
            This action cannot be undone.
          </Typography>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 8,
              marginTop: 24,
            }}
          >
            <Button
              variant="contained"
              color="error"
              onClick={confirmDelete}
              disabled={deleteVehicle.isPending}
            >
              Submit
            </Button>
            <Button
              variant="outlined"
              onClick={() => setIsDeleteDrawerOpen(false)}
              disabled={deleteVehicle.isPending}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  )
}
