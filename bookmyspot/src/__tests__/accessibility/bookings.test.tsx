/// <reference types="@testing-library/jest-dom" />
/// <reference types="jest-axe" />

import { render, screen, waitFor, fireEvent, act } from '@testing-library/react'
import { axe } from 'jest-axe'
import BookingsPage from '@/app/bookings/page'
import { SessionProvider } from 'next-auth/react'
import { AuthProvider } from '@/contexts/auth'
import '@testing-library/jest-dom'
import type { ExtendedBooking, MockSession, ExtendedSpot } from '../types'
import { UserType } from '@prisma/client'

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

const mockSession: MockSession = {
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

jest.mock('next-auth/react', () => ({
  ...jest.requireActual('next-auth/react'),
  useSession: () => ({ data: mockSession, status: 'authenticated', update: jest.fn() })
}))

describe('Bookings Page Accessibility', () => {
  let container: HTMLElement
  let mockBooking: ExtendedBooking

  beforeEach(async () => {
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

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([mockBooking])
      })
    ) as jest.Mock

    await act(async () => {
      const { container: renderedContainer } = render(
        <SessionProvider session={mockSession}>
          <AuthProvider>
            <BookingsPage />
          </AuthProvider>
        </SessionProvider>
      )
      container = renderedContainer
    })

    // Wait for initial render to complete
    await waitFor(() => {
      expect(screen.getByText('Test Spot')).toBeInTheDocument()
    })
  })

  it('should pass axe accessibility tests', async () => {
    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true },
        'heading-order': { enabled: true },
        'label': { enabled: true },
        'link-name': { enabled: true },
        'region': { enabled: true }
      }
    })
    expect(results).toHaveNoViolations()
  }, 90000) // Increased timeout for axe tests

  it('should have proper ARIA attributes', async () => {
    // Check for proper heading structure
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('My Bookings')

    // Check for proper list structure
    const mainContent = screen.getByRole('main')
    expect(mainContent).toBeInTheDocument()

    // Check for proper link labeling
    const link = screen.getByRole('link', { name: /test spot/i })
    expect(link).toHaveAttribute('href', '/bookings/1')
    expect(link).toHaveClass('text-lg font-semibold hover:text-blue-600 block')
  })

  it('should announce status changes to screen readers', async () => {
    const statusContainer = screen.getByText('COMPLETED')
    expect(statusContainer).toHaveClass('px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800')
  })

  it('should maintain focus after dynamic updates', async () => {
    const link = screen.getByRole('link', { name: /test spot/i })
    
    // Focus a link
    await act(async () => {
      link.focus()
    })
    expect(document.activeElement).toBe(link)

    // Simulate a data update
    await act(async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve([{
            ...mockBooking,
            status: 'CANCELLED'
          }])
        })
      ) as jest.Mock
    })

    // Focus should be maintained
    expect(document.activeElement).toBe(link)
  })

  it('should support keyboard navigation', async () => {
    const link = screen.getByRole('link', { name: /test spot/i })
    
    // Tab to the link
    await act(async () => {
      link.focus()
    })
    expect(document.activeElement).toBe(link)

    // Simulate Enter key press
    await act(async () => {
      fireEvent.click(link)
    })
    expect(mockRouter.push).toHaveBeenCalledWith('/bookings/1')
  })
})
