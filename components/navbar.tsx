'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import LogoutButton from './logout-button';

interface NavItem {
  name: string;
  href: string;
}

interface User {
  id: string;
  name: string | null;
  email: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<User | null>(null);

  const navItems: NavItem[] = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Analytics', href: '/analytics' },
  ];

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/me');
        if (!res.ok) return;
        const data = await res.json();
        setUser(data);
      } catch {}
    };

    fetchUser();
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (href: string) => pathname === href;

  const initials =
    user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() ??
    user?.email?.[0]?.toUpperCase() ??
    'U';

  return (
    <nav className="fixed top-5 left-1/2 -translate-x-1/2 w-[80%] sm:w-[90%] max-w-2xl z-50">
      {/* Glass background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-slate-800/40 to-slate-900/50 backdrop-blur-xl rounded-full border border-white/15 shadow-2xl" />

      {/* Navbar content */}
      <div className="relative flex items-center justify-between px-4 py-4 sm:px-6 md:px-8 md:py-1">
        {/* Logo */}
        <Link href="/" className="font-bold text-white text-sm md:text-base">
          URL Shortener
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                isActive(item.href)
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Desktop profile */}
          {user && (
            <div className="hidden md:block relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen((p) => !p)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                  {initials}
                </div>
                <span className="text-white/80 text-sm">
                  {user.name ?? 'User'}
                </span>
              </button>

              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 rounded-xl bg-slate-800/95 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-white font-semibold text-sm">
                      {user.name ?? 'User'}
                    </p>
                    <p className="text-white/50 text-xs">
                      {user.email}
                    </p>
                  </div>
                  <LogoutButton />
                </div>
              )}
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen((p) => !p)}
            className="md:hidden p-2 hover:bg-white/10 rounded-lg"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-1/2 -translate-x-1/2 w-[95%] mt-3 rounded-2xl bg-slate-800/95 backdrop-blur-xl border border-white/20 shadow-2xl">
          <div className="p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium ${
                  isActive(item.href)
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {user && (
              <>
                <div className="border-t border-white/10 pt-3">
                  <div className="flex items-center gap-3 px-4 py-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                      {initials}
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">
                        {user.name ?? 'User'}
                      </p>
                      <p className="text-white/50 text-xs">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <LogoutButton />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
