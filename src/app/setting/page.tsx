'use client';

import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { useState } from 'react';
import { Bug, CheckCircle } from 'lucide-react';

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
      <main className="min-h-[85vh] bg-[#f8f9fa] text-black px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-10">

          {/* Header */}
          <div className="text-left space-y-2">
            <h1 className="text-4xl font-semibold">⚙️ Settings</h1>
            <p className="text-gray-600 text-base">Adjust your preferences and report any issues.</p>
          </div>

          {/* Developer Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-medium mb-1">👨‍💻 Developer</h2>
            <p className="text-gray-600 text-sm">Arjay Tebia</p>
          </div>

          {/* Bug Report Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Bug className="text-blue-600" />
              <h2 className="text-xl font-medium">Report a Bug</h2>
            </div>

            {submitted ? (
              <div className="flex items-center gap-3 text-green-600 font-medium bg-green-50 p-4 rounded-md border border-green-200">
                <CheckCircle size={20} />
                Thank you! Your bug report has been submitted.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 mt-4">

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Juan Dela Cruz"
                    className="w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Tabs */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Affected Section</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {['Lines', 'Map', 'Schedule', 'Notification'].map((tab) => (
                      <label
                        key={tab}
                        className={`text-sm flex items-center justify-center px-3 py-2 rounded-md border cursor-pointer transition
                          ${form.tab === tab ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
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
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Explain what went wrong..."
                    className="w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md shadow-sm transition w-full sm:w-auto"
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
