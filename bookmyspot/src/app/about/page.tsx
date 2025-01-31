'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ClientButton } from '@/components/ui/client-button';

// Navigation Component
const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white">
            BookMySpot
          </Link>
          
          <div className="md:hidden">
            <ClientButton
              variant="ghost"
              onClick={toggleMenu}
              className="text-white"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </ClientButton>
          </div>

          <div className={`md:flex ${isMenuOpen ? 'block' : 'hidden'} absolute md:relative top-16 md:top-0 left-0 right-0 md:flex bg-black md:bg-transparent p-4 md:p-0 space-y-4 md:space-y-0 md:space-x-6`}>
            <ClientButton
              variant="ghost"
              onClick={() => setIsMenuOpen(false)}
              className="text-white w-full text-left md:w-auto"
            >
              <Link href="#mission">Our Mission</Link>
            </ClientButton>
            
            <ClientButton
              variant="ghost"
              onClick={() => setIsMenuOpen(false)}
              className="text-white w-full text-left md:w-auto"
            >
              <Link href="#team">Our Team</Link>
            </ClientButton>
            
            <ClientButton
              variant="ghost"
              onClick={() => setIsMenuOpen(false)}
              className="text-white w-full text-left md:w-auto"
            >
              <Link href="#contact">Contact</Link>
            </ClientButton>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Interface definitions
interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
}

interface MissionPoint {
  title: string;
  description: string;
  icon: React.ReactNode;
}

// About page component
export default function AboutPage() {
  // Team members data
  const teamMembers: TeamMember[] = [
    {
      name: 'Denzel Doe',
      role: 'CEO & Founder',
      image: '/images/DenzelDoe.jpg',
      bio: 'Leading innovation in parking solutions.',
    },
    {
      name: 'Temi Mula',
      role: 'CTO',
      image: '/images/temimula.jpg',
      bio: 'Technical visionary driving our platform.',
    },
    {
      name: 'Jane Johnson',
      role: 'Head of Operations',
      image: '/images/JaneJohnson.jpg',
      bio: 'Ensuring smooth operations and customer satisfaction.',
    },
  ];

  // Mission points data
  const missionPoints: MissionPoint[] = [
    {
      title: 'Simplifying Urban Parking',
      description: 'Making parking hassle-free through smart technology and user-friendly solutions.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: 'Community First',
      description: 'Building stronger communities by optimising parking resources and reducing congestion.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      title: 'Environmental Impact',
      description: 'Reducing carbon emissions by minimising time spent searching for parking.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">About BookMySpot</h1>
          <p className="text-xl">
            We&apos;re revolutionising the way people find and book parking spaces,
            making urban mobility smoother and more efficient.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-6">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-4">
              To transform the parking experience through innovative technology,
              making it seamless, efficient, and stress-free for both drivers
              and parking space owners.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="relative h-64">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                  <p className="text-blue-600 mb-4">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
            <div className="prose prose-lg mx-auto">
              <p>
                Founded in 2024, BookMySpot emerged from a simple observation: finding parking in busy urban areas was unnecessarily stressful and time-consuming. Our founder, Henry Onilude, experienced this frustration firsthand and decided to create a solution.
              </p>
              <p>
                What started as a small pilot project in one neighbourhood has grown into a comprehensive parking management platform, serving thousands of users across multiple cities. We&apos;ve helped countless property owners monetize their unused parking spaces while making it easier for drivers to find and book parking spots.
              </p>
              <p>
                Today, BookMySpot continues to innovate and expand, focusing on creating sustainable parking solutions that benefit both individuals and communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
          <p className="text-lg text-gray-600 mb-8">
            Have questions? We&apos;d love to hear from you.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}