'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import DriverDashboard from '@/components/dashboard/DriverDashboard';
import OwnerDashboard from '@/components/dashboard/OwnerDashboard';
import { Card } from '@/components/ui/card';
import { UserType } from '@prisma/client';
import { Bell, Loader2 } from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';
import type { DashboardUser } from '@/types/dashboard';

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="flex items-center justify-center p-6">
      <Card className="p-6 max-w-lg w-full bg-red-50">
        <h2 className="text-xl font-bold text-red-600 mb-2">Dashboard Error</h2>
        <p className="text-gray-600">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </Card>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (!session?.user) {
    return null;
  }

  const dashboardUser: DashboardUser = {
    id: session.user.id,
    email: session.user.email || '',
    name: session.user.name || '',
    type: session.user.type
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Welcome, {dashboardUser.name}</h1>
        </div>
        {dashboardUser.type === UserType.ADMIN && <AdminDashboard user={dashboardUser} />}
        {dashboardUser.type === UserType.DRIVER && <DriverDashboard user={dashboardUser} />}
        {dashboardUser.type === UserType.OWNER && <OwnerDashboard user={dashboardUser} />}
      </div>
    </ErrorBoundary>
  );
}