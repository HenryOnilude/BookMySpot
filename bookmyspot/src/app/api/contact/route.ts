// src/app/api/contact/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { name, email, subject, message, type } = await req.json();

    // Optional: Get session if you want to associate feedback with logged-in user
    const session = await getServerSession(authOptions);

    const feedback = await prisma.feedback.create({
      data: {
        name,
        email,
        subject,
        message,
        type,
        userId: session?.user?.id, // Optional: associate with user if logged in
      },
    });

    // Here you could add email notification logic
    // await sendEmailNotification(feedback);

    return NextResponse.json({ success: true, feedback });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}