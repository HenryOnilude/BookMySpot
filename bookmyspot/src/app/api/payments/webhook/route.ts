// src/app/api/payments/webhook/route.ts

import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';
import { sendPaymentNotification } from '@/lib/payment-notifications';

// Raw body parser for webhook events
async function getRawBody(req: Request): Promise<string> {
  const reader = req.body?.getReader();
  if (!reader) throw new Error('No request body');

  const chunks: Uint8Array[] = [];
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  return Buffer.concat(chunks.map(chunk => Buffer.from(chunk))).toString('utf8');
}

export async function POST(req: Request) {
  try {
    // Get the raw request body
    const rawBody = await getRawBody(req);

    // Get the Stripe signature from headers
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('Missing stripe signature or webhook secret');
      return NextResponse.json(
        { error: 'Missing stripe signature or webhook secret' },
        { status: 400 }
      );
    }

    // Verify the webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 400 }
      );
    }

    // Handle different webhook events
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.canceled':
        await handlePaymentCancellation(event.data.object as Stripe.PaymentIntent);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Handler for successful payments
async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const bookingId = paymentIntent.metadata.bookingId;
  
  if (!bookingId) {
    console.error('No booking ID in payment intent metadata');
    return;
  }

  try {
    // Update booking status to CONFIRMED
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CONFIRMED' },
      include: {
        spot: {
          include: {
            owner: true
          }
        },
        user: true
      }
    });

    // Send notifications
    await sendPaymentNotification(updatedBooking, 'success');

    // Release any temporary holds on the parking spot
    await prisma.spot.update({
      where: { id: updatedBooking.spotId },
      data: {
        isActive: true
      }
    });

  } catch (error) {
    console.error('Error updating booking after successful payment:', error);
    throw error;
  }
}

// Handler for failed payments
async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  const bookingId = paymentIntent.metadata.bookingId;
  
  if (!bookingId) {
    console.error('No booking ID in payment intent metadata');
    return;
  }

  try {
    // Update booking status to reflect payment failure
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' },
      include: {
        spot: {
          include: {
            owner: true
          }
        },
        user: true
      }
    });

    // Send notifications
    await sendPaymentNotification(updatedBooking, 'failure');

    // Release the parking spot back to available inventory
    await prisma.spot.update({
      where: { id: updatedBooking.spotId },
      data: {
        isActive: true
      }
    });

  } catch (error) {
    console.error('Error handling payment failure:', error);
    throw error;
  }
}

// Handler for cancelled payments
async function handlePaymentCancellation(paymentIntent: Stripe.PaymentIntent) {
  const bookingId = paymentIntent.metadata.bookingId;
  
  if (!bookingId) {
    console.error('No booking ID in payment intent metadata');
    return;
  }

  try {
    // Update booking status to CANCELLED
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' },
      include: {
        spot: {
          include: {
            owner: true
          }
        },
        user: true
      }
    });

    // Send notifications
    await sendPaymentNotification(updatedBooking, 'cancellation');

    // Release the parking spot back to available inventory
    await prisma.spot.update({
      where: { id: updatedBooking.spotId },
      data: {
        isActive: true
      }
    });

  } catch (error) {
    console.error('Error handling payment cancellation:', error);
    throw error;
  }
}