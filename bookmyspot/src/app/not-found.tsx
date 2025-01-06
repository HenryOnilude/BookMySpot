'use client';

import Link from 'next/link';
import { ClientButton } from '@/components/ui/client-button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-lg w-full p-6 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you are looking for might have been removed or is temporarily unavailable.
        </p>
        <Link href="/">
          <ClientButton className="w-full">
            Return to Home
          </ClientButton>
        </Link>
      </div>
    </div>
  );
}
