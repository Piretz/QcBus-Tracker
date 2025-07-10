'use client';

import { useEffect, useState, useCallback } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Bus, MapPin, Clock } from "lucide-react";

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

const calculateETA = (
  baseTime: number,
  distanceKm: number,
  speedKmh: number,
  delayPerStop: number,
  trafficDelay: number
) => {
  const travelTimeMin = (distanceKm / speedKmh) * 60;
  const totalDelayMin = delayPerStop + trafficDelay;
  return baseTime + (travelTimeMin + totalDelayMin) * 60 * 1000;
};

const isOutsideOperatingHours = () => {
  const now = new Date();
  const hour = now.getHours();
  return hour < 5 || hour >= 21;
};

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<number | null>(1);
  const [isClosed, setIsClosed] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());

  const generateRoutes = useCallback(() => {
    const closed = isOutsideOperatingHours();
    setIsClosed(closed);

    const now = Date.now();
    const hour = new Date(now).getHours();
    const isRushHour = (hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 20);

    const baseSpeed = isRushHour ? 15 : 25;
    const trafficDelay = isRushHour ? 4 : 2;
    const stopDelay = 1.5;

    const routesData: Route[] = staticRoutes.map((route) => {
      let cumulativeDistance = 0;

      return {
        ...route,
        stops: route.stops.map((stop) => {
          const segmentDistance = 2 + Math.random() * 1.5;
          cumulativeDistance += segmentDistance;

          const eta = closed
            ? 0
            : calculateETA(now, cumulativeDistance, baseSpeed, stopDelay, trafficDelay);

          return {
            name: stop,
            arrivalTimestamp: eta,
          };
        }),
      };
    });

    setRoutes(routesData);

    if (selectedRouteId === null && routesData.length > 0) {
      setSelectedRouteId(routesData[0].id);
    }
  }, [selectedRouteId]);

  useEffect(() => {
    generateRoutes();
    const refresh = setInterval(generateRoutes, 30000);
    return () => clearInterval(refresh);
  }, [generateRoutes]);

  useEffect(() => {
    const tick = setInterval(() => {
      setCurrentTime(Date.now());
      setIsClosed(isOutsideOperatingHours());
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
    if (diffMs <= 0) return "Arrived";
    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);
    return `${minutes}m ${seconds < 10 ? '0' : ''}${seconds}s`;
  };

  return (
    <>
      <Navbar />
      <main className="min-h-[85vh] bg-gradient-to-br from-blue-100 via-white to-blue-50 px-4 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl font-extrabold text-blue-800 flex justify-center items-center gap-2">
            <Bus className="w-8 h-8 text-blue-600" />
            Libreng Sakay Tracker
          </h1>
          <p className="text-gray-700 text-base md:text-lg max-w-xl mx-auto">
            View your bus route and get real-time arrival updates — refreshed every 30 seconds.
          </p>

          <div className="text-left w-full">
            <label className="block text-sm font-medium text-gray-800 mb-2">
              🧭 Choose your route:
            </label>
            <select
              disabled={routes.length === 0}
              className="w-full px-4 py-3 text-sm rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 bg-white"
              value={selectedRouteId ?? ''}
              onChange={(e) => setSelectedRouteId(Number(e.target.value))}
            >
              {routes.map(route => (
                <option key={route.id} value={route.id}>
                  {route.name}
                </option>
              ))}
            </select>
          </div>

          {selectedRoute && (
            <div className="bg-white shadow-xl border border-gray-200 rounded-2xl p-6 w-full text-left transition-all duration-300">
              <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2 mb-4">
                🛣️ {selectedRoute.name}
              </h2>

              {isClosed && (
                <div className="bg-red-100 text-red-700 font-semibold px-4 py-2 rounded-md mb-4 text-sm">
                  🕘 Bus operations are closed between 9:00 PM and 5:00 AM. Real-time tracking is unavailable.
                </div>
              )}

              <ol className="space-y-4">
                {selectedRoute.stops.map((stop, index) => (
                  <li
                    key={index}
                    className="bg-blue-50 border border-blue-200 hover:shadow-md transition rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3 mb-2 sm:mb-0">
                      <MapPin className="w-5 h-5 text-blue-700" />
                      <span className="text-base font-semibold text-gray-900">{stop.name}</span>
                    </div>
                    <div className="sm:text-right">
                      <div className="flex items-center justify-end gap-1 text-green-700 font-semibold text-sm">
                        <Clock className="w-4 h-4 text-green-700" />
                        <span>
                          {isClosed || stop.arrivalTimestamp === 0
                            ? 'Closed'
                            : formatTimeDiff(stop.arrivalTimestamp)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-700">
                        {isClosed || stop.arrivalTimestamp === 0
                          ? 'No trips available'
                          : `ETA: ${formatArrivalTime(stop.arrivalTimestamp)}`}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>

              <p className="text-xs text-gray-500 mt-6 text-right">
                {isClosed
                  ? 'Live tracking resumes at 5:00 AM'
                  : 'Auto-refreshing every 30 seconds'}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
