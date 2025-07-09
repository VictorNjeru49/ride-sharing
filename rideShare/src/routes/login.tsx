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
      
      if (!result.success) {
        console.error('Validation failed:', result.error.issues)
        return
      }

      console.log('Attempting login with:', {
        email: result.data.email,
        password: '[HIDDEN]',
      })
      try {
        const res = await login.mutateAsync({
          email: result.data.email,
          password: result.data.password,
        })

        // ✅ Save user to store
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

        if (hasRole(UserRole.ADMIN)) {
          router.navigate({ to: '/dashboard' })
        } else if (hasRole(UserRole.RIDER)) {
          router.navigate({ to: '/user' })
        } else if (hasRole(UserRole.DRIVER)) {
          router.navigate({ to: '/driver' })
        } else {
          toast.error('User role not found. Please contact support.')
          router.navigate({ to: '/' })
        }
      } catch (error) {
        let errorMessage = 'Login failed. Please try again.'

        if (error instanceof Error) {
          errorMessage = error.message
        }
        if (
          errorMessage.toLowerCase().includes('not found') ||
          errorMessage.toLowerCase().includes('no account found')
        ) {
          toast.error(
            'Account not found. Please check your email or create a new account.',
          )
        } else if (
          errorMessage.toLowerCase().includes('invalid') ||
          errorMessage.toLowerCase().includes('password')
        ) {
          toast.error(
            'Invalid credentials. Please check your email and password.',
          )
        } else if (
          errorMessage.toLowerCase().includes('network') ||
          errorMessage.toLowerCase().includes('fetch')
        ) {
          toast.error(
            'Network error. Please check your internet connection and try again.',
          )
        } else {
          toast.error(errorMessage)
        }
      }

      console.log('Form submitted successfully:', value)
    },

    
  })
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Toaster/>
      <Card className="w-full max-w-md shadow-md border border-gray-200 rounded-xl bg-white">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="bg-violet-100 p-3 rounded-full">
              <svg
                className="w-6 h-6 text-violet-600"
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 11v3m0 0H9m3 0h3"
                />
              </svg>
            </div>
          </div>
          <CardTitle className="text-xl font-semibold text-gray-800">
            Welcome User
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <CardContent>
            <div className="flex flex-col gap-8">
              <form.Field
                name="email"
                validators={{
                  onChange: ({ value }) =>
                    validateField(value, loginSchema.shape.email),
                  onBlur: ({ value }) =>
                    validateField(value, loginSchema.shape.email),
                }}
                children={(field) => (
                  <div className="grid gap-2">
                    <Label
                      htmlFor="email"
                      className="font-medium text-gray-700"
                    >
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
                      required
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="mt-1 text-sm text-red-600">
                        {String(field.state.meta.errors[0])}
                      </p>
                    )}
                  </div>
                )}
              />
              <form.Field
                name="password"
                validators={{
                  onChange: ({ value }) =>
                    validateField(value, loginSchema.shape.password),
                  onBlur: ({ value }) =>
                    validateField(value, loginSchema.shape.password),
                }}
                children={(field) => (
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="password"
                        className="font-medium text-gray-700"
                      >
                        Password
                      </Label>
                      <a
                        href="#"
                        className="text-sm text-blue-600 hover:underline hover:text-blue-800"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      placeholder="Enter your password"
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="mt-1 text-sm text-red-600">
                        {String(field.state.meta.errors[0])}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  className="w-full mt-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  disabled={!canSubmit}
                >
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </Button>
              )}
            />
            <Button
              variant="outline"
              className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Login with Google
            </Button>
          </CardFooter>
        </form>
        <div className="text-center text-sm mt-4 text-gray-600">
          Don’t have an account?{' '}
          <Link to="/register" className="text-violet-600 hover:underline">
            Sign up for free
          </Link>
          <p className="mt-2 text-xs text-gray-400">
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
