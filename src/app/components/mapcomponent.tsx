'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Dynamically import react-leaflet components
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then(m => m.Polyline), { ssr: false });

// Mock QC route coordinates and stops
const routeCoordinates: [number, number][] = [
  [14.6760, 121.0437], // QC Hall
  [14.6815, 121.0566],
  [14.6891, 121.0582],
  [14.6955, 121.0621],
  [14.7037, 121.0800],
  [14.7112, 121.0754],
  [14.7193, 121.0617], // Katipunan
];

// List of bus icon files (place these in /public directory)
const busIcons = [
  '/bus.png',
  '/bus.png',
  '/bus.png',
  '/bus.png',
  '/bus.png'
];

// Helper to create a Leaflet icon from an image
const createBusIcon = (url: string) =>
  new Icon({
    iconUrl: url,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

type Bus = {
  id: number;
  position: [number, number];
  routeIndex: number;
  icon: Icon;
  eta: number; // Estimated time of arrival at the next stop
};

export default function MapComponent() {
  const [isClient, setIsClient] = useState(false);
  const [buses, setBuses] = useState<Bus[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Initialize buses with random icons and positions
    const initialBuses: Bus[] = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      position: routeCoordinates[i % routeCoordinates.length],
      routeIndex: i % routeCoordinates.length,
      icon: createBusIcon(busIcons[i % busIcons.length]),
      eta: Math.floor(Math.random() * 5) + 2, // Random ETA (2 to 6 minutes)
    }));
    setBuses(initialBuses);

    const interval = setInterval(() => {
      setBuses(prev =>
        prev.map(bus => {
          const nextIndex = (bus.routeIndex + 1) % routeCoordinates.length;
          return {
            ...bus,
            position: routeCoordinates[nextIndex],
            routeIndex: nextIndex,
            eta: Math.floor(Math.random() * 5) + 2, // Randomize ETA every update
          };
        })
      );
    }, 4000); // Move every 4 seconds

    return () => clearInterval(interval);
  }, [isClient]);

  if (!isClient) return <div className="h-[600px]">Loading map...</div>;

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-md">
      <MapContainer center={[14.686, 121.06]} zoom={13} scrollWheelZoom={true} className="h-full w-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />

        {/* Route path */}
        <Polyline
          positions={routeCoordinates}
          pathOptions={{ color: 'blue', weight: 5, dashArray: '6 8', opacity: 0.7 }}
        />

        {/* Live-moving buses with custom icons */}
        {buses.map(bus => (
          <Marker key={bus.id} position={bus.position} icon={bus.icon}>
            <Popup>
              🚌 Bus #{bus.id}
              <br />
              Heading to: {routeCoordinates[(bus.routeIndex + 1) % routeCoordinates.length].join(', ')}
              <br />
              ETA: {bus.eta} minutes
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
