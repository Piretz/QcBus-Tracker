'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import 'leaflet/dist/leaflet.css';

const busIcon = new Icon({
  iconUrl: '/bus.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const initialBusPositions = [
  { id: 1, lat: 14.6760, lng: 121.0437 }, // QC
  { id: 2, lat: 14.5995, lng: 120.9842 }, // Manila
  { id: 3, lat: 14.5547, lng: 121.0244 }, // Makati
  { id: 4, lat: 14.5356, lng: 120.9822 }, // Pasay
  { id: 5, lat: 14.6368, lng: 121.0446 }, // San Juan
  { id: 6, lat: 14.6762, lng: 121.0433 }, // Cubao
  { id: 7, lat: 14.6219, lng: 121.0509 }, // EDSA
  { id: 8, lat: 14.5266, lng: 121.0575 }, // Paranaque
  { id: 9, lat: 14.6340, lng: 121.0773 }, // Marikina
  { id: 10, lat: 14.5715, lng: 121.0497 }, // Mandaluyong
];

export default function MapPage() {
  const [busPositions, setBusPositions] = useState(initialBusPositions);

  // Simulate movement
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
    <>
      <Navbar />
      <main className="min-h-[85vh] px-6 py-10 bg-gradient-to-br from-blue-100 to-white">
        <div className="max-w-6xl mx-auto text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-2">🗺️ Real-Time Bus Tracker</h1>
          <p className="text-gray-600 text-sm">
            See where all Libreng Sakay QC buses are located in Metro Manila.
          </p>
        </div>

        <div className="h-[600px] w-full rounded-xl overflow-hidden shadow-xl border border-blue-200">
         <MapContainer
  center={[14.6760, 121.0437]} // QC center
  zoom={12}
  scrollWheelZoom={true}
  className="h-full w-full"
>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
  />

  {/* ✅ Only display markers in Quezon City */}
 {busPositions
  .filter((bus) =>
    // Approximate bounds for Quezon City
    bus.lat >= 14.60 && bus.lat <= 14.75 &&
    bus.lng >= 121.00 && bus.lng <= 121.13
  )
  .map((bus) => (
    <Marker key={bus.id} position={[bus.lat, bus.lng]} icon={busIcon}>
      <Popup>
        🚌 Bus #{bus.id} <br />
        Live location updated
      </Popup>
    </Marker>
    ))}
</MapContainer>

        </div>

        <p className="text-sm text-center text-gray-500 mt-4">
          Last updated: {new Date().toLocaleTimeString()}
        </p>
      </main>
      <Footer />
    </>
  );
}
