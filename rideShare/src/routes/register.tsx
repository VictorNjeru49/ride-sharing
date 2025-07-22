import { createFileRoute, Link } from '@tanstack/react-router'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useCrudOperations } from '@/hooks/crudops'
import { useQueryClient } from '@tanstack/react-query'
import { UserRole, type userTypes } from '@/types/alltypes'
import { createRiderProfile, createUser, deleteUser, getUserById, getUsers, updateUser } from '@/api/UserApi'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { toast, Toaster } from 'sonner'
import { useNavigate } from '@tanstack/react-router'
import { useLogin } from '@/api/LoginApi'
import { authActions } from '@/app/store'

export const Route = createFileRoute('/register')({
  component: RouteComponent,
})

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  phone: z.string().min(10, 'phone number is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 15 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number'),
  agreeToTerms: z
    .boolean()
    .refine(
      (val) => val === true,
      'You must agree to the terms and conditions',
    ),
})

// Register dark mode styles
const bgClass = 'bg-gray-50 dark:bg-gray-900'
const cardClass = 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
const inputClass =
  'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white'
const errorClass = 'mt-1 text-sm text-red-600'
const labelClass =
  'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'

const validateField = <T,>(value: T, schema: z.ZodType<T>) => {
  const result = schema.safeParse(value)
  if (!result.success) {
    return result.error.issues[0]?.message || 'Validation error'
  }
  return undefined
}

function RouteComponent() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const loginMutation = useLogin()

  const { create } = useCrudOperations<
    userTypes,
    Partial<Omit<userTypes, 'id'>>,
    Partial<Omit<userTypes, 'id'>>,
    string
  >(
    {
      all: ['users'],
      details: (id: string) => ['users', id],
    },
    {
      fetchFn: () => getUsers(),
      createFn: (userData) => createUser(userData),
      updateFn: (id, userData) => updateUser(id, userData),
      deleteFn: (userId: string) => deleteUser(userId),
    },
  )

  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      agreeToTerms: false,
    },
    onSubmit: async ({ value }) => {
      const result = formSchema.safeParse(value)
      if (!result.success) return

      try {
        await create.mutateAsync(
          { ...result.data, role: UserRole.RIDER },
          {
            onSuccess: async (newUser) => {
              const fullUser = await getUserById(newUser.id)
              if (fullUser.role === UserRole.RIDER) {
                await createRiderProfile({ user: fullUser, rating: 5, preferredPaymentMethod: 'card' })
              }
            },
          },
        )
        toast.success('User created successfully!')

        queryClient.invalidateQueries({ queryKey: ['users'] })

        const login = await loginMutation.mutateAsync({
          email: result.data.email,
          password: result.data.password,
        })

        authActions.saveUser({
          isVerified: login.isVerified ?? false,
          tokens: login.tokens,
          user: {
            id: login.user.id,
            email: login.user.email,
            role: login.user.role ?? UserRole.RIDER,
          },
        })
        const loggedInUserRole = login.user?.role

        if (loggedInUserRole === UserRole.ADMIN) {
          navigate({ to: '/dashboard' })
        } else if (loggedInUserRole === UserRole.RIDER) {
          navigate({ to: '/user' })
        } else if (loggedInUserRole === UserRole.DRIVER) {
          navigate({ to: '/driver' })
        } else {
          toast.warning('Unknown user role:', loggedInUserRole)
          navigate({ to: '/' })
        }
      } catch (error) {
        toast.error('Error creating user:')
        toast.warning('Failed to create user. Please try again.')
      }
    },
  })
  const fieldKeys = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'password',
  ] as const

  return (
    <div className={`flex justify-center items-center min-h-screen ${bgClass}`}>
      <Toaster />
      <Card className={`w-full max-w-md shadow-lg ${cardClass}`}>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create an Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            {fieldKeys.map((fieldKey) => (
              <form.Field
                key={fieldKey}
                name={fieldKey} // correctly typed as one of the string literals
                validators={{
                  onChange: ({ value }) =>
                    validateField(value, formSchema.shape[fieldKey]),
                  onBlur: ({ value }) =>
                    validateField(value, formSchema.shape[fieldKey]),
                }}
              >
                {(field) => (
                  <div>
                    <label htmlFor={field.name} className={labelClass}>
                      {field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                    </label>
                    <input
                      id={field.name}
                      name={field.name}
                      type={field.name === 'password' ? 'password' : 'text'}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder={`Enter your ${field.name}`}
                      className={`${inputClass} ${
                        field.state.meta.errors.length > 0
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300'
                      }`}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className={errorClass}>{field.state.meta.errors[0]}</p>
                    )}
                  </div>
                )}
              </form.Field>
            ))}
            <form.Field
              name="agreeToTerms"
              validators={{
                onChange: ({ value }) =>
                  validateField(value, formSchema.shape.agreeToTerms),
                onBlur: ({ value }) =>
                  validateField(value, formSchema.shape.agreeToTerms),
              }}
            >
              {(field) => (
                <div>
                  <label className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      name={field.name}
                      checked={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.checked)}
                      className="mt-1"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      I agree to the Terms and Conditions and Privacy Policy
                    </span>
                  </label>
                  {field.state.meta.errors.length > 0 && (
                    <p className={errorClass}>{field.state.meta.errors[0]}</p>
                  )}
                </div>
              )}
            </form.Field>
            <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={`w-full py-2 px-4 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    canSubmit
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-400 cursor-not-allowed text-gray-200'
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Sign Up'}
                </button>
              )}
            </form.Subscribe>
          </form>

          <div className="text-sm text-center text-muted-foreground mt-4 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
