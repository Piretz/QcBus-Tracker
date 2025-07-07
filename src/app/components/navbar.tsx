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
              () => {
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
    <nav className="bg-blue-700 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo / Brand */}
        <Link href="/" className="text-2xl font-bold tracking-tight flex items-center space-x-2">
          <span>🚍</span>
          <span className="font-extrabold">Libreng Sakay QC</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`px-3 py-1 rounded-lg text-sm transition-all duration-200 ${
                pathname === link.path
                  ? 'bg-white text-blue-700 font-semibold shadow-sm'
                  : 'hover:bg-blue-600 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden px-4 pt-2 pb-4 bg-blue-600 transition-all duration-300 overflow-hidden rounded-b-2xl shadow-lg ${
          menuOpen ? 'max-h-[500px]' : 'max-h-0'
        }`}
        style={{ transitionProperty: 'max-height' }}
      >
        <div className="flex flex-col space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setMenuOpen(false)}
              className={`block py-2 px-3 rounded-lg text-sm transition-all ${
                pathname === link.path
                  ? 'bg-white text-blue-700 font-semibold'
                  : 'text-white hover:bg-blue-500'
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
