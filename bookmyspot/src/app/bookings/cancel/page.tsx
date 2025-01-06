'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CancelPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear any payment-related state if needed
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="mb-4">
          <XCircle className="w-16 h-16 text-red-500 mx-auto" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Cancelled
        </h1>
        <p className="text-gray-600 mb-8">
          Your booking has been cancelled. No payment has been processed.
        </p>
        <Button
          onClick={() => router.push('/spots')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Return to Spots
        </Button>
      </div>
    </div>
  );
}
