// src/app/privacy/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

// Interface for privacy section
interface PrivacySection {
  id: string;
  title: string;
  content: string[];
}

export default function PrivacyPolicy() {
  // State for active section in mobile view
  const [activeSection, setActiveSection] = useState<string>('collection');

  // Privacy policy sections data
  const sections: PrivacySection[] = [
    {
      id: 'collection',
      title: 'Information Collection',
      content: [
        'We collect information that you provide directly to us when you:',
        '• Create an account or profile',
        '• List or book a parking spot',
        '• Make payments through our platform',
        '• Contact our support team',
        '• Subscribe to our newsletters',
        'This includes your name, email address, phone number, payment information, and parking spot details.'
      ]
    },
    {
      id: 'usage',
      title: 'How We Use Your Information',
      content: [
        'We use the collected information to:',
        '• Process your bookings and payments',
        '• Verify your identity and maintain account security',
        '• Send booking confirmations and updates',
        '• Improve our services and user experience',
        '• Analyze parking patterns and optimize spot availability',
        '• Comply with legal obligations',
        '• Prevent fraud and enhance platform security'
      ]
    },
    {
      id: 'sharing',
      title: 'Information Sharing',
      content: [
        'We share your information with:',
        '• Parking spot owners (only necessary booking details)',
        '• Payment processors for transaction handling',
        '• Service providers who assist our operations',
        '• Law enforcement when required by law',
        'We never sell your personal information to third parties.'
      ]
    },
    {
      id: 'security',
      title: 'Data Security',
      content: [
        'We implement robust security measures including:',
        '• Encryption of sensitive data',
        '• Regular security audits',
        '• Secure payment processing',
        '• Access controls and authentication',
        '• Continuous monitoring for suspicious activities',
        'While we take these precautions, no online platform can guarantee 100% security.'
      ]
    },
    {
      id: 'cookies',
      title: 'Cookies and Tracking',
      content: [
        'We use cookies and similar technologies to:',
        '• Keep you logged in',
        '• Remember your preferences',
        '• Analyze site traffic and usage',
        '• Personalize your experience',
        'You can manage cookie preferences through your browser settings.'
      ]
    },
    {
      id: 'rights',
      title: 'Your Rights and Choices',
      content: [
        'You have the right to:',
        '• Access your personal information',
        '• Correct inaccurate data',
        '• Request deletion of your data',
        '• Opt out of marketing communications',
        '• Export your data',
        'Contact our privacy team to exercise these rights.'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl opacity-90">
            Last updated: December 2024
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Introduction */}
          <div className="p-6 border-b">
            <p className="text-gray-600">
              At BookMySpot, we take your privacy seriously. This policy describes how we collect,
              use, and protect your personal information when you use our platform.
            </p>
          </div>

          {/* Navigation - Desktop */}
          <div className="hidden md:flex border-b">
            <div className="w-1/4 bg-gray-50 p-6">
              <nav className="space-y-2 sticky top-6">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block text-gray-600 hover:text-blue-600 py-2"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>

            {/* Content - Desktop */}
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

          {/* Mobile View */}
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
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-gray-600 mb-6">
            If you have any questions about this Privacy Policy or our practices,
            please contact us at:
          </p>
          <div className="space-y-2 text-gray-600">
            <p>Email: privacy@bookmyspot.com</p>
            <p>Phone: 020 1234 5678</p>
            <p>Address: 123 Parking Street, City, Country</p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="max-w-4xl mx-auto mt-8 text-center">
          <div className="space-x-4">
            <Link href="/terms" className="text-blue-600 hover:text-blue-800">
              Terms of Service
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