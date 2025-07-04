import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Download, Filter, MoreVertical } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/dashboard/payments')({
  component: RouteComponent,
})

function RouteComponent() {
  const transactions = [
    {
      id: '#TXN001247',
      type: 'Ride Payment',
      user: {
        name: 'Sarah Johnson',
        email: 'sarah@email.com',
        avatar: 'https://i.pravatar.cc/40?img=5',
      },
      amount: '$24.50',
      status: 'Completed',
      date: '2024-01-15 14:30',
    },
    {
      id: '#TXN001246',
      type: 'Driver Payout',
      user: {
        name: 'Mike Chen',
        email: 'mike@email.com',
        avatar: 'https://i.pravatar.cc/40?img=10',
      },
      amount: '$156.75',
      status: 'Pending',
      date: '2024-01-15 13:45',
    },
    {
      id: '#TXN001245',
      type: 'Refund',
      user: {
        name: 'Emma Davis',
        email: 'emma@email.com',
        avatar: 'https://i.pravatar.cc/40?img=15',
      },
      amount: '-$18.25',
      status: 'Completed',
      date: '2024-01-15 12:20',
    },
  ]

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'Ride Payment':
        return 'blue'
      case 'Driver Payout':
        return 'green'
      case 'Refund':
        return 'red'
      default:
        return 'gray'
    }
  }

  const getStatusColor = (status: string) => {
    return status === 'Completed'
      ? 'text-green-600'
      : status === 'Pending'
        ? 'text-yellow-600'
        : 'text-red-600'
  }
  return (
    <div className="space-y-6">
    {/* Top Summary Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
          <CardDescription className="text-green-600">
            +12.5% from last month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-green-700">$124,567</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Today's Transactions</CardTitle>
          <CardDescription className="text-blue-600">
            +8.2% from yesterday
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-blue-700">1,247</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Pending Payouts</CardTitle>
          <CardDescription className="text-orange-600">
            47 drivers waiting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-orange-700">$8,945</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Failed Payments</CardTitle>
          <CardDescription className="text-red-600">
            Needs attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-red-700">23</p>
        </CardContent>
      </Card>
    </div>

    {/* Filters */}
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex gap-2 flex-wrap">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">All Transactions</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Ride Payment</DropdownMenuItem>
            <DropdownMenuItem>Driver Payout</DropdownMenuItem>
            <DropdownMenuItem>Refund</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Last 30 Days</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Today</DropdownMenuItem>
            <DropdownMenuItem>This Week</DropdownMenuItem>
            <DropdownMenuItem>This Month</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">All Status</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Completed</DropdownMenuItem>
            <DropdownMenuItem>Pending</DropdownMenuItem>
            <DropdownMenuItem>Failed</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          More Filters
        </Button>
      </div>
    </div>

    {/* Transaction Table */}
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Transaction ID</th>
              <th>Type</th>
              <th>User</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-3">{txn.id}</td>
                <td>
                  <Badge variant="secondary" className={`text-${getBadgeVariant(txn.type)}-600`}>
                    {txn.type}
                  </Badge>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={txn.user.avatar} />
                      <AvatarFallback>
                        {txn.user.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{txn.user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {txn.user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td>{txn.amount}</td>
                <td className={getStatusColor(txn.status)}>{txn.status}</td>
                <td>{txn.date}</td>
                <td>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-muted-foreground">
            Showing 1 to 10 of 1,247 results
          </p>
          <div className="flex gap-1">
            <Button variant="outline" size="sm">Previous</Button>
            <Button size="sm" className="bg-blue-600 text-white">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);
}
