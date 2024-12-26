import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function findMatches(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { datingProfile: true },
  })

  if (!user || !user.datingProfile) {
    return []
  }

  const potentialMatches = await prisma.user.findMany({
    where: {
      id: { not: userId },
      datingProfile: { 
        interests: { 
          hasSome: user.datingProfile.interests 
        }
      },
    },
    include: { datingProfile: true },
  })

  return potentialMatches.map(match => ({
    ...match,
    score: calculateMatchScore(user.datingProfile, match.datingProfile),
  })).sort((a, b) => b.score - a.score)
}

function calculateMatchScore(profile1, profile2) {
  const commonInterests = profile1.interests.filter(interest => 
    profile2.interests.includes(interest)
  )
  return commonInterests.length / Math.max(profile1.interests.length, profile2.interests.length)
}

