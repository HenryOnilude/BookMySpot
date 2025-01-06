'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth';
import { UserType } from '@prisma/client';

export default function Footer() {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: '/spots', label: 'Find Spots' },
    ...(user ? [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/bookings', label: 'My Bookings' },
      ...(user.type === UserType.OWNER ? [
        { href: '/spots/manage', label: 'Manage Spots' }
      ] : [])
    ] : [
      { href: '/auth/login', label: 'Login' },
      { href: '/auth/register', label: 'List Your Spot' }
    ]),
    { href: '/help', label: 'Help Center' }
  ];

  const legalLinks = [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/contact', label: 'Contact Us' }
  ];

  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center mb-4">
              <span className="text-xl font-bold text-blue-600">BookMySpot</span>
            </Link>
            <p className="text-sm text-gray-500 max-w-md">
              BookMySpot provides secure and convenient parking solutions for drivers and spot owners.
              Find and book parking spots 24/7 with our easy-to-use platform.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-500">
              {currentYear} BookMySpot. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a
                href="https://twitter.com/bookmyspot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                Twitter
              </a>
              <a
                href="https://facebook.com/bookmyspot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                Facebook
              </a>
              <a
                href="https://instagram.com/bookmyspot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
