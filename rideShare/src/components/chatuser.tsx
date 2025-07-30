import React, { useEffect, useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
 } from './ui/drawer' // adjust imports
import { getUsers } from '@/api/UserApi'
import type { userTypes } from '@/types/alltypes'
import { Outlet, useNavigate } from '@tanstack/react-router'
import { Button } from './ui/button'

type DrawerUsersProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DrawerUsers: React.FC<DrawerUsersProps> = ({ open, onOpenChange }) => {
  const [users, setUsers] = useState<userTypes[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (open) {
      setLoading(true)
      setError(null)
      getUsers()
        .then(setUsers)
        .catch((err) => setError(err.message || 'Failed to load users'))
        .finally(() => setLoading(false))
    }
  }, [open])

  function handleUserClick(userId: string) {
    // navigate(`/chat/${userId}`)
    alert(`The user ${userId}`)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="fixed top-0 right-0 h-full w-4/5 bg-white dark:bg-gray-700 shadow-lg overflow-auto z-50">
        <DrawerHeader>
          <div className="flex items-center justify-between border-b border-orange-800 p-4">
            <FaWhatsapp className="h-10 w-10 bg-green-500 rounded-sm" color="white" />
            <DrawerTitle className="flex-1 text-center text-lg font-semibold text-white">
              Chat Users
            </DrawerTitle>
            <Button onClick={() => onOpenChange(false)} className="btn-secondary">
              Close
            </Button>
          </div>
        </DrawerHeader>

        <div className="p-4 text-white">
          {loading && <p>Loading users...</p>}
          {error && <p className="text-red-400">{error}</p>}
          {!loading && !error && (
            <ul className="space-y-2">
              {users.map((user) => (
                <li
                  key={user.id}
                  className="cursor-pointer rounded p-2 hover:bg-green-600"
                  onClick={() => handleUserClick(user.id)}
                >
                  {user.firstName} {user.email && <span className="text-sm text-gray-300">({user.email})</span>}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-4 border-t border-gray-600 p-4 bg-gray-800 rounded">
          <Outlet />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default DrawerUsers
