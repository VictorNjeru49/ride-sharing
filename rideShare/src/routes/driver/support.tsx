import { createFileRoute } from '@tanstack/react-router'
import FAQComponent from '@/components/support'
import { UserRole } from '@/types/alltypes'

export const Route = createFileRoute('/driver/support')({
  component: RouteComponent,
})


function RouteComponent() {

  return (
    <>
    <FAQComponent userRole={UserRole.DRIVER} />

    </>
  )
}
