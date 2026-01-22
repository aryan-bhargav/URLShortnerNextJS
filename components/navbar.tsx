'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Menu, X } from 'lucide-react';
import LogoutButton from './logout-button';

interface NavItem {
  name: string;
  href: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const navItems: NavItem[] = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Analytics', href: '/analytics' },
    { name: 'Profile', href: '/profile' },
  ];

  // Close dropdown when clicking outside
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

  return (
    <nav className="fixed top-5 left-1/2 -translate-x-1/2 w-[80%] sm:w-[90%] max-w-2xl z-50">
      {/* Glassmorphism Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-slate-800/40 to-slate-900/50 backdrop-blur-xl rounded-full border border-white/15 shadow-2xl" />

      {/* Glass Shine Effect - Top Left to Right */}
      <div className="absolute top-0 -left-12 w-48 h-48 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl opacity-50" />

      {/* Glass Shine Effect - Top Right */}
      <div className="absolute top-0 -right-16 w-40 h-40 bg-gradient-to-bl from-cyan-300/15 to-transparent rounded-full blur-3xl opacity-40" />

      {/* Glass Shine Effect - Bottom Left subtle */}
      <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-gradient-to-tr from-blue-400/10 to-transparent rounded-full blur-3xl opacity-25" />

      {/* Navbar Content */}
      <div className="relative flex items-center justify-between px-4 py-4 sm:px-6 md:px-8 md:py-1">
        {/* Left: Logo/Brand */}
        <Link href="/" className="flex items-center gap-2 group cursor-pointer flex-shrink-0">
          <div className="relative">
            <div className="text-white/95 font-bold text-xs sm:text-sm md:text-base tracking-tight group-hover:text-white transition-colors duration-300 whitespace-nowrap">
              URL Shortener
            </div>
            <div className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300" />
          </div>
        </Link>

        {/* Desktop Navigation - Center */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.slice(0, 3).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium text-sm ${isActive(item.href)
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-white/70 hover:text-white/90 hover:bg-white/10'
                }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right: Profile Dropdown & Mobile Menu */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Desktop Profile */}
          <div className="hidden md:block relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-xs group-hover:shadow-lg transition-shadow">
                AR
              </div>
              <span className="text-white/80 group-hover:text-white text-sm font-medium transition-colors">
                Aryan
              </span>
              <svg
                className={`w-4 h-4 text-white/60 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''
                  }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 rounded-xl bg-slate-800/95 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-white font-semibold text-sm">Aryan</p>
                  <p className="text-white/50 text-xs">aryan@example.com</p>
                </div>
                <LogoutButton/>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-1/2 -translate-x-1/2 w-[95%] sm:w-[90%] mt-3 rounded-2xl bg-slate-800/95 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg transition-all duration-300 font-medium text-sm ${isActive(item.href)
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:text-white/90 hover:bg-white/10'
                  }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-2 border-t border-white/10 mt-2">
              <div className="px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-xs">
                  AR
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Aryan</p>
                  <p className="text-white/50 text-xs">aryan@example.com</p>
                </div>
              </div>
              <button className="w-full px-4 py-3 flex items-center gap-2 text-red-400 hover:bg-red-500/20 transition-colors duration-200 text-sm font-medium">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
