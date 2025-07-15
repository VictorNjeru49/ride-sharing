import React, { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { authStore } from '@/app/store'
import {
  createNotification,
  deleteNotification,
  getNotifications,
  getUserById,
  updateNotification,
} from '@/api/UserApi'
import { format } from 'date-fns'
import {
  type Notification,
  NotifyStatus,
  type userTypes,
} from '@/types/alltypes'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { useCrudOperations } from '@/hooks/crudops'
import { Trash2 } from 'lucide-react'

function Inbox() {
  const userId = authStore.state.user?.id

  const [selectedType, setSelectedType] = useState<NotifyStatus | 'all'>('all')
  const [activeNotification, setActiveNotification] =
    useState<Notification | null>(null)

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery<userTypes>({
    queryKey: ['user-notifications', userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId,
  })

  const { update, delete: deleteNotificationOp } = useCrudOperations<
    Notification,
    Partial<Omit<Notification, 'id'>>,
    Partial<Omit<Notification, 'id'>>,
    string
  >(
    {
      all: ['notify'],
      details: (id: string) => ['notify', id],
    },
    {
      fetchFn: getNotifications,
      createFn: createNotification,
      updateFn: updateNotification,
      deleteFn: deleteNotification,
    },
  )

  const notifications: Notification[] = user?.notifications ?? []

  const groupLabel: Record<NotifyStatus, string> = useMemo(
    () => ({
      [NotifyStatus.RIDE_STATUS]: 'Ride Status Updates',
      [NotifyStatus.PAYMENT]: 'Payment Notifications',
      [NotifyStatus.PROMOTION]: 'Promotions',
      [NotifyStatus.SYSTEM]: 'System Alerts',
    }),
    [],
  )

  const filteredNotifications = useMemo(() => {
    return selectedType === 'all'
      ? notifications
      : notifications.filter((n) => n.type === selectedType)
  }, [selectedType, notifications])

  async function handleOpenDialog(notification: Notification) {
    setActiveNotification(notification)
    if (!notification.isRead) {
      try {
        await update.mutateAsync({
          id: notification.id,
          payload: { isRead: true },
        })
      } catch (error) {
        console.error('Failed to mark as read', error)
      }
    }
  }

  if (isLoading) {
    return <div className="p-6 text-center text-gray-500">Loading inbox…</div>
  }

  if (isError || !user) {
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load inbox messages.
      </div>
    )
  }

  if (!notifications.length) {
    return (
      <div className="p-6 text-center text-gray-600">No notifications yet.</div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inbox</h1>
        <Select
          value={selectedType}
          onValueChange={(val) => setSelectedType(val as NotifyStatus | 'all')}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.entries(groupLabel).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">


{filteredNotifications.map((n) => (
  <Dialog
    key={n.id}
    onOpenChange={(open) => !open && setActiveNotification(null)}
  >
    <DialogTrigger asChild>
      <div
        onClick={() => handleOpenDialog(n)}
        className={`relative w-full cursor-pointer rounded border p-4 text-sm shadow-sm transition hover:bg-gray-100 dark:hover:bg-gray-800 ${
          n.isRead
            ? 'bg-gray-100 dark:bg-gray-800'
            : 'bg-blue-50 border-blue-400 dark:bg-blue-900/20'
        }`}
      >
        {/* 🗑️ Delete button (shows on hover) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()               // prevent Dialog open
            if (confirm('Delete this notification?')) {
              deleteNotificationOp.mutate(n.id)
            }
          }}
          className="absolute right-2 top-2 hidden rounded-full p-1 text-gray-500 hover:bg-red-100 hover:text-red-600 focus:bg-red-100 focus:text-red-600 sm:block"
        >
          <Trash2 size={16} />
        </button>

        <p className="font-medium truncate pr-6">{n.message}</p>
        <p className="mt-1 text-xs text-gray-500">
          {n.createdAt ? format(new Date(n.createdAt), 'PPpp') : ''}
        </p>
      </div>
    </DialogTrigger>

    {/* Dialog content unchanged */}
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Message Details</DialogTitle>
      </DialogHeader>
      <div className="text-sm text-gray-700 dark:text-gray-100">
        <p className="mb-2">
          <strong>Type:</strong> {groupLabel[n.type]}
        </p>
        <p className="whitespace-pre-wrap">{n.message}</p>
        <p className="mt-4 text-xs text-gray-500">
          Sent on {n.createdAt ? format(new Date(n.createdAt), 'PPpp') : '—'}
        </p>
      </div>
    </DialogContent>
  </Dialog>
))}

      </div>
    </div>
  )
}

export default Inbox
