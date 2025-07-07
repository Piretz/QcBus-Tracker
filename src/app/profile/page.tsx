'use client';

import { useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { UserCircle2 } from 'lucide-react';

export default function ProfilePage() {
  const [user] = useState({
    name: 'Juan Dela Cruz',
    email: 'juan@example.com',
    location: 'Quezon City',
  });

  return (
    <>
      <Navbar />
      <main className="min-h-[85vh] bg-gradient-to-br from-blue-100 to-white flex items-center justify-center px-4 py-10">
        <div className="bg-white w-full max-w-xl p-8 rounded-xl shadow-xl border border-gray-100">
          <div className="flex flex-col items-center mb-6">
            <UserCircle2 className="text-blue-600 mb-2" size={60} />
            <h1 className="text-2xl font-bold text-blue-800">👤 Profile Information</h1>
            <p className="text-sm text-gray-500">View your account details below</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1 font-medium">Full Name</label>
              <input
                value={user.name}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded-lg text-black"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1 font-medium">Email</label>
              <input
                value={user.email}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded-lg text-black"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1 font-medium">Location</label>
              <input
                value={user.location}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded-lg text-black"
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
