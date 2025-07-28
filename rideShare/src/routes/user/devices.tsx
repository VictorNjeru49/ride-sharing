import { createFileRoute } from '@tanstack/react-router'
import Devices from '@/components/devices'

export const Route = createFileRoute('/user/devices')({
  component: Devices,
})

