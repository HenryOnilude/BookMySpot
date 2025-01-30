import 'cypress-axe'
import '@cypress-audit/lighthouse/commands'

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to run Lighthouse audit
       * @example cy.lighthouse()
       */
      lighthouse: (
        thresholds?: {
          performance?: number
          accessibility?: number
          'best-practices'?: number
          seo?: number
          pwa?: number
        },
        opts?: any
      ) => void
    }
  }
}
