'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Swal from 'sweetalert2';

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Routes', path: '/routes' },
    { name: 'Schedule', path: '/schedule' },
    { name: 'Map', path: '/map' },
    { name: 'Notification', path: '/notification' },
    { name: 'Setting', path: '/setting' },
  ];

  useEffect(() => {
    const hasRequestedLocation = localStorage.getItem('locationRequested');
    if (!hasRequestedLocation && typeof window !== 'undefined') {
      Swal.fire({
        title: 'Enable Location?',
        text: 'We use your location to show your real-time position on the map.',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Allow Location',
        cancelButtonText: 'Not Now',
        allowOutsideClick: false,
      }).then((result) => {
        localStorage.setItem('locationRequested', 'true');
        if (result.isConfirmed && 'geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              console.log('User location:', position.coords);
              Swal.fire({
                icon: 'success',
                title: 'Location Access Granted',
                timer: 2000,
                showConfirmButton: false,
              });
            },
            () => {
              Swal.fire({
                icon: 'error',
                title: 'Location Access Denied',
                text: 'Please enable location in your browser settings.',
              });
            }
          );
        }
      });
    }
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-blue-700/80 backdrop-blur-md shadow-md text-white transition">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold flex items-center space-x-2 hover:opacity-90 transition">
          <span>🚍</span>
          <span className="font-extrabold tracking-tight">Libreng Sakay QC</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-4 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                pathname === link.path
                  ? 'bg-white text-blue-700 shadow'
                  : 'hover:bg-white/20 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-blue-700 transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-[400px] py-4 px-6' : 'max-h-0 py-0 px-6'
        }`}
      >
        <div className="flex flex-col space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition ${
                pathname === link.path
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-white hover:bg-blue-600'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
