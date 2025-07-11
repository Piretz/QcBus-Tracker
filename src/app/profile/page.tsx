'use client';

import { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/navigation';
import { UserCircle, Mail, BadgeInfo, LogOut } from 'lucide-react';
import Swal from 'sweetalert2';

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

    Swal.fire({
      icon: 'success',
      title: 'Signed out successfully!',
      text: 'You have been logged out.',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
    });

    setTimeout(() => {
      router.push('/login');
    }, 2000); // Redirect after alert
  };

  return (
    <>
      <Navbar />
      <main className="min-h-[85vh] bg-gradient-to-tr from-blue-50 via-white to-blue-100 px-4 py-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10 bg-cover bg-center pointer-events-none" />

        <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-md border border-gray-200 shadow-2xl rounded-3xl p-10 space-y-10 z-10 relative animate-fade-in-up">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 p-[3px] animate-pulse shadow-md">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                  <UserCircle className="w-20 h-20 text-blue-600" />
                </div>
              </div>
              <div className="absolute -top-2 -right-2 text-xs bg-blue-500 text-white px-2 py-1 rounded-full shadow">
                Active
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight drop-shadow-sm">Welcome</h1>
              <p className="text-gray-600 mt-1 text-sm">Manage your profile and preferences below</p>
            </div>
          </div>

          {/* Main Info */}
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin mx-auto" />
              <p className="text-gray-600 mt-4">Loading your profile...</p>
            </div>
          ) : user ? (
            <div className="space-y-6">
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-blue-700">Profile Info</h2>

                <div className="flex items-center gap-4 p-4 bg-white shadow rounded-xl border border-blue-100 hover:shadow-md transition-all">
                  <BadgeInfo className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase">Full Name</p>
                    <p className="text-base text-blue-900 font-medium">{user.displayName || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white shadow rounded-xl border border-blue-100 hover:shadow-md transition-all">
                  <Mail className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase">Email Address</p>
                    <p className="text-base text-blue-900 font-medium">{user.email}</p>
                  </div>
                </div>
              </section>

              {/* Logout */}
              <div className="pt-6">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg w-full justify-center transition-transform duration-200 active:scale-95 group"
                >
                  <LogOut className="w-5 h-5 group-hover:rotate-[-20deg] transition-transform" />
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <p className="text-red-600 text-center">You are not logged in.</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
