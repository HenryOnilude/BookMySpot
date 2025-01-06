'use client';

import { useEffect } from 'react';
import { ClientButton } from '@/components/ui/client-button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-lg w-full p-6 bg-white rounded-lg shadow-lg text-center">
        <div className="flex flex-col items-center gap-2 mb-4">
          <AlertTriangle className="h-12 w-12 text-red-500" />
          <h2 className="text-2xl font-bold text-red-600">Something went wrong!</h2>
          <p className="text-gray-600">
            {error?.message || 'An unexpected error occurred. Please try again later.'}
          </p>
        </div>
        <div className="space-y-4">
          <ClientButton
            variant="default"
            onClick={() => reset()}
            className="w-full"
          >
            Try again
          </ClientButton>
          <ClientButton
            variant="outline"
            onClick={() => window.location.reload()}
            className="w-full"
          >
            Try reloading
          </ClientButton>
        </div>
      </div>
    </div>
  );
}
