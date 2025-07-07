import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow">

        {/* Hero Section */}
        <section className="bg-[url('/qc-bus.jpg')] bg-cover bg-center h-[500px] flex items-center justify-center text-white relative">
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
          <div className="relative z-10 text-center px-6">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 drop-shadow-lg">
              Welcome to Libreng Sakay QC!
            </h1>
            <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto drop-shadow text-white">
              Track routes, view schedules, and ride for free across Quezon City.
            </p>
            <Link href="/register">
              <button className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-lg hover:bg-yellow-300 transition shadow-lg hover:scale-105">
                🗺️ Get Started
              </button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 bg-gradient-to-b from-blue-50 to-white text-center text-gray-800">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-12">Why Use Libreng Sakay QC?</h2>
          <div className="grid gap-10 md:grid-cols-3 max-w-6xl mx-auto">
            {[
              {
                icon: '🚌',
                title: 'Free Bus Rides',
                desc: 'Enjoy safe, convenient, and free public transportation around QC.',
              },
              {
                icon: '🕒',
                title: 'Live Schedules',
                desc: 'Access real-time schedules and plan your day confidently.',
              },
              {
                icon: '📍',
                title: 'Real-Time Tracking',
                desc: 'View bus locations on a live map so you never miss a ride.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white/90 backdrop-blur-lg border border-gray-200 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-blue-700">{feature.title}</h3>
                <p className="text-gray-700">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-700 text-white py-16 px-6 text-center relative">
          <div className="absolute inset-0 bg-pattern opacity-10 pointer-events-none" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to ride?</h2>
          <p className="mb-6 text-lg max-w-xl mx-auto">
            Discover routes, check updated schedules, and track your bus — all in one place.
          </p>
          <Link href="/map">
            <button className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-lg hover:bg-yellow-300 transition shadow-lg hover:scale-105">
              🧭 View Live Map
            </button>
          </Link>
        </section>

      </main>
      <Footer />
    </>
  );
}
