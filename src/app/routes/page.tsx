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

  const getRandomMinutes = () => Math.floor(Math.random() * 4) + 2;

  const generateRoutes = () => {
    const now = new Date();
    const currentTime = now.getTime();

    const closingTime = new Date();
    closingTime.setHours(21, 0, 0, 0);

    const closed = currentTime >= closingTime.getTime();
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

    const getFutureTime = (offsetMinutes: number) => {
      const timestamp = currentTime + offsetMinutes * 60 * 1000;
      return timestamp < closingTime.getTime() ? timestamp : null;
    };

    const liveRoutes: Route[] = staticRoutes.map(route => ({
      ...route,
      stops: route.stops
        .map((stop, i) => ({
          name: stop,
          arrivalTimestamp: getFutureTime((i + 1) * getRandomMinutes()),
        }))
        .filter((stop): stop is Stop => stop.arrivalTimestamp !== null)
    })).filter(route => route.stops.length > 0);

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
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg shadow-md transition-all text-sm ${
                isClosed
                  ? 'bg-gray-400 text-white hover:bg-gray-500'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <RefreshCcw className="w-4 h-4" /> Refresh Now
            </button>
          </div>

          {/* Route Display */}
          {selectedRoute && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xl text-left transition-all duration-300">
              <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2">
                🛣️ {selectedRoute.name}
              </h2>

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
                        <span>{formatTimeDiff(stop.arrivalTimestamp)}</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        Arrives at {formatArrivalTime(stop.arrivalTimestamp)}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>

              {/* Final ETA */}
              {!isClosed &&
                selectedRoute.stops.length > 0 &&
                selectedRoute.stops[selectedRoute.stops.length - 1].arrivalTimestamp > 0 && (
                  <div className="mt-8 text-right">
                    <h3 className="text-sm text-blue-800 font-semibold">🕒 Estimated Arrival at Final Destination:</h3>
                    <p className="text-base font-bold text-green-700">
                      {formatArrivalTime(selectedRoute.stops[selectedRoute.stops.length - 1].arrivalTimestamp)}
                    </p>
                  </div>
              )}

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
