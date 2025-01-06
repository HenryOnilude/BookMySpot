'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import SpotList from '@/components/spots/SpotList';
import { Search, MapPin } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// =================================================================
// Feature Card Component
// Displays individual features with image and description
// =================================================================
const FeatureCard = ({ imageSrc, title, description }: {
  imageSrc: string;
  title: string;
  description: string;
}) => (
  <div className="bg-white rounded-lg overflow-hidden shadow-lg transition hover:shadow-xl">
    {/* Feature Image */}
    <div className="relative h-48">
      <Image
        src={imageSrc}
        alt={title}
        fill
        className="object-cover transform hover:scale-105 transition duration-500"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
    {/* Feature Content */}
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

// =================================================================
// Testimonial Card Component
// Displays user testimonials with avatar and content
// =================================================================
const TestimonialCard = ({ name, role, content, imageSrc }: {
  name: string;
  role: string;
  content: string;
  imageSrc: string;
}) => (
  <div className="bg-white rounded-lg overflow-hidden shadow-lg p-8 relative">
    {/* User Info with Avatar */}
    <div className="flex items-center gap-4 mb-6">
      <div className="relative w-16 h-16 rounded-full overflow-hidden">
        <Image
          src={imageSrc}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div>
        <h4 className="font-semibold text-lg text-gray-900">{name}</h4>
        <p className="text-gray-600">{role}</p>
      </div>
    </div>
    {/* Testimonial Content */}
    <p className="text-gray-700 italic">&quot;{content}&quot;</p>
    {/* Decorative Quote Icon */}
    <div className="absolute top-4 right-4 text-blue-500">
      <svg className="w-8 h-8 opacity-25" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>
    </div>
  </div>
);

// =================================================================
// Video Background Component
// Handles the hero section video background with loading state
// =================================================================
const VideoBackground = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Safari and Firefox specific setup
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    
    const attemptPlay = async () => {
      try {
        // Reset video to beginning
        video.currentTime = 0;
        await video.play();
        video.playbackRate = 0.75;
        setHasError(false);
      } catch (err) {
        console.error('Video playback error:', err);
        setHasError(true);
      }
    };

    // Event listeners for different states
    const handleCanPlay = () => {
      setIsLoading(false);
      attemptPlay();
    };

    const handleError = (e: Event) => {
      console.error('Video error:', e);
      setHasError(true);
      setIsLoading(false);
    };

    // Add all event listeners
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('stalled', handleError);
    video.addEventListener('suspend', handleError);

    // Force load the video
    video.load();

    // Cleanup
    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('stalled', handleError);
      video.removeEventListener('suspend', handleError);
    };
  }, []);

  // Fallback to static image if video fails
  if (hasError) {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10"></div>
        <Image
          src="/images/parking-hero.jpg"
          alt="Parking lot background"
          fill
          className="object-cover"
          priority
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10"></div>
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className={`absolute w-full h-full object-cover transition-opacity duration-500 ${isLoading ? "opacity-0" : "opacity-100"}`}
        poster="/images/parking-hero.jpg"
      >
        <source 
          src="/images/covervideo.mp4" 
          type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
        />
        Your browser does not support the video tag.
      </video>
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800" />
      )}
    </div>
  );
};

// =================================================================
// Search Bar Component
// Provides location search and datetime selection
// =================================================================
const SearchBar = () => {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [dateTime, setDateTime] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/spots/search?location=${encodeURIComponent(location)}&datetime=${encodeURIComponent(dateTime)}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-center gap-3 bg-white/90 backdrop-blur-md rounded-xl p-2">
        {/* Location Input */}
        <div className="flex-1 w-full relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Enter location or postcode"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-transparent rounded-lg focus:outline-none"
          />
        </div>

        {/* DateTime Input */}
        <div className="flex-1 w-full">
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            className="w-full px-4 py-2.5 bg-transparent rounded-lg focus:outline-none"
          />
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="w-full md:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <Search className="h-5 w-5" />
          <span>Search</span>
        </button>
      </div>
    </form>
  );
};

// =================================================================
// Main Home Page Component
// =================================================================
export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  // Feature section data
  const features = [
    {
      imageSrc: "/images/coverdarkmode.jpg",
      title: "24/7 Secure Parking",
      description: "Well-lit, monitored indoor parking facilities for your peace of mind"
    },
    {
      imageSrc: "/images/disablecarpark.jpg",
      title: "Accessible Facilities",
      description: "Dedicated accessible parking spots available at all locations"
    },
    {
      imageSrc: "/images/darkmodecarparklabel.jpg",
      title: "Clear Navigation",
      description: "Well-marked signage and easy-to-follow directions"
    }
  ];

  // Testimonials section data
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Regular Parker",
      content: "BookMySpot made finding secure parking near my workplace incredibly easy. The booking process is seamless!",
      imageSrc: "/images/testimonywomanpic.jpg"
    },
    {
      name: "Marcus Chen",
      role: "Space Owner",
      content: "I've been able to earn extra income from my unused parking space. The platform is user-friendly and reliable.",
      imageSrc: "/images/testmonyman.jpg"
    },
    {
      name: "Yasin Williams",
      role: "Business Owner",
      content: "The flexible booking options and clear navigation have made parking management stress-free for our customers.",
      imageSrc: "/images/testimonny2woman.jpg"
    }
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-800">
        <VideoBackground />
        <div className="relative z-20 container mx-auto px-4 py-16 text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            Smart Parking Solutions
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Find and book secure parking spots 24/7
          </p>
          
          {/* Search Component */}
          <SearchBar />
          
          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/spots"
              className="inline-block px-8 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors duration-200"
            >
              Browse All Spots
            </Link>
            {!session && (
              <Link
                href="/spots/create"
                className="inline-block px-8 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors duration-200"
              >
                List Your Spot
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">
            Premium Parking Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                imageSrc={feature.imageSrc}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-lg shadow-lg space-y-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Search</h3>
              <p className="text-gray-600">
                Find available parking spots in your desired location
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-lg shadow-lg space-y-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Book</h3>
              <p className="text-gray-600">
                Reserve your spot with instant confirmation and secure payment
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-lg shadow-lg space-y-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Park</h3>
              <p className="text-gray-600">
                Follow directions to your secured parking spot and enjoy hassle-free parking
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">
            What Our Users Say
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                name={testimonial.name}
                role={testimonial.role}
                content={testimonial.content}
                imageSrc={testimonial.imageSrc}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA (Call To Action) Section - Only show if user is not signed in */}
      {!session && (
        <section className="py-16 lg:py-24 bg-blue-900 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg lg:text-xl mb-8 opacity-90">
              Join thousands of users who have simplified their parking experience
            </p>
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/register"
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg"
              >
                Sign Up Now
              </Link>
              <Link 
                href="/contact"
                className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white/10"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}