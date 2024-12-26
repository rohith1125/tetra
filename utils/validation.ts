import { z } from "zod"

export const tweetSchema = z.object({
  content: z.string().min(1).max(280),
})

export const profileSchema = z.object({
  bio: z.string().max(500),
  interests: z.array(z.string()).max(10),
})

export const matchSchema = z.object({
  userId: z.string(),
})

