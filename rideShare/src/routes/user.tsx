import Layout from '@/components/layout'
import { UserRole } from '@/types/alltypes'
import { authStore } from '@/app/store';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { isLoggedIn } from '@/app/authPersistence';

export const Route = createFileRoute('/user')({
  //  beforeLoad: ({ location }) => {
  //     const { isVerified } = authStore.state
  //     console.log('isVerfied', isVerified)
  //     console.log('user logged‑in?', isLoggedIn())
  //     if (!isVerified || !isLoggedIn()) {
  //       throw redirect({
  //         to: '/login',
  //         search: {
  //           redirect: location.href,
  //         },
  //       })
  //     }
  //   },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <Layout role={UserRole.RIDER} />

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </>
  )
}
