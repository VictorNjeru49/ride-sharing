import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useCrudOperations } from '@/hooks/crudops'
import {
  getPromoCodes,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
} from '@/api/UserApi'
import type { PromoCode, UserPromoUsage, userTypes } from '@/types/alltypes'
import { Toaster } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button, buttonVariants } from '@/components/ui/button'
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ChevronDown, ChevronUp } from 'lucide-react'
import clsx from 'clsx'

export const Route = createFileRoute('/dashboard/promocode')({
  component: RouteComponent,
})

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

  // ───────────────────────────── Filter + Pagination
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

  // ───────────────────────────── CRUD helpers
  const handleClose = () => {
    setDialogOpen(false)
    setFormData({
      code: '',
      discountAmount: 0,
      expirationDate: 0,
      isActive: true,
      usageLimit: 0
    })
    setEditId(null)
  }

  const handleSave = () => {
    const payload: Partial<PromoCode> = {
      code: formData.code,
      discountAmount: formData.discountAmount,
      usageLimit: formData.usageLimit,
      expirationDate: formData.expirationDate,
      isActive: formData.isActive,
    }
    if (!formData.code || !formData.discountAmount) return
    if (editId) {
      update.mutate(
        { id: editId, payload },
        { onSuccess: handleClose },
      )
    } else {
      create.mutate(payload, { onSuccess: handleClose })
    }
  }

  const handleEdit = (promo: PromoCode) => {
    setFormData(promo)
    setEditId(promo.id)
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => remove.mutate(id)

  // ───────────────────────────── Render
  return (
    <div className="p-6 space-y-6">
      <Toaster />
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <h1 className="text-2xl font-bold">Promo Code Management</h1>
        <div className="flex gap-2 flex-wrap">
          <Input
            placeholder="Filter by code"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-xs"
          />
          <Button onClick={() => setDialogOpen(true)}>Create Promo Code</Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead />
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Usage Limit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((p) => (
              <PromoRow
                key={p.id}
                promo={p}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>
          Showing {page * rowsPerPage + 1} to{' '}
          {Math.min((page + 1) * rowsPerPage, filtered.length)} of{' '}
          {filtered.length} entries
        </span>
        <div className="flex items-center gap-2">
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
                (p + 1) * rowsPerPage < filtered.length ? p + 1 : p,
              )
            }
            disabled={(page + 1) * rowsPerPage >= filtered.length}
          >
            Next
          </Button>
          <select
            className={clsx(
              buttonVariants({ variant: 'outline', size: 'sm' }),
              'cursor-pointer',
            )}
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10))
              setPage(0)
            }}
          >
            {[5, 10, 25].map((n) => (
              <option key={n} value={n}>
                {n}/page
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit' : 'Create'} Promo Code</DialogTitle>
            <DialogDescription>
              Define code, discount and usage limit.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium" htmlFor="code">
                Code
              </label>
              <Input
                id="code"
                value={formData.code || ''}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="discount">
                Discount Amount ($)
              </label>
              <Input
                id="discount"
                type="number"
                value={formData.discountAmount ?? ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discountAmount: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="limit">
                Usage Limit
              </label>
              <Input
                id="limit"
                type="number"
                value={formData.usageLimit ?? ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    usageLimit: parseInt(e.target.value, 10),
                  })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={handleClose} type="button">
              Cancel
            </Button>
            <Button onClick={handleSave}>{editId ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ───────────────────────────── Promo Row component
function PromoRow({
  promo,
  onEdit,
  onDelete,
}: {
  promo: PromoCode
  onEdit: (p: PromoCode) => void
  onDelete: (id: string) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <TableRow>
        <TableCell>
          <Collapsible open={open} onOpenChange={setOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon">
                {open ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </TableCell>
        <TableCell>{promo.code}</TableCell>
        <TableCell>${promo.discountAmount}</TableCell>
        <TableCell>{promo.usageLimit}</TableCell>
        <TableCell>{promo.isActive ? 'Active' : 'Inactive'}</TableCell>
        <TableCell className="space-x-2">
          <Button size="sm" variant="secondary" onClick={() => onEdit(promo)}>
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(promo.id)}
          >
            Delete
          </Button>
        </TableCell>
      </TableRow>

      <Collapsible>
        <CollapsibleContent className="px-4 py-2 bg-muted/50">
          {/* Usages */}
          <h4 className="font-medium mb-1">Promo Code Usages</h4>
          {promo.usages?.length ? (
            <ul className="list-disc list-inside space-y-1 text-sm">
              {promo.usages.map((u: UserPromoUsage) => (
                <li key={u.id}>
                  User <span className="font-semibold">{u.user?.id}</span> on{' '}
                  {new Date(u.usedAt).toLocaleDateString()}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground mb-2">
              No usages recorded.
            </p>
          )}

          {promo.createdBy?.length ? (
            <ul className="list-disc list-inside space-y-1 text-sm">
              {promo.createdBy.map((c: userTypes) => (
                <li key={c.id}>
                  {c.firstName}{' '}
                  {c.updatedAt ? (
                    <span className="text-muted-foreground">
                      — {new Date(c.updatedAt).toLocaleString()}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No users recorded.</p>
          )}
        </CollapsibleContent>
      </Collapsible>
    </>
  )
}

export default RouteComponent
