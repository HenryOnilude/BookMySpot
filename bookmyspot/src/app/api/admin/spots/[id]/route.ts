import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (admin?.type !== 'ADMIN') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const data = await request.json();
    const { isActive } = data;

    const updatedSpot = await prisma.spot.update({
      where: { id: params.id },
      data: { isActive },
    });

    return NextResponse.json(updatedSpot);
  } catch (error) {
    console.error('Error updating spot:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
