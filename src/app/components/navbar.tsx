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
        localStorage.setItem('locationRequested', 'true'); // set regardless of choice

        if (result.isConfirmed) {
          if ('geolocation' in navigator) {
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
              (error) => {
                console.error(error);
                Swal.fire({
                  icon: 'error',
                  title: 'Location Access Denied',
                  text: 'Please enable location in your browser settings.',
                });
              }
            );
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Not Supported',
              text: 'Geolocation is not supported by your browser.',
            });
          }
        }
      });
    }
  }, []);

  return (
    <nav className="bg-blue-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-bold tracking-tight">🚍 Libreng Sakay QC</h1>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`px-3 py-1 rounded-md transition duration-200 ${
                pathname === link.path
                  ? 'bg-white text-blue-700 font-semibold'
                  : 'hover:bg-blue-600 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 pt-2 bg-blue-600 rounded-b-xl transition-all duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setMenuOpen(false)}
              className={`block py-2 px-3 rounded-md transition ${
                pathname === link.path
                  ? 'bg-white text-blue-700 font-semibold'
                  : 'text-white hover:bg-blue-500'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
