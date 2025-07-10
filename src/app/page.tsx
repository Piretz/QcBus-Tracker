'use client';
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow">

        {/* Hero Section */}
        <section className="bg-[url('/qc-bus.jpg')] bg-cover bg-center h-[520px] flex items-center justify-center text-white relative">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
          <div className="relative z-10 text-center px-6 animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 tracking-tight drop-shadow-md">
              🚍 Libreng Sakay QC
            </h1>
            <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto text-white/90">
              Real-time tracking, live schedules, and free rides across Quezon City.
            </p>
            <Link href="/register">
              <button className="bg-yellow-400 text-black font-semibold px-8 py-3 rounded-full hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-xl">
                🗺️ Get Started
              </button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6 bg-gradient-to-b from-blue-50 to-white text-center text-gray-800">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-800 mb-16 animate-fade-in-down">
            Why Use Libreng Sakay QC?
          </h2>
          <div className="grid gap-12 md:grid-cols-3 max-w-6xl mx-auto">
            {[
              {
                icon: '🚌',
                title: 'Free Bus Rides',
                desc: 'Enjoy safe, convenient, and zero-fare public transportation in Quezon City.',
              },
              {
                icon: '🕒',
                title: 'Live Schedules',
                desc: 'Stay updated with accurate arrival times and schedule adjustments.',
              },
              {
                icon: '📍',
                title: 'Real-Time Tracking',
                desc: 'Know exactly where your ride is and avoid long waits or missed buses.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white/90 border border-gray-100 rounded-3xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 text-left hover:bg-white transform hover:-translate-y-1"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-blue-700 mb-2">{feature.title}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Route Highlights Section */}
        <section className="py-24 px-6 bg-white text-gray-800 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-800 mb-16 animate-fade-in-down">
            QC Route Highlights
          </h2>
          <div className="grid gap-10 md:grid-cols-3 max-w-6xl mx-auto">
            {[
              {
                icon: '🚏',
                name: 'East Avenue Loop',
                desc: 'Connects Cubao to Commonwealth via East Ave and Elliptical Road.',
              },
              {
                icon: '🏥',
                name: 'Hospital Line',
                desc: 'Passes through major hospitals: East Ave, Heart Center, NKTI.',
              },
              {
                icon: '🏛️',
                name: 'City Hall Express',
                desc: 'Direct route from Novaliches to QC Hall with few stops.',
              },
            ].map((route, index) => (
              <div
                key={index}
                className="bg-blue-50 border border-blue-100 rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-300 text-left hover:bg-blue-100/60 transform hover:-translate-y-1"
              >
                <div className="text-4xl mb-4">{route.icon}</div>
                <h3 className="text-xl font-bold text-blue-700 mb-2">{route.name}</h3>
                <p className="text-gray-700 text-sm leading-relaxed mb-3">{route.desc}</p>
                <Link href="/routes">
                  <span className="text-blue-600 hover:underline text-sm font-medium">
                    View Full Route →
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-700 text-white py-20 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10 pointer-events-none bg-cover" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in-up">Ready to Ride?</h2>
            <p className="mb-6 text-lg max-w-xl mx-auto">
              Discover routes, check updated schedules, and track your bus — all in one place.
            </p>
            <Link href="/map">
              <button className="bg-yellow-400 text-black font-semibold px-8 py-3 rounded-full hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-xl">
                🧭 View Live Map
              </button>
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
