import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { PrismaClient } from '@prisma/client'
import { tweetSchema } from '@/utils/validation'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { content } = tweetSchema.parse(body)

    const tweet = await prisma.tweet.create({
      data: {
        content,
        authorId: session.user.id,
      },
    })

    return NextResponse.json(tweet)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

