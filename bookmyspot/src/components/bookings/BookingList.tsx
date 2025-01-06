// src/components/bookings/BookingList.tsx
'use client';

import { useState, useEffect } from 'react';
import { Booking, Spot, User } from '@prisma/client';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, MapPin, AlertCircle as AlertIcon } from 'lucide-react';
import Link from 'next/link';
import { ExtendedBooking } from '@/types';

interface BookingListProps {
  bookings: ExtendedBooking[];
  isLoading?: boolean;
  onCancelBooking?: (bookingId: string) => void;
}

export default function BookingList({ bookings, isLoading = false, onCancelBooking }: BookingListProps) {
  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('en-UK', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const getBookingStatus = (booking: ExtendedBooking) => {
    const now = new Date();
    const startTime = new Date(booking.startTime);
    const endTime = new Date(booking.endTime);

    if (booking.status === 'CANCELLED') return 'CANCELLED';
    if (now < startTime) return 'UPCOMING';
    if (now >= startTime && now <= endTime) return 'ACTIVE';
    if (now > endTime) return 'COMPLETED';
    return booking.status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'UPCOMING':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 animate-pulse shadow-sm">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (!bookings.length) {
    return (
      <Card className="p-8 text-center shadow-sm">
        <AlertIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by booking a parking spot.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {bookings.map((booking) => {
        const status = getBookingStatus(booking);
        const statusColor = getStatusColor(status);

        return (
          <Card key={booking.id} className="p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex flex-wrap justify-between items-start gap-6">
              <div className="space-y-3 flex-grow">
                <Link 
                  href={`/bookings/${booking.id}`}
                  className="text-lg font-semibold hover:text-blue-600 block"
                >
                  {booking.spot.title}
                </Link>
                
                <div className="flex items-center text-gray-600 text-sm">
                  <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{booking.spot.address}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{formatDateTime(booking.startTime)} - {formatDateTime(booking.endTime)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>£{booking.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                  {status}
                </span>

                {status === 'UPCOMING' && onCancelBooking && (
                  <button
                    onClick={() => onCancelBooking(booking.id)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}