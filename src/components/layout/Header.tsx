'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const Header: React.FC = () => {
  const { user, signOut, loading } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  return (
    <header className="border-b border-gray-700 bg-gray-900 fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="no-underline" scroll={false}>
          <div className="flex items-center gap-2 cursor-pointer text-white hover:text-blue-400 transition-colors">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-mono font-bold">
              T
            </div>
            <span className="text-xl font-semibold">
              Terminal Mastery
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          <Link href="/" className="no-underline" scroll={false}>
            <button className="bg-transparent border-0 text-gray-400 px-4 py-2 rounded-md cursor-pointer text-sm transition-all duration-200 hover:text-white hover:bg-gray-800">
              Home
            </button>
          </Link>

          {user ? (
            <>
              <Link href="/lessons" className="no-underline" scroll={false}>
                <button className="bg-transparent border-0 text-gray-400 px-4 py-2 rounded-md cursor-pointer text-sm transition-all duration-200 hover:text-white hover:bg-gray-800">
                  Lessons
                </button>
              </Link>

              {/* User Menu */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="bg-transparent border-0 text-gray-400 px-4 py-2 rounded-md cursor-pointer text-sm transition-all duration-200 hover:text-white hover:bg-gray-800 flex items-center gap-2"
                >
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  {user.email}
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-700">
                        {user.email}
                      </div>
                      <button
                        onClick={handleSignOut}
                        disabled={loading}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors disabled:opacity-50"
                      >
                        {loading ? 'Signing out...' : 'Sign out'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="no-underline" scroll={false}>
                <button className="bg-transparent border-0 text-gray-400 px-4 py-2 rounded-md cursor-pointer text-sm transition-all duration-200 hover:text-white hover:bg-gray-800">
                  Sign In
                </button>
              </Link>

              <Link href="/signup" className="no-underline" scroll={false}>
                <button className="bg-blue-600 border-0 text-white px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition-all duration-200 hover:bg-blue-700">
                  Get Started
                </button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;