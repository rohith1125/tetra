'use client'

import { useState, useEffect } from 'react'
import { useSession } from "next-auth/react"
import { Button } from '@/components/ui/button'

type Match = {
  id: string
  user: {
    name: string
    image: string
  }
  datingProfile: {
    bio: string
  }
}

export default function DatingFeature() {
  const { data: session } = useSession()
  const [matches, setMatches] = useState<Match[]>([])

  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    const res = await fetch('/api/matches')
    const data = await res.json()
    setMatches(data)
  }

  const handleMatch = async (matchId: string) => {
    const res = await fetch(`/api/matches/${matchId}/accept`, {
      method: 'POST',
    })
    if (res.ok) {
      fetchMatches()
    }
  }

  return (
    <div className="w-64 bg-white h-screen p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Matches</h2>
      <div className="space-y-4">
        {matches.map((match) => (
          <div key={match.id} className="bg-gray-100 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <img src={match.user.image} alt={match.user.name} className="w-10 h-10 rounded-full mr-2" />
              <p className="font-bold">{match.user.name}</p>
            </div>
            <p className="text-sm text-gray-600">{match.datingProfile.bio}</p>
            <Button onClick={() => handleMatch(match.id)} className="mt-2" size="sm">
              Accept Match
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

