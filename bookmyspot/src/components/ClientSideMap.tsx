'use client';

import { useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import type { MapProps } from '@/types/dashboard';
import { useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Dynamically import MapContainer with loading state
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { 
    ssr: false,
    loading: () => (
      <div className="h-80 w-full rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
          <p className="mt-2 text-gray-600">Loading map...</p>
        </div>
      </div>
    )
  }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

// Create a client-side only marker component
const DynamicMarker = dynamic(
  () => Promise.resolve(({ position }: { position: { lat: number; lng: number } }) => {
    // Import Leaflet only on client side
    const L = require('leaflet');
    
    // Create icon using useMemo to avoid recreating on every render
    const icon = useMemo(() => L.divIcon({
      html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-blue-500">
        <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
      </svg>`,
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    }), []);

    return <Marker position={position} icon={icon} />;
  }),
  { ssr: false }
);

// Wrap MapEvents in dynamic import to avoid SSR issues
const MapEvents = dynamic(
  () => Promise.resolve(({ onClick }: { onClick?: (lat: number, lng: number) => void }) => {
    const map = useMap();

    useEffect(() => {
      if (!onClick) return;

      const handleClick = (e: any) => {
        onClick(e.latlng.lat, e.latlng.lng);
      };

      map.on('click', handleClick);
      return () => {
        map.off('click', handleClick);
      };
    }, [map, onClick]);

    return null;
  }),
  { ssr: false }
);

const MapClickHandler = dynamic(
  () => Promise.resolve(({ onClick }: { onClick?: (lat: number, lng: number) => void }) => {
    const map = useMap();

    useEffect(() => {
      if (!onClick) return;

      const handleClick = (e: any) => {
        onClick(e.latlng.lat, e.latlng.lng);
      };

      map.on('click', handleClick);
      return () => {
        map.off('click', handleClick);
      };
    }, [map, onClick]);

    return null;
  }),
  { ssr: false }
);

export default function ClientSideMap({ center, zoom = 13, onClick, marker }: MapProps) {
  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {marker && <DynamicMarker position={marker} />}
        {onClick && <MapClickHandler onClick={onClick} />}
      </MapContainer>
    </div>
  );
}
