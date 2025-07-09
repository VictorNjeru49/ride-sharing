import React, { useState, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useCrudOperations } from '@/hooks/crudops'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  TextField,
  TablePagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material'
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from '@mui/icons-material'
import { getUsers, createUser, updateUser, deleteUser } from '@/api/UserApi'
import { type userTypes, UserRole } from '@/types/alltypes'
import { Toaster } from 'sonner'

export const Route = createFileRoute('/dashboard/users')({
  component: RouteComponent,
})

function Row({
  user,
  onEdit,
  onDelete,
}: {
  user: userTypes
  onEdit: (user: userTypes) => void
  onDelete: (id: string) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          {user.firstName} {user.lastName}
        </TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.role}</TableCell>
        <TableCell>
          <Button size="small" onClick={() => onEdit(user)}>
            Edit
          </Button>
          <Button size="small" color="error" onClick={() => onDelete(user.id)}>
            Delete
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} style={{ padding: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={2}>
              <Typography variant="subtitle1">More Details</Typography>
              <Typography variant="body2">
                Phone: {user.phone || 'N/A'}
              </Typography>
              <Typography variant="body2">
                Verified: {user.isVerified ? 'Yes' : 'No'}
              </Typography>
              <Typography variant="body2">
                Wallet Balance: ${user.walletBalance ?? 0}
              </Typography>
              {user.driverProfile && (
                <Box mt={1}>
                  <Typography variant="subtitle2">Driver Profile</Typography>
                  <Typography variant="body2">
                    Vehicle Type: {user.driverProfile.vehicle.make}
                  </Typography>
                  <Typography variant="body2">
                    License No: {user.driverProfile.licenseNumber}
                  </Typography>
                </Box>
              )}
              {user.riderProfile && (
                <Box mt={1}>
                  <Typography variant="subtitle2">Rider Profile</Typography>
                  <Typography variant="body2">
                    Preferred Payment:{' '}
                    {user.riderProfile.preferredPaymentMethod}
                  </Typography>
                </Box>
              )}
              {user.adminProfile && (
                <Box mt={1}>
                  <Typography variant="subtitle2">Admin Role</Typography>
                  <Typography variant="body2">
                    Role: {user.adminProfile.role}
                  </Typography>
                </Box>
              )}
              {user.payments && user.payments.length > 0 && (
                <Box mt={1}>
                  <Typography variant="subtitle2">Payments</Typography>
                  {user.payments.map((pay, idx) => (
                    <Typography key={idx} variant="body2">
                      {pay.method}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

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
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [openDialog, setOpenDialog] = useState(false)
  const [formData, setFormData] = useState<Partial<userTypes>>({})
  const [editId, setEditId] = useState<string | null>(null)

  const filteredData = useMemo(
    () =>
      query.data?.filter((user) =>
        user.email.toLowerCase().includes(filter.toLowerCase()),
      ) || [],
    [query.data, filter],
  )

  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage
    return filteredData.slice(start, start + rowsPerPage)
  }, [filteredData, page, rowsPerPage])

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage)

  const handleDialogClose = () => {
    setOpenDialog(false)
    setFormData({})
    setEditId(null)
  }

  const handleEdit = (user: userTypes) => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: '', // blank password to require explicit change
      role: user.role,
      phone: user.phone || '',
    })
    setEditId(user.id)
    setOpenDialog(true)
  }

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
      create.mutate(payload, { onSuccess: handleDialogClose })
    }
  }

  const handleDelete = (id: string) => {
    removeUser.mutate(id)
  }

  if (query.isLoading)
    return (
      <Box p={4}>
        <CircularProgress />
      </Box>
    )
  if (query.isError)
    return (
      <Typography color="error">
        {query.error?.message || 'Failed to load'}
      </Typography>
    )

  return (
    <>
      <Toaster />
      <Box p={4}>
        <Typography variant="h5" gutterBottom>
          Users Management
        </Typography>

        <Box display="flex" justifyContent="space-between" mb={2}>
          <TextField
            label="Filter by Email"
            variant="outlined"
            size="small"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <Button variant="contained" onClick={() => setOpenDialog(true)}>
            Create User
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((user) => (
                <Row
                  key={user.id}
                  user={user}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10))
              setPage(0)
            }}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </TableContainer>

        <Dialog open={openDialog} onClose={handleDialogClose} fullWidth>
          <DialogTitle>{editId ? 'Edit User' : 'Create User'}</DialogTitle>
          <DialogContent>
            <TextField
              label="First Name"
              fullWidth
              margin="dense"
              value={formData.firstName || ''}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
            />
            <TextField
              label="Last Name"
              fullWidth
              margin="dense"
              value={formData.lastName || ''}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
            />
            <TextField
              label="Email"
              fullWidth
              margin="dense"
              value={formData.email || ''}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="dense"
              value={formData.password || ''}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              helperText={editId ? 'Leave blank to keep current password' : ''}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role || ''}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value as UserRole })
                }
                label="Role"
              >
                {Object.values(UserRole).map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>
              {editId ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  )
}

export default RouteComponent
