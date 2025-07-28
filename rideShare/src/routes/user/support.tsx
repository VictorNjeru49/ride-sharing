import { createFileRoute } from '@tanstack/react-router'
import FAQComponent from '@/components/support'
import { UserRole } from '@/types/alltypes'

export const Route = createFileRoute('/user/support')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <FAQComponent userRole={UserRole.RIDER} />
    </>
  )
}
