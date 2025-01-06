import { UserType } from '@prisma/client';

export interface DashboardUser {
  id: string;
  email: string;
  name: string;
  type: UserType;
}

export interface DashboardComponentProps {
  user: DashboardUser;
}

export interface DashboardStats {
  totalUsers: number;
  totalSpots: number;
  activeBookings: number;
  revenue: number;
}

export interface DriverStats {
  activeBookings: number;
  totalBookings: number;
  totalSpent: number;
}

export interface OwnerStats {
  totalSpots: number;
  activeBookings: number;
  earnings: number;
}

export interface SearchParams {
  location?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  dateFrom?: Date;
  dateTo?: Date;
  priceMin?: number;
  priceMax?: number;
}

export interface MapProps {
  center: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  onClick?: (lat: number, lng: number) => void;
  marker?: {
    lat: number;
    lng: number;
  } | null;
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
}