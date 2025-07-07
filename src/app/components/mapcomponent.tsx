'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then(m => m.Polyline), { ssr: false });

// Bus icon
const busIcon = new Icon({
  iconUrl: '/bus.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// Predefined route inside Quezon City (mocked)
const routeCoordinates: [number, number][] = [
  [14.6760, 121.0437], // QC Hall
  [14.6815, 121.0566],
  [14.6891, 121.0582],
  [14.6955, 121.0621],
  [14.7037, 121.0800],
  [14.7112, 121.0754],
  [14.7193, 121.0617], // Katipunan area
];

type Bus = {
  id: number;
  position: [number, number];
  routeIndex: number;
};

export default function MapComponent() {
  const [buses, setBuses] = useState<Bus[]>([
    { id: 1, position: routeCoordinates[0], routeIndex: 0 },
    { id: 2, position: routeCoordinates[2], routeIndex: 2 },
  ]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const interval = setInterval(() => {
      setBuses(prev =>
        prev.map(bus => {
          const nextIndex = (bus.routeIndex + 1) % routeCoordinates.length;
          return {
            ...bus,
            position: routeCoordinates[nextIndex],
            routeIndex: nextIndex,
          };
        })
      );
    }, 4000); // Update every 4s (simulate real-time)

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-md">
      <MapContainer center={[14.686, 121.06]} zoom={13} scrollWheelZoom={true} className="h-full w-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />

        {/* Route line */}
        <Polyline
          positions={routeCoordinates}
          pathOptions={{ color: 'blue', weight: 5, dashArray: '6 8', opacity: 0.7 }}
        />

        {/* Live-moving buses */}
        {buses.map(bus => (
          <Marker key={bus.id} position={bus.position} icon={busIcon}>
            <Popup>
              🚌 Bus #{bus.id}
              <br />
              Moving along route
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
