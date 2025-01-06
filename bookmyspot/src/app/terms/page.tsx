// src/app/terms/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

// Interface for terms section
interface TermsSection {
  id: string;
  title: string;
  content: string[];
}

export default function TermsOfService() {
  // State for active section in mobile view
  const [activeSection, setActiveSection] = useState<string>('acceptance');

  // Terms sections data
  const sections: TermsSection[] = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      content: [
        'By accessing and using BookMySpot, you agree to be bound by these Terms of Service and all applicable laws and regulations.',
        'If you do not agree with any of these terms, you are prohibited from using or accessing this platform.',
        'We reserve the right to modify these terms at any time, and each use of our platform constitutes acceptance of the current terms.'
      ]
    },
    {
      id: 'user-responsibilities',
      title: 'User Responsibilities',
      content: [
        'Users must:',
        '• Provide accurate and complete information when registering',
        '• Maintain the security of their account credentials',
        '• Comply with all local parking and traffic regulations',
        '• Not engage in fraudulent activities or misuse the platform',
        '• Report any unauthorized use of their account',
        '• Update their information to ensure accuracy',
        'Violation of these responsibilities may result in account suspension or termination.'
      ]
    },
    {
      id: 'parking-owners',
      title: 'Parking Spot Owner Terms',
      content: [
        'Parking spot owners must:',
        '• Have legal right to list and rent the parking spot',
        '• Provide accurate location and availability information',
        '• Maintain the parking spot in a safe and accessible condition',
        '• Honor all confirmed bookings',
        '• Comply with local zoning and parking regulations',
        '• Maintain appropriate insurance coverage',
        '• Respond promptly to booking requests and inquiries'
      ]
    },
    {
      id: 'booking-terms',
      title: 'Booking and Payment Terms',
      content: [
        'All bookings are subject to:',
        '• Confirmation by the parking spot owner',
        '• Payment of the full amount at time of booking',
        '• Platform service fees and applicable taxes',
        '• Cancellation policy as specified for each spot',
        'Payment processing is handled by secure third-party providers.',
        'Users agree to pay all charges incurred in connection with their use of the platform.'
      ]
    },
    {
      id: 'cancellations',
      title: 'Cancellation Policy',
      content: [
        'Our cancellation policy includes:',
        '• Full refund if cancelled 24 hours before start time',
        '• Partial refund if cancelled within 24 hours',
        '• No refund for no-shows',
        '• Special circumstances may be reviewed case by case',
        'Repeated cancellations may affect user account status.'
      ]
    },
    {
      id: 'liability',
      title: 'Liability and Insurance',
      content: [
        'BookMySpot:',
        '• Is not responsible for damage to vehicles or property',
        '• Does not provide insurance coverage',
        '• Recommends users maintain appropriate insurance',
        '• Is not liable for losses due to incorrect spot information',
        '• Disclaims all warranties to the maximum extent permitted by law'
      ]
    },
    {
      id: 'disputes',
      title: 'Dispute Resolution',
      content: [
        'In case of disputes:',
        '• Users agree to attempt direct resolution first',
        '• Platform mediation services are available',
        '• Arbitration may be required for unresolved disputes',
        '• Local laws of jurisdiction apply',
        '• Small claims court is an alternative option'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl opacity-90">
            Last updated: January 2024
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Introduction */}
          <div className="p-6 border-b">
            <p className="text-gray-600">
              Welcome to BookMySpot. These terms of service outline your rights and responsibilities
              when using our platform. Please read them carefully before using our services.
            </p>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex border-b">
            {/* Navigation Sidebar */}
            <div className="w-1/4 bg-gray-50 p-6">
              <nav className="space-y-2 sticky top-6">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block text-gray-600 hover:text-blue-600 py-2 transition-colors"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="w-3/4 p-6">
              {sections.map((section) => (
                <div key={section.id} id={section.id} className="mb-12">
                  <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
                  {section.content.map((paragraph, index) => (
                    <p key={index} className="text-gray-600 mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden">
            {sections.map((section) => (
              <div key={section.id} className="border-b">
                <button
                  onClick={() => setActiveSection(activeSection === section.id ? '' : section.id)}
                  className="w-full text-left p-4 flex justify-between items-center bg-gray-50"
                >
                  <span className="font-semibold">{section.title}</span>
                  <svg
                    className={`w-6 h-6 transform transition-transform ${
                      activeSection === section.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {activeSection === section.id && (
                  <div className="p-4">
                    {section.content.map((paragraph, index) => (
                      <p key={index} className="text-gray-600 mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Questions About Our Terms?</h2>
          <p className="text-gray-600 mb-6">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <div className="space-y-2 text-gray-600">
            <p>Email: legal@bookmyspot.com</p>
            <p>Phone: 020 1234 5678</p>
            <p>Address: 123 Parking Street, City, Country</p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="max-w-4xl mx-auto mt-8 text-center">
          <div className="space-x-4">
            <Link href="/privacy" className="text-blue-600 hover:text-blue-800">
              Privacy Policy
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/about" className="text-blue-600 hover:text-blue-800">
              About Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}