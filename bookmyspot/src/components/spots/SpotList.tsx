// src/components/spots/SpotList.tsx
'use client';

import { useState, useEffect } from 'react';
import { Spot, Review } from '@prisma/client';
import SpotCard from './SpotCard';

// Define the extended spot type
export interface SpotWithReviews extends Spot {
  reviews: Review[];
  averageRating: number | null;
}

// Define props interface
interface SpotListProps {
  spots: SpotWithReviews[];
  isLoading: boolean;
}

export default function SpotList({ spots, isLoading }: SpotListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="w-full h-48 bg-gray-200 rounded-t-lg" />
            <div className="p-4 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!spots.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No parking spots found</h3>
        <p className="mt-2 text-sm text-gray-500">
          Try adjusting your search or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {spots.map((spot) => (
        <SpotCard key={spot.id} spot={spot} />
      ))}
    </div>
  );
}