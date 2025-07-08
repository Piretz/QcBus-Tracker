'use client';

import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

type Stop = {
  name: string;
  arrivalTimestamp: number;
};

type Route = {
  id: number;
  name: string;
  stops: Stop[];
};

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null);

  const getRandomMinutes = () => Math.floor(Math.random() * 4) + 2;

  const generateRoutes = () => {
    const currentTime = Date.now();
    const newRoutes: Route[] = [
      {
        id: 1,
        name: 'QC Hall to Cubao',
        stops: ['QC Hall', 'EDSA-Kamuning', 'Cubao Terminal'].map((stop, i) => ({
          name: stop,
          arrivalTimestamp: currentTime + (i + 1) * getRandomMinutes() * 60 * 1000,
        })),
      },
      {
        id: 2,
        name: 'QC Hall to Litex/IBP',
        stops: ['QC Hall', 'Commonwealth', 'Litex', 'IBP Road'].map((stop, i) => ({
          name: stop,
          arrivalTimestamp: currentTime + (i + 1) * getRandomMinutes() * 60 * 1000,
        })),
      },
      {
        id: 3,
        name: 'Welcome Rotonda to Katipunan',
        stops: ['Welcome Rotonda', 'España', 'Aurora Blvd', 'Katipunan'].map((stop, i) => ({
          name: stop,
          arrivalTimestamp: currentTime + (i + 1) * getRandomMinutes() * 60 * 1000,
        })),
      },
    ];

    setRoutes(newRoutes);
    if (selectedRouteId === null && newRoutes.length > 0) {
      setSelectedRouteId(newRoutes[0].id);
    }
  };

  useEffect(() => {
    generateRoutes();
    const refreshRoutes = setInterval(generateRoutes, 30000);
    return () => clearInterval(refreshRoutes);
  }, []);

  const selectedRoute = routes.find((r) => r.id === selectedRouteId);

  const formatArrivalTime = (arrivalTimestamp: number): string => {
    const time = new Date(arrivalTimestamp);
    return time.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <Navbar />
      <main className="min-h-[85vh] bg-gradient-to-br from-blue-100 to-white px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">🚌 Libreng Sakay Tracker</h1>
          <p className="text-gray-600 mb-8 text-sm md:text-base">
            View your bus route below and track when it arrives — real time.
          </p>

          {/* Dropdown */}
          <div className="mb-6 text-left">
            <label className="block mb-2 text-sm font-medium text-gray-700">Select a route:</label>
            <select
              className="w-full px-4 py-3 border border-blue-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 text-sm"
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

          {/* Route Display */}
          {selectedRoute && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xl text-left transition-all duration-300">
              <h2 className="text-xl font-bold text-blue-700 mb-4">🛣️ {selectedRoute.name}</h2>
              <ul className="space-y-3 text-sm text-gray-700">
                {selectedRoute.stops.map((stop, index) => (
                  <li key={index} className="flex items-center justify-between border-b pb-2">
                    <span>🟢 <strong>{stop.name}</strong></span>
                    <span className="text-green-600 font-semibold">
                      {formatArrivalTime(stop.arrivalTimestamp)}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-400 mt-4 text-right">
                Auto-updated every 30s
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
