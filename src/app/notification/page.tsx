'use client';

import { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { BellRing, Clock, BusFront, AlertTriangle } from 'lucide-react';

interface Notification {
  id: number;
  message: string;
  type: 'bus' | 'alert';
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

// Simulated live API fetch
const fetchBusLocations = (): Promise<Bus[]> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, lat: 14.651 + Math.random() * 0.002, lng: 121.049 + Math.random() * 0.002, route: 'UP Diliman - City Hall' },
        { id: 2, lat: 14.654 + Math.random() * 0.002, lng: 121.060 + Math.random() * 0.002, route: 'Quezon Ave - Welcome Rotonda' },
        { id: 3, lat: 14.646 + Math.random() * 0.002, lng: 121.050 + Math.random() * 0.002, route: 'QC Hall - East Ave' },
      ]);
    }, 1000);
  });



function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (val: number) => (val * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Simulated destination (you can allow users to set this later)
const destination: Location = {
  lat: 14.6548,
  lng: 121.0647,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [notifiedBusIds, setNotifiedBusIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => console.error('Location error:', err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  useEffect(() => {
    if (!userLocation) return;

    const interval = setInterval(async () => {
      const buses = await fetchBusLocations();
      const newNotified = new Set(notifiedBusIds);

      buses.forEach((bus) => {
        const userDistance = calculateDistanceKm(userLocation.lat, userLocation.lng, bus.lat, bus.lng);
        const destDistance = calculateDistanceKm(destination.lat, destination.lng, bus.lat, bus.lng);
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Near current location
        if (userDistance <= 1.0 && !notifiedBusIds.has(bus.id)) {
          setNotifications((prev) => [
            {
              id: Date.now(),
              message: `🚌 Bus #${bus.id} is near your current location!\n🗺️ ${bus.route}`,
              type: 'bus',
              time: now,
            },
            ...prev,
          ]);
          newNotified.add(bus.id);
        }

        // Near destination
        if (destDistance <= 0.8 && !notifiedBusIds.has(bus.id + 1000)) {
          setNotifications((prev) => [
            {
              id: Date.now(),
              message: `📍 Bus #${bus.id} is approaching your destination!\n🗺️ ${bus.route}`,
              type: 'bus',
              time: now,
            },
            ...prev,
          ]);
          newNotified.add(bus.id + 1000);
        }
      });

      setNotifiedBusIds(newNotified);
    }, 10000);

    return () => clearInterval(interval);
  }, [userLocation, notifiedBusIds]);

  

  return (
    <>
      <Navbar />
      <main className="min-h-[85vh] bg-gradient-to-br from-blue-50 to-white px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-blue-800 mb-6 flex justify-center items-center gap-2">
            <BellRing className="text-yellow-400" size={34} />
            Live Notifications
          </h1>

          {notifications.length === 0 ? (
            <div className="text-gray-600 text-sm mt-8">
              No alerts yet. We’ll notify you once a bus is near your location or destination!
            </div>
          ) : (
            <ul className="mt-8 space-y-4 text-left">
              {notifications.map((note) => (
                <li
                  key={note.id}
                  className={`rounded-xl border shadow-md p-4 flex gap-4 items-start transition ${
                    note.type === 'alert'
                      ? 'border-red-300 bg-red-50'
                      : 'border-blue-200 bg-white hover:shadow-lg'
                  }`}
                >
                  <div className="text-2xl">
                    {note.type === 'alert' ? (
                      <AlertTriangle className="text-red-500" />
                    ) : (
                      <BusFront className="text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 whitespace-pre-line font-medium">{note.message}</p>
                    <div className="text-xs text-gray-500 flex items-center mt-2">
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
