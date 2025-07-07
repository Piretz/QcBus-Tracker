'use client';

import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { useState } from 'react';
import { Bug, CheckCircle, User, Settings2 } from 'lucide-react';

export default function SettingsPage() {
  const [form, setForm] = useState({ name: '', tab: '', description: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Bug Report Submitted:', form);
    setSubmitted(true);
    setForm({ name: '', tab: '', description: '' });

    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-[85vh] bg-gradient-to-br from-blue-50 to-white text-black px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-10">

          {/* Page Header */}
          <div className="relative rounded-2xl bg-blue-100/50 border border-blue-200 p-6 shadow-md overflow-hidden">
            <div className="flex items-center gap-3 relative z-10">
              <Settings2 className="text-blue-600" size={32} />
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-blue-800">Settings</h1>
                <p className="text-gray-600 text-sm mt-1">Adjust preferences or report issues in the app.</p>
              </div>
            </div>
            <div className="absolute top-2 right-4 text-blue-100 opacity-30">
              <Settings2 size={80} />
            </div>
          </div>

          {/* Developer Info Card */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full">
                <User size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Developer Info</h2>
                <p className="text-sm text-gray-600 mt-1">Arjay Tebia</p>
                <p className="text-xs text-gray-400">Developer: Bus Tracker App</p>
              </div>
            </div>
          </div>

          {/* Bug Report Section */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-4">
              <Bug className="text-red-600" />
              <h2 className="text-xl font-semibold">Report a Bug</h2>
            </div>

            {submitted ? (
              <div className="flex items-center gap-3 text-green-700 font-medium bg-green-50 p-4 rounded-lg border border-green-200 shadow-sm animate-fade-in">
                <CheckCircle className="animate-pulse" size={20} />
                Thank you! Your bug report has been submitted.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 mt-4">

                {/* Name Input */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-1">Your Name</label>
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

                {/* Section Select */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Affected Section</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['Lines', 'Map', 'Schedule', 'Notification'].map((tab) => (
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

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-800 mb-1">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Explain what went wrong or what you encountered..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm"
                    required
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md transition duration-200"
                >
                  🪲 Submit Bug Report
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
