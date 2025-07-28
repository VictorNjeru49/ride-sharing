import { useEffect, useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useCrudOperations } from '@/hooks/crudops'
import { getUsers, createUser, updateUser, deleteUser, createRiderProfile, createDriverProfile, getUserById, getVehiclesById, createAdmin, getVehicles } from '@/api/UserApi'
import { type userTypes, type Vehicle, UserRole } from '@/types/alltypes'
import { Toaster } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

export const Route = createFileRoute('/dashboard/users')({
  component: RouteComponent,
})

function RouteComponent() {
  const {
    query,
    create,
    update,
    delete: removeUser,
  } = useCrudOperations<
    userTypes,
    Partial<userTypes>,
    Partial<userTypes>,
    string
  >(
    { all: ['users'], details: (id) => ['users', id] },
    {
      fetchFn: getUsers,
      createFn: createUser,
      updateFn: updateUser,
      deleteFn: deleteUser,
    },
  )

  const [filter, setFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [openDialog, setOpenDialog] = useState(false)
  const [formData, setFormData] = useState<Partial<userTypes>>({})
  const [editId, setEditId] = useState<string | null>(null)
  const [viewUser, setViewUser] = useState<userTypes | null>(null)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    null,
  )


  const filteredData = useMemo(() => {
    return (
      query.data?.filter((user) => {
        const matchesEmail = user.email
          .toLowerCase()
          .includes(filter.toLowerCase())
        const matchesRole = roleFilter ? user.role === roleFilter : true
        return matchesEmail && matchesRole
      }) || []
    )
  }, [query.data, filter, roleFilter])

  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage
    return filteredData.slice(start, start + rowsPerPage)
  }, [filteredData, page, rowsPerPage])

  const handleDialogClose = () => {
    setOpenDialog(false)
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: UserRole.RIDER,
      phone: '',
      isVerified: false
    })
    setEditId(null)
     setSelectedVehicleId(null)
     setVehicles([])
  }

  const handleEdit = (user: userTypes) => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: '',
      role: user.role,
      phone: user.phone || '',
      isVerified: user.isVerified,
    })
    setEditId(user.id)
    setOpenDialog(true)
  }

useEffect(() => {
  if (formData.role === UserRole.DRIVER) {
    getVehicles()
      .then((allVehicles) => {
        
        const availableVehicles = allVehicles.filter((v) => !v.driver)
        setVehicles(availableVehicles)
      })
      .catch((err) => console.error('Failed to load vehicles:', err))
  }
}, [formData.role])

  const handleSave = () => {
    if (!formData.email || !formData.firstName) return

    const payload: Partial<userTypes> = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      role: formData.role || UserRole.RIDER,
      phone: formData.phone || undefined,
    }

    if (formData.password && formData.password.trim() !== '') {
      payload.password = formData.password
    }

    if (editId) {
      update.mutate(
        { id: editId, payload },
        {
          onSuccess: handleDialogClose,
        },
      )
    } else {
      create.mutate(payload, {
        onSuccess: async (newUser) => {
  try {
    const fullUser = await getUserById(newUser.id)

    if (fullUser.role === UserRole.RIDER) {
      await createRiderProfile({
        user: fullUser,
        rating: 5,
        preferredPaymentMethod: 'card',
      })
    } else if (fullUser.role === UserRole.DRIVER) {
      if (!selectedVehicleId) throw new Error('Please select a vehicle')

      const fullVehicle = await getVehiclesById(selectedVehicleId)

      await createDriverProfile({
        user: fullUser,
        licenseNumber: 'DEFAULT-LICENSE',
        rating: 5,
        isAvailable: true,
        vehicle: fullVehicle,
      })
    } else if (fullUser.role === UserRole.ADMIN) {
      await createAdmin({ user: fullUser})
    }
  } catch (profileErr) {
    console.error('Profile creation failed:', profileErr)
  } finally {
    handleDialogClose()
  }
        },
      })
    }
  }

  const handleDelete = (id: string) => {
    removeUser.mutate(id)
  }

  return (
    <div className="p-4 space-y-4">
      <Toaster />
      <div className="flex justify-between gap-4">
        <Input
          placeholder="Search by Email"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <Select onValueChange={setRoleFilter} value={roleFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {Object.values(UserRole).map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={() => setOpenDialog(true)}>Create User</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setViewUser(user)}
                  >
                    View
                  </Button>
                  <Button size="sm" onClick={() => handleEdit(user)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Showing {page * rowsPerPage + 1} to{' '}
          {Math.min((page + 1) * rowsPerPage, filteredData.length)} of{' '}
          {filteredData.length} entries
        </div>

        <div className="flex gap-4 items-center">
          <Select
            value={String(rowsPerPage)}
            onValueChange={(value) => {
              setRowsPerPage(Number(value))
              setPage(0) // Reset page to first when rows per page changes
            }}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20].map((num) => (
                <SelectItem key={num} value={String(num)}>
                  {num} per page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={page === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setPage((p) =>
                (p + 1) * rowsPerPage < filteredData.length ? p + 1 : p,
              )
            }
            disabled={(page + 1) * rowsPerPage >= filteredData.length}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit User' : 'Create User'}</DialogTitle>
            <DialogDescription>
              Fill in the details to {editId ? 'update' : 'create'} the user.
            </DialogDescription>
          </DialogHeader>
          {/* Form Fields omitted for brevity (same as before) */}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={handleDialogClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>{editId ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={Boolean(viewUser)} onOpenChange={() => setViewUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {viewUser?.firstName} {viewUser?.lastName} {'('}
              {viewUser?.email || '—'}
              {')'}
            </DialogTitle>
            <DialogDescription>Role: {viewUser?.role}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4 text-sm">
            {/* Phone & Verification */}
            <p>Phone: {viewUser?.phone || '—'}</p>
            <p>Password: {viewUser?.password}</p>
            <p>Verified: {viewUser?.isVerified ? 'Yes' : 'No'}</p>
            <p>Wallet Balance: ${viewUser?.walletBalance ?? '—'}</p>

            {/* Driver Profile */}
            {viewUser?.driverProfile ? (
              <div className="space-y-1">
                <h4 className="font-medium">Driver Profile</h4>
                <p>Vehicle: {viewUser.driverProfile.vehicle?.make || '—'}</p>
                <p>License#: {viewUser.driverProfile.licenseNumber || '—'}</p>
              </div>
            ) : null}

            {/* Rider Profile */}
            {viewUser?.riderProfile ? (
              <div className="space-y-1">
                <h4 className="font-medium">Rider Profile</h4>
                <p>
                  Preferred Payment:{' '}
                  {viewUser.riderProfile.preferredPaymentMethod || '—'}
                </p>
              </div>
            ) : null}

            {/* Admin Profile */}
            {viewUser?.adminProfile ? (
              <div className="space-y-1">
                <h4 className="font-medium">Admin Profile</h4>
                <p>Role: {viewUser.adminProfile.role || '—'}</p>
              </div>
            ) : null}

            {/* Payments */}
            {viewUser?.payments && viewUser.payments.length > 0 ? (
              <div className="space-y-1">
                <h4 className="font-medium">Payments</h4>
                {viewUser.payments.map((p, i) => (
                  <p key={i}>{p.method}</p>
                ))}
              </div>
            ) : null}
          </div>

          <DialogFooter>
            <Button onClick={() => setViewUser(null)} variant="outline">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit User' : 'Create User'}</DialogTitle>
            <DialogDescription>
              Fill in the details to {editId ? 'update' : 'create'} the user.
            </DialogDescription>
          </DialogHeader>

          {/* Form inputs */}
          <div className="space-y-4">
            <Input
              placeholder="First Name"
              value={formData.firstName ?? ''}
              onChange={(e) =>
                setFormData((f) => ({ ...f, firstName: e.target.value }))
              }
            />
            <Input
              placeholder="Last Name"
              value={formData.lastName ?? ''}
              onChange={(e) =>
                setFormData((f) => ({ ...f, lastName: e.target.value }))
              }
            />
            <Input
              placeholder="Email"
              type="email"
              value={formData.email ?? ''}
              onChange={(e) =>
                setFormData((f) => ({ ...f, email: e.target.value }))
              }
            />
            <Input
              placeholder={
                editId ? 'New Password (leave blank to keep)' : 'Password'
              }
              type="password"
              value={formData.password ?? ''}
              onChange={(e) =>
                setFormData((f) => ({ ...f, password: e.target.value }))
              }
            />

            <Select
              value={formData.role ?? ''}
              onValueChange={(value) =>
                setFormData((f) => ({ ...f, role: value as UserRole }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(UserRole).map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Phone"
              value={formData.phone ?? ''}
              onChange={(e) =>
                setFormData((f) => ({ ...f, phone: e.target.value }))
              }
            />
            <Checkbox
              checked={formData.isVerified ?? false}
              onCheckedChange={(checked) =>
                setFormData((f) => ({ ...f, isVerified: Boolean(checked) }))
              }
            />

            {/* Vehicle select only for drivers */}
            {formData.role === UserRole.DRIVER && (
              <Select
                value={selectedVehicleId ?? ''}
                onValueChange={(value) => {
                  setSelectedVehicleId(value)
                  // Optionally update formData if you want to track vehicle here too
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.make} {v.model} ({v.plateNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={handleDialogClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>{editId ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {formData.role === UserRole.DRIVER && (
        <Select
          value={selectedVehicleId ?? ''}
          onValueChange={setSelectedVehicleId}
        >
          <SelectTrigger className="w-full mt-2">
            <SelectValue placeholder="Select Vehicle" />
          </SelectTrigger>
          <SelectContent>
            {vehicles.map((v) => (
              <SelectItem key={v.id} value={v.id}>
                {v.make} {v.model} ({v.plateNumber})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  )
}

export default RouteComponent
