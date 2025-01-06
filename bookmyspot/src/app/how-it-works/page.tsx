'use client';

import { Card } from '@/components/ui/card';
import { 
  Search, 
  CreditCard, 
  Car,
  UserPlus,
  MapPin,
  Calendar,
  DollarSign,
  Shield
} from 'lucide-react';
import Link from 'next/link';

const driverSteps = [
  {
    title: 'Search',
    description: 'Enter your location and desired parking time to find available spots.',
    icon: Search
  },
  {
    title: 'Book',
    description: 'Choose your preferred spot and book instantly.',
    icon: Calendar
  },
  {
    title: 'Pay',
    description: 'Secure payment through our platform.',
    icon: CreditCard
  },
  {
    title: 'Park',
    description: 'Follow the instructions to access your parking spot.',
    icon: Car
  }
];

const ownerSteps = [
  {
    title: 'Register',
    description: 'Create an account and verify your identity.',
    icon: UserPlus
  },
  {
    title: 'List',
    description: 'Add your parking spot details and location.',
    icon: MapPin
  },
  {
    title: 'Price',
    description: 'Set your rates and availability.',
    icon: DollarSign
  },
  {
    title: 'Earn',
    description: 'Start receiving bookings and earn money.',
    icon: Shield
  }
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">How It Works</h1>
          <p className="mt-4 text-xl text-gray-600">
            Simple, secure, and convenient parking solutions
          </p>
        </div>

        {/* For Drivers Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">For Drivers</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {driverSteps.map((step, index) => (
              <Card key={step.title} className="p-6 relative">
                <div className="absolute -top-4 -left-4 h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="flex flex-col items-center text-center">
                  <step.icon className="h-12 w-12 text-blue-500 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* For Space Owners Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">For Space Owners</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {ownerSteps.map((step, index) => (
              <Card key={step.title} className="p-6 relative">
                <div className="absolute -top-4 -left-4 h-8 w-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="flex flex-col items-center text-center">
                  <step.icon className="h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                How secure is the booking process?
              </h3>
              <p className="text-gray-600">
                All bookings are secured with SSL encryption and payments are processed through 
                Stripe, a leading payment processor. We also provide insurance coverage for 
                additional peace of mind.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                What if I need to cancel my booking?
              </h3>
              <p className="text-gray-600">
                Cancellations are free up to 24 hours before the booking start time. 
                Later cancellations may be subject to our cancellation policy.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                How do I get paid as a space owner?
              </h3>
              <p className="text-gray-600">
                Payments are automatically processed and transferred to your linked bank account. 
                We handle all payment processing and provide detailed earnings reports.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Is my parking space insured?
              </h3>
              <p className="text-gray-600">
                Yes, all bookings through our platform are covered by our comprehensive 
                insurance policy, protecting both drivers and space owners.
              </p>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to get started?
          </h2>
          <div className="flex justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Register as Driver
            </Link>
            <Link
              href="/register?type=owner"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
            >
              List Your Space
            </Link>
          </div>
          <p className="mt-4 text-gray-600">
            Join thousands of users who trust BookMySpot for their parking needs
          </p>
        </div>
      </div>
    </div>
  );
}