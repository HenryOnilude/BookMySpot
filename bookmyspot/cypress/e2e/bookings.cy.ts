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

  it('should match visual snapshot', () => {
    cy.visit('/bookings')
    cy.wait('@session')
    cy.wait('@getBookings')
    // @ts-ignore
    cy.percySnapshot('Bookings Page')
  })

  it('should be accessible', () => {
    cy.visit('/bookings')
    cy.wait('@session')
    cy.wait('@getBookings')
    cy.injectAxe()
    cy.checkA11y(undefined, {
      includedImpacts: ['critical', 'serious']
    })
  })

  it('should have semantically correct content structure', () => {
    cy.visit('/bookings')
    cy.wait('@session')
    cy.wait('@getBookings')
    
    // Verify semantic structure
    cy.get('main').should('exist')
    cy.get('h1').should('have.text', 'My Bookings')
      .and('have.css', 'font-size')
      .and('be.oneOf', ['24px', '1.5rem', '2rem']) // Common heading sizes
    
    // Verify booking card structure
    cy.get('[data-testid="booking-card"]').within(() => {
      cy.get('h2, h3').should('exist') // Proper heading hierarchy
      cy.get('time').should('have.attr', 'datetime') // Semantic time element
      cy.get('address').should('exist') // Semantic address element
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

  // Accessibility testing with Axe
  it('should pass accessibility tests', () => {
    cy.visit('/bookings')
    cy.wait('@session')
    cy.wait('@getBookings')
    
    cy.injectAxe()
    cy.checkA11y(undefined, {
      includedImpacts: ['critical', 'serious'],
      rules: {
        'color-contrast': { enabled: true },
        'heading-order': { enabled: true },
        'label': { enabled: true }
      }
    }, (violations) => {
      function terminalLog(violations: Array<{
        id: string;
        impact: string;
        description: string;
        nodes: Array<{ target: string[] }>;
      }>) {
        cy.task('log', `${violations.length} accessibility violation${
          violations.length === 1 ? '' : 's'
        } ${violations.length === 1 ? 'was' : 'were'} detected`)
        
        violations.forEach(violation => {
          const nodes = Cypress.$(violation.nodes.map(node => node.target.join(','))).get()
          
          cy.task('log', {
            name: violation.id,
            message: `[${violation.impact}] ${violation.description}`,
            consoleProps: () => ({
              violationId: violation.id,
              impact: violation.impact,
              description: violation.description,
              nodes: nodes
            })
          })
        })
      }
      terminalLog(violations)
    })
  })

  // Performance and best practices testing with Lighthouse
  it('should pass lighthouse audit', () => {
    cy.visit('/bookings')
    cy.wait('@session')
    cy.wait('@getBookings')
    
    cy.lighthouse({
      performance: 85,
      accessibility: 90,
      'best-practices': 85,
      seo: 85,
      pwa: 50
    }, {
      formFactor: 'desktop',
      screenEmulation: {
        mobile: false,
        disable: false,
        width: 1350,
        height: 940,
        deviceScaleFactor: 1,
      }
    })
  })

  it('should open and use chat functionality', () => {
    // Mock chat messages API
    cy.intercept('GET', '/api/chat/*', {
      statusCode: 200,
      body: [{
        id: '1',
        senderId: '1',
        senderName: 'Test User',
        content: 'Hello, I have a question about my booking.',
        timestamp: new Date().toISOString()
      }]
    }).as('getMessages')

    cy.intercept('POST', '/api/chat/*', {
      statusCode: 200,
      body: {
        id: '2',
        senderId: '1',
        senderName: 'Test User',
        content: 'Test message',
        timestamp: new Date().toISOString()
      }
    }).as('postMessage')

    cy.visit('/bookings')
    cy.wait('@session')
    cy.wait('@getBookings')

    // Open chat
    cy.get('button[aria-label="Open chat"]').click()
    cy.wait('@getMessages')

    // Verify chat UI elements
    cy.contains('Chat').should('be.visible')
    cy.get('input[aria-label="Message input"]').should('be.visible')
    cy.get('button[aria-label="Send message"]').should('be.visible')

    // Send a message
    cy.get('input[aria-label="Message input"]')
      .type('Test message')
    cy.get('button[aria-label="Send message"]').click()
    cy.wait('@postMessage')

    // Verify message appears in chat
    cy.contains('Test message').should('be.visible')

    // Close chat
    cy.get('button[aria-label="Close chat"]').click()
    cy.contains('Chat').should('not.exist')
  })

  it('should handle chat errors gracefully', () => {
    // Mock failed chat messages API
    cy.intercept('GET', '/api/chat/*', {
      statusCode: 500,
      body: { message: 'Internal Server Error' }
    }).as('getMessagesFailed')

    cy.visit('/bookings')
    cy.wait('@session')
    cy.wait('@getBookings')

    // Open chat
    cy.get('button[aria-label="Open chat"]').click()
    cy.wait('@getMessagesFailed')

    // Verify error handling
    cy.get('.chat-error-message').should('be.visible')
  })
})
