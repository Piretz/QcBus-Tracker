'use client';

import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Bus, RefreshCcw, MapPin } from "lucide-react";

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
  const [isClosed, setIsClosed] = useState(false);

  const getRandomMinutes = () => Math.floor(Math.random() * 4) + 2;

  const generateRoutes = () => {
    const now = new Date();
    const currentTime = now.getTime();

    // Set closing time (9:00 PM today)
    const closingTime = new Date();
    closingTime.setHours(21, 0, 0, 0); // 21:00:00.000

    const closed = currentTime >= closingTime.getTime();
    setIsClosed(closed);

    if (closed) {
      setRoutes([]);
      setSelectedRouteId(null);
      return;
    }

    const getFutureTime = (offsetMinutes: number) => {
      const timestamp = currentTime + offsetMinutes * 60 * 1000;
      return timestamp < closingTime.getTime() ? timestamp : null;
    };

    const newRoutes: Route[] = [
      {
        id: 1,
        name: 'QC Hall to Cubao',
        stops: ['QC Hall', 'EDSA-Kamuning', 'Cubao Terminal']
          .map((stop, i) => ({
            name: stop,
            arrivalTimestamp: getFutureTime((i + 1) * getRandomMinutes()),
          }))
          .filter((stop): stop is Stop => stop.arrivalTimestamp !== null),
      },
      {
        id: 2,
        name: 'QC Hall to Litex/IBP',
        stops: ['QC Hall', 'Commonwealth', 'Litex', 'IBP Road']
          .map((stop, i) => ({
            name: stop,
            arrivalTimestamp: getFutureTime((i + 1) * getRandomMinutes()),
          }))
          .filter((stop): stop is Stop => stop.arrivalTimestamp !== null),
      },
      {
        id: 3,
        name: 'Welcome Rotonda to Katipunan',
        stops: ['Welcome Rotonda', 'España', 'Aurora Blvd', 'Katipunan']
          .map((stop, i) => ({
            name: stop,
            arrivalTimestamp: getFutureTime((i + 1) * getRandomMinutes()),
          }))
          .filter((stop): stop is Stop => stop.arrivalTimestamp !== null),
      },
    ].filter(route => route.stops.length > 0);

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
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-blue-800 mb-2 flex items-center justify-center gap-2">
            <Bus className="w-8 h-8 text-blue-600" /> Libreng Sakay Tracker
          </h1>
          <p className="text-gray-700 mb-10 text-base md:text-lg max-w-xl mx-auto">
            View your bus route below and track when it arrives — updated in real-time every 30 seconds.
          </p>

          {/* No buses available */}
          {routes.length === 0 ? (
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-red-600 font-semibold text-lg mt-10">
              🕘 Buses have stopped operating for today. Please come back tomorrow!
            </div>
          ) : (
            <>
              {/* Route Selector */}
              <div className="mb-8 text-left">
                <label className="block mb-2 text-sm font-medium text-gray-800">Choose your route:</label>
                <select
                  disabled={isClosed}
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
                  disabled={isClosed}
                  onClick={generateRoutes}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg shadow-md transition-all text-sm ${
                    isClosed
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <RefreshCcw className="w-4 h-4" /> Refresh Now
                </button>
              </div>

              {/* Route Display */}
              {selectedRoute && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xl text-left transition-all duration-300">
                  <h2 className="text-2xl font-semibold text-blue-700 mb-6 flex items-center gap-2">
                    🛣️ {selectedRoute.name}
                  </h2>

                  <ol className="relative border-l-4 border-blue-400 ml-2 space-y-6">
                    {selectedRoute.stops.map((stop, index) => (
                      <li key={index} className="ml-4">
                        <div className="absolute w-4 h-4 bg-blue-500 rounded-full left-[-9px] top-1.5 border-2 border-white"></div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-900 font-medium">
                            <MapPin className="inline w-4 h-4 mr-1 text-blue-500" />
                            {stop.name}
                          </span>
                          <span className="text-green-600 font-semibold text-sm">
                            {formatArrivalTime(stop.arrivalTimestamp)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ol>

                  <p className="text-xs text-gray-400 mt-6 text-right">
                    Auto-refreshes every 30 seconds
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
