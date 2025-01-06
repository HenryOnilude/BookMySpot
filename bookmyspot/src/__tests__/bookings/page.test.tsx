import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import BookingsPage from '@/app/bookings/page'
import { SessionProvider } from 'next-auth/react'
import { AuthProvider } from '@/contexts/auth'
import * as nextAuth from 'next-auth/react'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
    }
  }
}))

// Mock session
const mockSession = {
  user: {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    role: 'DRIVER'
  },
  expires: new Date(Date.now() + 2 * 86400000).toISOString()
}

// Mock useSession hook
jest.mock('next-auth/react', () => ({
  ...jest.requireActual('next-auth/react'),
  useSession: () => ({
    data: mockSession,
    status: 'authenticated'
  })
}))

describe('BookingsPage', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()
  })

  it('should display bookings when loaded', async () => {
    // Mock the fetch call
    global.fetch = jest.fn().mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{
          id: '1',
          spot: { 
            title: 'Canary Wharf Parking',
            address: 'Canada Square, London E14'
          },
          startTime: '2024-12-21T15:25:00Z',
          endTime: '2024-12-22T15:25:00Z',
          totalPrice: 360.00,
          status: 'COMPLETED'
        }])
      })
    )

    render(
      <SessionProvider session={mockSession}>
        <AuthProvider>
          <BookingsPage />
        </AuthProvider>
      </SessionProvider>
    )

    // Check loading state
    expect(screen.getByText('My Bookings')).toBeInTheDocument()

    // Wait for bookings to load
    await waitFor(() => {
      expect(screen.getByText('Canary Wharf Parking')).toBeInTheDocument()
      expect(screen.getByText('Canada Square, London E14')).toBeInTheDocument()
      expect(screen.getByText('COMPLETED')).toBeInTheDocument()
    })
  })

  it('should handle booking cancellation', async () => {
    // Mock the fetch calls
    global.fetch = jest.fn()
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{
          id: '1',
          spot: { 
            title: 'Canary Wharf Parking',
            address: 'Canada Square, London E14'
          },
          startTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
          endTime: new Date(Date.now() + 172800000).toISOString(),  // Day after tomorrow
          totalPrice: 360.00,
          status: 'UPCOMING'
        }])
      }))
      .mockImplementationOnce(() => Promise.resolve({ ok: true })) // Cancel booking response

    render(
      <SessionProvider session={mockSession}>
        <AuthProvider>
          <BookingsPage />
        </AuthProvider>
      </SessionProvider>
    )

    // Wait for the cancel button to appear and click it
    await waitFor(() => {
      const cancelButton = screen.getByText('Cancel')
      fireEvent.click(cancelButton)
    })

    // Verify that the cancel API was called
    expect(global.fetch).toHaveBeenCalledTimes(2)
  })
})
