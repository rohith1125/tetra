import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { findMatches } from '@/utils/matchingAlgorithm'

export async function GET() {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const matches = await findMatches(session.user.id)

  return NextResponse.json(matches)
}

