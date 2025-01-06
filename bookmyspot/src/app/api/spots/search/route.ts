import { NextResponse } from 'next/server';
import { Spot } from '@prisma/client';

// Mock data covering major UK cities and London areas
const mockSpots: Partial<Spot>[] = [
  // Central London
  {
    id: '1',
    title: 'Covent Garden Secure Parking',
    description: 'Premium parking in the heart of Covent Garden',
    address: '14 Floral Street, London WC2E 9BZ',
    pricePerHour: 25,
    isActive: true,
    ownerId: 'owner1',
    images: [],
    latitude: 51.5132,
    longitude: -0.1234
  },
  {
    id: '2',
    title: 'Oxford Street Shopping Parking',
    description: 'Convenient parking for Oxford Street shoppers',
    address: 'Oxford Street, London W1',
    pricePerHour: 20,
    isActive: true,
    ownerId: 'owner1',
    images: [],
    latitude: 51.5154,
    longitude: -0.1418
  },
  {
    id: '3',
    title: 'Soho Square Parking',
    description: 'Central parking in vibrant Soho',
    address: 'Soho Square, London W1D',
    pricePerHour: 22,
    isActive: true,
    ownerId: 'owner2',
    images: [],
    latitude: 51.5156,
    longitude: -0.1320
  },
  {
    id: '4',
    title: 'Leicester Square Parking',
    description: 'Entertainment district parking',
    address: 'Leicester Square, London WC2H',
    pricePerHour: 25,
    isActive: true,
    ownerId: 'owner2',
    images: [],
    latitude: 51.5110,
    longitude: -0.1281
  },
  // West End & Mayfair
  {
    id: '5',
    title: 'Mayfair Luxury Parking',
    description: 'Secure parking in upscale Mayfair',
    address: 'Berkeley Square, London W1J',
    pricePerHour: 30,
    isActive: true,
    ownerId: 'owner3',
    images: [],
    latitude: 51.5100,
    longitude: -0.1477
  },
  {
    id: '6',
    title: 'Regent Street Parking',
    description: 'Shopping district parking',
    address: 'Regent Street, London W1B',
    pricePerHour: 25,
    isActive: true,
    ownerId: 'owner3',
    images: [],
    latitude: 51.5142,
    longitude: -0.1390
  },
  // City of London
  {
    id: '7',
    title: 'Liverpool Street Station Parking',
    description: 'Convenient station parking',
    address: 'Liverpool Street, London EC2M',
    pricePerHour: 20,
    isActive: true,
    ownerId: 'owner4',
    images: [],
    latitude: 51.5179,
    longitude: -0.0819
  },
  {
    id: '8',
    title: 'Bank Station Parking',
    description: 'Financial district parking',
    address: 'Bank, London EC3V',
    pricePerHour: 22,
    isActive: true,
    ownerId: 'owner4',
    images: [],
    latitude: 51.5133,
    longitude: -0.0886
  },
  // South Bank
  {
    id: '9',
    title: 'London Eye Parking',
    description: 'Tourist attraction parking',
    address: 'South Bank, London SE1',
    pricePerHour: 20,
    isActive: true,
    ownerId: 'owner5',
    images: [],
    latitude: 51.5033,
    longitude: -0.1195
  },
  {
    id: '10',
    title: 'Tate Modern Parking',
    description: 'Art gallery parking',
    address: 'Bankside, London SE1',
    pricePerHour: 18,
    isActive: true,
    ownerId: 'owner5',
    images: [],
    latitude: 51.5076,
    longitude: -0.0994
  },
  // East London
  {
    id: '11',
    title: 'Canary Wharf Parking',
    description: 'Business district parking',
    address: 'Canary Wharf, London E14',
    pricePerHour: 20,
    isActive: true,
    ownerId: 'owner6',
    images: [],
    latitude: 51.5054,
    longitude: -0.0235
  },
  {
    id: '12',
    title: 'Stratford Westfield Parking',
    description: 'Shopping center parking',
    address: 'Westfield Stratford City, London E20',
    pricePerHour: 15,
    isActive: true,
    ownerId: 'owner6',
    images: [],
    latitude: 51.5435,
    longitude: 0.0098
  },
  // North London
  {
    id: '13',
    title: 'Camden Market Parking',
    description: 'Market area parking',
    address: 'Camden Lock, London NW1',
    pricePerHour: 15,
    isActive: true,
    ownerId: 'owner7',
    images: [],
    latitude: 51.5419,
    longitude: -0.1463
  },
  {
    id: '14',
    title: 'Emirates Stadium Parking',
    description: 'Arsenal stadium parking',
    address: 'Hornsey Road, London N7',
    pricePerHour: 15,
    isActive: true,
    ownerId: 'owner7',
    images: [],
    latitude: 51.5550,
    longitude: -0.1084
  },
  // West London
  {
    id: '15',
    title: 'Westfield London Parking',
    description: 'Shopping center parking',
    address: 'Westfield London, W12',
    pricePerHour: 15,
    isActive: true,
    ownerId: 'owner8',
    images: [],
    latitude: 51.5074,
    longitude: -0.2215
  },
  {
    id: '16',
    title: 'Kensington Palace Parking',
    description: 'Tourist attraction parking',
    address: 'Kensington Gardens, London W8',
    pricePerHour: 20,
    isActive: true,
    ownerId: 'owner8',
    images: [],
    latitude: 51.5050,
    longitude: -0.1877
  },
  // South London
  {
    id: '17',
    title: 'O2 Arena Parking',
    description: 'Event venue parking',
    address: 'Peninsula Square, London SE10',
    pricePerHour: 15,
    isActive: true,
    ownerId: 'owner9',
    images: [],
    latitude: 51.5030,
    longitude: 0.0032
  },
  {
    id: '18',
    title: 'Brixton Academy Parking',
    description: 'Music venue parking',
    address: 'Stockwell Road, London SW9',
    pricePerHour: 12,
    isActive: true,
    ownerId: 'owner9',
    images: [],
    latitude: 51.4651,
    longitude: -0.1150
  },
  {
    id: '19',
    title: 'Victoria Station Parking',
    description: 'Transport hub parking',
    address: 'Victoria Street, London SW1',
    pricePerHour: 20,
    isActive: true,
    ownerId: 'owner10',
    images: [],
    latitude: 51.4952,
    longitude: -0.1441
  },
  {
    id: '20',
    title: 'Paddington Station Parking',
    description: 'Station parking',
    address: 'Praed Street, London W2',
    pricePerHour: 20,
    isActive: true,
    ownerId: 'owner10',
    images: [],
    latitude: 51.5154,
    longitude: -0.1755
  },
  {
    id: '21',
    title: 'Crystal Palace Park Parking',
    description: 'Park and sports venue parking',
    address: 'Crystal Palace Park Road, London SE19',
    pricePerHour: 10,
    isActive: true,
    ownerId: 'owner11',
    images: [],
    latitude: 51.4225,
    longitude: -0.0700
  },
  {
    id: '22',
    title: 'Dulwich Village Parking',
    description: 'Village area parking near Dulwich Picture Gallery',
    address: 'Dulwich Village, London SE21',
    pricePerHour: 12,
    isActive: true,
    ownerId: 'owner11',
    images: [],
    latitude: 51.4513,
    longitude: -0.0857
  },
  {
    id: '23',
    title: 'Peckham Rye Parking',
    description: 'Park and shopping area parking',
    address: 'Peckham Rye, London SE15',
    pricePerHour: 10,
    isActive: true,
    ownerId: 'owner12',
    images: [],
    latitude: 51.4690,
    longitude: -0.0667
  },
  {
    id: '24',
    title: 'Clapham Common Parking',
    description: 'Park and entertainment area parking',
    address: 'Clapham Common South Side, London SW4',
    pricePerHour: 12,
    isActive: true,
    ownerId: 'owner12',
    images: [],
    latitude: 51.4619,
    longitude: -0.1392
  },
  {
    id: '25',
    title: 'Wimbledon Tennis Club Parking',
    description: 'Sports venue and village parking',
    address: 'Church Road, London SW19',
    pricePerHour: 15,
    isActive: true,
    ownerId: 'owner13',
    images: [],
    latitude: 51.4343,
    longitude: -0.2177
  },
  {
    id: '26',
    title: 'Battersea Park Parking',
    description: 'Park and riverside parking',
    address: 'Battersea Park Road, London SW11',
    pricePerHour: 12,
    isActive: true,
    ownerId: 'owner13',
    images: [],
    latitude: 51.4791,
    longitude: -0.1550
  },
  {
    id: '27',
    title: 'Greenwich Market Parking',
    description: 'Historic market and tourist area parking',
    address: 'Greenwich Market, London SE10',
    pricePerHour: 12,
    isActive: true,
    ownerId: 'owner14',
    images: [],
    latitude: 51.4817,
    longitude: -0.0090
  },
  {
    id: '28',
    title: 'Elephant & Castle Parking',
    description: 'Shopping center and transport hub parking',
    address: 'Elephant & Castle, London SE1',
    pricePerHour: 15,
    isActive: true,
    ownerId: 'owner14',
    images: [],
    latitude: 51.4957,
    longitude: -0.1018
  },
  {
    id: '29',
    title: 'Lewisham Shopping Parking',
    description: 'Town center and shopping area parking',
    address: 'Lewisham High Street, London SE13',
    pricePerHour: 12,
    isActive: true,
    ownerId: 'owner15',
    images: [],
    latitude: 51.4614,
    longitude: -0.0124
  },
  {
    id: '30',
    title: 'Streatham Common Parking',
    description: 'Park and high street parking',
    address: 'Streatham High Road, London SW16',
    pricePerHour: 10,
    isActive: true,
    ownerId: 'owner15',
    images: [],
    latitude: 51.4177,
    longitude: -0.1329
  },
  {
    id: '31',
    title: 'Thamesmead Town Centre Parking',
    description: 'Town center parking near shops and amenities',
    address: 'Thamesmead Town Centre, London SE28',
    pricePerHour: 8,
    isActive: true,
    ownerId: 'owner16',
    images: [],
    latitude: 51.5011,
    longitude: 0.1156
  },
  {
    id: '32',
    title: 'Crossway Park Parking',
    description: 'Park and recreation area parking',
    address: 'Crossway, Thamesmead, London SE28',
    pricePerHour: 8,
    isActive: true,
    ownerId: 'owner16',
    images: [],
    latitude: 51.4989,
    longitude: 0.1198
  },
  {
    id: '33',
    title: 'Thamesmead Moorings Parking',
    description: 'Riverside parking near Thames Path',
    address: 'Moorings Way, Thamesmead, London SE28',
    pricePerHour: 8,
    isActive: true,
    ownerId: 'owner16',
    images: [],
    latitude: 51.5042,
    longitude: 0.1167
  },
  {
    id: '34',
    title: 'Gallions Reach Parking',
    description: 'Shopping park and retail area parking',
    address: 'Gallions Reach Shopping Park, London SE28',
    pricePerHour: 10,
    isActive: true,
    ownerId: 'owner17',
    images: [],
    latitude: 51.5086,
    longitude: 0.1078
  },
  {
    id: '35',
    title: 'Abbey Wood Station Parking',
    description: 'Railway station and Elizabeth line parking',
    address: 'Wilton Road, Abbey Wood, London SE28',
    pricePerHour: 12,
    isActive: true,
    ownerId: 'owner17',
    images: [],
    latitude: 51.4912,
    longitude: 0.1204
  }
];

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || '51.5074');
    const lng = parseFloat(searchParams.get('lng') || '-0.1278');
    const radius = parseFloat(searchParams.get('radius') || '10');

    console.log('Search params:', { lat, lng, radius });

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { error: 'Invalid coordinates provided' },
        { status: 400 }
      );
    }

    // Filter spots within the radius
    const nearbySpots = mockSpots.filter(spot => {
      if (!spot.latitude || !spot.longitude) return false;
      const distance = calculateDistance(lat, lng, spot.latitude, spot.longitude);
      console.log(`Distance to ${spot.title}: ${distance}km`);
      return distance <= radius;
    });

    console.log(`Found ${nearbySpots.length} spots within ${radius}km radius`);

    // Sort by distance
    const sortedSpots = nearbySpots.sort((a, b) => {
      if (!a.latitude || !a.longitude || !b.latitude || !b.longitude) return 0;
      const distanceA = calculateDistance(lat, lng, a.latitude, a.longitude);
      const distanceB = calculateDistance(lat, lng, b.latitude, b.longitude);
      return distanceA - distanceB;
    });

    // Add distance to each spot
    const spotsWithDistance = sortedSpots.map(spot => ({
      ...spot,
      distance: spot.latitude && spot.longitude ? 
        calculateDistance(lat, lng, spot.latitude, spot.longitude) : null
    }));

    return NextResponse.json({
      spots: spotsWithDistance,
      total: spotsWithDistance.length,
      searchParams: { lat, lng, radius }
    });
  } catch (error) {
    console.error('Error searching spots:', error);
    return NextResponse.json(
      { error: 'Failed to search spots' },
      { status: 500 }
    );
  }
}
