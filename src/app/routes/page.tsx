'use client';

import { useEffect, useState, useCallback } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Bus, MapPin, Clock, RefreshCcw } from "lucide-react";

type Stop = { name: string; arrivalTimestamp: number };
type Route = { id: number; name: string; stops: string[] };
type TrafficLevel = 'light' | 'moderate' | 'heavy';

const staticRoutes: Route[] = [
  { id: 1, name: 'QMC to Welcome Rotonda via E. Rodriguez Sr. Avenue', stops: ['Quezon Memorial Circle', 'Kalayaan Avenue', 'Tomas Morato', 'St. Luke’s Medical Center', 'Trinity University of Asia', 'Welcome Rotonda'] },
  { id: 2, name: 'QMC to Katipunan via CP Garcia', stops: ['Quezon Memorial Circle', 'University Avenue (UP Diliman)', 'CP Garcia Avenue', 'UP Town Center', 'Katipunan (LRT2 Station)'] },
  { id: 3, name: 'QMC to Araneta-Cubao via East Avenue', stops: ['Quezon Memorial Circle', 'Philippine Heart Center', 'East Avenue Medical Center', 'Land Transportation Office (LTO)', 'National Kidney Institute', 'Araneta City / Cubao'] },
  { id: 4, name: 'IBP Road to Litex', stops: ['Batasan Road (near Sandiganbayan)', 'IBP Road', 'Commonwealth Avenue', 'Litex Market', 'Payatas Road Junction'] },
  { id: 5, name: 'Novaliches to QMC via Mindanao Avenue', stops: ['Novaliches Bayan (Proper)', 'Tandang Sora Avenue', 'Mindanao Avenue', 'Visayas Avenue', 'Quezon Memorial Circle'] },
  { id: 6, name: 'QMC – Philcoa – UP – Katipunan Loop', stops: ['Quezon Memorial Circle', 'Philcoa', 'University of the Philippines (UP) Campus', 'Katipunan Avenue', 'Balara Area'] },
];

// Shortened for brevity; use full travelTimeData from your original
const travelTimeData: Record<string, Record<TrafficLevel, [number, number]>> = {
  'Quezon Memorial Circle→Kalayaan Avenue': { light: [10, 15], moderate: [15, 25], heavy: [25, 40] },
  'Kalayaan Avenue→Tomas Morato': { light: [12, 18], moderate: [18, 30], heavy: [30, 45] },
  // ... include other route segments from your original code
};

const getTrafficLevel = (): TrafficLevel => {
  const hour = new Date().getHours();
  if ((hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 20)) return 'heavy';
  if ((hour >= 6 && hour < 7) || (hour > 10 && hour <= 16)) return 'moderate';
  return 'light';
};

const getETA = (from: string, to: string, traffic: TrafficLevel): number => {
  const key = `${from}→${to}`;
  const segment = travelTimeData[key]?.[traffic];
  if (!segment) return traffic === 'light' ? 5 : traffic === 'moderate' ? 8 : 12;
  const [min, max] = segment;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const isOutsideOperatingHours = () => {
  const hour = new Date().getHours();
  return hour < 5 || hour >= 21;
};

export default function RoutesPage() {
 
  const [arrivalTimes, setArrivalTimes] = useState<Record<number, Stop[]>>({});
  const [selectedRouteId, setSelectedRouteId] = useState<number>(1);
  const [isClosed, setIsClosed] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);


  const refreshArrivalTimes = useCallback(() => {
    const closed = isOutsideOperatingHours();
    setIsClosed(closed);
    const traffic = getTrafficLevel();
    const now = Date.now();

    const updated = staticRoutes.reduce((acc, route) => {
      let time = 0;
      const stops = route.stops.map((stop, i, arr) => {
        if (!closed && i > 0) {
          time += getETA(arr[i - 1], stop, traffic);
        }
        return { name: stop, arrivalTimestamp: closed ? 0 : now + time * 60000 };
      });
      acc[route.id] = stops;
      return acc;
    }, {} as Record<number, Stop[]>);

    setArrivalTimes(updated);
  }, []);

  useEffect(() => {
    refreshArrivalTimes();
    const interval = setInterval(refreshArrivalTimes, 30000);
    return () => clearInterval(interval);
  }, [refreshArrivalTimes]);

  const selectedStops = arrivalTimes[selectedRouteId] || [];
  const formatTime = (timestamp: number) =>
    timestamp === 0 ? '--:--' : new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <>
  <Navbar />
  <main className="min-h-[85vh] bg-gradient-to-br from-blue-100 via-white to-blue-50 px-4 py-14">
    <div className="max-w-4xl mx-auto space-y-10 text-center">
      {/* Header */}
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-blue-900 flex justify-center items-center gap-3">
          <Bus className="w-9 h-9" />
          Libreng Sakay Route Tracker
        </h1>
        <p className="text-gray-800 text-base md:text-lg mt-3 font-medium">
          Get <span className="font-semibold text-blue-700">real-time</span> updates on bus arrival times
        </p>
      </div>

      {/* Route Selector */}
      <div className="text-left w-full">
        <label className="block text-base font-semibold text-gray-800 mb-2">📍 Select a route:</label>
        <select
          className="w-full px-4 py-3 text-base rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 bg-white"
          value={selectedRouteId}
          onChange={e => setSelectedRouteId(Number(e.target.value))}
        >
          {staticRoutes.map(route => (
            <option key={route.id} value={route.id}>{route.name}</option>
          ))}
        </select>
      </div>

     {/* Refresh Button */}
<div className="flex justify-end">
  <button
    onClick={() => {
      if (isRefreshing) return;          // guard: avoid double‑clicks
      setIsRefreshing(true);             // show spinner / disable
      refreshArrivalTimes();             // run the update
      setIsRefreshing(false);            // turn button back on
    }}
    disabled={isRefreshing}
    className={`flex items-center gap-2 text-base font-semibold px-5 py-2 rounded-lg transition
      ${isRefreshing
        ? 'bg-gray-400 cursor-not-allowed text-white'
        : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
  >
    {/* icon spins while refreshing */}
    <RefreshCcw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
    {isRefreshing ? 'Refreshing…' : 'Refresh '}
  </button>
</div>
      {/* Route Display */}
      <div className="bg-white shadow-xl border border-gray-200 rounded-2xl px-6 py-8 text-left space-y-6">
        <h2 className="text-xl md:text-2xl font-bold text-blue-800 flex items-center gap-2">
          🛣️ {staticRoutes.find(r => r.id === selectedRouteId)?.name}
        </h2>

        {isClosed && (
          <div className="bg-red-100 text-red-800 font-semibold px-4 py-2 rounded-md text-sm md:text-base">
            🕘 Buses are not operating between 9:00 PM and 5:00 AM
          </div>
        )}

        {/* Stop List */}
        <ol className="space-y-5 relative border-l-4 border-blue-300 pl-6">
          {selectedStops.map((stop, i) => (
            <li key={i} className="relative">
              <div className="flex justify-between items-center">
                <div className="text-gray-900 text-base md:text-lg font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-700" />
                  {stop.name}
                </div>
                <div
                  className={`text-sm md:text-base flex items-center gap-2 px-4 py-1 rounded-full font-medium ${
                    isClosed ? 'bg-gray-300 text-gray-600' : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  {isClosed ? 'Closed' : formatTime(stop.arrivalTimestamp)}
                </div>
              </div>
            </li>
          ))}
        </ol>

        <p className="text-sm text-gray-500 text-right mt-4">
          {isClosed ? 'Live tracking resumes at 5:00 AM' : 'Auto-refreshing every 30 seconds'}
        </p>
      </div>
    </div>
  </main>
  <Footer />
</>

  );
}
