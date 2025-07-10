'use client';

import { useEffect, useState, useCallback } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Bus, MapPin, Clock } from "lucide-react";

type Stop = { name: string; arrivalTimestamp: number };
type Route = { id: number; name: string; stops: Stop[] };

const staticRoutes = [
  {
    id: 1,
    name: 'QMC to Welcome Rotonda via E. Rodriguez Sr. Avenue',
    stops: [
      'Quezon Memorial Circle', 'Kalayaan Avenue', 'Tomas Morato',
      'St. Luke’s Medical Center', 'Trinity University of Asia', 'Welcome Rotonda'
    ],
  },
  {
    id: 2,
    name: 'QMC to Katipunan via CP Garcia',
    stops: [
      'Quezon Memorial Circle', 'University Avenue (UP Diliman)',
      'CP Garcia Avenue', 'UP Town Center', 'Katipunan (LRT2 Station)'
    ],
  },
  {
    id: 3,
    name: 'QMC to Araneta-Cubao via East Avenue',
    stops: [
      'Quezon Memorial Circle', 'Philippine Heart Center', 'East Avenue Medical Center',
      'Land Transportation Office (LTO)', 'National Kidney Institute', 'Araneta City / Cubao'
    ],
  },
  {
    id: 4,
    name: 'IBP Road to Litex',
    stops: [
      'Batasan Road (near Sandiganbayan)', 'IBP Road', 'Commonwealth Avenue',
      'Litex Market', 'Payatas Road Junction'
    ],
  },
  {
    id: 5,
    name: 'Novaliches to QMC via Mindanao Avenue',
    stops: [
      'Novaliches Bayan (Proper)', 'Tandang Sora Avenue',
      'Mindanao Avenue', 'Visayas Avenue', 'Quezon Memorial Circle'
    ],
  },
  {
    id: 6,
    name: 'QMC – Philcoa – UP – Katipunan Loop',
    stops: [
      'Quezon Memorial Circle', 'Philcoa', 'University of the Philippines (UP) Campus',
      'Katipunan Avenue', 'Balara Area'
    ],
  },
];

const isOutsideOperatingHours = () => {
  const hour = new Date().getHours();
  return hour < 5 || hour >= 21;
};

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<number | null>(1);
  const [isClosed, setIsClosed] = useState(false);

  const generateRoutes = useCallback(() => {
    const closed = isOutsideOperatingHours();
    setIsClosed(closed);
    const now = Date.now();
    const hour = new Date().getHours();

    const traffic = (hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 20)
      ? 'heavy' : (hour >= 6 && hour < 7) || (hour > 10 && hour <= 16)
      ? 'moderate' : 'light';

    const getSegmentTime = () => traffic === 'light' ? 5 : traffic === 'moderate' ? 8 : 12;

    const routesData = staticRoutes.map(route => {
      let time = 0;
      const stops = route.stops.map((stop, i) => {
        if (!closed && i > 0) time += getSegmentTime();
        return { name: stop, arrivalTimestamp: closed ? 0 : now + time * 60000 };
      });
      return { ...route, stops };
    });

    setRoutes(routesData);
    if (selectedRouteId === null && routesData.length > 0)
      setSelectedRouteId(routesData[0].id);
  }, [selectedRouteId]);

  useEffect(() => {
    generateRoutes();
    const interval = setInterval(generateRoutes, 30000);
    return () => clearInterval(interval);
  }, [generateRoutes]);

  const selectedRoute = routes.find(r => r.id === selectedRouteId);
  const formatTime = (timestamp: number) =>
    timestamp === 0 ? '--:--' : new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

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
            View your bus route and get real-time arrival updates
          </p>

          <div className="text-left w-full">
            <label className="block text-sm font-medium text-gray-800 mb-2">🧭 Choose your route:</label>
            <select
              className="w-full px-4 py-3 text-sm rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 bg-white"
              value={selectedRouteId ?? ''}
              onChange={e => setSelectedRouteId(Number(e.target.value))}
            >
              {routes.map(route => (
                <option key={route.id} value={route.id}>{route.name}</option>
              ))}
            </select>
          </div>

          {selectedRoute && (
            <div className="bg-white shadow-xl border border-gray-200 rounded-2xl p-6 w-full text-left">
              <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2 mb-4">
                🛣️ {selectedRoute.name}
              </h2>

              {isClosed && (
                <div className="bg-red-100 text-red-700 font-semibold px-4 py-2 rounded-md mb-4 text-sm">
                  🕘 Bus operations are closed between 9:00 PM and 5:00 AM.
                </div>
              )}

              <ol className="space-y-4">
                {selectedRoute.stops.map((stop, i) => (
                  <li key={i} className="bg-blue-50 border border-blue-200 hover:shadow-md rounded-xl p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-blue-700" />
                      <span className="text-base font-semibold text-gray-900">{stop.name}</span>
                    </div>
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold
                        ${isClosed || stop.arrivalTimestamp === 0
                          ? 'bg-gray-200 text-gray-600'
                          : 'bg-green-100 text-green-700 animate-pulse'}
                      `}
                    >
                      <Clock className="w-4 h-4" />
                      <span>{isClosed || stop.arrivalTimestamp === 0 ? 'Closed' : `ETA: ${formatTime(stop.arrivalTimestamp)}`}</span>
                    </div>
                  </li>
                ))}
              </ol>

              <p className="text-xs text-gray-500 mt-6 text-right">
                {isClosed ? 'Live tracking resumes at 5:00 AM' : 'Auto-refreshing every 30 seconds'}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
