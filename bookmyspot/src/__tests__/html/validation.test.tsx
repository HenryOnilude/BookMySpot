import { render, waitFor, act } from '@testing-library/react'
import BookingsPage from '@/app/bookings/page'
import { SessionProvider } from 'next-auth/react'
import { AuthProvider } from '@/contexts/auth'
import { JSDOM } from 'jsdom'
import '@testing-library/jest-dom'

// Mock session data
const mockSession = {
  user: {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    role: 'DRIVER',
    emailVerified: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    image: null,
  },
  expires: new Date(Date.now() + 2 * 86400000).toISOString()
}

// Mock router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname() {
    return ''
  }
}))

// Mock next-auth
jest.mock('next-auth/react', () => ({
  ...jest.requireActual('next-auth/react'),
  useSession: () => ({ data: mockSession, status: 'authenticated', update: jest.fn() })
}))

describe('HTML Validation Tests', () => {
  const mockBooking = {
    id: '1',
    userId: '1',
    spotId: '1',
    startTime: new Date('2025-01-03T20:00:00Z'),
    endTime: new Date('2025-01-03T21:00:00Z'),
    totalPrice: 10.00,
    status: 'COMPLETED',
    createdAt: new Date(),
    updatedAt: new Date(),
    spot: {
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
    },
    user: mockSession.user,
  }

  beforeEach(() => {
    // Mock fetch for any data loading
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([mockBooking])
      })
    ) as jest.Mock
  })

  const validateHTML = (html: string) => {
    const dom = new JSDOM(html)
    const { document } = dom.window
    const errors: string[] = []

    // Check for proper document structure
    if (!document.querySelector('main')) {
      errors.push('Missing <main> element')
    }
    if (!document.querySelector('header')) {
      errors.push('Missing <header> element')
    }

    // Check heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    const headingLevels = Array.from(headings).map(h => parseInt(h.tagName[1]))
    if (headingLevels[0] !== 1) {
      errors.push('First heading is not h1')
    }
    if (headingLevels.some((level, i) => i > 0 && level > headingLevels[i - 1] + 1)) {
      errors.push('Invalid heading hierarchy')
    }

    // Check list structure
    const lists = document.querySelectorAll('ul, ol')
    lists.forEach(list => {
      const invalidChildren = Array.from(list.children).filter(child => child.tagName.toLowerCase() !== 'li')
      if (invalidChildren.length > 0) {
        errors.push(`List contains non-li elements: ${invalidChildren.map(c => c.tagName).join(', ')}`)
      }
    })

    // Check button attributes
    const buttons = document.querySelectorAll('button')
    buttons.forEach(button => {
      if (!button.getAttribute('type')) {
        errors.push('Button missing type attribute')
      }
    })

    // Check form structure
    const forms = document.querySelectorAll('form')
    forms.forEach(form => {
      const inputs = form.querySelectorAll('input')
      inputs.forEach(input => {
        if (!input.getAttribute('type')) {
          errors.push('Input missing type attribute')
        }
        if (input.type !== 'submit' && input.type !== 'hidden' && !input.getAttribute('id')) {
          errors.push('Input missing id attribute')
        }
        if (input.type !== 'submit' && input.type !== 'hidden' && !form.querySelector(`label[for="${input.id}"]`)) {
          errors.push(`Input ${input.id || 'unknown'} missing associated label`)
        }
      })
    })

    // Check for invalid nesting
    const divInParagraphs = document.querySelectorAll('p div')
    if (divInParagraphs.length > 0) {
      errors.push('Invalid nesting: <div> inside <p>')
    }

    // Check for proper ARIA usage
    const ariaElements = document.querySelectorAll('[role]')
    ariaElements.forEach(el => {
      const role = el.getAttribute('role')
      if (role === 'button' && !el.getAttribute('tabindex')) {
        errors.push('Interactive element with role="button" missing tabindex')
      }
    })

    return errors
  }

  it('should have valid HTML structure', async () => {
    let container: HTMLElement
    await act(async () => {
      const result = render(
        <SessionProvider session={mockSession}>
          <AuthProvider>
            <BookingsPage />
          </AuthProvider>
        </SessionProvider>
      )
      container = result.container
    })

    await waitFor(() => {
      const errors = validateHTML(container.innerHTML)
      expect(errors).toEqual([]) // Should have no validation errors
    })
  })

  it('should have proper document landmarks', async () => {
    let container: HTMLElement
    await act(async () => {
      const result = render(
        <SessionProvider session={mockSession}>
          <AuthProvider>
            <BookingsPage />
          </AuthProvider>
        </SessionProvider>
      )
      container = result.container
    })

    await waitFor(() => {
      // Check for proper document structure
      expect(container.querySelector('main')).toBeInTheDocument()
      expect(container.querySelector('header')).toBeInTheDocument()

      // Check for proper heading hierarchy
      const h1 = container.querySelector('h1')
      expect(h1).toBeInTheDocument()
      expect(h1).toHaveTextContent('My Bookings')

      // Check for proper list structure
      const bookingsList = container.querySelector('.space-y-6')
      expect(bookingsList).toBeInTheDocument()

      // Check for proper button structure
      const buttons = container.querySelectorAll('button')
      buttons.forEach(button => {
        expect(button).toHaveAttribute('type')
      })
    })
  })

  it('should handle error states with valid HTML', async () => {
    // Mock an error state
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      })
    ) as jest.Mock

    let container: HTMLElement
    await act(async () => {
      const result = render(
        <SessionProvider session={mockSession}>
          <AuthProvider>
            <BookingsPage />
          </AuthProvider>
        </SessionProvider>
      )
      container = result.container
    })

    await waitFor(() => {
      const errors = validateHTML(container.innerHTML)
      expect(errors).toEqual([]) // Should have no validation errors even in error state
    })
  })
})
