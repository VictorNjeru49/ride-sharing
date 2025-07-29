import { useMemo, useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getRides, getRideCancelById } from '@/api/UserApi'
import type { Ride } from '@/types/alltypes'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Loader2, Eye, Ban } from 'lucide-react'
import { toast } from 'sonner'


function Trips() {
 const router = useRouter()
   const queryClient = useQueryClient()
 
   // ---------------------------------------------------------------------------
   // Local UI state
   // ---------------------------------------------------------------------------
   const [searchText, setSearchText] = useState<string>('')
   const [statusFilter, setStatusFilter] = useState<string>('all')
 
   // ---------------------------------------------------------------------------
   // Data fetching
   // ---------------------------------------------------------------------------
   const {
     data: ridesData,
     isLoading,
     error,
   } = useQuery<Ride[]>({
     queryKey: ['rides'],
     queryFn: () => getRides(),
   })
 
   const rides: Ride[] = ridesData ?? []
 
   // ---------------------------------------------------------------------------
   // Cancel ride mutation
   // ---------------------------------------------------------------------------
   const { mutate: handleCancel, isPending: isCancelling } = useMutation({
     mutationFn: (rideId: string) => getRideCancelById(rideId),
     onSuccess: (_) => {
       toast.success('Ride cancelled')
       queryClient.invalidateQueries({ queryKey: ['rides'] })
     },
     onError: () => toast.error('Failed to cancel ride'),
   })
 
   // ---------------------------------------------------------------------------
   // Derived filtered list
   // ---------------------------------------------------------------------------
   const filteredRides = useMemo(() => {
     const lower = searchText.toLowerCase()
     return rides.filter((r) => {
       const matchesStatus =
         statusFilter === 'all' ? true : r.status === statusFilter
       const matchesSearch = !searchText
         ? true
         : [
             r.id,
             r?.rider?.user?.firstName + ' ' + r?.rider?.user?.lastName,
             r?.driver?.user?.firstName + ' ' + r?.driver?.user?.lastName,
             r.pickupLocation.address,
             r.dropoffLocation.address,
           ]
             .filter(Boolean)
             .some((field) => field.toLowerCase().includes(lower))
 
       return matchesStatus && matchesSearch
     })
   }, [rides, searchText, statusFilter])
 
   // ---------------------------------------------------------------------------
   // Loading / error states
   // ---------------------------------------------------------------------------
   if (isLoading)
     return (
       <div className="flex items-center justify-center p-10 text-gray-500">
         <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading trips…
       </div>
     )
   if (error)
     return (
       <div className="p-6 text-center text-red-500">Error loading trips.</div>
     )
 
   // ---------------------------------------------------------------------------
   // UI
   // ---------------------------------------------------------------------------
   return (
     <Card className="mx-auto mb-10 mt-6 w-full ">
       <CardHeader>
         <CardTitle className="text-2xl font-bold">Trips Management</CardTitle>
       </CardHeader>

       {/* Filters */}
       <div className="flex flex-col gap-4 px-6 pb-4 sm:flex-row sm:items-end">
         <div className="flex-1">
           <Input
             placeholder="Search rider / driver / address…"
             value={searchText}
             onChange={(e) => setSearchText(e.target.value)}
           />
         </div>
         <div className="w-full sm:w-52">
           <Select
             value={statusFilter}
             onValueChange={(v) => setStatusFilter(v)}
           >
             <SelectTrigger>
               <SelectValue placeholder="Status" />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="all">All</SelectItem>
               <SelectItem value="pending">Pending</SelectItem>
               <SelectItem value="inprogress">In Progress</SelectItem>
               <SelectItem value="completed">Completed</SelectItem>
               <SelectItem value="cancelled">Cancelled</SelectItem>
             </SelectContent>
           </Select>
         </div>
       </div>

       {/* Table */}
       <CardContent className="overflow-x-auto p-0">
         {filteredRides.length === 0 ? (
           <div className="p-6 text-center text-gray-500">No trips found.</div>
         ) : (
           <Table>
             <TableHeader>
               <TableRow>
                 <TableHead className="w-24">ID</TableHead>
                 <TableHead>Rider</TableHead>
                 <TableHead>Driver</TableHead>
                 <TableHead>Pickup</TableHead>
                 <TableHead>Destination</TableHead>
                 <TableHead>Date</TableHead>
                 <TableHead>Status</TableHead>
                 <TableHead className="w-24">Fare</TableHead>
                 <TableHead className="w-20">Action</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {filteredRides.map((ride) => (
                 <TableRow key={ride.id} className="hover:bg-muted/50">
                   <TableCell className="truncate text-xs font-medium">
                     {ride.id.slice(0, 6)}…
                   </TableCell>
                   <TableCell>
                     {ride.rider?.user
                       ? `${ride.rider.user.firstName} ${ride.rider.user.lastName}`
                       : 'Grace Anderson'}
                   </TableCell>
                   <TableCell>
                     {ride.driver?.user
                       ? `${ride.driver.user.firstName} ${ride.driver.user.lastName}`
                       : 'Chris Anderson'}
                   </TableCell>

                   <TableCell className="truncate max-w-[140px]">
                     {ride.pickupLocation?.address ?? 'N/A'}
                   </TableCell>
                   <TableCell className="truncate max-w-[140px]">
                     {ride.dropoffLocation?.address ?? 'N/A'}
                   </TableCell>

                   <TableCell>
                     {new Date(ride.startTime).toLocaleDateString()}
                   </TableCell>
                   <TableCell className="capitalize">{ride.status}</TableCell>
                   <TableCell>{Number(ride.fare).toFixed(2)}</TableCell>
                   <TableCell className="flex gap-2">
                     <Button
                       size="icon"
                       variant="ghost"
                          onClick={() =>
                            router.navigate({
                              to: '/dashboard/trips/$tripId',
                              params: { tripId: ride.id },
                            })
                          }
                     >
                       <Eye className="h-4 w-4" />
                     </Button>
                     <Button
                       size="icon"
                       variant="ghost"
                       disabled={isCancelling || ride.status !== 'pending'}
                       onClick={() => handleCancel(ride.id)}
                     >
                       <Ban className="h-4 w-4" />
                     </Button>
                   </TableCell>
                 </TableRow>
               ))}
             </TableBody>
           </Table>
         )}
       </CardContent>
     </Card>
   )
 }
 
 
export default Trips