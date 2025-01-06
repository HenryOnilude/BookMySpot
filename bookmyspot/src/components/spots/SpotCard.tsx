// src/components/spots/SpotCard.tsx
'use client';

import { useState, useEffect } from 'react';
import { Spot } from '@prisma/client';
import { Card } from '@/components/ui/card';
import { MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BookingDialog from './BookingDialog';

interface SpotCardProps {
  spot: Spot;
  startTime: Date;
  endTime: Date;
}

export default function SpotCard({ spot, startTime, endTime }: SpotCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageNumber] = useState(() => Math.floor(Math.random() * 20) + 3); // Random number between 3 and 22

  // Calculate total price
  const calculateTotalPrice = () => {
    const hours = Math.ceil((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60));
    return hours * spot.pricePerHour;
  };

  return (
    <div>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative">
          {/* Parking spot image */}
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={`/images/carparkpayement${imageNumber}.jpg`}
              alt={spot.title}
              className="object-cover w-full h-48"
            />
          </div>
        </div>
        
        <div className="p-4 space-y-2">
          <h3 className="text-lg font-semibold">{spot.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{spot.description}</p>
          
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{spot.address}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            <span>24/7 Access</span>
          </div>

          <div className="flex justify-between items-center pt-2">
            <div className="text-lg font-bold text-green-600">
              £{spot.pricePerHour}/hr
            </div>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Book Now
            </Button>
          </div>
        </div>
      </Card>

      <BookingDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        spotId={spot.id}
        startTime={startTime}
        endTime={endTime}
        totalPrice={calculateTotalPrice()}
      />
    </div>
  );
}