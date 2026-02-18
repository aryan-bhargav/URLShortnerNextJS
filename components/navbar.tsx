'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LogOut, User, ChevronDown } from 'lucide-react';
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
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<User | null>(null);

  const navItems: NavItem[] = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Analytics', href: '/analytics' },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

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
    <>
      <style>{`
        @keyframes navSlideDown {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes mobileMenuIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .nav-mounted {
          animation: navSlideDown 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .mobile-menu-animate {
          animation: mobileMenuIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .dropdown-animate {
          animation: dropdownIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .nav-link-indicator {
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          border-radius: 9999px;
          background: #22d3ee;
          transition: all 0.2s ease;
        }
        .avatar-ring {
          background: conic-gradient(from 0deg, #22d3ee, #3b82f6, #8b5cf6, #22d3ee);
        }
      `}</style>

      <nav
        className={`
          fixed top-4 left-0 right-0 mx-auto z-50
          w-[92%] sm:w-[88%] max-w-2xl
          ${mounted ? 'nav-mounted' : 'opacity-90'}
          transition-all duration-500
        `}
      >
        {/* Glass pill background */}
        <div
          className={`
            absolute inset-0 rounded-2xl sm:rounded-full
            border transition-all duration-500
            ${scrolled
              ? 'bg-slate-900/80 border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]'
              : 'bg-slate-900/50 border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.07)]'
            }
            backdrop-blur-4xl
          `}
        />

        {/* Top shimmer line */}
        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full" />

        {/* Navbar content */}
        <div className="relative flex items-center justify-between px-4 py-2.5 sm:px-5 sm:py-2">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
          >
            {/* Logo icon */}
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_12px_rgba(34,211,238,0.4)] group-hover:shadow-[0_0_18px_rgba(34,211,238,0.6)] transition-shadow duration-300">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
            <span className="font-bold text-white text-sm tracking-tight group-hover:text-cyan-300 transition-colors duration-200">
              Short<span className="text-cyan-400">ly</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  relative px-4 py-2 rounded-full text-sm font-medium
                  transition-all duration-200
                  ${isActive(item.href)
                    ? 'text-white bg-white/15'
                    : 'text-white/60 hover:text-white hover:bg-white/8'
                  }
                `}
              >
                {item.name}
                {isActive(item.href) && <span className="nav-link-indicator" />}
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
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-full hover:bg-white/10 transition-all duration-200 group"
                >
                  {/* Avatar with gradient ring */}
                  <div className="relative">
                    <div className="avatar-ring w-8 h-8 rounded-full p-[1.5px]">
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                        {initials}
                      </div>
                    </div>
                  </div>
                  <span className="text-white/80 text-sm font-medium max-w-[80px] truncate">
                    {user.name?.split(' ')[0] ?? 'User'}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-white/40 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Profile dropdown */}
                {isProfileOpen && (
                  <div className="dropdown-animate absolute top-full right-0 mt-2 w-52 rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden">
                    {/* Top accent */}
                    <div className="h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

                    <div className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="avatar-ring w-9 h-9 rounded-full p-[1.5px] shrink-0">
                          <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                            {initials}
                          </div>
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-semibold text-sm truncate">{user.name ?? 'User'}</p>
                          <p className="text-white/40 text-xs truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mx-3 h-px bg-white/8" />

                    <div className="p-2">
                      <LogoutButton />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen((p) => !p)}
              className="md:hidden relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-all duration-200"
              aria-label="Toggle menu"
            >
              <span
                className={`absolute transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'}`}
              >
                <X className="w-4.5 h-4.5 text-white" />
              </span>
              <span
                className={`absolute transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 -rotate-90' : 'opacity-100 rotate-0'}`}
              >
                <Menu className="w-4.5 h-4.5 text-white" />
              </span>
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {isMobileMenuOpen && (
          <div className="mobile-menu-animate md:hidden absolute top-full left-0 right-0 mt-2 rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden">
            {/* Top accent */}
            <div className="h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

            <div className="p-3 space-y-1">
              {navItems.map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium
                    transition-all duration-200
                    ${isActive(item.href)
                      ? 'bg-white/15 text-white'
                      : 'text-white/60 hover:bg-white/8 hover:text-white'
                    }
                  `}
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <span>{item.name}</span>
                  {isActive(item.href) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  )}
                </Link>
              ))}
            </div>

            {/* User section in mobile */}
            {user && (
              <>
                <div className="mx-3 h-px bg-white/8" />
                <div className="p-3">
                  <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
                    <div className="avatar-ring w-9 h-9 rounded-full p-[1.5px] shrink-0">
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                        {initials}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{user.name ?? 'User'}</p>
                      <p className="text-white/40 text-xs truncate">{user.email}</p>
                    </div>
                  </div>
                  <LogoutButton />
                </div>
              </>
            )}

            {/* Bottom accent */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
          </div>
        )}
      </nav>

      {/* Mobile backdrop overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          style={{ animation: 'fadeIn 0.2s ease forwards' }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}