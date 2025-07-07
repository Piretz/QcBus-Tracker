'use client';

import { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { BellRing, Clock } from 'lucide-react';

interface Notification {
  id: number;
  message: string;
  time: string;
}

interface Location {
  lat: number;
  lng: number;
}

interface Bus {
  id: number;
  lat: number;
  lng: number;
  route: string;
}

// 🚌 Simulated real-time bus list (can be replaced with live API data)
const buses: Bus[] = [
  { id: 1, lat: 14.651, lng: 121.049, route: 'UP Diliman - City Hall' },
  { id: 2, lat: 14.654, lng: 121.060, route: 'Quezon Ave - Welcome Rotonda' },
  { id: 3, lat: 14.646, lng: 121.050, route: 'QC Hall - East Ave' },
];

// 📍 Distance calculator
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (val: number) => (val * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [notifiedBusIds, setNotifiedBusIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.error('Location error:', err);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  useEffect(() => {
    if (!userLocation) return;

    const interval = setInterval(() => {
      const newNotified = new Set(notifiedBusIds);

      buses.forEach((bus) => {
        const distance = calculateDistanceKm(userLocation.lat, userLocation.lng, bus.lat, bus.lng);

        if (distance <= 1.0 && !notifiedBusIds.has(bus.id)) {
          const now = new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });

          const message = `🚌 Bus #${bus.id} is near you!\n🗺️ Route: ${bus.route}\n📍 Location: (${bus.lat.toFixed(4)}, ${bus.lng.toFixed(4)})`;

          setNotifications((prev) => [
            {
              id: Date.now(),
              message,
              time: now,
            },
            ...prev,
          ]);

          newNotified.add(bus.id);
        }
      });

      setNotifiedBusIds(newNotified);
    }, 10000); // every 10 seconds

    return () => clearInterval(interval);
  }, [userLocation, notifiedBusIds]);

  return (
    <>
      <Navbar />
      <main className="min-h-[85vh] bg-gradient-to-br from-blue-100 to-white px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-blue-800 mb-6 flex justify-center items-center gap-2">
            <BellRing className="text-yellow-400" size={34} />
            Notifications
          </h1>

          {notifications.length === 0 ? (
            <div className="text-gray-600 text-sm mt-8">
              No alerts yet. We’ll notify you once a bus is near your location!
            </div>
          ) : (
            <ul className="mt-8 space-y-4 text-left">
              {notifications.map((note) => (
                <li
                  key={note.id}
                  className="bg-white border border-blue-100 shadow-sm rounded-xl p-4 flex items-start gap-4 transition duration-300 hover:shadow-md"
                >
                  <div className="text-blue-600 text-xl">📢</div>
                  <div className="flex-1">
                    <p className="text-gray-800 whitespace-pre-line font-medium">
                      {note.message}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 mt-2">
                      <Clock className="w-4 h-4 mr-1" />
                      {note.time}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
