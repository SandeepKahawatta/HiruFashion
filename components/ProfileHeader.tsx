'use client'

import { User } from 'lucide-react'

interface ProfileHeaderProps {
  user: {
    name: string
    email: string
    role: string
  }
  orderCount: number
}

export default function ProfileHeader({ user, orderCount }: ProfileHeaderProps) {
  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-8">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold tracking-wider shadow-lg">
          {initials}
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">{user.name}</h1>
          <p className="text-gray-500 font-medium mb-4">{user.email}</p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <span className="px-4 py-1.5 bg-gray-100 rounded-full text-xs font-bold uppercase tracking-wider text-gray-600">
              {user.role} Member
            </span>
            <span className="px-4 py-1.5 bg-black text-white rounded-full text-xs font-bold uppercase tracking-wider">
              {orderCount} Orders
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
