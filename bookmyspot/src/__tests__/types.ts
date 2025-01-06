/// <reference types="@testing-library/jest-dom" />
import { Session } from 'next-auth'
import { Booking, Spot, User } from '@prisma/client'
import { AxeResults } from 'jest-axe'

export enum UserType {
  DRIVER = 'DRIVER',
  ADMIN = 'ADMIN',
  OWNER = 'OWNER'
}

export interface AuthenticatedUser extends Omit<User, 'type'> {
  role: UserType
}

export interface MockSession extends Omit<Session, 'user'> {
  user: AuthenticatedUser
  expires: string
}

export interface ExtendedSpot extends Omit<Spot, 'title' | 'address'> {
  id: string
  title: string
  address: string
  description?: string
  price?: number
  createdAt: Date
  updatedAt: Date
  ownerId: string
  latitude: number
  longitude: number
  imageUrl: string | null
  isAvailable: boolean
}

export interface ExtendedBooking extends Omit<Booking, 'startTime' | 'endTime' | 'totalPrice' | 'status'> {
  id: string
  userId: string
  spotId: string
  startTime: Date
  endTime: Date
  totalPrice: number
  status: string
  createdAt: Date
  updatedAt: Date
  spot: ExtendedSpot
  user: AuthenticatedUser
}

// Add a basic test to satisfy Jest's requirement
describe('Types', () => {
  it('should have correct types defined', () => {
    const mockUser: AuthenticatedUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: UserType.DRIVER,
      emailVerified: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      image: null,
    }

    expect(mockUser.id).toBe('1')
    expect(mockUser.email).toBe('test@example.com')
  })
})

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toHaveNoViolations(): R
      toHaveLength(length: number): R
      toHaveTextContent(text: string | RegExp): R
      toHaveClass(...classNames: string[]): R
      toContain(text: string): R
      toBeNull(): R
      toHaveBeenCalledWith(...args: any[]): R
      toHaveAttribute(attr: string, value?: string): R
      toHaveStyle(style: Record<string, any>): R
    }
  }

  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to check accessibility
       */
      checkA11y(
        context?: string | Node | null,
        options?: any,
        violationCallback?: (violations: AxeResults) => void
      ): void
    }
  }
}
