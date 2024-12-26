import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import rateLimit from 'express-rate-limit'
import { promisify } from 'util'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
})

const asyncMiddleware = promisify(limiter)

export async function rateLimitMiddleware(request: NextRequest) {
  try {
    await asyncMiddleware(request, NextResponse)
    return NextResponse.next()
  } catch (error) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }
}

