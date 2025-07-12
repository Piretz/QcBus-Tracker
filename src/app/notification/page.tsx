// NotificationsPage.tsx
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

const fetchBusLocations = (): Promise<Bus[]> =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          lat: 14.651 + Math.random() * 0.002,
          lng: 121.049 + Math.random() * 0.002,
          route: 'UP Diliman – City Hall',
        },
        {
          id: 2,
          lat: 14.654 + Math.random() * 0.002,
          lng: 121.06 + Math.random() * 0.002,
          route: 'Quezon Ave – Welcome Rotonda',
        },
        {
          id: 3,
          lat: 14.646 + Math.random() * 0.002,
          lng: 121.05 + Math.random() * 0.002,
          route: 'QC Hall – East Ave',
        },
      ]);
    }, 1000);
  });

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

function estimateETA(distanceKm: number, traffic: 'light' | 'moderate' | 'heavy') {
  const speedKph = traffic === 'light' ? 30 : traffic === 'moderate' ? 20 : 10;
  return Math.max(1, Math.ceil((distanceKm / speedKph) * 60));
}

const destination: Location = {
  lat: 14.6548,
  lng: 121.0647,
};

function getTrafficCondition(): 'light' | 'moderate' | 'heavy' {
  const hr = new Date().getHours();
  if ((hr >= 7 && hr <= 10) || (hr >= 17 && hr <= 20)) return 'heavy';
  if ((hr >= 6 && hr < 7) || (hr > 10 && hr <= 16)) return 'moderate';
  return 'light';
}

function triggerFeedback(kind: 'alert' | 'bus') {
  if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
  const src = kind === 'alert' ? '/alert.mp3' : '/notification.mp3';
  const audio = new Audio(src);
  audio.play().catch(() => {});
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [notifiedIds, setNotifiedIds] = useState<Set<number>>(new Set());
  const [lastTraffic, setLastTraffic] = useState<'light' | 'moderate' | 'heavy' | null>(null);

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      alert('Geolocation is not supported or enabled on your browser.');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      pos => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      err => console.error('Location error:', err),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    if (!userLocation) return;

    const interval = setInterval(async () => {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const currentTraffic = getTrafficCondition();

      if (currentTraffic !== lastTraffic) {
        setNotifications(prev => [
          {
            id: Date.now(),
            message: `🚦 Traffic update: ${currentTraffic.toUpperCase()} traffic conditions.`,
            type: 'alert',
            time: now,
          },
          ...prev,
        ]);
        setLastTraffic(currentTraffic);
        triggerFeedback('alert');
      }

      const buses = await fetchBusLocations();
      const nextNotified = new Set(notifiedIds);

      buses.forEach(bus => {
        const userDist = calculateDistanceKm(userLocation.lat, userLocation.lng, bus.lat, bus.lng);
        const destDist = calculateDistanceKm(destination.lat, destination.lng, bus.lat, bus.lng);
        const etaToUser = estimateETA(userDist, currentTraffic);
        const etaToDest = estimateETA(destDist, currentTraffic);

        const ID_NEAR = bus.id;
        const ID_ON_WAY = bus.id + 2000;
        const ID_DEST = bus.id + 4000;

        if (userDist > 0.5 && userDist <= 1.2 && !notifiedIds.has(ID_ON_WAY)) {
          setNotifications(prev => [
            {
              id: Date.now(),
              message: `🚌 Bus #${bus.id} is on the way – ETA ${etaToUser} min\n🗺️ ${bus.route}`,
              type: 'bus',
              time: now,
            },
            ...prev,
          ]);
          nextNotified.add(ID_ON_WAY);
          triggerFeedback('bus');
        }

        if (userDist <= 0.5 && !notifiedIds.has(ID_NEAR)) {
          setNotifications(prev => [
            {
              id: Date.now(),
              message: `📍 Bus #${bus.id} is very close! ETA ${etaToUser} min\n🗺️ ${bus.route}`,
              type: 'bus',
              time: now,
            },
            ...prev,
          ]);
          nextNotified.add(ID_NEAR);
          triggerFeedback('bus');
        }

        if (destDist <= 0.8 && !notifiedIds.has(ID_DEST)) {
          setNotifications(prev => [
            {
              id: Date.now(),
              message: `🏁 Bus #${bus.id} is nearing your destination – ETA ${etaToDest} min\n🗺️ ${bus.route}`,
              type: 'bus',
              time: now,
            },
            ...prev,
          ]);
          nextNotified.add(ID_DEST);
          triggerFeedback('bus');
        }
      });

      setNotifications(prev => prev.slice(0, 15));
      setNotifiedIds(nextNotified);
    }, 10000);

    return () => clearInterval(interval);
  }, [userLocation, notifiedIds, lastTraffic]);

  return (
    <>
      <Navbar />
      <main className="min-h-[85vh] bg-gradient-to-br from-blue-50 to-white px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-blue-800 mb-6 flex justify-center items-center gap-2">
            <BellRing className="text-yellow-400" size={34} />
            Live Notifications
          </h1>

          <div className="text-xs text-gray-500 mb-4">
            {userLocation
              ? `📍 Tracking at (${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)})`
              : '📍 Waiting for location permission…'}
          </div>

          {notifications.length === 0 ? (
            <div className="text-gray-600 text-sm mt-8">
              No alerts yet – we’ll let you know once something happens nearby!
            </div>
          ) : (
            <ul className="mt-8 space-y-4 text-left">
              {notifications.map(note => (
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
