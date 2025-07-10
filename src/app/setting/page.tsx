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
              <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full shadow-inner">
                <User size={22} />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Developer</h2>
                <p className="text-sm text-gray-600">Arjay Tebia</p>
                <p className="text-xs text-gray-400">Bus Tracker Application</p>
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

                {/* Name Input */}
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

                {/* Tabs Affected */}
                <div>
                  <label className="block text-sm font-medium mb-2">Which section is affected?</label>
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

                {/* Bug Description */}
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

                {/* Submit Button */}
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
