'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth';
import { LoadingSpinner } from '@/components/ui/loading';
import { LogOut } from 'lucide-react';
import { UserType } from '@prisma/client';
import { useSession } from 'next-auth/react';

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  if (status === 'loading') {
    return (
      <nav className="fixed w-full z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-white hover:text-gray-200">
                BookMySpot
              </Link>
            </div>
            <div className="flex items-center justify-center">
              <LoadingSpinner className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed w-full z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-white hover:text-gray-200">
              BookMySpot
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {!user && (
              <>
                <Link
                  href="/about"
                  className="text-white hover:text-gray-200 px-4 py-2 rounded-md text-sm font-medium"
                >
                  About
                </Link>
                <Link
                  href="/services"
                  className="text-white hover:text-gray-200 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Services
                </Link>
                <Link
                  href="/contact"
                  className="text-white hover:text-gray-200 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Contact
                </Link>
                <Link
                  href="/spots"
                  className="text-white hover:text-gray-200 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Find Spots
                </Link>
                <Link
                  href="/login"
                  className="text-white hover:text-gray-200 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-white hover:text-gray-200 px-4 py-2 rounded-md text-sm font-medium border border-white"
                >
                  Register
                </Link>
              </>
            )}

            {user && (
              <>
                <Link 
                  href="/spots" 
                  className="text-white hover:text-gray-200 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Spots
                </Link>
                <div className="flex items-center gap-4">
                  <Link
                    href="/spots"
                    className="text-sm font-medium text-muted-foreground hover:text-primary"
                  >
                    Find Spots
                  </Link>
                  {user.type === UserType.OWNER && (
                    <Link
                      href="/spots/create"
                      className="text-sm font-medium text-muted-foreground hover:text-primary"
                    >
                      List a Spot
                    </Link>
                  )}
                  {user.type === UserType.ADMIN && (
                    <Link
                      href="/admin"
                      className="text-sm font-medium text-muted-foreground hover:text-primary"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                </div>
                <Link 
                  href="/bookings" 
                  className="text-white hover:text-gray-200 px-4 py-2 rounded-md text-sm font-medium"
                >
                  My Bookings
                </Link>
                <div className="flex items-center space-x-4 ml-4">
                  <span className="text-white font-medium">{user.name}</span>
                  <button
                    onClick={handleSignOut}
                    className="text-white hover:text-gray-200 p-2 rounded-full hover:bg-white/10"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
