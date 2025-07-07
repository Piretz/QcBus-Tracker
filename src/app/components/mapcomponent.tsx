// components/MapComponent.tsx
'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const busIcon = new Icon({
  iconUrl: '/bus.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const initialBusPositions = [
  { id: 1, lat: 14.6760, lng: 121.0437 },
  { id: 2, lat: 14.5995, lng: 120.9842 },
  { id: 3, lat: 14.5547, lng: 121.0244 },
  { id: 4, lat: 14.5356, lng: 120.9822 },
  { id: 5, lat: 14.6368, lng: 121.0446 },
  { id: 6, lat: 14.6762, lng: 121.0433 },
  { id: 7, lat: 14.6219, lng: 121.0509 },
  { id: 8, lat: 14.5266, lng: 121.0575 },
  { id: 9, lat: 14.6340, lng: 121.0773 },
  { id: 10, lat: 14.5715, lng: 121.0497 },
];

export default function MapComponent() {
  const [busPositions, setBusPositions] = useState(initialBusPositions);

  useEffect(() => {
    const interval = setInterval(() => {
      setBusPositions((prev) =>
        prev.map((bus) => ({
          ...bus,
          lat: bus.lat + (Math.random() - 0.5) * 0.001,
          lng: bus.lng + (Math.random() - 0.5) * 0.001,
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <MapContainer
      center={[14.6760, 121.0437]}
      zoom={12}
      scrollWheelZoom={true}
      className="h-full w-full"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
      />
      {busPositions
        .filter(
          (bus) =>
            bus.lat >= 14.6 &&
            bus.lat <= 14.75 &&
            bus.lng >= 121.0 &&
            bus.lng <= 121.13
        )
        .map((bus) => (
          <Marker key={bus.id} position={[bus.lat, bus.lng]} icon={busIcon}>
            <Popup>
              🚌 Bus #{bus.id}
              <br />
              Live location updated
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}
