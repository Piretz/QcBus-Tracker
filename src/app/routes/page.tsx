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
    name: 'QMC to Welcome Rotonda via E. Rodriguez Sr. Avenue',
    stops: [
      'Quezon Memorial Circle',
      'Kalayaan Avenue',
      'Tomas Morato',
      'St. Luke’s Medical Center',
      'Trinity University of Asia',
      'Welcome Rotonda',
    ],
  },
  {
    id: 2,
    name: 'QMC to Katipunan via CP Garcia',
    stops: [
      'Quezon Memorial Circle',
      'University Avenue (UP Diliman)',
      'CP Garcia Avenue',
      'UP Town Center',
      'Katipunan (LRT2 Station)',
    ],
  },
  {
    id: 3,
    name: 'QMC to Araneta-Cubao via East Avenue',
    stops: [
      'Quezon Memorial Circle',
      'Philippine Heart Center',
      'East Avenue Medical Center',
      'Land Transportation Office (LTO)',
      'National Kidney Institute',
      'Araneta City / Cubao',
    ],
  },
  {
    id: 4,
    name: 'IBP Road to Litex',
    stops: [
      'Batasan Road (near Sandiganbayan)',
      'IBP Road',
      'Commonwealth Avenue',
      'Litex Market',
      'Payatas Road Junction',
    ],
  },
  {
    id: 5,
    name: 'Novaliches to QMC via Mindanao Avenue',
    stops: [
      'Novaliches Bayan (Proper)',
      'Tandang Sora Avenue',
      'Mindanao Avenue',
      'Visayas Avenue',
      'Quezon Memorial Circle',
    ],
  },
  {
    id: 6,
    name: 'QMC – Philcoa – UP – Katipunan Loop',
    stops: [
      'Quezon Memorial Circle',
      'Philcoa',
      'University of the Philippines (UP) Campus',
      'Katipunan Avenue',
      'Balara Area',
    ],
  },
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

  const getTrafficCondition = () => {
    if ((hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 20)) return 'heavy';
    if ((hour >= 6 && hour < 7) || (hour > 10 && hour <= 16)) return 'moderate';
    return 'light';
  };

  const trafficCondition = getTrafficCondition();

 const getSegmentTime = (from: string, to: string, routeId: number): number => {
  // Route 1: QMC → Welcome Rotonda
  if (routeId === 1) {
    if (from === 'Quezon Memorial Circle' && to === 'Kalayaan Avenue')
      return trafficCondition === 'light' ? 12 : trafficCondition === 'moderate' ? 20 : 32;
    if (from === 'Kalayaan Avenue' && to === 'Tomas Morato')
      return trafficCondition === 'light' ? 15 : trafficCondition === 'moderate' ? 24 : 38;
    if (from === 'Tomas Morato' && to === 'St. Luke’s Medical Center')
      return trafficCondition === 'light' ? 7 : trafficCondition === 'moderate' ? 12 : 20;
    if (from === 'St. Luke’s Medical Center' && to === 'Trinity University of Asia')
      return trafficCondition === 'light' ? 3 : trafficCondition === 'moderate' ? 4 : 5;
    if (from === 'Trinity University of Asia' && to === 'Welcome Rotonda')
      return trafficCondition === 'light' ? 12 : trafficCondition === 'moderate' ? 20 : 30;
  }

  // Route 2: QMC → Katipunan via CP Garcia
  if (routeId === 2) {
    if (from === 'Quezon Memorial Circle' && to === 'University Avenue (UP Diliman)')
      return trafficCondition === 'light' ? 4 : trafficCondition === 'moderate' ? 8 : 13;
    if (from === 'University Avenue (UP Diliman)' && to === 'CP Garcia Avenue')
      return trafficCondition === 'light' ? 4 : trafficCondition === 'moderate' ? 6 : 9;
    if (from === 'CP Garcia Avenue' && to === 'UP Town Center')
      return trafficCondition === 'light' ? 6 : trafficCondition === 'moderate' ? 10 : 16;
    if (from === 'UP Town Center' && to === 'Katipunan (LRT2 Station)')
      return trafficCondition === 'light' ? 7 : trafficCondition === 'moderate' ? 12 : 20;
  }

  // Route 3: QMC → Araneta-Cubao via East Avenue
  if (routeId === 3) {
    if (from === 'Quezon Memorial Circle' && to === 'Philippine Heart Center')
      return trafficCondition === 'light' ? 4 : trafficCondition === 'moderate' ? 8 : 13;
    if (from === 'Philippine Heart Center' && to === 'East Avenue Medical Center')
      return 4;
    if (from === 'East Avenue Medical Center' && to === 'Land Transportation Office (LTO)')
      return 3;
    if (from === 'Land Transportation Office (LTO)' && to === 'National Kidney Institute')
      return 4;
    if (from === 'National Kidney Institute' && to === 'Araneta City / Cubao')
      return trafficCondition === 'light' ? 12 : trafficCondition === 'moderate' ? 20 : 32;
  }

  // Route 4: IBP Road to Litex
  if (routeId === 4) {
    if (from === 'Batasan Road (near Sandiganbayan)' && to === 'IBP Road')
      return trafficCondition === 'light' ? 4 : trafficCondition === 'moderate' ? 8 : 15;
    if (from === 'IBP Road' && to === 'Commonwealth Avenue')
      return trafficCondition === 'light' ? 4 : trafficCondition === 'moderate' ? 8 : 15;
    if (from === 'Commonwealth Avenue' && to === 'Litex Market')
      return trafficCondition === 'light' ? 6 : trafficCondition === 'moderate' ? 12 : 20;
    if (from === 'Litex Market' && to === 'Payatas Road Junction')
      return trafficCondition === 'light' ? 3 : trafficCondition === 'moderate' ? 6 : 10;
  }

  // Route 5: Novaliches to QMC via Mindanao
  if (routeId === 5) {
    if (from === 'Novaliches Bayan (Proper)' && to === 'Tandang Sora Avenue')
      return trafficCondition === 'light' ? 15 : trafficCondition === 'moderate' ? 24 : 38;
    if (from === 'Tandang Sora Avenue' && to === 'Mindanao Avenue')
      return trafficCondition === 'light' ? 6 : trafficCondition === 'moderate' ? 12 : 20;
    if (from === 'Mindanao Avenue' && to === 'Visayas Avenue')
      return trafficCondition === 'light' ? 6 : trafficCondition === 'moderate' ? 12 : 20;
    if (from === 'Visayas Avenue' && to === 'Quezon Memorial Circle')
      return trafficCondition === 'light' ? 8 : trafficCondition === 'moderate' ? 12 : 20;
  }

  // Route 6: QMC – Philcoa – UP – Katipunan Loop
  if (routeId === 6) {
    if (from === 'Quezon Memorial Circle' && to === 'Philcoa')
      return trafficCondition === 'light' ? 4 : trafficCondition === 'moderate' ? 6 : 10;
    if (from === 'Philcoa' && to === 'University of the Philippines (UP) Campus)')
      return trafficCondition === 'light' ? 4 : trafficCondition === 'moderate' ? 8 : 13;
    if (from === 'University of the Philippines (UP) Campus)' && to === 'Katipunan Avenue')
      return trafficCondition === 'light' ? 6 : trafficCondition === 'moderate' ? 12 : 20;
    if (from === 'Katipunan Avenue' && to === 'Balara Area')
      return trafficCondition === 'light' ? 5 : trafficCondition === 'moderate' ? 10 : 16;
  }

  // Default fallback for unlisted segments
  return trafficCondition === 'light' ? 5 : trafficCondition === 'moderate' ? 8 : 12;
};

  const routesData: Route[] = staticRoutes.map((route) => {
    let accumulatedTime = 0;

    const stopsWithETA = route.stops.map((stop, index, allStops) => {
      let eta = 0;

      if (!closed && index > 0) {
        const prevStop = allStops[index - 1];
        const segmentMinutes = getSegmentTime(prevStop, stop, route.id);


        accumulatedTime += segmentMinutes;
        eta = now + accumulatedTime * 60 * 1000;
      }

      return {
        name: stop,
        arrivalTimestamp: eta,
      };
    });

    return {
      ...route,
      stops: stopsWithETA,
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
                            <div
                              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold transition-all
                                ${
                                  isClosed || stop.arrivalTimestamp === 0
                                    ? 'bg-gray-200 text-gray-600'
                                    : currentTime >= stop.arrivalTimestamp
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-green-100 text-green-700 animate-pulse'
                                }
                              `}
                            >
                              <Clock className="w-4 h-4" />
                              <span>
                                {isClosed || stop.arrivalTimestamp === 0
                                  ? 'Closed'
                                  : currentTime >= stop.arrivalTimestamp
                                  ? 'Arrived'
                                  : `ETA: ${formatArrivalTime(stop.arrivalTimestamp)}`}
                              </span>
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
