import React, { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { authStore } from '@/app/store'
import {
  createNotification,
  deleteNotification,
  getNotifications,
  getUserById,
  updateNotification,
} from '@/api/UserApi'
import {
  type Notification,
  NotifyStatus,
  type userTypes,
} from '@/types/alltypes'

import { cn } from '@/lib/utils'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { RingLoader } from 'react-spinners'
import { useCrudOperations } from '@/hooks/crudops'

function Inbox() {
  const userId = authStore.state.user?.id

  const [selectedType, setSelectedType] = useState<NotifyStatus | 'all'>('all')
  const [selected, setSelected] = useState<Notification | null>(null)

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery<userTypes>({
    queryKey: ['user-notifications', userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId,
  })

  const { update } = useCrudOperations<
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

  const handleOpenDialog = async (notification: Notification) => {
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

  const handleSelect = async (notification: Notification) => {
    setSelected(notification)
    await handleOpenDialog(notification)
  }

  const getTypeColor = (type: NotifyStatus) => {
    switch (type) {
      case NotifyStatus.RIDE_STATUS:
        return 'bg-blue-100 text-blue-800'
      case NotifyStatus.PAYMENT:
        return 'bg-green-100 text-green-800'
      case NotifyStatus.PROMOTION:
        return 'bg-pink-100 text-pink-800'
      case NotifyStatus.SYSTEM:
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="w-fit text-center py-10 m-auto">
        <RingLoader color="#0017ff" />
        Loading...
      </div>
    )
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

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Notifications List */}
        <div className="w-full lg:w-1/3 border rounded-md overflow-auto max-h-[80vh]">
          <CardHeader>
            <CardTitle className="text-lg">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {filteredNotifications.length === 0 ? (
              <p className="text-muted-foreground">
                No notifications available.
              </p>
            ) : (
              filteredNotifications.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    'p-3 cursor-pointer rounded-md hover:bg-muted border',
                    selected?.id === n.id && 'bg-muted',
                  )}
                  onClick={() => handleSelect(n)}
                >
                  <div className="flex justify-between items-center">
                    <Badge className={cn(getTypeColor(n.type), 'text-xs')}>
                      {n.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(n.createdAt ?? ''), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="mt-1 text-sm line-clamp-2">{n.message}</p>
                </div>
              ))
            )}
          </CardContent>
        </div>

        {/* Message Detail */}
        <div className="w-full lg:w-2/3 hidden lg:block">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selected ? (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <Badge
                      className={cn(getTypeColor(selected.type), 'text-xs')}
                    >
                      {selected.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(selected.createdAt ?? ''), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">
                    {selected.message}
                  </p>
                </>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Select a notification to view details.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Inbox
