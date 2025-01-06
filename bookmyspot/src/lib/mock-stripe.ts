// Mock Stripe implementation for testing/demo purposes
export const mockStripe = {
  // Mock publishable key - this is just for show, not a real key
  publishableKey: 'pk_test_mock_key',

  redirectToCheckout: async ({ sessionId }: { sessionId: string }) => {
    console.log('Mock Stripe: Processing payment with session', sessionId);
    
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Always redirect to success page in demo mode
    window.location.href = `/bookings/success?session_id=${sessionId}`;
    return { error: null };
  },

  // Mock Stripe Elements UI (just for show)
  elements: {
    create: () => ({
      mount: () => console.log('Mock Stripe: Mounted payment element'),
      on: () => console.log('Mock Stripe: Added event listener'),
      unmount: () => console.log('Mock Stripe: Unmounted payment element'),
    }),
  },
};
