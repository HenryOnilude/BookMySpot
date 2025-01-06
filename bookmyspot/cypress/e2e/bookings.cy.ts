describe('Bookings Page', () => {
  beforeEach(() => {
    // Mock the session
    cy.intercept('/api/auth/session', {
      statusCode: 200,
      body: {
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          role: 'DRIVER',
          type: 'USER',
          emailVerified: new Date().toISOString(),
        },
        expires: new Date(Date.now() + 2 * 86400000).toISOString()
      }
    }).as('session')

    // Mock the bookings API
    cy.intercept('GET', '/api/bookings', {
      statusCode: 200,
      body: [{
        id: '1',
        spot: {
          title: 'Canary Wharf Parking',
          address: 'Canada Square, London E14'
        },
        startTime: '2024-12-21T15:25:00Z',
        endTime: '2024-12-22T15:25:00Z',
        totalPrice: 360.00,
        status: 'UPCOMING'
      }]
    }).as('getBookings')
  })

  it('should load and display bookings', () => {
    cy.visit('/bookings')
    cy.wait('@session')
    cy.wait('@getBookings')
    
    cy.get('h1').should('contain', 'My Bookings')
    cy.contains('Canary Wharf Parking').should('be.visible')
    cy.contains('Canada Square, London E14').should('be.visible')
  })

  it('should handle booking cancellation', () => {
    cy.intercept('DELETE', '/api/bookings/*', {
      statusCode: 200,
      body: { message: 'Booking cancelled successfully' }
    }).as('cancelBooking')

    cy.visit('/bookings')
    cy.wait('@session')
    cy.wait('@getBookings')

    cy.contains('button', 'Cancel').click()
    cy.wait('@cancelBooking')
    cy.contains('Booking cancelled successfully').should('be.visible')
  })

  it('should be accessible', () => {
    cy.visit('/bookings')
    cy.wait('@session')
    cy.wait('@getBookings')
    cy.injectAxe()
    cy.checkA11y(null, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa']
      }
    })
  })

  it('should perform well', () => {
    cy.visit('/bookings')
    cy.wait('@session')
    cy.wait('@getBookings')
    
    cy.lighthouse({
      performance: 90,
      accessibility: 90,
      'best-practices': 90,
      seo: 90,
    }, {
      formFactor: 'desktop',
      screenEmulation: { disabled: true }
    })
  })

  it('should handle errors gracefully', () => {
    // Mock API error
    cy.intercept('GET', '/api/bookings', {
      statusCode: 500,
      body: { message: 'Internal Server Error' }
    }).as('getBookingsError')

    cy.visit('/bookings')
    cy.wait('@session')
    cy.wait('@getBookingsError')
    
    cy.contains('Error loading bookings').should('be.visible')
    cy.contains('Please try again later').should('be.visible')
  })

  it('should handle unauthorized access', () => {
    // Mock unauthenticated session
    cy.intercept('/api/auth/session', {
      statusCode: 200,
      body: null
    }).as('unauthenticatedSession')

    cy.visit('/bookings')
    cy.wait('@unauthenticatedSession')
    
    cy.contains('Please sign in to view your bookings').should('be.visible')
    cy.get('a').contains('Sign In').should('be.visible')
  })
})
