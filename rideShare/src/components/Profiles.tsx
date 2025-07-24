import React, { useEffect, useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { toast, Toaster } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { getUserById, updateUser } from '@/api/UserApi'
import { UserRole, type userTypes } from '@/types/alltypes'
import { authStore } from '@/app/store'
import { RingLoader } from 'react-spinners'

function Profiles() {
  const userId = authStore.state.user?.id

  // Fetch user data with useQuery
  const { data: user, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId,
  })

  // Form state
  const [formData, setFormData] = useState<Partial<userTypes>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profilePicture: '',
    password: '',
  })

  // Sync form data when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        profilePicture: user.profilePicture,
      })
    }
  }, [user])

  // Mutation for updating user
  const updateMutation = useMutation<
    userTypes,
    Error,
    { id: string; payload: Partial<userTypes> }
  >({
    mutationFn: ({ id, payload }) => updateUser(id, payload),
    onSuccess: () => {
      toast.success('Profile updated successfully!')
    },
    onError: (error) => {
      toast.error(`Update failed: ${error.message}`)
    },
  })

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  // const handleRoleChange = (value: string) => {
  //   setFormData((prev) => ({ ...prev, role: value as UserRole }))
  // }

  // Submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) {
      toast.error('User ID is missing. Cannot update profile.')
      return
    }

    // Prepare payload, exclude empty password if not changed
    const payload: Partial<userTypes> = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      profilePicture: formData.profilePicture,
    }
    if (formData.password && formData.password.trim() !== '') {
      payload.password = formData.password
    }

    updateMutation.mutateAsync({ id: userId, payload })
  }

  const {
    firstName = '',
    lastName = '',
    email = '',
    phone = '',
    profilePicture,
    password = '',
  } = formData

  if (isLoading) {
    return (
      <div className=" w-fit text-center py-10 m-auto">
        <RingLoader color="#0017ff" />
        Loading...
      </div>
    )
  }
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Toaster />
      <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
        Profile Settings
      </h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Manage your account settings and preferences
      </p>

      <Tabs defaultValue="profile" className="mt-8 md:mt-12">
        <TabsList
          className="
        flex flex-col space-y-3 md:grid md:grid-cols-3 md:space-y-0 w-full mb-10
        border-b border-gray-200 dark:border-gray-700
      "
        >
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-600
          dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-white
          font-semibold text-gray-700 dark:text-gray-300 px-5 py-4 rounded-md
          md:text-center md:px-0 md:py-3"
          >
            Profile Details
          </TabsTrigger>
          <TabsTrigger
            value="account"
            className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-600
          dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-white
          font-semibold text-gray-700 dark:text-gray-300 px-5 py-4 rounded-md
          md:text-center md:px-0 md:py-3"
          >
            Account Settings
          </TabsTrigger>
          <TabsTrigger
            value="recovery"
            className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-600
          dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-white
          font-semibold text-gray-700 dark:text-gray-300 px-5 py-4 rounded-md
          md:text-center md:px-0 md:py-3"
          >
            Recovery & Security
          </TabsTrigger>
        </TabsList>

        <form
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 shadow-md space-y-8"
          onSubmit={handleSubmit}
        >
          <div className="flex items-center gap-6 dark:text-white">
            <Avatar className="w-20 h-20">
              {profilePicture ? (
                <AvatarImage src={profilePicture} />
              ) : (
                <AvatarFallback className="text-3xl font-bold">
                  {firstName?.[0]}
                  {lastName?.[0]}
                </AvatarFallback>
              )}
            </Avatar>
            <Button variant="outline" disabled className="h-10 px-5">
              Change Photo
            </Button>
          </div>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="firstName"
                  className="font-medium text-gray-700 dark:text-gray-300"
                >
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={handleChange}
                  disabled={isLoading || updateMutation.isPending}
                  className="mt-2"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <Label
                  htmlFor="lastName"
                  className="font-medium text-gray-700 dark:text-gray-300"
                >
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={handleChange}
                  disabled={isLoading || updateMutation.isPending}
                  className="mt-2"
                  placeholder="Enter your last name"
                />
              </div>
              <div className="md:col-span-2">
                <Label
                  htmlFor="email"
                  className="font-medium text-gray-700 dark:text-gray-300"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleChange}
                  disabled={isLoading || updateMutation.isPending}
                  className="mt-2"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <Label
                  htmlFor="phone"
                  className="font-medium text-gray-700 dark:text-gray-300"
                >
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={handleChange}
                  disabled={isLoading || updateMutation.isPending}
                  className="mt-2"
                  placeholder="+1234567890"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <div>
              <Label
                htmlFor="username"
                className="font-medium text-gray-700 dark:text-gray-300"
              >
                Username
              </Label>
              <Input
                id="username"
                defaultValue={user?.firstName || user?.lastName || ''}
                disabled
                className="mt-2 bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
              />
            </div>
          </TabsContent>

          <TabsContent value="recovery" className="space-y-6">
            <div>
              <Label
                htmlFor="password"
                className="font-medium text-gray-700 dark:text-gray-300"
              >
                New Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={handleChange}
                disabled={isLoading || updateMutation.isPending}
                className="mt-2"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <Label
                htmlFor="confirmPassword"
                className="font-medium text-gray-700 dark:text-gray-300"
              >
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                disabled={isLoading || updateMutation.isPending}
                className="mt-2"
                placeholder="Confirm new password"
              />
            </div>
            <div>
              <Label
                htmlFor="backup"
                className="font-medium text-gray-700 dark:text-gray-300"
              >
                Backup Email
              </Label>
              <Input
                id="backup"
                type="email"
                placeholder="backup@company.com"
                disabled={isLoading || updateMutation.isPending}
                className="mt-2"
              />
            </div>
          </TabsContent>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              disabled={isLoading || updateMutation.isPending}
              onClick={() => {
                if (user) {
                  setFormData({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    profilePicture: user.profilePicture,
                    password: '',
                  })
                }
              }}
              className="px-6 py-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || updateMutation.isPending}
              aria-busy={updateMutation.isPending}
              className="px-8 py-2"
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  )
}

export default Profiles
