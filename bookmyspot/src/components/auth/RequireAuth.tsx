// src/components/auth/RequireAuth.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { UserType } from '@prisma/client';

interface RequireAuthProps {
  children: React.ReactNode;
  allowedRoles?: UserType[];
}

export function RequireAuth({ children, allowedRoles }: RequireAuthProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const loading = status === 'loading';

  useEffect(() => {
    if (!loading) {
      if (!session) {
        router.push('/login');
      } else if (allowedRoles && !allowedRoles.includes(session.user.type)) {
        router.push('/dashboard'); // Redirect to main dashboard if role not allowed
      }
    }
  }, [session, loading, router, allowedRoles]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(session.user.type)) {
    return null;
  }

  return <>{children}</>;
}