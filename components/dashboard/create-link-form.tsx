'use client';

import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface CreateLinkFormProps {
  onSuccess: () => void;
}

export default function CreateLinkForm({ onSuccess }: CreateLinkFormProps) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [maxClicks, setMaxClicks] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!originalUrl) {
      setError('Original URL is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const body: any = {
        originalUrl,
        isActive,
      };

      if (shortCode.trim()) body.shortCode = shortCode.trim();
      if (expiresAt) body.expiresAt = expiresAt;
      if (maxClicks) body.maxClicks = Number(maxClicks);

      const res = await fetch('/api/urls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create link');
      }

      setOriginalUrl('');
      setShortCode('');
      setExpiresAt('');
      setMaxClicks('');
      setIsActive(true);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Main Glassmorphism Container */}
      <div className="relative">
        {/* Gradient Background Blur */}
        <div className="absolute inset-0  backdrop-blur-2xl rounded-2xl" />

        {/* Glass Shine Effects */}
        <div className="absolute top-0 -left-20 w-60 h-60 bg-gradient-to-br from-cyan-300/20 to-transparent rounded-full blur-3xl opacity-60" />
        <div className="absolute top-1/3 -right-32 w-72 h-72 bg-gradient-to-bl from-blue-300/15 to-transparent rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-gradient-to-tr from-cyan-400/10 to-transparent rounded-full blur-3xl opacity-40" />

        {/* Subtle Border Highlight */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 via-transparent to-white/5 pointer-events-none" />

        {/* Content */}
        <div className="relative px-6 sm:px-8 md:px-10 py-8 sm:py-10 md:py-12">
          {/* Header */}
          <div className="mb-8 space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Create Short Link
            </h2>
          </div>

          <div className="space-y-6">
            {/* Original URL - Required */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold text-white">
                  Original URL
                </label>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-medium">
                  Required
                </span>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/0 to-blue-400/0 group-focus-within:from-cyan-400/20 group-focus-within:to-blue-400/20 rounded-lg transition-all duration-300" />
                <input
                  type="url"
                  placeholder="https://example.com/very-long-url-here"
                  className="relative w-full px-4 py-3 sm:py-3.5 md:py-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-white/20 transition-all duration-300 text-sm md:text-base"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                />
              </div>
            </div>

            {/* Short Code - Optional */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold text-white">
                  Custom Short Code
                </label>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-medium">
                  Optional
                </span>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/0 to-orange-400/0 group-focus-within:from-amber-400/20 group-focus-within:to-orange-400/20 rounded-lg transition-all duration-300" />
                <input
                  type="text"
                  placeholder="my-link (leave empty for auto-generated)"
                  className="relative w-full px-4 py-3 sm:py-3.5 md:py-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-white/20 transition-all duration-300 text-sm md:text-base"
                  value={shortCode}
                  onChange={(e) => setShortCode(e.target.value)}
                />
              </div>
              <p className="text-xs text-white/40">
                Leave empty to auto-generate a unique short link
              </p>
            </div>

            {/* Advanced Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Expiry Date - Optional */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold text-white">
                    Expiry Date
                  </label>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-medium">
                    Optional
                  </span>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/0 to-purple-400/0 group-focus-within:from-blue-400/20 group-focus-within:to-purple-400/20 rounded-lg transition-all duration-300" />
                  <div className="relative flex items-center">
                    <Clock className="absolute left-3 w-4 h-4 text-white/40 pointer-events-none" />
                    <input
                      type="datetime-local"
                      className="relative w-full pl-10 pr-4 py-3 sm:py-3.5 md:py-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-white/20 transition-all duration-300 text-sm md:text-base"
                      value={expiresAt}
                      placeholder='slect date'
                      onChange={(e) => setExpiresAt(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Max Clicks - Optional */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold text-white">
                    Max Clicks
                  </label>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-300 text-xs font-medium">
                    Optional
                  </span>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/0 to-emerald-400/0 group-focus-within:from-green-400/20 group-focus-within:to-emerald-400/20 rounded-lg transition-all duration-300" />
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 100"
                    className="relative w-full px-4 py-3 sm:py-3.5 md:py-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-white/20 transition-all duration-300 text-sm md:text-base"
                    value={maxClicks}
                    onChange={(e) => setMaxClicks(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/[7%] transition-all duration-300">
              <div className="flex-1">
                <label className="text-sm font-semibold text-white block mb-1">
                  Link Status
                </label>
                <p className="text-xs text-white/50">
                  {isActive ? 'Link is active and can be used' : 'Link is inactive'}
                </p>
              </div>
              <button
                onClick={() => setIsActive(!isActive)}
                className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/40'
                    : 'bg-white/10'
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                    isActive ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30 animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-300">{error}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/30 animate-in fade-in slide-in-from-top-2 duration-300">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-300">
                    Link created successfully!
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 sm:py-3.5 md:py-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold text-sm md:text-base hover:shadow-xl hover:shadow-cyan-500/40 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Creating Link...
                </span>
              ) : (
                'Shorten URL'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
