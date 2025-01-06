'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { RequireAuth } from '@/components/auth/RequireAuth';
import BookingList from '@/components/bookings/BookingList';
import { Booking, Spot, User } from '@prisma/client';

// Extended booking type including related data
interface ExtendedBooking extends Booking {
  spot: Spot;
  user: User;
}

export default function BookingsPage() {
  // State for bookings and loading status
  const [bookings, setBookings] = useState<ExtendedBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Fetch bookings on component mount
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/bookings');
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Handle booking cancellation
  const handleCancelBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Update bookings list after successful cancellation
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking.id === bookingId 
              ? { ...booking, status: 'CANCELLED' }
              : booking
          )
        );
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  return (
    <RequireAuth>
      <div className="container mx-auto px-4 py-24 min-h-screen mb-20">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.type === 'OWNER' ? 'Parking Spot Bookings' : 'My Bookings'}
          </h1>
          <p className="text-gray-600 mt-2">
            {user?.type === 'OWNER' 
              ? 'Manage bookings for your parking spots'
              : 'View and manage your parking spot bookings'}
          </p>
        </header>

        <main className="mb-16">
          {isLoading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="rounded-lg border bg-white text-gray-950 p-8 text-center shadow-sm">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" x2="12" y1="8" y2="12" />
                <line x1="12" x2="12.01" y1="16" y2="16" />
              </svg>
              <h2 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h2>
              <p className="mt-1 text-sm text-gray-500">Get started by booking a parking spot.</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="rounded-lg border bg-white text-gray-950 p-8 text-center shadow-sm">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" x2="12" y1="8" y2="12" />
                <line x1="12" x2="12.01" y1="16" y2="16" />
              </svg>
              <h2 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h2>
              <p className="mt-1 text-sm text-gray-500">Get started by booking a parking spot.</p>
            </div>
          ) : (
            <BookingList 
              bookings={bookings}
              isLoading={isLoading}
              onCancelBooking={handleCancelBooking}
            />
          )}
        </main>
      </div>
    </RequireAuth>
  );
}