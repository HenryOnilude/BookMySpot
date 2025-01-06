// src/app/api/spots/[id]/route.ts
// Handles CRUD operations for individual parking spots

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

interface RouteParams {
  params: {
    id: string;
  };
}

// Get details of a specific parking spot
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const spot = await prisma.spot.findUnique({
      where: { id: params.id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        bookings: {
          where: {
            endTime: {
              gte: new Date(),
            },
          },
          select: {
            startTime: true,
            endTime: true,
          },
        },
      },
    });

    if (!spot) {
      return NextResponse.json(
        { error: 'Parking spot not found' },
        { status: 404 }
      );
    }

    // Calculate average rating
    const averageRating = spot.reviews.length
      ? spot.reviews.reduce((acc, review) => acc + review.rating, 0) / spot.reviews.length
      : null;

    return NextResponse.json({
      ...spot,
      averageRating,
    });
  } catch (error) {
    console.error('Error fetching spot:', error);
    return NextResponse.json(
      { error: 'Failed to fetch parking spot' },
      { status: 500 }
    );
  }
}

// Update a parking spot
export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const spot = await prisma.spot.findUnique({
      where: { id: params.id },
      select: { ownerId: true },
    });

    if (!spot) {
      return NextResponse.json(
        { error: 'Parking spot not found' },
        { status: 404 }
      );
    }

    // Verify ownership or admin status
    if (spot.ownerId !== session.user.id && session.user.type !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Not authorized to update this spot' },
        { status: 403 }
      );
    }

    const data = await req.json();
    
    // Validate price data if provided
    if (data.pricePerHour !== undefined && data.pricePerHour <= 0) {
      return NextResponse.json(
        { error: 'Price per hour must be greater than 0' },
        { status: 400 }
      );
    }

    if (data.pricePerDay !== undefined && data.pricePerDay <= 0) {
      return NextResponse.json(
        { error: 'Price per day must be greater than 0' },
        { status: 400 }
      );
    }

    const updatedSpot = await prisma.spot.update({
      where: { id: params.id },
      data,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(updatedSpot);
  } catch (error) {
    console.error('Error updating spot:', error);
    return NextResponse.json(
      { error: 'Failed to update parking spot' },
      { status: 500 }
    );
  }
}

// Delete (deactivate) a parking spot
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const spot = await prisma.spot.findUnique({
      where: { id: params.id },
      select: { 
        ownerId: true,
        bookings: {
          where: {
            status: { in: ['PENDING', 'CONFIRMED'] },
            endTime: { gte: new Date() },
          },
        },
      },
    });

    if (!spot) {
      return NextResponse.json(
        { error: 'Parking spot not found' },
        { status: 404 }
      );
    }

    // Verify ownership or admin status
    if (spot.ownerId !== session.user.id && session.user.type !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Not authorized to delete this spot' },
        { status: 403 }
      );
    }

    // Check for active bookings
    if (spot.bookings.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete spot with active bookings' },
        { status: 400 }
      );
    }

    // Soft delete by setting isActive to false
    await prisma.spot.update({
      where: { id: params.id },
      data: { isActive: false },
    });

    return NextResponse.json({ message: 'Spot successfully deactivated' });
  } catch (error) {
    console.error('Error deleting spot:', error);
    return NextResponse.json(
      { error: 'Failed to delete parking spot' },
      { status: 500 }
    );
  }
}