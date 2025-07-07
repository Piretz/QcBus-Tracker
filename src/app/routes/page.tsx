  'use client';

import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const busRoutes = [
  { id: 1, name: 'QC Hall to Cubao', stops: ['QC Hall', 'EDSA-Kamuning', 'Cubao Terminal'] },
  { id: 2, name: 'QC Hall to Litex/IBP', stops: ['QC Hall', 'Commonwealth', 'Litex', 'IBP Road'] },
  { id: 3, name: 'Welcome Rotonda to Katipunan', stops: ['Welcome Rotonda', 'Espana', 'Aurora Blvd', 'Katipunan'] },
];

export default function RoutesPage() {
  const [nextArrivals, setNextArrivals] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      const newArrivals: { [key: number]: string } = {};
      busRoutes.forEach(route => {
        const minutes = Math.floor(Math.random() * 15) + 1; // Random 1–15 min
        const arrivalTime = new Date(now.getTime() + minutes * 60000);
        newArrivals[route.id] = arrivalTime.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
      });
      setNextArrivals(newArrivals);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-[85vh] bg-gradient-to-br from-blue-100 to-white px-4 py-12">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">🚌 Libreng Sakay Bus Routes</h1>
          <p className="text-gray-600 mb-10 text-sm md:text-base">
            Discover the routes available today and see when the next bus arrives in real time.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {busRoutes.map((route) => (
              <div
                key={route.id}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-xl hover:shadow-2xl transition duration-300"
              >
                <h2 className="text-xl font-bold text-blue-700 mb-2">🛣️ {route.name}</h2>
                <p className="text-sm text-gray-600 mb-4">
                  ⏱️ Next Bus Arrival:{" "}
                  <span className="font-semibold text-green-600">
                    {nextArrivals[route.id] || 'Loading...'}
                  </span>
                </p>
                <ul className="space-y-1 text-sm text-gray-700 list-disc list-inside">
                  {route.stops.map((stop, index) => (
                    <li key={index}>🟢 {stop}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
