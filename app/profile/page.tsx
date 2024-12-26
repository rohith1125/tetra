'use client'

import { useState, useEffect } from 'react'
import { useSession } from "next-auth/react"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProfilePage() {
  const { data: session } = useSession()
  const [bio, setBio] = useState('')
  const [interests, setInterests] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    const res = await fetch('/api/profile')
    const data = await res.json()
    setBio(data.bio || '')
    setInterests(data.interests?.join(', ') || '')
    setAvatarUrl(data.avatarUrl || '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bio,
        interests: interests.split(',').map(i => i.trim()),
        avatarUrl,
      }),
    })
    if (res.ok) {
      alert('Profile updated successfully!')
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const { fileUrl } = await res.json()
        setAvatarUrl(fileUrl)
      }
    }
  }

  if (!session) {
    return <div>Please sign in to view this page.</div>
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      <div className="mb-4">
        <Avatar className="w-24 h-24">
          <AvatarImage src={avatarUrl || session?.user?.image} />
          <AvatarFallback>{session?.user?.name?.[0]}</AvatarFallback>
        </Avatar>
        <Input type="file" onChange={handleAvatarUpload} className="mt-2" />
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
            Bio
          </label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="interests" className="block text-sm font-medium text-gray-700">
            Interests (comma-separated)
          </label>
          <Input
            id="interests"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            className="mt-1"
          />
        </div>
        <Button type="submit">Update Profile</Button>
      </form>
    </div>
  )
}

