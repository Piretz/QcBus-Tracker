'use client';

import dynamic from 'next/dynamic';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

const MapComponent = dynamic(() => import('../components/mapcomponent'), {
  ssr: false, // ⛔ disables server-side rendering
});

export default function MapPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[85vh] px-6 py-10 bg-gradient-to-br from-blue-100 to-white">
        <div className="max-w-6xl mx-auto text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-2">🗺️ Real-Time Bus Tracker</h1>
          <p className="text-gray-600 text-sm">
            See where all Libreng Sakay QC buses are located in Quezon City
          </p>
        </div>

        <div className="h-[600px] w-full rounded-xl overflow-hidden shadow-xl border border-blue-200">
          <MapComponent />
        </div>

        <p className="text-sm text-center text-gray-500 mt-4">
          Last updated: {new Date().toLocaleTimeString()}
        </p>
      </main>
      <Footer />
    </>
  );
}
