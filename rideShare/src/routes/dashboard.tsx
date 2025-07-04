import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import Layout from '@/components/layout';
import { UserRole } from '@/types/alltypes';
import { authStore } from '@/app/store';

export const Route = createFileRoute('/dashboard')({
  // beforeLoad: ({ location }) => {
  //   const { isVerified } = authStore.state
  //   console.log('isVerfied', isVerified)
  //   if (!isVerified) {
  //     throw redirect({
  //       to: '/login',
  //       search: {
  //         redirect: location.href,
  //       },
  //     })
  //   }
  // },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
     <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
    {/* Sidebar */}
    <Layout role={UserRole.ADMIN} />

    {/* Main Content */}
    <main className="flex-1 p-6">
    <Outlet />
    </main>
  </div>
    </>
  )
}
