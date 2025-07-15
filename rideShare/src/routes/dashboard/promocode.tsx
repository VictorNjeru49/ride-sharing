import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Collapse,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TablePagination,
} from '@mui/material'
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from '@mui/icons-material'
import { useCrudOperations } from '@/hooks/crudops'
import {
  getPromoCodes,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
} from '@/api/UserApi'
import type { PromoCode, UserPromoUsage, userTypes } from '@/types/alltypes'

export const Route = createFileRoute('/dashboard/promocode')({
  component: RouteComponent,
})


function PromoRow({
  promo,
  onEdit,
  onDelete,
}: {
  promo: PromoCode
  onEdit: (data: PromoCode) => void
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
        <TableCell>{promo.code}</TableCell>
        <TableCell>${promo.discountAmount}</TableCell>
        <TableCell>{promo.usageLimit}</TableCell>
        <TableCell>{promo.isActive ? 'Active' : 'Inactive'}</TableCell>
        <TableCell>
          <Button size="small" onClick={() => onEdit(promo)}>
            Edit
          </Button>
          <Button size="small" color="error" onClick={() => onDelete(promo.id)}>
            Delete
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} style={{ paddingBottom: 0, paddingTop: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={2}>
              <Typography variant="subtitle1" gutterBottom>
                Promo Code Usages
              </Typography>
              {promo.usages.length > 0 ? (
                <ul>
                  {promo.usages.map((usage: UserPromoUsage) => (
                    <li key={usage.id}>
                      Used by User ID: <strong>{usage.user?.id}</strong> on{' '}
                      {new Date(usage.usedAt).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No usages recorded.
                </Typography>
              )}
            </Box>
          </Collapse>
        </TableCell>
        <TableCell colSpan={6} style={{ paddingBottom: 0, paddingTop: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={2}>
              <Typography variant="subtitle1" gutterBottom>
                Promo User
              </Typography>
              {promo.createdBy.length > 0 ? (
                <ul>
                  {promo.createdBy.map((createdBy: userTypes) => (
                    <li key={createdBy.id}>
                      Used by User ID: <strong>{createdBy.firstName}</strong> on{' '}
                      {createdBy.updatedAt
                        ? new Date(createdBy.updatedAt).toLocaleString()
                        : 'No update date'}
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No usages recorded.
                </Typography>
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
    delete: remove,
  } = useCrudOperations<
    PromoCode,
    Partial<PromoCode>,
    Partial<PromoCode>,
    string
  >(
    { all: ['promocodes'], details: (id) => ['promocodes', id] },
    {
      fetchFn: getPromoCodes,
      createFn: createPromoCode,
      updateFn: updatePromoCode,
      deleteFn: deletePromoCode,
    },
  )

  const [filter, setFilter] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<PromoCode>>({})
  const [editId, setEditId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return (
      query.data?.filter((p) =>
        p.code.toLowerCase().includes(filter.toLowerCase()),
      ) || []
    )
  }, [query.data, filter])

  const paginated = useMemo(() => {
    const start = page * rowsPerPage
    return filtered.slice(start, start + rowsPerPage)
  }, [filtered, page, rowsPerPage])

  const handleClose = () => {
    setDialogOpen(false)
    setFormData({})
    setEditId(null)
  }

  const handleSave = () => {
    if (!formData.code || !formData.discountAmount) return
    if (editId) {
      update.mutate(
        { id: editId, payload: formData },
        { onSuccess: handleClose },
      )
    } else {
      create.mutate(formData, { onSuccess: handleClose })
    }
  }

  const handleEdit = (promo: PromoCode) => {
    setFormData(promo)
    setEditId(promo.id)
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    remove.mutate(id)
  }

  return (
    <Box p={4}>
      <Typography variant="h5" gutterBottom>
        Promo Code Management
      </Typography>

      <Box display="flex" justifyContent="space-between" mb={2}>
        <TextField
          label="Filter by Code"
          variant="outlined"
          size="small"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <Button variant="contained" onClick={() => setDialogOpen(true)}>
          Create Promo Code
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Code</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Usage Limit</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((promo) => (
              <PromoRow
                key={promo.id}
                promo={promo}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10))
            setPage(0)
          }}
        />
      </TableContainer>

      {/* 🔽 Dialog */}
      <Dialog open={dialogOpen} onClose={handleClose} fullWidth>
        <DialogTitle>{editId ? 'Edit' : 'Create'} Promo Code</DialogTitle>
        <DialogContent>
          <TextField
            label="Code"
            fullWidth
            margin="dense"
            value={formData.code || ''}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          />
          <TextField
            label="Discount Amount"
            fullWidth
            margin="dense"
            type="number"
            value={formData.discountAmount || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                discountAmount: parseFloat(e.target.value),
              })
            }
          />
          <TextField
            label="Usage Limit"
            fullWidth
            margin="dense"
            type="number"
            value={formData.usageLimit || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                usageLimit: parseInt(e.target.value, 10),
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {editId ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
