'use client';

import { useAuth } from '@/contexts/auth';
import { UserType } from '@prisma/client';
import { Menu, X, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useState, useCallback } from 'react';
import { LoadingSpinner } from './ui/loading';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  href: string;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

const NavLink = ({ href, label, onClick, disabled }: NavLinkProps) => (
  <Link
    href={href}
    className={cn(
      "text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium",
      "transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
      disabled && "opacity-50 cursor-not-allowed pointer-events-none"
    )}
    onClick={disabled ? undefined : onClick}
    aria-disabled={disabled}
  >
    {label}
  </Link>
);

export default function Navigation() {
  const { user, loading, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = useCallback(async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
    } finally {
      setIsLoggingOut(false);
      setIsMenuOpen(false);
    }
  }, [signOut]);

  if (loading) {
    return (
      <div className="fixed w-full z-[100] bg-transparent">
        <div className="flex items-center justify-center h-16">
          <LoadingSpinner className="w-6 h-6 text-white" />
        </div>
      </div>
    );
  }

  return (
    <nav className="fixed w-full z-[100] bg-transparent/30 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-white hover:text-gray-200">
              BookMySpot
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center space-x-4">
            {!user ? (
              <>
                <NavLink href="/about" label="About" />
                <NavLink href="/services" label="Services" />
                <NavLink href="/contact" label="Contact" />
                <NavLink href="/spots" label="Find Spots" />
                <NavLink href="/login" label="Login" />
                <Link
                  href="/register"
                  className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium border border-white transition-colors"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <NavLink href="/spots" label="Spots" />
                <NavLink href="/bookings" label="My Bookings" />
                {user.type === UserType.OWNER && (
                  <NavLink href="/spots/manage" label="Manage Spots" />
                )}
                <div className="flex items-center space-x-4">
                  <span className="text-white">{user.name}</span>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="text-white hover:text-gray-200 disabled:opacity-50"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-gray-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="sm:hidden bg-black/70 backdrop-blur-lg mt-2 rounded-lg p-4">
            <div className="flex flex-col space-y-2">
              {!user ? (
                <>
                  <NavLink href="/about" label="About" />
                  <NavLink href="/services" label="Services" />
                  <NavLink href="/contact" label="Contact" />
                  <NavLink href="/spots" label="Find Spots" />
                  <NavLink href="/login" label="Login" />
                  <Link
                    href="/register"
                    className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium border border-white text-center"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <NavLink href="/spots" label="Spots" />
                  <NavLink href="/bookings" label="My Bookings" />
                  {user.type === UserType.OWNER && (
                    <NavLink href="/spots/manage" label="Manage Spots" />
                  )}
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-white">{user.name}</span>
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="text-white hover:text-gray-200 disabled:opacity-50"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
