// src/lib/payment-client.ts
import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe('pk_test_51QQJyRBGcf7FLZCyx9cfQMCNvmKNvhBqGw7E9F08HDpB57mnWvwRBnhLiTrErKZeFmNIRoJrABy6yjXbMKDLMoFP00OwkexLil');
  }
  return stripePromise;
};

export const createPaymentIntent = async (bookingId: string) => {
  const response = await fetch('/api/payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ bookingId }),
  });

  if (!response.ok) {
    throw new Error('Failed to create payment intent');
  }

  const data = await response.json();
  return data.clientSecret;
};