'use client';

import { useState } from 'react';
import SpotSearch from '@/components/spots/SpotSearch';
import SpotCard from '@/components/spots/SpotCard';
import type { SearchParams } from '@/types/dashboard';
import type { Spot } from '@prisma/client';
import { useSession } from 'next-auth/react';

const DEFAULT_CENTER = {
  lat: 37.7749,
  lng: -122.4194,
};

export default function SpotsPage() {
  const { data: session } = useSession();
  const [searchResults, setSearchResults] = useState<Spot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchDates, setSearchDates] = useState<{
    startTime: Date;
    endTime: Date;
  }>({
    startTime: new Date(),
    endTime: new Date(Date.now() + 3600000), // Default to 1 hour from now
  });

  const handleSearch = async (params: SearchParams) => {
    setIsLoading(true);
    setError(null);

    try {
      // Update search dates from params
      if (params.dateFrom && params.dateTo) {
        setSearchDates({
          startTime: params.dateFrom,
          endTime: params.dateTo,
        });
      }

      const queryParams = new URLSearchParams({
        lat: params.coordinates?.lat.toString() || DEFAULT_CENTER.lat.toString(),
        lng: params.coordinates?.lng.toString() || DEFAULT_CENTER.lng.toString(),
        radius: '10',
      });

      console.log('Search params:', Object.fromEntries(queryParams.entries()));

      const response = await fetch(`/api/spots?${queryParams}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(session?.user?.id ? { 'Authorization': `Bearer ${session.user.id}` } : {})
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `Failed to fetch spots: ${response.statusText}`);
      }

      const spots = await response.json();
      console.log(`Found ${spots.length} spots`);
      setSearchResults(spots);
    } catch (error) {
      console.error('Search error:', error);
      setError(error instanceof Error ? error.message : 'Failed to search spots');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen mb-20">

      
      <SpotSearch onSearch={handleSearch} />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 mb-16">
          {searchResults.map((spot) => (
            <SpotCard
              key={spot.id}
              spot={spot}
              startTime={searchDates.startTime}
              endTime={searchDates.endTime}
            />
          ))}
          {searchResults.length === 0 && !isLoading && (
            <div className="col-span-full text-center text-gray-500 mt-8">
              No parking spots found. Try adjusting your search criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
}