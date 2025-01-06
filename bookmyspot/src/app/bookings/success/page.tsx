'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      router.push('/spots');
      return;
    }

    // Wait a moment for the webhook to process
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Redirect to bookings page after 3 seconds
      setTimeout(() => {
        router.push('/bookings');
      }, 3000);
    }, 2000);

    return () => clearTimeout(timer);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="mb-4">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-8">
          {isLoading
            ? 'Processing your booking...'
            : 'Your booking has been confirmed. Redirecting to your bookings...'}
        </p>
        {isLoading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    </div>
  );
}
