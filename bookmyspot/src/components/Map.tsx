'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Location } from '@/types/dashboard';

interface MapProps {
  onLocationSelect: (location: Location) => void;
  onError?: (error: string) => void;
  className?: string;
}

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: '/marker-icon.png',
  iconRetinaUrl: '/marker-icon-2x.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// UK Bounds
const UK_BOUNDS = {
  northEast: { lat: 58.7, lng: 1.8 },  // Northeast corner of UK
  southWest: { lat: 49.9, lng: -8.2 }, // Southwest corner of UK
};

function MapEvents({ onLocationSelect, onError }: { onLocationSelect: (location: Location) => void; onError?: (error: string) => void }) {
  const map = useMap();
  
  useEffect(() => {
    // Set bounds for UK
    const bounds = L.latLngBounds(
      L.latLng(UK_BOUNDS.southWest.lat, UK_BOUNDS.southWest.lng),
      L.latLng(UK_BOUNDS.northEast.lat, UK_BOUNDS.northEast.lng)
    );
    
    map.setMaxBounds(bounds);
    map.fitBounds(bounds);
    
    const handleClick = async (e: L.LeafletMouseEvent) => {
      try {
        const { lat, lng } = e.latlng;
        
        // Check if clicked location is within UK bounds
        if (!bounds.contains([lat, lng])) {
          throw new Error('Selected location must be within the United Kingdom');
        }
        
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&countrycodes=gb`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch location data');
        }
        
        const data = await response.json();
        
        // Verify the location is in the UK
        if (!data.address || data.address.country_code?.toLowerCase() !== 'gb') {
          throw new Error('Selected location must be within the United Kingdom');
        }
        
        onLocationSelect({
          lat,
          lng,
          address: data.display_name
        });
      } catch (error) {
        console.error('Error getting location:', error);
        onError?.(error instanceof Error ? error.message : 'Failed to get location');
      }
    };

    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [map, onLocationSelect, onError]);

  return null;
}

export function Map({ onLocationSelect, onError, className = '' }: MapProps) {
  const mapRef = useRef<L.Map>(null);

  return (
    <div className={`h-80 w-full rounded-lg overflow-hidden ${className}`}>
      <div className="h-full w-full" ref={mapRef}>
        <MapContainer
          center={[54.5, -2]} // Center of UK
          zoom={6}
          minZoom={5}
          maxZoom={18}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapEvents onLocationSelect={onLocationSelect} onError={onError} />
        </MapContainer>
      </div>
    </div>
  );
}
