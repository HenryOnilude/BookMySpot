import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe('sk_test_51OPwWzHjz2MOQDsEgMPeF3GOZsKcEKVnHhNwj4rbvNrEwRKN4nSC3RBXbfXYJVbxZFXBtO5zXcrHxWmzqzKWzWXZ00J9h5zPEJ', {
  apiVersion: '2023-10-16',
});

// Stripe webhook secret for verifying webhook events
const webhookSecret = 'whsec_f4c7c3f85e9f6d4e6d1c9b8a7f4e1d8c5b2a9f6e3d0c7b4a1e8d5f2c9b6a3';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature')!;

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Update the booking status to confirmed
      await prisma.booking.updateMany({
        where: {
          stripePaymentIntentId: session.payment_intent as string,
          status: 'PENDING'
        },
        data: {
          status: 'CONFIRMED'
        }
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}
