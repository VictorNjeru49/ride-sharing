import React, { useEffect, useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { toast, Toaster } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
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
      <h2 className="text-2xl font-bold">Profile Settings</h2>
      <p className="text-sm text-muted-foreground">
        Manage your account settings and preferences
      </p>

      <Tabs defaultValue="profile" className="mt-6">
        <TabsList className="grid grid-cols-3 w-full mb-4">
          <TabsTrigger value="profile">Profile Details</TabsTrigger>
          <TabsTrigger value="account">Account Settings</TabsTrigger>
          <TabsTrigger value="recovery">Recovery & Security</TabsTrigger>
        </TabsList>

        <form
          className="bg-white rounded-lg border p-6 space-y-6 shadow"
          onSubmit={handleSubmit}
        >
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              {profilePicture ? (
                <AvatarImage src={profilePicture} />
              ) : (
                <AvatarFallback>
                  {firstName?.[0]}
                  {lastName?.[0]}
                </AvatarFallback>
              )}
            </Avatar>
            <Button variant="outline" disabled>
              Change Photo
            </Button>
          </div>

          <TabsContent value="profile" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={handleChange}
                  disabled={isLoading || updateMutation.isPending}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={handleChange}
                  disabled={isLoading || updateMutation.isPending}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleChange}
                  disabled={isLoading || updateMutation.isPending}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={handleChange}
                  disabled={isLoading || updateMutation.isPending}
                />
              </div>
              {/* <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={role}
                  onValueChange={handleRoleChange}
                  disabled={isLoading || updateMutation.isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserRole.ADMIN}>
                      Administrator
                    </SelectItem>
                    <SelectItem value={UserRole.DRIVER}>Driver</SelectItem>
                    <SelectItem value={UserRole.RIDER}>Rider</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
            </div>
          </TabsContent>

          <TabsContent value="account" className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                defaultValue={user?.firstName || user?.lastName || ''}
                disabled
              />
            </div>
            {/* <div>
              <Label htmlFor="role">Role</Label>
              <Input id="role" defaultValue={role} disabled />
            </div> */}
          </TabsContent>

          <TabsContent value="recovery" className="space-y-4">
            <div>
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={handleChange}
                disabled={isLoading || updateMutation.isPending}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                // You can add confirm password state and validation as needed
                disabled={isLoading || updateMutation.isPending}
              />
            </div>
            <div>
              <Label htmlFor="backup">Backup Email</Label>
              <Input
                id="backup"
                type="email"
                placeholder="backup@company.com"
                disabled={isLoading || updateMutation.isPending}
              />
            </div>
          </TabsContent>

          <div className="flex justify-end gap-4 pt-4">
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
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || updateMutation.isPending}
              aria-busy={updateMutation.isPending}
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
