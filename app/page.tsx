import Feed from '@/components/Feed'
import Sidebar from '@/components/Sidebar'
import DatingFeature from '@/components/DatingFeature'
import { getServerSession } from "next-auth/next"
import LoginButton from '@/components/LoginButton'

export default async function Home() {
  const session = await getServerSession()

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoginButton />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-4">
        <Feed />
      </main>
      <DatingFeature />
    </div>
  )
}

