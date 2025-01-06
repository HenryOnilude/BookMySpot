// src/components/spots/SpotDetails.tsx
'use client';

import { useState } from 'react';
import { Spot } from '@prisma/client';
import { Card } from '@/components/ui/card';
import { MapPin, Clock, DollarSign, Calendar, Star, Shield } from 'lucide-react';

interface SpotDetailsProps {
  spot: Spot;
  onBook?: (startTime: Date, endTime: Date) => void;
}

export default function SpotDetails({ spot, onBook }: SpotDetailsProps) {
  const [startTime, setStartTime] = useState<Date>();
  const [endTime, setEndTime] = useState<Date>();

  const handleBooking = () => {
    if (startTime && endTime && onBook) {
      onBook(startTime, endTime);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="overflow-hidden">
        {/* Image Gallery */}
        <div className="relative h-96 bg-gray-200">
          {spot.images && spot.images.length > 0 ? (
            <img
              src={spot.images[0]}
              alt={spot.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <MapPin className="w-16 h-16 text-gray-400" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{spot.title}</h1>
            <div className="flex items-center text-gray-500">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{spot.address}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold mb-2">About this spot</h2>
            <p className="text-gray-600">{spot.description}</p>
          </div>

          {/* Pricing */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Pricing</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                <div>
                  <p className="font-medium">${spot.pricePerHour}/hour</p>
                  <p className="text-sm text-gray-500">Hourly rate</p>
                </div>
              </div>
              {spot.pricePerDay && (
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                  <div>
                    <p className="font-medium">${spot.pricePerDay}/day</p>
                    <p className="text-sm text-gray-500">Daily rate</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Amenities */}
          {spot.amenities && spot.amenities.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Amenities</h2>
              <div className="grid grid-cols-2 gap-4">
                {spot.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-blue-600" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Booking Section */}
          {onBook && (
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold mb-4">Book this spot</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e) => setStartTime(new Date(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e) => setEndTime(new Date(e.target.value))}
                  />
                </div>
              </div>
              <button
                onClick={handleBooking}
                disabled={!startTime || !endTime}
                className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Book Now
              </button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}