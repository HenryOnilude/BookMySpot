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
    const { type } = data;

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: { type },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
