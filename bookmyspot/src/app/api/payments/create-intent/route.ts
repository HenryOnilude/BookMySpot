// src/app/api/payments/create-intent/route.ts
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request data
    const { spotId, startTime, endTime, totalPrice } = await req.json();

    if (!spotId || !startTime || !endTime || typeof totalPrice !== 'number') {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if the spot exists
    const spot = await prisma.spot.findUnique({
      where: { id: spotId },
    });

    if (!spot) {
      return NextResponse.json(
        { error: 'Parking spot not found' },
        { status: 404 }
      );
    }

    // Check if spot is already booked for the given time period
    const existingBooking = await prisma.booking.findFirst({
      where: {
        spotId,
        OR: [
          {
            AND: [
              { startTime: { lte: new Date(startTime) } },
              { endTime: { gt: new Date(startTime) } }
            ]
          },
          {
            AND: [
              { startTime: { lt: new Date(endTime) } },
              { endTime: { gte: new Date(endTime) } }
            ]
          }
        ]
      }
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: 'This spot is already booked for the selected time period' },
        { status: 409 }
      );
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100), // Convert to pence
      currency: 'gbp',
      metadata: {
        spotId,
        startTime,
        endTime,
        userId: session.user.id,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Create a pending booking record
    await prisma.booking.create({
      data: {
        spotId,
        userId: session.user.id,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        totalPrice,
        status: 'PENDING',
        stripePaymentIntentId: paymentIntent.id,
      },
    });

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret 
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}