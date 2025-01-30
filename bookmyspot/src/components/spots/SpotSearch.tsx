'use client';

import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import { SearchIcon } from 'lucide-react';
import ClientSideMap from '../ClientSideMap';
import type { SearchParams } from '@/types/dashboard';

interface SpotSearchProps {
  onSearch: (params: SearchParams) => void;
}

const DEFAULT_CENTER = {
  lat: 51.5545, 
  lng: -0.2478
};

export default function SpotSearch({ onSearch }: SpotSearchProps) {
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleLocationSearch = async () => {
    if (!location.trim()) {
      setSearchError('Please enter a location');
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&countrycodes=gb`
      );

      if (!response.ok) {
        throw new Error('Location search failed');
      }

      const data = await response.json();
      
      if (data.length === 0) {
        setSearchError('Location not found');
        return;
      }

      const { lat, lon } = data[0];
      const newCoords = { lat: parseFloat(lat), lng: parseFloat(lon) };
      console.log('Found coordinates:', newCoords);
      setCoordinates(newCoords);
      setSearchError(null);
    } catch (error) {
      setSearchError('Failed to search location');
      console.error('Location search error:', error);
    }
  };

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setCoordinates({ lat, lng });
    // Reverse geocode to get location name
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then(res => res.json())
      .then(data => {
        setLocation(data.display_name);
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!coordinates) {
      setSearchError('Please select a location');
      return;
    }

    if (!startDate || !endDate) {
      setSearchError('Please select both start and end dates');
      return;
    }

    if (endDate < startDate) {
      setSearchError('End date must be after start date');
      return;
    }

    try {
      const response = await fetch(`/api/spots?lat=${coordinates.lat}&lng=${coordinates.lng}&radius=10`);
      if (!response.ok) {
        throw new Error('Failed to fetch spots');
      }
      const data = await response.json();
      
      onSearch({
        location,
        coordinates,
        dateFrom: startDate,
        dateTo: endDate,
        spots: data
      });
    } catch (error) {
      console.error('Error fetching spots:', error);
      setSearchError('Failed to fetch parking spots');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6 mt-8">Find Available Parking Spots</h1>
      
      <div className="space-y-6">
        {/* Search Form */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-4">
            <input
              type="datetime-local"
              value={startDate ? format(startDate, "yyyy-MM-dd'T'HH:mm") : ''}
              onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
              className="w-48 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="datetime-local"
              value={endDate ? format(endDate, "yyyy-MM-dd'T'HH:mm") : ''}
              onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
              className="w-48 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <SearchIcon className="w-5 h-5" />
            <span>Search Spots</span>
          </button>
        </div>

        {searchError && (
          <div className="text-red-500 text-sm">{searchError}</div>
        )}

        {/* Map */}
        <div className="w-full">
          <ClientSideMap
            center={coordinates || DEFAULT_CENTER}
            onClick={handleMapClick}
            marker={coordinates}
          />
        </div>
      </div>
    </div>
  );
}