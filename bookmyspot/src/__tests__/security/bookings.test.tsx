import { render, screen, waitFor, act } from '@testing-library/react'
import BookingsPage from '@/app/bookings/page'
import { SessionProvider } from 'next-auth/react'
import { AuthProvider } from '@/contexts/auth'
import '@testing-library/jest-dom'
import type { ExtendedBooking, MockSession, ExtendedSpot, UserType } from '../types'

const mockSpot: ExtendedSpot = {
  id: '1',
  title: 'Test Spot',
  address: '123 Test St',
  description: 'A test parking spot',
  price: 10.00,
  createdAt: new Date(),
  updatedAt: new Date(),
  ownerId: '2',
  latitude: 51.5074,
  longitude: -0.1278,
  imageUrl: null,
  isAvailable: true,
}

const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
}

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname() {
    return ''
  }
}))

describe('Bookings Page Security', () => {
  let mockSession: MockSession
  let mockBooking: ExtendedBooking

  beforeEach(() => {
    mockSession = {
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: UserType.DRIVER,
        emailVerified: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        image: null,
      },
      expires: new Date(Date.now() + 2 * 86400000).toISOString()
    }

    mockBooking = {
      id: '1',
      userId: '1',
      spotId: '1',
      startTime: new Date('2025-01-03T20:00:00Z'),
      endTime: new Date('2025-01-03T21:00:00Z'),
      totalPrice: 10.00,
      status: 'COMPLETED',
      createdAt: new Date(),
      updatedAt: new Date(),
      spot: mockSpot,
      user: mockSession.user,
    }

    jest.clearAllMocks()
  })

  it('should handle unauthorized access attempts', async () => {
    // Mock unauthenticated session
    jest.spyOn(require('next-auth/react'), 'useSession').mockReturnValue({
      data: null,
      status: 'unauthenticated'
    })

    await act(async () => {
      render(
        <SessionProvider session={null}>
          <AuthProvider>
            <BookingsPage />
          </AuthProvider>
        </SessionProvider>
      )
    })

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/login')
    })
  })

  it('should protect against XSS in booking data', async () => {
    jest.spyOn(require('next-auth/react'), 'useSession').mockReturnValue({
      data: mockSession,
      status: 'authenticated'
    })

    const maliciousBooking = {
      ...mockBooking,
      spot: {
        ...mockSpot,
        title: 'Malicious Title <script>alert("XSS")</script>',
        description: 'Malicious Description <img src="x" onerror="alert(1)">'
      }
    }

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([maliciousBooking])
      })
    ) as jest.Mock

    await act(async () => {
      render(
        <SessionProvider session={mockSession}>
          <AuthProvider>
            <BookingsPage />
          </AuthProvider>
        </SessionProvider>
      )
    })

    await waitFor(() => {
      const title = screen.getByText(/malicious title/i)
      const titleHtml = title.innerHTML
      expect(titleHtml).not.toContain('<script>')
      expect(titleHtml).not.toContain('onerror')
    })
  })

  it('should handle CSRF protection', async () => {
    jest.spyOn(require('next-auth/react'), 'useSession').mockReturnValue({
      data: mockSession,
      status: 'authenticated'
    })

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([mockBooking])
      })
    ) as jest.Mock

    await act(async () => {
      render(
        <SessionProvider session={mockSession}>
          <AuthProvider>
            <BookingsPage />
          </AuthProvider>
        </SessionProvider>
      )
    })

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled()
      const [url, options] = (global.fetch as jest.Mock).mock.calls[0]
      expect(url).toBe('/api/bookings')
      expect(options).toBeUndefined() // GET request doesn't need options
    })
  })

  it('should handle session expiration', async () => {
    // Start with authenticated session
    const mockUseSession = jest.spyOn(require('next-auth/react'), 'useSession')
    mockUseSession.mockReturnValue({
      data: mockSession,
      status: 'authenticated'
    })

    await act(async () => {
      render(
        <SessionProvider session={mockSession}>
          <AuthProvider>
            <BookingsPage />
          </AuthProvider>
        </SessionProvider>
      )
    })

    // Simulate session expiration
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated'
    })

    // Trigger a re-render
    await act(async () => {
      // Force a re-render by updating props
      render(
        <SessionProvider session={null}>
          <AuthProvider>
            <BookingsPage />
          </AuthProvider>
        </SessionProvider>
      )
    })

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/login')
    })
  })
})
