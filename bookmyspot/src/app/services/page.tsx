'use client';

import { Car, Clock, Shield, CreditCard, MapPin, Star } from 'lucide-react';

// Service interface
interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ServicesPage = () => {
  // Define services
  const services: Service[] = [
    {
      icon: <Car className="w-8 h-8 text-blue-600" />,
      title: "Easy Parking Spot Booking",
      description: "Book your parking spot in advance with just a few clicks. No more circling around looking for spaces."
    },
    {
      icon: <Clock className="w-8 h-8 text-blue-600" />,
      title: "Real-time Availability",
      description: "Check real-time parking spot availability and make instant bookings."
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "Secure Payments",
      description: "Safe and secure payment processing for all your parking bookings."
    },
    {
      icon: <CreditCard className="w-8 h-8 text-blue-600" />,
      title: "Flexible Payment Options",
      description: "Multiple payment methods accepted for your convenience."
    },
    {
      icon: <MapPin className="w-8 h-8 text-blue-600" />,
      title: "Location Services",
      description: "Find parking spots near your destination with our interactive map."
    },
    {
      icon: <Star className="w-8 h-8 text-blue-600" />,
      title: "Premium Features",
      description: "Access premium features like reserved spots and special rates."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-xl">
            Discover how BookMySpot makes parking easier and more convenient for you.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;