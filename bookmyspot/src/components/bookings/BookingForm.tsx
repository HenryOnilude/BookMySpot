// src/components/bookings/BookingForm.tsx
'use client';

import { useState } from 'react';
import { Booking, Spot } from '@prisma/client';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, CreditCard } from 'lucide-react';

interface BookingFormProps {
  spot: Spot;
  onSubmit: (bookingData: Partial<Booking>) => void;
  isLoading?: boolean;
}

export default function BookingForm({ spot, onSubmit, isLoading = false }: BookingFormProps) {
  const [bookingData, setBookingData] = useState({
    startTime: '',
    endTime: '',
    totalPrice: 0,
  });

  // Calculate the total price based on duration and spot rates
  const calculateTotalPrice = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const durationHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    const durationDays = durationHours / 24;

    let totalPrice = 0;
    if (durationHours < 24) {
      // Hourly rate
      totalPrice = durationHours * spot.pricePerHour;
    } else {
      // Daily rate if available, otherwise calculate using hourly rate
      const dailyRate = spot.pricePerDay ?? (spot.pricePerHour * 24);
      totalPrice = Math.floor(durationDays) * dailyRate +
        (durationHours % 24) * spot.pricePerHour;
    }

    return Math.round(totalPrice * 100) / 100; // Round to 2 decimal places
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookingData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Recalculate total price if both dates are set
      if (newData.startTime && newData.endTime) {
        newData.totalPrice = calculateTotalPrice(newData.startTime, newData.endTime);
      }
      
      return newData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...bookingData,
      spotId: spot.id,
      startTime: new Date(bookingData.startTime),
      endTime: new Date(bookingData.endTime),
    });
  };

  const now = new Date();
  const minDateTime = now.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm

  return (
    <Card className="p-6 max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Book Parking Spot</h2>
          
          {/* Spot Info Summary */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium">Rates:</h3>
            <p className="text-sm text-gray-600">
              Hourly: ${spot.pricePerHour}
              {spot.pricePerDay && ` • Daily: $${spot.pricePerDay}`}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Time */}
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                Start Time
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="datetime-local"
                  id="startTime"
                  name="startTime"
                  required
                  min={minDateTime}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={bookingData.startTime}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* End Time */}
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                End Time
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="datetime-local"
                  id="endTime"
                  name="endTime"
                  required
                  min={bookingData.startTime || minDateTime}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={bookingData.endTime}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Price Summary */}
        {bookingData.totalPrice > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900">Total Price</h3>
            <p className="text-2xl font-bold text-blue-600">
              ${bookingData.totalPrice.toFixed(2)}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !bookingData.startTime || !bookingData.endTime}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Proceed to Payment'}
          </button>
        </div>
      </form>
    </Card>
  );
}