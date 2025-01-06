import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // First create a test user if it doesn't exist
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123', // In production, this should be hashed
      type: 'OWNER',
    },
  });

  console.log('Created test user:', testUser.id);

  // Create test spots in London
  const spots = [
    {
      title: 'O2 Arena Parking',
      description: 'Event venue parking',
      address: 'Peninsula Square, London SE10 0DX',
      latitude: 51.503,
      longitude: 0.003,
      pricePerHour: 10,
      pricePerDay: 80,
      isActive: true,
      ownerId: testUser.id,
      amenities: ['CCTV', 'Lighting', 'Security'],
      images: [],
    },
    {
      title: 'Canary Wharf Parking',
      description: 'Business district parking',
      address: 'Canada Square, London E14',
      latitude: 51.505,
      longitude: -0.019,
      pricePerHour: 15,
      pricePerDay: 120,
      isActive: true,
      ownerId: testUser.id,
      amenities: ['CCTV', 'Lighting', 'Security', 'Electric Charging'],
      images: [],
    },
    {
      title: 'Greenwich Market Parking',
      description: 'Historic market and tourist area parking',
      address: 'Greenwich Market, London SE10',
      latitude: 51.481,
      longitude: -0.009,
      pricePerHour: 8,
      pricePerDay: 60,
      isActive: true,
      ownerId: testUser.id,
      amenities: ['CCTV', 'Lighting'],
      images: [],
    },
    {
      title: 'Lewisham Shopping Parking',
      description: 'Shopping center parking',
      address: 'Lewisham High Street, London SE13',
      latitude: 51.464,
      longitude: -0.012,
      pricePerHour: 7,
      pricePerDay: 50,
      isActive: true,
      ownerId: testUser.id,
      amenities: ['CCTV', 'Lighting', 'Security'],
      images: [],
    },
  ];

  console.log('Seeding spots...');
  
  for (const spot of spots) {
    await prisma.spot.upsert({
      where: { 
        id: spot.title.toLowerCase().replace(/\s+/g, '-')
      },
      update: spot,
      create: {
        ...spot,
        id: spot.title.toLowerCase().replace(/\s+/g, '-'),
      },
    });
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
