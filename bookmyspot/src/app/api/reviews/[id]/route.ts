// src/app/api/reviews/[id]/route.ts
// This file handles CRUD operations for individual reviews
// Includes authorization checks and data validation

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

interface RouteParams {
  params: {
    id: string;
  };
}

// Get a specific review with related spot and user data
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const review = await prisma.review.findUnique({
      where: { id: params.id },
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

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(review);
  } catch (error) {
    console.error('Error fetching review:', error);
    return NextResponse.json(
      { error: 'Failed to fetch review' },
      { status: 500 }
    );
  }
}

// Update an existing review
export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const review = await prisma.review.findUnique({
      where: { id: params.id },
    });

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Only allow the review author or admin to update
    if (review.userId !== session.user.id && session.user.type !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Not authorized to update this review' },
        { status: 403 }
      );
    }

    const data = await req.json();
    const { rating, comment } = data;

    // Validate rating
    if (rating && (rating < 0 || rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 0 and 5' },
        { status: 400 }
      );
    }

    const updatedReview = await prisma.review.update({
      where: { id: params.id },
      data: {
        rating,
        comment,
      },
      include: {
        spot: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(updatedReview);
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    );
  }
}

// Delete a review
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const review = await prisma.review.findUnique({
      where: { id: params.id },
    });

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Only allow the review author or admin to delete
    if (review.userId !== session.user.id && session.user.type !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Not authorized to delete this review' },
        { status: 403 }
      );
    }

    await prisma.review.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}