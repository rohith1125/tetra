import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import Feed from '@/components/Feed'

jest.mock('next-auth/react', () => ({
  ...jest.requireActual('next-auth/react'),
  useSession: () => ({ data: { user: { id: '1' } }, status: 'authenticated' }),
}))

describe('Feed', () => {
  it('renders the feed and allows posting a new tweet', async () => {
    render(
      <SessionProvider session={null}>
        <Feed />
      </SessionProvider>
    )

    expect(screen.getByPlaceholderText("What's happening?")).toBeInTheDocument()

    fireEvent.change(screen.getByPlaceholderText("What's happening?"), {
      target: { value: 'Test tweet' },
    })
    fireEvent.click(screen.getByText('Tweet'))

    await waitFor(() => {
      expect(screen.getByText('Test tweet')).toBeInTheDocument()
    })
  })
})

