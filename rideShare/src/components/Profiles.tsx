import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
  import { Input } from "@/components/ui/input"
  import { Label } from "@/components/ui/label"
  import { Button } from "@/components/ui/button"
  import { Textarea } from "@/components/ui/textarea"
  import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function Profiles() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
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
  
          <form className="bg-white rounded-lg border p-6 space-y-6 shadow">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src="https://randomuser.me/api/portraits/men/75.jpg" />
                <AvatarFallback>JA</AvatarFallback>
              </Avatar>
              <Button variant="outline">Change Photo</Button>
            </div>
  
            <TabsContent value="profile" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Anderson" />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="john.anderson@company.com" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+1 (555) 123-4567" />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select defaultValue="it">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="it">Information Technology</SelectItem>
                      <SelectItem value="hr">Human Resources</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={3}
                    defaultValue="Senior System Administrator with 8+ years of experience in managing enterprise infrastructure and security protocols."
                  />
                </div>
              </div>
            </TabsContent>
  
            <TabsContent value="account" className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue="john_admin" />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Input id="role" defaultValue="Administrator" />
              </div>
            </TabsContent>
  
            <TabsContent value="recovery" className="space-y-4">
              <div>
                <Label htmlFor="password">New Password</Label>
                <Input id="password" type="password" />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <div>
                <Label htmlFor="backup">Backup Email</Label>
                <Input id="backup" type="email" placeholder="backup@company.com" />
              </div>
            </TabsContent>
  
            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Tabs>
      </div>
  )
}

export default Profiles