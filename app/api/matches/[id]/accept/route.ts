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

  const matchId = params.id

  const match = await prisma.match.findUnique({
    where: { id: matchId },
  })

  if (!match || (match.senderId !== session.user.id && match.receiverId !== session.user.id)) {
    return NextResponse.json({ error: 'Match not found' }, { status: 404 })
  }

  await prisma.match.update({
    where: { id: matchId },
    data: { status: 'ACCEPTED' },
  })

  return NextResponse.json({ success: true })
}

