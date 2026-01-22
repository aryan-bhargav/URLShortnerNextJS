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
      const body: any = { originalUrl, isActive };

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
    <div className="w-full max-w-xl mx-auto glass rounded-xl">
      <div className="relative">
        <div className="absolute inset-0 backdrop-blur-2xl rounded-2xl" />

        <div className="hidden sm:block absolute top-0 -left-20 w-60 h-60 bg-gradient-to-br from-cyan-300/20 to-transparent rounded-full blur-3xl opacity-60" />
        <div className="hidden sm:block absolute top-1/3 -right-32 w-72 h-72 bg-gradient-to-bl from-blue-300/15 to-transparent rounded-full blur-3xl opacity-50" />
        <div className="hidden sm:block absolute bottom-0 left-1/3 w-48 h-48 bg-gradient-to-tr from-cyan-400/10 to-transparent rounded-full blur-3xl opacity-40" />

        <div className="relative px-4 sm:px-6 md:px-10 py-6 sm:py-8 md:py-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-8">
            Create Short Link
          </h2>

          <div className="space-y-6">
            <input
              type="url"
              placeholder="https://example.com"
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:ring-2 focus:ring-cyan-400/50 outline-none"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
            />

            <input
              type="text"
              placeholder="Custom short code (optional)"
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:ring-2 focus:ring-amber-400/50 outline-none"
              value={shortCode}
              onChange={(e) => setShortCode(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="datetime-local"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-blue-400/50 outline-none"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                />
              </div>

              <input
                type="number"
                min="1"
                placeholder="Max clicks"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:ring-2 focus:ring-green-400/50 outline-none"
                value={maxClicks}
                onChange={(e) => setMaxClicks(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">Link Status</p>
                <p className="text-xs text-white/50">
                  {isActive ? 'Link is active' : 'Link is inactive'}
                </p>
              </div>

              <button
                onClick={() => setIsActive(!isActive)}
                className={`relative w-14 h-8 rounded-full transition ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                    : 'bg-white/10'
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    isActive ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {error && (
              <div className="flex gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {success && (
              <div className="flex gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <p className="text-sm text-green-300">Link created successfully</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:shadow-xl disabled:opacity-50"
            >
              {loading ? 'Creating…' : 'Shorten URL'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
