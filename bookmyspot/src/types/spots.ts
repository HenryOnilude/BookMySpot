import { Spot } from '@prisma/client';

export type SpotFormData = {
  title: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  pricePerHour: number;
  pricePerDay?: number;
  amenities: string[];
  images: string[];
};

export type SpotWithDetails = Spot & {
  owner: {
    id: string;
    name: string;
    email: string;
  };
  reviews: {
    rating: number;
  }[];
  distance?: number;
  averageRating?: number | null;
};

export type SpotFilters = {
  location?: {
    latitude: number;
    longitude: number;
    radius: number;
  };
  priceRange?: {
    min?: number;
    max?: number;
  };
  amenities?: string[];
  dates?: {
    start: Date;
    end: Date;
  };
};
