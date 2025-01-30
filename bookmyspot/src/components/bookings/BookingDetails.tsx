// src/components/bookings/BookingDetails.tsx
'use client';

import { Booking, Spot, User } from '@prisma/client';
import { Card } from '@/components/ui/card';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CreditCard, 
  User as UserIcon,
  Phone,
  Mail,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import ChatBox from '../chat/ChatBox';

// Extended Booking type that includes related Spot and User data
interface ExtendedBooking extends Booking {
  spot: Spot;
  user: User;
}

interface BookingDetailsProps {
  booking: ExtendedBooking;
  onCancelBooking?: (bookingId: string) => void;
}

export default function BookingDetails({ booking, onCancelBooking }: BookingDetailsProps) {
  // Helper function to format dates consistently throughout the component
  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  // Calculate the current status of the booking based on time and existing status
  const getBookingStatus = () => {
    const now = new Date();
    const startTime = new Date(booking.startTime);
    const endTime = new Date(booking.endTime);

    if (booking.status === 'CANCELLED') return 'CANCELLED';
    if (now < startTime) return 'UPCOMING';
    if (now >= startTime && now <= endTime) return 'ACTIVE';
    if (now > endTime) return 'COMPLETED';
    return booking.status;
  };

  // Get appropriate color classes for the status badge
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

  // Calculate duration of booking in hours and minutes
  const calculateDuration = () => {
    const start = new Date(booking.startTime);
    const end = new Date(booking.endTime);
    const durationMs = end.getTime() - start.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const status = getBookingStatus();
  const statusColor = getStatusColor(status);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Main Booking Information Card */}
      <Card className="p-6 mb-6">
        <div className="border-b pb-4 mb-4">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold">Booking Details</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
              {status}
            </span>
          </div>
          <p className="text-gray-500">Booking ID: {booking.id}</p>
        </div>

        {/* Time and Duration Section */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <Calendar className="h-5 w-5 mt-1 mr-2 text-gray-500" />
              <div>
                <p className="font-medium">Start Time</p>
                <p className="text-gray-600">{formatDateTime(booking.startTime)}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Calendar className="h-5 w-5 mt-1 mr-2 text-gray-500" />
              <div>
                <p className="font-medium">End Time</p>
                <p className="text-gray-600">{formatDateTime(booking.endTime)}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-gray-500" />
            <p>Duration: {calculateDuration()}</p>
          </div>
        </div>

        {/* Parking Spot Details */}
        <div className="mt-6 border-t pt-4">
          <h2 className="text-lg font-semibold mb-4">Parking Spot Details</h2>
          <div className="space-y-3">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 mt-1 mr-2 text-gray-500" />
              <div>
                <p className="font-medium">{booking.spot.title}</p>
                <p className="text-gray-600">{booking.spot.address}</p>
              </div>
            </div>
            {booking.spot.amenities && booking.spot.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {booking.spot.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Payment Information */}
        <div className="mt-6 border-t pt-4">
          <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Amount</span>
              <span className="text-xl font-bold">${booking.totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <CreditCard className="h-4 w-4 mr-1" />
              <span>Payment Status: Completed</span>
            </div>
          </div>
        </div>

        {/* Cancellation Option */}
        {status === 'UPCOMING' && onCancelBooking && (
          <div className="mt-6 border-t pt-4">
            <button
              onClick={() => onCancelBooking(booking.id)}
              className="flex items-center justify-center w-full px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50"
            >
              <AlertTriangle className="h-5 w-5 mr-2" />
              Cancel Booking
            </button>
            <p className="mt-2 text-sm text-gray-500 text-center">
              Free cancellation until 24 hours before start time
            </p>
          </div>
        )}
      </Card>

      {/* Contact Information Card */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
        <div className="space-y-3">
          <div className="flex items-center">
            <UserIcon className="h-5 w-5 mr-2 text-gray-500" />
            <span>{booking.user.name}</span>
          </div>
          <div className="flex items-center">
            <Mail className="h-5 w-5 mr-2 text-gray-500" />
            <span>{booking.user.email}</span>
          </div>
        </div>
      </Card>

      <div className="mt-4">
        <ChatBox bookingId={booking.id} />
      </div>
    </div>
  );
}