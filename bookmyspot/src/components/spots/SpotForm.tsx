// src/components/spots/SpotForm.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { MapPin, Image as ImageIcon, Plus, X } from 'lucide-react';
import type { SpotFormData } from '@/types';

interface SpotFormProps {
  initialData?: Partial<SpotFormData>;
  onSubmit: (data: SpotFormData) => void;
  isLoading?: boolean;
}

const AMENITIES_OPTIONS = [
  'Security Camera',
  'Covered Parking',
  'EV Charging',
  'Lighting',
  'Security Gate',
  'Handicap Accessible',
  '24/7 Access',
  'Car Wash'
];

export default function SpotForm({ initialData = {}, onSubmit, isLoading = false }: SpotFormProps) {
  const [formData, setFormData] = useState<Partial<SpotFormData>>({
    title: '',
    description: '',
    address: '',
    latitude: 0,
    longitude: 0,
    pricePerHour: 0,
    pricePerDay: 0,
    amenities: [],
    images: [],
    ...initialData
  });

  const [selectedAmenities, setSelectedAmenities] = useState<Set<string>>(
    new Set(initialData.amenities || [])
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'pricePerHour' || name === 'pricePerDay' ? parseFloat(value) : value
    }));
  };

  const toggleAmenity = (amenity: string) => {
    const newSelectedAmenities = new Set(selectedAmenities);
    if (newSelectedAmenities.has(amenity)) {
      newSelectedAmenities.delete(amenity);
    } else {
      newSelectedAmenities.add(amenity);
    }
    setSelectedAmenities(newSelectedAmenities);
    setFormData((prev) => ({
      ...prev,
      amenities: Array.from(newSelectedAmenities)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as SpotFormData);
  };

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} id="spot-form" className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Spot Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter spot title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter spot description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter spot address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
                  Latitude
                </label>
                <input
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="any"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
                  Longitude
                </label>
                <input
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="any"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Pricing</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="pricePerHour" className="block text-sm font-medium text-gray-700">
                Price per Hour ($)
              </label>
              <input
                id="pricePerHour"
                name="pricePerHour"
                type="number"
                step="0.01"
                min="0"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter hourly rate"
                value={formData.pricePerHour}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="pricePerDay" className="block text-sm font-medium text-gray-700">
                Price per Day ($)
              </label>
              <input
                id="pricePerDay"
                name="pricePerDay"
                type="number"
                step="0.01"
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter daily rate"
                value={formData.pricePerDay?.toString() ?? ''}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Amenities</h2>
          <div className="grid grid-cols-2 gap-2">
            {AMENITIES_OPTIONS.map((amenity) => (
              <label
                key={amenity}
                className={`flex items-center p-3 rounded-lg border cursor-pointer ${
                  selectedAmenities.has(amenity)
                    ? 'bg-blue-50 border-blue-500'
                    : 'border-gray-200 hover:border-blue-500'
                }`}
              >
                <input
                  id={amenity}
                  name={amenity}
                  type="checkbox"
                  className="sr-only"
                  checked={selectedAmenities.has(amenity)}
                  onChange={() => toggleAmenity(amenity)}
                />
                <span className={selectedAmenities.has(amenity) ? 'text-blue-700' : 'text-gray-700'}>
                  {amenity}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            id="submit-spot"
            name="submit-spot"
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Saving...' : 'Save Parking Spot'}
          </button>
        </div>
      </form>
    </Card>
  );
}