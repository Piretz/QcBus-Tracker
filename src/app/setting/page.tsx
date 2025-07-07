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

    setTimeout(() => {
      setSubmitted(false); // reset for next submission
    }, 5000);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-[85vh] bg-[#0D0D0D] text-white px-4 py-10">
        <div className="max-w-4xl mx-auto space-y-8">

          <h1 className="text-4xl font-bold mb-2">⚙️ Settings</h1>
          <p className="text-gray-400 mb-6 text-sm">Customize your experience or report any bugs you encounter.</p>

          {/* Developer Info */}
          <div className="bg-[#161616] p-6 rounded-xl shadow-lg border border-gray-800 hover:shadow-xl transition">
            <h2 className="text-xl font-semibold text-white mb-1">👨‍💻 Developer</h2>
            <p className="text-gray-400 text-sm">Arjay Tebia</p>
          </div>

          {/* Bug Report Section */}
          <div className="bg-[#161616] p-6 rounded-xl shadow-lg border border-gray-800 hover:shadow-xl transition">
            <div className="flex items-center gap-2 mb-4">
              <Bug className="text-green-500" />
              <h2 className="text-xl font-semibold">Report a Bug</h2>
            </div>

            {submitted ? (
              <div className="flex items-center gap-3 text-green-400 font-semibold bg-[#0f1a0f] p-4 rounded-md border border-green-600">
                <CheckCircle size={20} />
                Thank you! Your bug report has been submitted.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 mt-4">

                {/* Name */}
                <div>
                  <label className="block text-sm mb-1 font-medium">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2 rounded-md bg-[#0D0D0D] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                {/* Tab Selection */}
                <div>
                  <label className="block text-sm mb-2 font-medium">Where did you see the bug?</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-300">
                    {['Lines', 'Map', 'Schedule', 'Profile', 'Notification'].map((tab) => (
                      <label
                        key={tab}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer border border-gray-700 hover:bg-gray-800 transition ${
                          form.tab === tab ? 'bg-blue-700 text-white font-semibold' : ''
                        }`}
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
                  <label className="block text-sm mb-1 font-medium">Describe the bug</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Please describe what happened and how we can reproduce the issue..."
                    className="w-full px-4 py-3 rounded-md bg-[#0D0D0D] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md shadow-md transition w-full md:w-auto"
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
