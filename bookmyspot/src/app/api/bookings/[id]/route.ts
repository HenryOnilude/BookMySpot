// src/app/api/bookings/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = req.nextUrl.pathname.split('/').pop();
    if (!id) {
      return NextResponse.json({ error: 'Invalid booking ID' }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        spot: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Check if user has permission to view this booking
    const hasPermission = 
      session.user.type === 'ADMIN' ||
      booking.userId === session.user.id ||
      booking.spot.ownerId === session.user.id;

    if (!hasPermission) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = req.nextUrl.pathname.split('/').pop();
    if (!id) {
      return NextResponse.json({ error: 'Invalid booking ID' }, { status: 400 });
    }

    const data = await req.json();
    const { status } = data;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        spot: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Check if user has permission to update this booking
    const hasPermission = 
      session.user.type === 'ADMIN' ||
      booking.userId === session.user.id ||
      booking.spot.ownerId === session.user.id;

    if (!hasPermission) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Validate status transition
    if (status && !validateStatusTransition(booking.status, status, session.user.type)) {
      return NextResponse.json(
        { error: 'Invalid status transition' },
        { status: 400 }
      );
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        spot: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = req.nextUrl.pathname.split('/').pop();
    if (!id) {
      return NextResponse.json({ error: 'Invalid booking ID' }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        spot: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Check if user has permission to delete this booking
    const hasPermission = 
      session.user.type === 'ADMIN' ||
      booking.userId === session.user.id ||
      booking.spot.ownerId === session.user.id;

    if (!hasPermission) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.booking.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to validate booking status transitions
function validateStatusTransition(
  currentStatus: string,
  newStatus: string,
  userType: string
): boolean {
  const validTransitions: Record<string, string[]> = {
    PENDING: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['COMPLETED', 'CANCELLED'],
    COMPLETED: [],
    CANCELLED: [],
  };

  return validTransitions[currentStatus]?.includes(newStatus) ?? false;
}