import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Card className="w-full max-w-md mx-auto mt-24 shadow-lg border border-gray-200 rounded-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-semibold text-gray-900">
          Login to your account
        </CardTitle>
        <CardDescription className="text-gray-600 mt-1">
          Enter your email below to login to your account
        </CardDescription>
        <CardAction className="mt-3">
          <Button
            variant="link"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Sign Up
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <form>
          <div className="flex flex-col gap-8">
            <div className="grid gap-2">
              <Label htmlFor="email" className="font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="font-medium text-gray-700">
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
                id="password"
                type="password"
                required
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        >
          Login
        </Button>
        <Button
          variant="outline"
          className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
        >
          Login with Google
        </Button>
      </CardFooter>
    </Card>
  )
}
