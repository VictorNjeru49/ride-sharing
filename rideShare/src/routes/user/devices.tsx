import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getUserById } from '@/api/UserApi'
import { authStore } from '@/app/store'
import type { userTypes } from '@/types/alltypes'
import { format } from 'date-fns'
import Devices from '@/components/devices'
import { RingLoader } from 'react-spinners'

export const Route = createFileRoute('/user/devices')({
  component: Devices,
})

function DevicePage() {
  const userId = authStore.state.user?.id

  const {
    data: user,
    isPending,
    isError,
    error,
  } = useQuery<userTypes>({
    queryKey: ['user-devices', userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId,
  })

  if (isPending) {
    return (
      <div className=" w-fit text-center py-10 m-auto">
        <RingLoader color="#0017ff" />
        Loading...
      </div>
    )
  }

  if (isError || !user) {
    return (
      <div className="p-6 text-center text-red-500">
        Error loading devices. {String(error)}
      </div>
    )
  }

  const devices = user.devices ?? []

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Logged‑in Devices</h1>

      {devices.length === 0 ? (
        <p className="text-gray-600">No devices found for your account.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {devices.map((d) => (
            <div
              key={d.id}
              className="rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-800"
            >
              <h2 className="font-semibold capitalize">
                {d.deviceType.toLowerCase()}
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium">Token:</span>{' '}
                {d.deviceToken.slice(0, 8)}…
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium">Last active:</span>{' '}
                {format(new Date(d.lastActive), 'PPpp')}
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium">Added:</span>{' '}
                {format(new Date(d.createdAt), 'PP')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
