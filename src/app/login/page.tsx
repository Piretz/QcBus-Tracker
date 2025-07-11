'use client';

import { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase"; // Ensure this path is correct

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: `Welcome back, ${user.displayName || 'User'}!`,
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      setTimeout(() => router.push('/'), 3500);
    } catch (err: any) {
      console.error("Firebase login error:", err);

      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Incorrect email or password.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: err.message || 'Something went wrong. Please try again.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-blue-100 to-white px-4">
        <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md border border-gray-100">
          <h1 className="text-3xl font-bold text-center text-blue-700 mb-2">
            🔐 Login to Libreng Sakay QC
          </h1>
          <p className="text-center text-gray-600 mb-6 text-sm">
            Please log in to access real-time tracking, schedules, and more.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm text-gray-700 block mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 block mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don’t have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
