// src/app/api/spots/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { Spot, Review } from '@prisma/client';

// Type definition for spot with its related data
type SpotWithDetails = Spot & {
  reviews: Pick<Review, 'rating'>[];
  owner: {
    id: string;
    name: string;
    email: string;
  };
  distance?: number;
  averageRating?: number | null;
};

// Type for query filters
type QueryFilters = {
  where: {
    isActive: true;
    pricePerHour?: {
      gte?: number;
      lte?: number;
    };
    AND?: Array<{
      latitude?: { gte: number; lte: number };
      longitude?: { gte: number; lte: number };
    }>;
  };
  include: {
    owner: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
    reviews: {
      select: {
        rating: true;
      };
    };
  };
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = searchParams.get('radius') || '10'; // Default 10km radius

    console.log('Search params:', { lat, lng, radius });

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radiusKm = parseFloat(radius);

    // Convert radius to approximate latitude/longitude bounds
    // 111.2 km is roughly 1 degree of latitude
    const latDelta = radiusKm / 111.2;
    const lngDelta = radiusKm / (111.2 * Math.cos(latitude * Math.PI / 180));

    console.log('Searching with bounds:', {
      latMin: latitude - latDelta,
      latMax: latitude + latDelta,
      lngMin: longitude - lngDelta,
      lngMax: longitude + lngDelta,
    });

    // First, get all spots
    const allSpots = await prisma.spot.findMany({
      where: {
        isActive: true,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });

    console.log(`Found ${allSpots.length} total spots in database`);

    // Then filter by distance
    const spotsWithDistance = allSpots.map(spot => {
      const distance = calculateDistance(
        latitude,
        longitude,
        spot.latitude,
        spot.longitude
      );
      return {
        ...spot,
        distance,
        averageRating: spot.reviews.length > 0
          ? spot.reviews.reduce((acc, review) => acc + review.rating, 0) / spot.reviews.length
          : null,
      };
    }).filter(spot => {
      const isInRadius = spot.distance <= radiusKm;
      console.log(`Spot ${spot.title} is ${spot.distance.toFixed(2)}km away, included: ${isInRadius}`);
      return isInRadius;
    });

    console.log(`Found ${spotsWithDistance.length} spots within ${radius}km radius`);

    return NextResponse.json(spotsWithDistance);
  } catch (error) {
    console.error('Error in GET /api/spots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch spots' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await req.json();
    const {
      title,
      description,
      address,
      latitude,
      longitude,
      pricePerHour,
      pricePerDay,
      amenities,
      images,
    } = data;

    // Validate required fields
    if (!title || !description || !address || !latitude || !longitude || !pricePerHour) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Create the spot
    const spot = await prisma.spot.create({
      data: {
        title,
        description,
        address,
        latitude,
        longitude,
        pricePerHour,
        pricePerDay,
        amenities,
        images,
        isActive: true,
        ownerId: session.user.id,
      },
    });

    return NextResponse.json(spot);
  } catch (error) {
    console.error('Error creating spot:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Helper function to calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}