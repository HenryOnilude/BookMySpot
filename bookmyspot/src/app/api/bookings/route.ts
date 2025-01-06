// src/app/api/bookings/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const spotId = searchParams.get('spotId');

    let query: any = {
      where: {},
      include: {
        spot: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    };

    // Filter by user role
    if (session.user.type === 'DRIVER') {
      query.where.userId = session.user.id;
    } else if (session.user.type === 'OWNER') {
      query.where.spot = {
        ownerId: session.user.id,
      };
    }

    // Add status filter if provided
    if (status) {
      query.where.status = status;
    }

    // Add spot filter if provided
    if (spotId) {
      query.where.spotId = spotId;
    }

    const bookings = await prisma.booking.findMany(query);
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.type !== 'DRIVER') {
      return NextResponse.json(
        { error: 'Only drivers can create bookings' },
        { status: 403 }
      );
    }

    const data = await req.json();
    const { spotId, startTime, endTime, totalPrice } = data;

    // Validate required fields
    if (!spotId || !startTime || !endTime || !totalPrice) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if spot exists and is active
    const spot = await prisma.spot.findUnique({
      where: { id: spotId, isActive: true },
    });

    if (!spot) {
      return NextResponse.json(
        { error: 'Parking spot not found or inactive' },
        { status: 404 }
      );
    }

    // Check for overlapping bookings
    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        spotId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        OR: [
          {
            AND: [
              { startTime: { lte: new Date(startTime) } },
              { endTime: { gt: new Date(startTime) } },
            ],
          },
          {
            AND: [
              { startTime: { lt: new Date(endTime) } },
              { endTime: { gte: new Date(endTime) } },
            ],
          },
        ],
      },
    });

    if (overlappingBooking) {
      return NextResponse.json(
        { error: 'Spot is already booked for this time period' },
        { status: 409 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        spotId,
        userId: session.user.id,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        totalPrice,
        status: 'PENDING',
      },
      include: {
        spot: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}