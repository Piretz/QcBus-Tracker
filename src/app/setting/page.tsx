'use client';

import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { useState } from 'react';
import { Bug, CheckCircle, Settings2 } from 'lucide-react';
import Image from 'next/image'; // ✅ Added for next/image

export default function SettingsPage() {
  const [form, setForm] = useState({ name: '', tab: '', description: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('https://formspree.io/f/mkgbdzok', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          section: form.tab,
          description: form.description,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setForm({ name: '', tab: '', description: '' });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        alert('Failed to send bug report.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred. Try again later.');
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-[85vh] bg-gradient-to-br from-sky-50 via-white to-blue-100 px-4 py-12 text-gray-800">
        <div className="max-w-4xl mx-auto space-y-10">

          {/* 🔧 Settings Header */}
          <section className="bg-white/70 backdrop-blur border border-blue-100 p-6 rounded-3xl shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-4 relative z-10">
              <Settings2 className="text-blue-600" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-blue-900">Settings</h1>
                <p className="text-sm text-gray-600">Customize preferences or report issues.</p>
              </div>
            </div>
            <Settings2 size={100} className="absolute top-1 right-3 text-blue-200/20" />
          </section>

          {/* 👨‍💻 Developer Info */}
          <section className="bg-white p-6 rounded-2xl shadow border border-gray-100 hover:shadow-lg transition">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden shadow-inner border border-gray-200 relative">
                <Image
                  src="/tebia.jpg"
                  alt="Arjay Tebia"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
              <div>
                <h2 className="text-l font-semibold">Developer</h2>
                <p className="text-l text-blue-600 hover:underline">
                  <a href="https://www.linkedin.com/in/tebia-arjay-827056231/" target="_blank" rel="noopener noreferrer">
                    Arjay Tebia
                  </a>
                </p>
                <p className="text-l text-gray-700">Bus Tracker Application</p>
              </div>
            </div>
          </section>

          {/* 🐞 Bug Report */}
          <section className="bg-white p-6 rounded-2xl shadow border border-gray-100 hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-4">
              <Bug className="text-red-500" />
              <h2 className="text-xl font-semibold">Report a Bug</h2>
            </div>

            {submitted ? (
              <div className="flex items-center gap-2 text-green-700 font-medium bg-green-50 p-4 rounded-lg border border-green-200 shadow animate-fade-in">
                <CheckCircle className="animate-pulse" size={20} />
                Bug report submitted successfully. Thank you!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Your Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Juan Dela Cruz"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Which section is affected?</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['Home', 'Routes', 'Schedule', 'Map', 'Notification'].map((tab) => (
                      <label
                        key={tab}
                        className={`text-sm px-3 py-2 rounded-lg border text-center font-medium cursor-pointer transition
                          ${form.tab === tab
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                      >
                        <input
                          type="radio"
                          name="tab"
                          value={tab}
                          checked={form.tab === tab}
                          onChange={handleChange}
                          className="hidden"
                        />
                        {tab}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">Bug Description</label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe the issue clearly. What did you expect to happen?"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md transition"
                >
                  Submit Bug Report
                </button>
              </form>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
