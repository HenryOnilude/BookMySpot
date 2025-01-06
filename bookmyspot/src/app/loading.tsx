import { LoadingSpinner } from '@/components/ui/loading';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-lg w-full p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
