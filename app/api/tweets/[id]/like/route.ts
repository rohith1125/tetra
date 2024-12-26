import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const tweetId = params.id
  const userId = session.user.id

  const existingLike = await prisma.like.findUnique({
    where: {
      userId_tweetId: {
        userId,
        tweetId,
      },
    },
  })

  if (existingLike) {
    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    })
  } else {
    await prisma.like.create({
      data: {
        userId,
        tweetId,
      },
    })
  }

  return NextResponse.json({ success: true })
}

