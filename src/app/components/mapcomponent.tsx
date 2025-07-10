'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Icon, divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 🧭 Dynamic Leaflet components
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then(m => m.Polyline), { ssr: false });

// 🗺️ Route coordinates
const route1: [number, number][] = [
  [14.6994, 121.0359], [14.6933, 121.0395], [14.6868, 121.0426], [14.6760, 121.0437],
  [14.6700, 121.0505], [14.6549, 121.0526], [14.6474, 121.0563], [14.6396, 121.0560],
  [14.6312, 121.0581], [14.6255, 121.0611], [14.6192, 121.0698], [14.6130, 121.0805],
];

const route2: [number, number][] = [
  [14.6130, 121.0805], [14.6100, 121.0900], [14.6050, 121.0950], [14.6000, 121.1000],
];

const route3: [number, number][] = [
  [14.6549, 121.0526], [14.6580, 121.0600], [14.6620, 121.0670], [14.6660, 121.0730],
];

const allRoutes = [route1, route2, route3];

// 🗺️ Station icon
const stationIcon = new Icon({
  iconUrl: '/mark.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// 🚌 Animated bus icon generator
const generateBusIcon = (id: number) =>
  divIcon({
    html: `<div class="bus-marker">🚌 <span>Bus #${id}</span></div>`,
    className: '',
    iconSize: [60, 24],
    iconAnchor: [30, 12],
  });

// 👤 Glowing user icon
const userIcon = divIcon({
  html: `<div class="user-location-marker"></div>`,
  className: '',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// 🧾 Bus type
type Bus = {
  id: number;
  position: [number, number];
  routeIndex: number;
  eta: number;
};

export default function MapComponent() {
  const [isClient, setIsClient] = useState(false);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    setIsClient(typeof window !== 'undefined');
  }, []);

  // 🚍 Simulate real-time bus movement on route1 only
  useEffect(() => {
    if (!isClient) return;

    const initialBuses = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      position: route1[i],
      routeIndex: i,
      eta: Math.floor(Math.random() * 5) + 2,
    }));

    setBuses(initialBuses);

    const interval = setInterval(() => {
      setBuses(prev =>
        prev.map(bus => {
          const nextIndex = (bus.routeIndex + 1) % route1.length;
          return {
            ...bus,
            position: route1[nextIndex],
            routeIndex: nextIndex,
            eta: Math.floor(Math.random() * 5) + 2,
          };
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isClient]);

  // 📍 Track user location
  useEffect(() => {
    if (!isClient || !navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      pos => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
      },
      err => console.error('Geolocation error:', err),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isClient]);

  if (!isClient) return <div className="h-[600px]">Loading map...</div>;

  return (
    <>
      <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-md">
        <MapContainer center={[14.686, 121.06]} zoom={13} scrollWheelZoom className="h-full w-full">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          />

          {/* 🚏 All Bus Routes */}
          {allRoutes.map((coords, i) => (
            <Polyline
              key={`route-${i}`}
              positions={coords}
              pathOptions={{ color: 'blue', weight: 5, dashArray: '6 8', opacity: 0.7 }}
            />
          ))}

          {/* 🛑 Station Markers for All Routes */}
          {allRoutes.flat().map(([lat, lng], index) => (
            <Marker key={`stop-${index}`} position={[lat, lng]} icon={stationIcon}>
              <Popup>Bus Stop #{index + 1}</Popup>
            </Marker>
          ))}

          {/* 🚌 Animated Bus Markers (route1 only) */}
          {buses.map(bus => (
            <Marker key={bus.id} position={bus.position} icon={generateBusIcon(bus.id)}>
              <Popup>
                🚌 Bus #{bus.id}<br />
                Next stop: {route1[(bus.routeIndex + 1) % route1.length].join(', ')}<br />
                ETA: {bus.eta} minutes
              </Popup>
            </Marker>
          ))}

          {/* 👤 User Location Marker */}
          {userLocation && (
            <Marker position={userLocation} icon={userIcon}>
              <Popup>You are here</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* 🌐 Marker Animations */}
      <style jsx global>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 10px rgba(0, 123, 255, 0.7);
          }
          50% {
            transform: scale(1.2);
            box-shadow: 0 0 20px rgba(0, 123, 255, 0.9);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 10px rgba(0, 123, 255, 0.7);
          }
        }

        .user-location-marker {
          width: 20px;
          height: 20px;
          background: #007bff;
          border-radius: 50%;
          border: 3px solid white;
          animation: pulse 1.5s infinite;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .bus-marker {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          background: #34d399;
          border-radius: 12px;
          color: white;
          font-weight: bold;
          font-size: 12px;
          box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
          animation: bounce 1.5s infinite;
        }
      `}</style>
    </>
  );
}
