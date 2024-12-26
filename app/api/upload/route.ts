import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { uploadToS3 } from '@/utils/s3Upload'

export async function POST(request: Request) {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const buffer = Buffer.from(await file.arrayBuffer())
    const fileName = `${session.user.id}-${Date.now()}-${file.name}`

    const fileUrl = await uploadToS3(buffer, fileName)

    return NextResponse.json({ fileUrl })
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json({ error: 'Error uploading image' }, { status: 500 })
  }
}

