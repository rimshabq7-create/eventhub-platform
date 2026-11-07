'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem('currentUser');
    if (stored) setUser(JSON.parse(stored));

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    setDropdownOpen(false);
    window.location.href = '/';
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">📅</span>
            <span className="text-xl font-bold text-primary">
              Event<span className="text-accent">Hub</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-700 hover:text-primary font-medium transition">Home</Link>
            <Link href="/events" className="text-gray-700 hover:text-primary font-medium transition">Events</Link>
            <Link href="/categories" className="text-gray-700 hover:text-primary font-medium transition">Categories</Link>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <span className="text-xl">👤</span>
                  <span className="font-medium text-primary">{user.name}</span>
                  <span className="text-xs">▼</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border">
                    <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-100 transition">
                      📊 Dashboard
                    </Link>
                    <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100 transition">
                      👤 Profile
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500 transition"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  href="/login"
                  className="px-5 py-2 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-secondary transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden text-2xl text-primary"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-4 border-t flex flex-col gap-2">
            <Link href="/" className="py-2 text-gray-700 font-medium">Home</Link>
            <Link href="/events" className="py-2 text-gray-700 font-medium">Events</Link>
            <Link href="/categories" className="py-2 text-gray-700 font-medium">Categories</Link>
            {user ? (
              <>
                <Link href="/dashboard" className="py-2 text-gray-700 font-medium">Dashboard</Link>
                <Link href="/profile" className="py-2 text-gray-700 font-medium">Profile</Link>
                <button onClick={handleLogout} className="py-2 text-red-500 text-left font-medium">
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2 mt-3">
                <Link href="/login" className="flex-1 text-center px-4 py-2 border-2 border-primary text-primary rounded-lg font-semibold">
                  Login
                </Link>
                <Link href="/register" className="flex-1 text-center px-4 py-2 bg-primary text-white rounded-lg font-semibold">
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}