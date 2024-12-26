'use client'

import Link from 'next/link'
import { Home, User, Heart, LogOut } from 'lucide-react'
import { useSession, signOut } from "next-auth/react"
import { Button } from '@/components/ui/button'

export default function Sidebar() {
  const { data: session } = useSession()

  return (
    <div className="w-64 bg-white h-screen p-4 flex flex-col">
      <h1 className="text-2xl font-bold mb-8">TweetDate</h1>
      <nav className="space-y-4">
        <Link href="/" className="flex items-center space-x-2 text-gray-700 hover:text-blue-500">
          <Home className="h-5 w-5" />
          <span>Home</span>
        </Link>
        <Link href="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-blue-500">
          <User className="h-5 w-5" />
          <span>Profile</span>
        </Link>
        <Link href="/dating" className="flex items-center space-x-2 text-gray-700 hover:text-blue-500">
          <Heart className="h-5 w-5" />
          <span>Dating</span>
        </Link>
      </nav>
      {session && (
        <Button onClick={() => signOut()} className="mt-auto flex items-center space-x-2 text-gray-700 hover:text-red-500">
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Button>
      )}
    </div>
  )
}

