import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';
import { 
  sendEmail, 
  createBookingConfirmationEmail, 
  createOwnerNotificationEmail 
} from '@/lib/email';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export async function POST(request: Request) {
  try {
    console.log('Payment request received');
    
    const session = await getServerSession(authOptions);
    console.log('Session status:', session ? 'authenticated' : 'unauthenticated');
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'You must be logged in to make a booking' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('Request body:', body);
    
    const { spotId, startTime, endTime, totalPrice } = body;

    if (!spotId || !startTime || !endTime || typeof totalPrice !== 'number') {
      console.error('Invalid request data:', { spotId, startTime, endTime, totalPrice });
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
      console.error('Parking spot not found:', spotId);
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
      console.error('Spot already booked:', existingBooking);
      return NextResponse.json(
        { error: 'This spot is already booked for the selected time period' },
        { status: 409 }
      );
    }

    // Create a Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100), // Convert to pence
      currency: 'gbp',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        spotId,
        startTime,
        endTime,
        userId: session.user.id,
      },
    });

    console.log('Payment intent created:', paymentIntent);

    // Create the booking after successful payment
    const booking = await prisma.booking.create({
      data: {
        spotId,
        userId: session.user.id,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        totalPrice,
        stripePaymentIntentId: paymentIntent.id,
        status: 'CONFIRMED',
      },
      include: {
        spot: {
          include: {
            owner: true
          }
        },
        user: true
      }
    });

    // Send confirmation email to the user
    await sendEmail(
      createBookingConfirmationEmail(
        session.user.email!,
        booking.spot.title,
        booking.startTime,
        booking.endTime,
        booking.totalPrice
      )
    );

    // Send notification email to the owner
    await sendEmail(
      createOwnerNotificationEmail(
        booking.spot.owner.email!,
        booking.spot.title,
        booking.startTime,
        booking.endTime,
        session.user.email!
      )
    );

    return NextResponse.json({ 
      success: true, 
      clientSecret: paymentIntent.client_secret 
    });
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment session' },
      { status: 500 }
    );
  }
}
