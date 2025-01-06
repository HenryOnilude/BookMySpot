'use client';

import { useAuth } from '@/contexts/auth';
import { UserType } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { LoadingSpinner } from '../ui/loading';
import { cn } from '@/lib/utils';
import { showToast } from '@/lib/toast';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserType[];
  fallbackUrl?: string;
  loadingMessage?: string;
}

export function RoleGuard({ 
  children, 
  allowedRoles, 
  fallbackUrl = '/dashboard',
  loadingMessage = 'Checking permissions...'
}: RoleGuardProps) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleRedirect = useCallback((path: string) => {
    setIsRedirecting(true);
    showToast.error('Access denied. Redirecting...');
    
    const timer = setTimeout(() => {
      router.push(path);
    }, 1500);

    return () => clearTimeout(timer);
  }, [router]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!authLoading && user) {
      if (!allowedRoles.includes(user.type)) {
        timer = setTimeout(() => {
          setShowError(true);
        }, 500);
        handleRedirect(fallbackUrl);
      }
    } else if (!authLoading && !user) {
      timer = setTimeout(() => {
        setShowError(true);
      }, 500);
      handleRedirect('/auth/login');
    }

    return () => {
      clearTimeout(timer);
    };
  }, [user, authLoading, allowedRoles, fallbackUrl, handleRedirect]);

  if (authLoading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-lg w-full p-6 bg-white rounded-lg shadow-lg">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">{isRedirecting ? 'Redirecting...' : loadingMessage}</p>
        </div>
      </div>
    );
  }

  if (showError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-lg w-full p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You do not have permission to access this page.
          </p>
          <button
            onClick={() => router.push('/auth/login')}
            className={cn(
              "px-4 py-2 bg-red-600 text-white rounded-md",
              "hover:bg-red-700 transition-colors text-sm"
            )}
          >
            Login
          </button>
          <button
            onClick={() => router.push('/')}
            className={cn(
              "px-4 py-2 bg-gray-600 text-white rounded-md",
              "hover:bg-gray-700 transition-colors text-sm"
            )}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}