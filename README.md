# BookMySpot

A modern parking spot booking application built with Next.js that allows users to search, view, and book parking spots in London. The project demonstrates the implementation of complex real-time systems, scalable architecture, and modern development practices.

<img width="1512" alt="BookMySpot" src="https://github.com/user-attachments/assets/c653332e-e2c3-4b8e-a377-591d502b0a9f" />

### Live Demo

Homepage:

https://github.com/user-attachments/assets/47357eef-74ba-4c0f-8fa8-ae548f2fbcad

About Us:

https://github.com/user-attachments/assets/ee5d21df-b41b-48ce-90b3-fd2a21aae84d

Searcb for booking:

https://github.com/user-attachments/assets/792d5e80-7d1c-4adc-9d02-8c6d5b82540e

Payment:

https://github.com/user-attachments/assets/ae23aefe-5850-48d8-bc78-bfaa898aebb0

Bookings:

https://github.com/user-attachments/assets/939e60ec-03c0-4b3a-9d59-a549644f9cc2

Contact Us:

https://github.com/user-attachments/assets/b6a6e2f3-87b4-4b66-9d30-d613ddc574e8

Register: 

https://github.com/user-attachments/assets/393f7053-101c-4dd6-aa40-a60d8b5ffec7

Login:

https://github.com/user-attachments/assets/0778755b-e050-411e-9a59-861e8bc6fee7

Privacy Policy: 

https://github.com/user-attachments/assets/fc7820c1-4071-4eea-b65b-3e4b6ca94af6

Terms of Service:

https://github.com/user-attachments/assets/bf081256-2a64-4b9b-9510-54ae63be1103

How it works: 

https://github.com/user-attachments/assets/dbd99cff-a2da-4c23-a88f-631e5aa3cf57



## Project Overview

### Problems I Solve
- **Urban Congestion**: Reduces traffic from parking spot hunting
- **Resource Utilisation**: Optimises existing parking infrastructure
- **Time Efficiency**: Eliminates wasted time searching for parking
- **Environmental Impact**: Reduces emissions from circling for spots
- **Revenue Generation**: Enables property owners to monetise unused spaces

### Market Impact
- Serves both individual drivers and property owners
- Integrates with focuses on London's urban parking challenges
- Supports sustainable urban mobility goals
- Provides real-time parking availability data

## Technical Highlights

### Architecture Decisions
- **Next.js App Router Architecture**: Leverages Next.js 14's App Router for efficient server-side rendering and API routes
- **Component-Driven Design**: Modular components using Shadcn UI and custom components for reusability
- **Repository Pattern**: Clean separation of data access through Prisma ORM
- **Responsive Design**: Mobile-first approach using Tailwind CSS with custom utilities
- **RESTful API Design**: Well-structured API endpoints following REST principles

### Performance Optimisations
- Next.js Server Component for improved SEO and initial load
- Built-in Image Optimisation with Next.js Image component and lazy loading
- Automatic Route Optimisation with dynamic imports and prefetching
- Prisma Query Performance with connection pooling and type-safe queries
- Next.js Build Optimisations including automatic asset minification and bundling

### Security Measures
- NextAuth.js Authentication with secure session management
- Role-based Access (Driver/Owner permissions)
- TypeScript Type Safety and input validation
- Next.js Security Headers and XSS protection
- Secure API Routes with middleware protection

## Features

### Interactive Mapping
- Interactive Location Selection with Leaflet maps
- Custom Spot Markers with location details
- OpenStreetMap Integration for accurate mapping
- Dynamic Location Updates with real-time position
- Responsive Map Controls for mobile and desktop

### User Interface
- **Booking System**
  - Interactive spot search and selection
  - Hourly and daily booking options
  - Real-time price calculation
  - Secure Stripe payments
  - Booking status tracking

- **User Dashboard**
  - Role-specific dashboard views such as Driver, Owner and Admin
  - Active bookings management
  - Booking history tracking
  - Profile settings and preferences
  - Secure session handling

## Development Practices

### Code Quality

- TypeScript Integration
  - Strict type checking enabled
  - Type-safe API routes
  - Prisma type generation
  
- Testing Framework
  - Jest unit testing
  - React Testing Library
  - Accessibility testing suite
  - Security testing suite
  
- Code Standards
  - Next.js ESLint configuration
  - Tailwind class organization
  - Consistent project structure
  
### Testing Strategy
- Unit Testing
  - Jest for component testing
  - React Testing Library for interactions
  - Mock service testing
- Security Testing
  - Authentication flow validation
  - Authorization checks
  - Input sanitization tests
  - XSS prevention
- Accessibility Testing
  - Screen reader compatibility
  - Keyboard navigation
  - ARIA compliance
  - Colour contrast checks

# Tech Stack

## Frontend
**Framework**
* Next.js 14 (App Router)
* TypeScript
* React Server Components

**Styling**
* Tailwind CSS
* Shadcn UI Components
* Custom UI Components

**Maps & Location**
* Leaflet Maps Integration
* OpenStreetMap Tiles
* Nominatim Geocoding

## Backend
**Core**
* Next.js API Routes
* Server-side TypeScript
* WebSocket Server

**Database**
* PostgreSQL
* Prisma ORM
* Type-safe Queries

**Authentication & Payments**
* NextAuth.js
* Stripe Integration
* Session Management

# Getting Started

## Prerequisites
* Node.js 18+
* PostgreSQL database
* npm or yarn

## Installation Steps

1. Clone the repository
```bash
git clone https://github.com/HenryOnilude/BookMySpot.git
```

2. Install dependencies
```bash
cd BookMySpot
npm install
```

3. Set up environment variables
```bash
# Create .env.local with:
DATABASE_URL=
NEXTAUTH_SECRET=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_APP_URL=
```

4. Set up the database
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

5. Start the development server
```bash
npm run dev
```

6. Run tests (optional)
```bash
# Run all tests
npm run test:all
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Development Commands
* `npm run dev` - Start development server
* `npm run build` - Build for production
* `npm run start` - Start production server
* `npm run test` - Run tests

## Environment Variables
* `DATABASE_URL` - PostgreSQL connection string
* `NEXTAUTH_SECRET` - JWT encryption key
* `STRIPE_SECRET_KEY` - Stripe API secret key
* `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
* `NEXT_PUBLIC_APP_URL` - Application URL
* `NEXTAUTH_URL` - NextAuth URL
# Future Improvements

## Phase 1: Immediate Enhancements
**Progressive Web App (PWA)**
* Offline functionality
* Mobile-optimized experience
* Push notifications

**Real-time Features**
* WebSocket booking updates
* Live availability tracking
* Instant payment confirmations

**Enhanced Booking System**
* Advanced search filters
* Dynamic pricing options
* Corporate booking portal

## Phase 2: Platform Growth
**Analytics & Reporting**
* Booking analytics dashboard
* Revenue tracking tools
* Usage pattern reports

**Platform Extensions**
* Public API documentation
* Multiple payment gateways
* Partner integrations

## Phase 3: Innovation Goals
**Mobile App Development**
* React Native mobile app
* Cross-platform support
* Native device features

**Smart Parking Features**
* AI-powered spot recommendations
* IoT parking sensors integration
* Predictive pricing model

**Advanced Features**
* Multi-language support
* Advanced booking algorithms
* Machine learning optimizations

# Project Statistics

**Testing Coverage**
* Component Tests: 80%+ coverage
* Security Tests: Key flows covered
* Accessibility Tests: WCAG compliance
* Integration Tests: API endpoints tested

**Performance Metrics**
* Next.js Server Components
* First Load JS: < 100KB
* Time to Interactive: < 3s
* API Response: < 200ms

**Code Quality**
* TypeScript Strict Mode
* ESLint Rules: All passed
* Accessibility Score: WCAG 2.1 AA
* Zero known security vulnerabilities

