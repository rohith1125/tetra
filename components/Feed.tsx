'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSession } from "next-auth/react"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Heart } from 'lucide-react'
import io from 'socket.io-client'
import { FixedSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'

type Tweet = {
  id: string
  content: string
  author: {
    name: string
    image: string
  }
  likes: number
  liked: boolean
}

export default function Feed() {
  const { data: session } = useSession()
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [newTweet, setNewTweet] = useState('')

  useEffect(() => {
    fetchTweets()
  }, [])

  const fetchTweets = async () => {
    const res = await fetch('/api/tweets')
    const data = await res.json()
    setTweets(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newTweet.trim()) {
      const res = await fetch('/api/tweets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newTweet }),
      })
      if (res.ok) {
        setNewTweet('')
        fetchTweets()
      }
    }
  }

  const handleLike = async (tweetId: string) => {
    const res = await fetch(`/api/tweets/${tweetId}/like`, {
      method: 'POST',
    })
    if (res.ok) {
      fetchTweets()
    }
  }

  const memoizedTweets = useMemo(() => tweets, [tweets])

  const Row = ({ index, style }) => {
    const tweet = memoizedTweets[index]
    return (
      <div style={style}>
        <li className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <img src={tweet.author.image} alt="" className="w-10 h-10 rounded-full mr-2" />
            <p className="font-bold">{tweet.author.name}</p>
          </div>
          <p>{tweet.content}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleLike(tweet.id)}
            className={`mt-2 ${tweet.liked ? 'text-red-500' : 'text-gray-500'}`}
            aria-label={`Like tweet by ${tweet.author.name}`}
            aria-pressed={tweet.liked}
          >
            <Heart className="w-4 h-4 mr-1" aria-hidden="true" />
            <span aria-live="polite">{tweet.likes}</span>
          </Button>
        </li>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="mb-4">
        <label htmlFor="new-tweet" className="sr-only">New Tweet</label>
        <Input
          id="new-tweet"
          value={newTweet}
          onChange={(e) => setNewTweet(e.target.value)}
          placeholder="What's happening?"
          className="mb-2"
          aria-label="New Tweet"
        />
        <Button type="submit">Tweet</Button>
      </form>
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            itemCount={memoizedTweets.length}
            itemSize={150}
            width={width}
          >
            {Row}
          </List>
        )}
      </AutoSizer>
    </div>
  )
}

