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

// Coordinates for QC route
const routeCoordinates: [number, number][] = [
  [14.6994, 121.0359],
  [14.6933, 121.0395],
  [14.6868, 121.0426],
  [14.6760, 121.0437],
  [14.6700, 121.0505],
  [14.6549, 121.0526],
  [14.6474, 121.0563],
  [14.6396, 121.0560],
  [14.6312, 121.0581],
  [14.6255, 121.0611],
  [14.6192, 121.0698],
  [14.6130, 121.0805],
];

// Custom station icon
const stationIcon = new Icon({
  iconUrl: '/mark.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

type Bus = {
  id: number;
  position: [number, number];
  routeIndex: number;
  eta: number;
};

export default function MapComponent() {
  const [isClient, setIsClient] = useState(false);
  const [buses, setBuses] = useState<Bus[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const initialBuses: Bus[] = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      position: routeCoordinates[i % routeCoordinates.length],
      routeIndex: i % routeCoordinates.length,
      eta: Math.floor(Math.random() * 5) + 2,
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
            eta: Math.floor(Math.random() * 5) + 2,
          };
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isClient]);

  if (!isClient) return <div className="h-[600px]">Loading map...</div>;

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-md">
      <MapContainer center={[14.686, 121.06]} zoom={13} scrollWheelZoom className="h-full w-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />

        {/* Dashed QC Route */}
        <Polyline
          positions={routeCoordinates}
          pathOptions={{ color: 'blue', weight: 5, dashArray: '6 8', opacity: 0.7 }}
        />

        {/* Station Markers with custom icon */}
        {routeCoordinates.map(([lat, lng], index) => (
          <Marker key={`stop-${index}`} position={[lat, lng]} icon={stationIcon}>
            <Popup>Bus Stop #{index + 1}</Popup>
          </Marker>
        ))}

        {/* Optional: Real-time bus tracker with blue dot or emoji */}
        {buses.map(bus => (
          <Marker key={bus.id} position={bus.position}>
            <Popup>
              🚌 Bus #{bus.id}
              <br />
              Next stop: {routeCoordinates[(bus.routeIndex + 1) % routeCoordinates.length].join(', ')}
              <br />
              ETA: {bus.eta} minutes
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
