import { prisma } from '@/lib/prisma';
import { Booking } from '@prisma/client';

export async function sendPaymentNotification(
  booking: Booking,
  type: 'success' | 'failure' | 'cancellation'
) {
  try {
    // Get the booking with related user and spot owner details
    const bookingWithDetails = await prisma.booking.findUnique({
      where: { id: booking.id },
      include: {
        user: true,
        spot: {
          include: {
            owner: true,
          },
        },
      },
    });

    if (!bookingWithDetails) {
      throw new Error('Booking not found');
    }

    // Create notifications for both user and owner
    await Promise.all([
      // Create notification for the user
      prisma.notification.create({
        data: {
          userId: bookingWithDetails.userId,
          title: getNotificationTitle(type),
          message: getNotificationMessage(type, bookingWithDetails),
          type: 'PAYMENT',
        },
      }),
      // Create notification for the spot owner
      prisma.notification.create({
        data: {
          userId: bookingWithDetails.spot.ownerId,
          title: getNotificationTitle(type),
          message: getNotificationMessage(type, bookingWithDetails, true),
          type: 'PAYMENT',
        },
      }),
    ]);

  } catch (error) {
    console.error('Error sending payment notification:', error);
    throw error;
  }
}

function getNotificationTitle(type: 'success' | 'failure' | 'cancellation'): string {
  switch (type) {
    case 'success':
      return 'Payment Successful';
    case 'failure':
      return 'Payment Failed';
    case 'cancellation':
      return 'Payment Cancelled';
  }
}

function getNotificationMessage(
  type: 'success' | 'failure' | 'cancellation',
  booking: any,
  isOwner: boolean = false
): string {
  const spotTitle = booking.spot.title;
  const dateStr = new Date(booking.startTime).toLocaleDateString();
  const timeStr = new Date(booking.startTime).toLocaleTimeString();
  const amount = booking.totalPrice.toFixed(2);
  
  if (isOwner) {
    switch (type) {
      case 'success':
        return `New booking confirmed for ${spotTitle}. ${booking.user.name} has booked for ${dateStr} at ${timeStr}. Amount: £${amount}`;
      case 'failure':
        return `Booking payment failed for ${spotTitle} (${dateStr} at ${timeStr}). The spot has been released.`;
      case 'cancellation':
        return `Booking cancelled for ${spotTitle} (${dateStr} at ${timeStr}). The spot has been released.`;
    }
  } else {
    switch (type) {
      case 'success':
        return `Your booking for ${spotTitle} on ${dateStr} at ${timeStr} has been confirmed. Amount paid: £${amount}`;
      case 'failure':
        return `Payment failed for your booking at ${spotTitle} (${dateStr} at ${timeStr}). Please try again.`;
      case 'cancellation':
        return `Your booking for ${spotTitle} (${dateStr} at ${timeStr}) has been cancelled.`;
    }
  }
}
