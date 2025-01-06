import '@testing-library/jest-dom';
import 'whatwg-fetch';
import 'jest-axe/extend-expect';
import { configure } from '@testing-library/react';

// Configure testing-library
configure({ testIdAttribute: 'data-testid' });

// Add TextEncoder and TextDecoder to global scope
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util')
  global.TextEncoder = TextEncoder
  global.TextDecoder = TextDecoder
}

// Mock fetch globally
global.fetch = jest.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([])
  })
);

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  takeRecords = () => [];
}

global.IntersectionObserver = MockIntersectionObserver;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }))
});

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
  },
  usePathname() {
    return '';
  },
}));

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession() {
    return {
      data: {
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          role: 'DRIVER',
        },
        expires: new Date(Date.now() + 2 * 86400000).toISOString()
      },
      status: 'authenticated'
    }
  }
}))
