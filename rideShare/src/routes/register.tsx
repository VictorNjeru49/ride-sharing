import { createFileRoute, Link } from '@tanstack/react-router'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useCrudOperations } from '@/hooks/crudops'
import { useQueryClient } from '@tanstack/react-query'
import type { userTypes } from '@/types/alltypes'
import { createUser, deleteUser, getUsers, updateUser } from '@/api/UserApi'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'
import { useLogin } from '@/api/LoginApi'


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
    .min(8, 'Password must be at least 8 characters')
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

type FormData = z.infer<typeof formSchema>
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
    } as FormData,
    onSubmit: async ({ value }) => {
      // Final validation before submission
      const result = formSchema.safeParse(value)
      if (!result.success) {
        console.error('Validation failed:', result.error.issues)
        return
      }

      try {
        // Register user
        const res = await create.mutateAsync(result.data)
        toast.success('User created successfully!')

        // Invalidate users list if needed
        queryClient.invalidateQueries({ queryKey: ['users'] })

        // Auto-login after registration
        await loginMutation.mutateAsync({
          email: result.data.email,
          password: result.data.password,
        })

        // After login success, get user role and navigate
        const loggedInUserRole = res.role // or get from login response if different

        if (loggedInUserRole === 'admin') {
          navigate({ to: '/dashboard' })
        } else if (loggedInUserRole === 'rider') {
          navigate({ to: '/user' })
        } else if (loggedInUserRole === 'driver') {
          navigate({ to: '/driver' })
        } else {
          toast.warning('Unknown user role:', loggedInUserRole)
          navigate({ to: '/' })
        }

        form.reset()
      } catch (error) {
        toast.error('Error creating user:')
        toast.warning('Failed to create user. Please try again.')
      }
    },
  })

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create an Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
              // await handleSubmit(formData)
            }}
          >
            {/* First Name */}
            <form.Field
              name="firstName"
              validators={{
                onChange: ({ value }) =>
                  validateField(value, formSchema.shape.firstName),
                onBlur: ({ value }) =>
                  validateField(value, formSchema.shape.firstName),
              }}
              children={(field) => (
                <div className="space-y-1">
                  <Label htmlFor="firstName">First Name</Label>
                  <input
                    type="text"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter your first name"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      field.state.meta.errors.length > 0
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300'
                    }`}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="mt-1 text-sm text-red-600">
                      {String(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Last Name Field */}
            <form.Field
              name="lastName"
              validators={{
                onChange: ({ value }) =>
                  validateField(value, formSchema.shape.lastName),
                onBlur: ({ value }) =>
                  validateField(value, formSchema.shape.lastName),
              }}
              children={(field) => (
                <div>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter your last name"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      field.state.meta.errors.length > 0
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300'
                    }`}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="mt-1 text-sm text-red-600">
                      {String(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Email */}
            <form.Field
              name="email"
              validators={{
                onChange: ({ value }) =>
                  validateField(value, formSchema.shape.email),
                onBlur: ({ value }) =>
                  validateField(value, formSchema.shape.email),
              }}
              children={(field) => (
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <input
                    type="email"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter your email address"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      field.state.meta.errors.length > 0
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300'
                    }`}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="mt-1 text-sm text-red-600">
                      {String(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            />
            {/* Phone */}
            <form.Field
              name="phone"
              validators={{
                onChange: ({ value }) =>
                  validateField(value, formSchema.shape.phone),
                onBlur: ({ value }) =>
                  validateField(value, formSchema.shape.phone),
              }}
              children={(field) => (
                <div className="space-y-1">
                  <Label htmlFor="phone">Phone</Label>
                  <input
                    type="text"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="254712345678"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      field.state.meta.errors.length > 0
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300'
                    }`}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="mt-1 text-sm text-red-600">
                      {String(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Password */}
            <form.Field
              name="password"
              validators={{
                onChange: ({ value }) =>
                  validateField(value, formSchema.shape.password),
                onBlur: ({ value }) =>
                  validateField(value, formSchema.shape.password),
              }}
              children={(field) => (
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <input
                    type="password"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter your password"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      field.state.meta.errors.length > 0
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300'
                    }`}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="mt-1 text-sm text-red-600">
                      {String(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            />
            {/* Confirm Password */}
            <div className="space-y-1">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Terms and Conditions Field */}
            <form.Field
              name="agreeToTerms"
              validators={{
                onChange: ({ value }) =>
                  validateField(value, formSchema.shape.agreeToTerms),
                onBlur: ({ value }) =>
                  validateField(value, formSchema.shape.agreeToTerms),
              }}
              children={(field) => (
                <div>
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name={field.name}
                      checked={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.checked)}
                      className="mr-2 mt-1"
                    />
                    <span className="text-sm text-gray-700">
                      I agree to the Terms and Conditions and Privacy Policy
                    </span>
                  </label>
                  {field.state.meta.errors.length > 0 && (
                    <p className="mt-1 text-sm text-red-600">
                      {String(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Submit Button */}
            <div className="pt-4">
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
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
              />
            </div>
          </form>

          {/* Footer */}
          <div className="text-sm text-center text-muted-foreground mt-4">
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
