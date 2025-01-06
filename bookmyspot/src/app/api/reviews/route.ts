// src/app/api/reviews/route.ts
// This file handles listing and creating reviews for parking spots

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Get reviews with optional filtering
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const spotId = searchParams.get('spotId');
    const userId = searchParams.get('userId');

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
      orderBy: {
        createdAt: 'desc',
      },
    };

    // Add filters if provided
    if (spotId) query.where.spotId = spotId;
    if (userId) query.where.userId = userId;

    const reviews = await prisma.review.findMany(query);
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// Create a new review
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { spotId, rating, comment } = data;

    // Validate required fields
    if (!spotId || rating === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate rating range
    if (rating < 0 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 0 and 5' },
        { status: 400 }
      );
    }

    // Check if spot exists
    const spot = await prisma.spot.findUnique({
      where: { id: spotId },
    });

    if (!spot) {
      return NextResponse.json(
        { error: 'Parking spot not found' },
        { status: 404 }
      );
    }

    // Check if user has booked this spot
    const hasBooking = await prisma.booking.findFirst({
      where: {
        spotId,
        userId: session.user.id,
        status: 'COMPLETED',
      },
    });

    if (!hasBooking) {
      return NextResponse.json(
        { error: 'Can only review spots you have booked' },
        { status: 403 }
      );
    }

    // Check if user has already reviewed this spot
    const existingReview = await prisma.review.findFirst({
      where: {
        spotId,
        userId: session.user.id,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this spot' },
        { status: 409 }
      );
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        spotId,
        userId: session.user.id,
        rating,
        comment,
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

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}