'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '@/components/ui/ThemeToggle';

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
    <header className="border-b fixed top-0 left-0 right-0 z-50 px-6 py-4" style={{
      borderColor: 'var(--border-primary)',
      backgroundColor: 'var(--bg-secondary)'
    }}>
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="no-underline" scroll={false}>
          <div className="flex items-center gap-2 cursor-pointer transition-colors" style={{
            color: 'var(--text-primary)'
          }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-blue)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}>
            <div className="w-8 h-8 rounded flex items-center justify-center font-mono font-bold" style={{
              backgroundColor: 'var(--accent-blue)',
              color: 'white'
            }}>
              T
            </div>
            <span className="text-xl font-semibold">
              Terminal Mastery
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2">
          <Link href="/" className="no-underline" scroll={false}>
            <button className="nav-link">
              Home
            </button>
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />

          {user ? (
            <>
              <Link href="/lessons" className="no-underline" scroll={false}>
                <button className="nav-link">
                  Lessons
                </button>
              </Link>

              {/* User Menu */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="nav-link flex items-center gap-2"
                >
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{
                    backgroundColor: 'var(--accent-blue)'
                  }}>
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  {user.email}
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50 clean-card" style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-primary)'
                  }}>
                    <div className="py-1">
                      <div className="px-4 py-2 text-xs border-b" style={{
                        color: 'var(--text-muted)',
                        borderColor: 'var(--border-primary)'
                      }}>
                        {user.email}
                      </div>
                      <button
                        onClick={handleSignOut}
                        disabled={loading}
                        className="w-full text-left px-4 py-2 text-sm transition-colors disabled:opacity-50"
                        style={{
                          color: 'var(--text-secondary)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                          e.currentTarget.style.color = 'var(--text-primary)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'var(--text-secondary)';
                        }}
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
                <button className="nav-link">
                  Sign In
                </button>
              </Link>

              <Link href="/signup" className="no-underline" scroll={false}>
                <button className="clean-button-primary text-sm font-medium px-4 py-2">
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