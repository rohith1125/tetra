import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const profile = await prisma.datingProfile.findUnique({
    where: { userId: session.user.id },
  })

  return NextResponse.json(profile || {})
}

export async function POST(request: Request) {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { bio, interests } = await request.json()

  const profile = await prisma.datingProfile.upsert({
    where: { userId: session.user.id },
    update: { bio, interests },
    create: { userId: session.user.id, bio, interests },
  })

  return NextResponse.json(profile)
}

