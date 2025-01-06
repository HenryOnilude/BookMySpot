import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (user?.type !== 'ADMIN') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const spots = await prisma.spot.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        owner: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(spots);
  } catch (error) {
    console.error('Error fetching spots:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
