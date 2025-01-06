import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config)
      return config
    },
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
  viewportWidth: 1280,
  viewportHeight: 720,
})
