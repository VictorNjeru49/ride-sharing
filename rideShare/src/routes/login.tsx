import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { z } from 'zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLogin } from '@/api/LoginApi'
import { useRouter } from '@tanstack/react-router'
import { toast, Toaster } from 'sonner'
import { useForm } from '@tanstack/react-form'
import { UserRole } from '@/types/alltypes'
import { authActions } from '@/app/store'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
})

export type FormData = z.infer<typeof loginSchema>

const validateField = <T,>(value: T, schema: z.ZodType<T>) => {
  const result = schema.safeParse(value)
  if (!result.success) {
    return result.error.issues[0]?.message || 'Validation error'
  }
  return undefined
}

function RouteComponent() {
  const login = useLogin()
  const router = useRouter()

  const form = useForm({
    defaultValues: { email: '', password: '' } as FormData,
    onSubmit: async ({ value }) => {
      const result = loginSchema.safeParse(value)
      if (!result.success) return

      try {
        const res = await login.mutateAsync(result.data)
        authActions.saveUser({
          isVerified: res.isVerified ?? false,
          tokens: res.tokens,
          user: {
            id: res.user.id,
            email: res.user.email,
            role: res.user.role ?? UserRole.RIDER,
          },
        })
        toast.success(`Welcome, ${res.user.email}!`)
        form.reset()

        const userRole = res.user?.role
        const hasRole = (role: UserRole) =>
          Array.isArray(userRole) ? userRole.includes(role) : userRole === role

        if (hasRole(UserRole.ADMIN)) router.navigate({ to: '/dashboard' })
        else if (hasRole(UserRole.RIDER)) router.navigate({ to: '/user' })
        else if (hasRole(UserRole.DRIVER)) router.navigate({ to: '/driver' })
        else {
          toast.error('User role not found. Please contact support.')
          router.navigate({ to: '/' })
        }
      } catch (error) {
        let errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.'
        if (errorMessage.toLowerCase().includes('not found'))
          toast.error('Account not found. Please check your email or register.')
        else if (errorMessage.toLowerCase().includes('invalid') || errorMessage.toLowerCase().includes('password'))
          toast.error('Invalid credentials. Please check your email and password.')
        else if (errorMessage.toLowerCase().includes('network'))
          toast.error('Network error. Check your connection and try again.')
        else toast.error(errorMessage)
      }
    },
  })

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-gray-900">
      <Toaster />
      <Card className="w-full max-w-md shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="bg-violet-100 dark:bg-violet-900 p-3 rounded-full">
              <svg
                className="w-6 h-6 text-violet-600 dark:text-violet-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 11c.943 0 1.815-.613 2-1.529V8.471C13.815 7.557 12.943 7 12 7s-1.815.557-2 1.471v1C10.185 10.387 11.057 11 12 11z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v3m0 0H9m3 0h3" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Welcome User
          </CardTitle>
          <CardDescription className="text-sm text-gray-500 dark:text-gray-300">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <CardContent className="flex flex-col gap-8">
            <form.Field
              name="email"
              validators={{
                onChange: ({ value }) => validateField(value, loginSchema.shape.email),
                onBlur: ({ value }) => validateField(value, loginSchema.shape.email),
              }}
            >
              {(field) => (
                <div className="grid gap-2">
                  <Label htmlFor={field.name} className="text-gray-700 dark:text-gray-200">
                    Email
                  </Label>
                  <Input
                    type="email"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="name@mail.com"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {String(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field
              name="password"
              validators={{
                onChange: ({ value }) => validateField(value, loginSchema.shape.password),
                onBlur: ({ value }) => validateField(value, loginSchema.shape.password),
              }}
            >
              {(field) => (
                <div className="grid gap-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor={field.name} className="text-gray-700 dark:text-gray-200">
                      Password
                    </Label>
                    <a
                      href="#"
                      className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                    >
                      Forgot?
                    </a>
                  </div>
                  <Input
                    type="password"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter your password"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {String(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </form.Field>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 mt-4">
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </Button>
              )}
            </form.Subscribe>
            <Button variant="outline" className="w-full">
              Login with Google
            </Button>
          </CardFooter>
        </form>

        <div className="text-center text-sm mt-4 text-gray-600 dark:text-gray-300">
          Don’t have an account?{' '}
          <Link to="/register" className="text-violet-600 hover:underline dark:text-violet-400">
            Sign up for free
          </Link>
          <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
            By signing in, you agree to our{' '}
            <a href="#" className="underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </Card>
    </div>
  )
}
