'use client';

import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Bus, RefreshCcw, MapPin, Clock } from "lucide-react";

type Stop = {
  name: string;
  arrivalTimestamp: number;
};

type Route = {
  id: number;
  name: string;
  stops: Stop[];
};

const staticRoutes = [
  {
    id: 1,
    name: 'QC Hall to Cubao',
    stops: ['QC Hall', 'EDSA-Kamuning', 'Cubao Terminal']
  },
  {
    id: 2,
    name: 'QC Hall to Litex/IBP',
    stops: ['QC Hall', 'Commonwealth', 'Litex', 'IBP Road']
  },
  {
    id: 3,
    name: 'Welcome Rotonda to Katipunan',
    stops: ['Welcome Rotonda', 'España', 'Aurora Blvd', 'Katipunan']
  }
];

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<number | null>(1);
  const [isClosed, setIsClosed] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());


const generateRoutes = () => {
  const now = Date.now();

  const closingTime = new Date();
  closingTime.setHours(21, 0, 0, 0);

  const closed = now >= closingTime.getTime();
  setIsClosed(closed);

  if (closed) {
    const offlineRoutes: Route[] = staticRoutes.map(route => ({
      ...route,
      stops: route.stops.map(stop => ({
        name: stop,
        arrivalTimestamp: 0,
      }))
    }));
    setRoutes(offlineRoutes);
    return;
  }

  const intervalPerStop = 3 * 60 * 1000; // 3 minutes in milliseconds

  const liveRoutes: Route[] = staticRoutes.map(route => {
    return {
      ...route,
      stops: route.stops.map((stop, index) => ({
        name: stop,
        arrivalTimestamp: now + (index + 1) * intervalPerStop,
      })),
    };
  });

  setRoutes(liveRoutes);

  if (selectedRouteId === null && liveRoutes.length > 0) {
    setSelectedRouteId(liveRoutes[0].id);
  }
};

  // Initial generation + refresh every 30s
  useEffect(() => {
    generateRoutes();
    const refresh = setInterval(generateRoutes, 30000);
    return () => clearInterval(refresh);
  }, []);

  // Real-time clock & closure check every second
  useEffect(() => {
    const tick = setInterval(() => {
      const now = Date.now();
      setCurrentTime(now);

      const closing = new Date();
      closing.setHours(21, 0, 0, 0);

      const closed = now >= closing.getTime();
      setIsClosed(closed);
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  const selectedRoute = routes.find(route => route.id === selectedRouteId);

  const formatArrivalTime = (timestamp: number): string => {
    if (timestamp === 0) return "--:--";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatTimeDiff = (timestamp: number): string => {
    const diffMs = timestamp - currentTime;
    const minutes = Math.max(0, Math.floor(diffMs / 60000));
    return `${minutes} min${minutes !== 1 ? 's' : ''}`;
  };

  return (
    <>
      <Navbar />
      <main className="min-h-[85vh] bg-gradient-to-br from-blue-100 to-white px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-blue-800 mb-2 flex items-center justify-center gap-2">
            <Bus className="w-8 h-8 text-blue-600" /> Libreng Sakay Tracker
          </h1>
          <p className="text-gray-700 mb-8 text-base md:text-lg max-w-xl mx-auto">
            View your bus route below and track when it arrives — updated in real-time every 30 seconds.
          </p>

          {/* Route Selector */}
          <div className="mb-8 text-left">
            <label className="block mb-2 text-sm font-medium text-gray-800">Choose your route:</label>
            <select
              disabled={routes.length === 0}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={selectedRouteId ?? ''}
              onChange={(e) => setSelectedRouteId(Number(e.target.value))}
            >
              {routes.map((route) => (
                <option key={route.id} value={route.id}>
                  {route.name}
                </option>
              ))}
            </select>
          </div>

          {/* Refresh Button */}
    <div className="flex justify-end mb-6">
  <button
    onClick={generateRoutes}
    disabled={isClosed}
    className={`group relative inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 ring-offset-2 shadow-xl ${
      isClosed
        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
        : 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 active:scale-[0.97]'
    } backdrop-blur-md`}
    style={{
      boxShadow: isClosed
        ? 'none'
        : '0 4px 14px rgba(59, 130, 246, 0.4), 0 2px 4px rgba(0,0,0,0.1)',
    }}
  >
    {/* Spinning Icon on Hover */}
    <RefreshCcw
      className={`w-5 h-5 transition-transform duration-500 ${
        isClosed ? 'text-gray-500' : 'group-hover:rotate-[360deg]'
      }`}
    />
    <span className="relative z-10">Refresh Now</span>

    {/* Glow ring on hover */}
    {!isClosed && (
      <span className="absolute inset-0 rounded-2xl ring-1 ring-white/10 group-hover:ring-white/20 transition-all duration-300 pointer-events-none" />
    )}
  </button>
</div>



          {/* Route Display */}
          {selectedRoute && (
  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xl text-left transition-all duration-300">
    <h2 className="text-2xl font-bold text-blue-700 mb-2 flex items-center gap-2">
      🛣️ {selectedRoute.name}
    </h2>

    {/* Closed notice */}
    {isClosed && (
      <div className="text-sm text-red-600 font-semibold mb-4">
        🕘 Bus operations have ended for today. Live tracking is offline.
      </div>
    )}

    {/* Stops */}
    <ol className="space-y-4">
      {selectedRoute.stops.map((stop, index) => (
        <li
          key={index}
          className="bg-blue-50 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between shadow-sm border border-blue-100 hover:shadow-md transition"
        >
          <div className="flex items-center gap-3 mb-2 sm:mb-0">
            <MapPin className="w-5 h-5 text-blue-500" />
            <span className="text-gray-900 font-medium text-base">{stop.name}</span>
          </div>

          {/* Time Display for Each Stop */}
          <div className="text-right text-sm sm:text-base text-green-700 space-y-0 sm:space-y-0 sm:flex sm:flex-col sm:items-end font-semibold">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-green-600" />
              <span>
                {isClosed || stop.arrivalTimestamp === 0
                  ? 'Closed'
                  : formatTimeDiff(stop.arrivalTimestamp)}
              </span>
            </div>
            <div className="text-xs text-gray-600">
              {isClosed || stop.arrivalTimestamp === 0
                ? 'No trips after 9 PM'
                : `Arrives at ${formatArrivalTime(stop.arrivalTimestamp)}`}
            </div>
          </div>
        </li>
      ))}
    </ol>

    <p className="text-xs text-gray-400 mt-6 text-right">
      {isClosed ? 'Live tracking unavailable after 9 PM' : 'Auto-refreshes every 30 seconds'}
    </p>
  </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
