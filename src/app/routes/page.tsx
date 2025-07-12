'use client';

import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Bus } from "lucide-react";

export default function RoutesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[85vh] bg-gradient-to-br from-blue-100 via-white to-blue-50 px-4 py-14">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <header>
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 flex justify-center items-center gap-3">
              <Bus className="w-9 h-9" />
              Libreng Sakay Route Tracker
            </h1>
            <p className="text-gray-800 text-base md:text-lg mt-3 font-medium">
              Real-time route tracking is currently <span className="text-red-700 font-semibold">under maintenance</span>.
            </p>
          </header>

          <div className="bg-white shadow-xl border border-gray-200 rounded-2xl px-6 py-16 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-red-700 mb-4">🔧 Under Maintenance</h2>
            <p className="text-gray-600 text-lg">
              We&apos;re working to improve our bus arrival tracking system.<br />
              Please check back later.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
