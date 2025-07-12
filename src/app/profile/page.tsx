'use client';

import { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/navigation';
import { UserCircle, Mail, BadgeInfo, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <>
      <Navbar />
      <main className="min-h-[85vh] bg-gradient-to-br from-white via-blue-50 to-blue-100 px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white shadow-2xl rounded-3xl p-10 space-y-10 border border-gray-100 animate-fade-in-down">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="bg-blue-100 p-4 rounded-full">
              <UserCircle className="w-20 h-20 text-blue-700" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-blue-800">My Profile</h1>
              <p className="text-gray-500 mt-1 text-sm">Manage your account and preferences</p>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <p className="text-gray-500 mt-6">Loading profile...</p>
          ) : user ? (
            <div className="space-y-6 text-base">
              {/* Name */}
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-white rounded-xl shadow">
                <BadgeInfo className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500 font-semibold uppercase">Name</p>
                  <p className="text-lg text-blue-900 font-medium">{user.displayName || 'Not provided'}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-white rounded-xl shadow">
                <Mail className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500 font-semibold uppercase">Email</p>
                  <p className="text-lg text-blue-900 font-medium">{user.email}</p>
                </div>
              </div>

              {/* Logout Button */}
              <div className="pt-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-200 ease-in-out w-full justify-center group"
                >
                  <LogOut className="w-5 h-5 group-hover:rotate-[-20deg] transition-transform" />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <p className="text-red-600 font-medium">Not logged in</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
