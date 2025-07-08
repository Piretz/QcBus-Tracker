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
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
          <div className="relative z-10 text-center px-6 animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 drop-shadow-xl tracking-tight">
              🚍 Libreng Sakay QC
            </h1>
            <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto text-white/90">
              Real-time tracking, live schedules, and free rides across Quezon City.
            </p>
            <Link href="/register">
              <button className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-lg hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-xl">
                🗺️ Get Started
              </button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6 bg-gradient-to-b from-blue-50 to-white text-center text-gray-800">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-800 mb-14">
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
                className="bg-white/90 border border-gray-100 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition duration-300 text-left"
              >
                <div className="text-6xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-blue-700 mb-2">{feature.title}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-700 text-white py-20 px-6 text-center relative">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10 pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Ride?</h2>
            <p className="mb-6 text-lg max-w-xl mx-auto">
              Discover routes, check updated schedules, and track your bus — all in one place.
            </p>
            <Link href="/map">
              <button className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-lg hover:bg-yellow-300 transition shadow-xl hover:scale-105">
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
