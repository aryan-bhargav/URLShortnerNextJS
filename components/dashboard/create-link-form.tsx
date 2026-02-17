'use client';

import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Clock, Hash, Link2, MousePointerClick, Power } from 'lucide-react';

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
    if (!originalUrl) { setError('Original URL is required'); return; }
    setLoading(true); setError(''); setSuccess(false);

    try {
      const body: Record<string, unknown> = { originalUrl, isActive };
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

      setOriginalUrl(''); setShortCode(''); setExpiresAt('');
      setMaxClicks(''); setIsActive(true);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Glass card */}
      <div className="relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_4px_32px_rgba(0,0,0,0.35)] overflow-hidden">

        {/* Top-edge accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

        {/* Ambient glow blobs — hidden on smallest screens to save paint */}
        <div aria-hidden className="pointer-events-none absolute -top-16 -left-16 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl hidden sm:block" />
        <div aria-hidden className="pointer-events-none absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-blue-500/8 blur-3xl hidden sm:block" />

        <div className="relative px-5 py-6 sm:px-7 sm:py-7 space-y-4">

          {/* Header */}
          <div className="flex items-center gap-2.5 mb-1">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-400/20">
              <Link2 className="w-3.5 h-3.5 text-cyan-400" />
            </span>
            <h2 className="text-base font-semibold text-white tracking-tight">New short link</h2>
          </div>

          {/* ── URL input (primary, slightly larger) ── */}
          <Field icon={<Link2 className="w-3.5 h-3.5" />} accent="cyan">
            <input
              type="url"
              placeholder="https://your-long-url.com"
              className="field-input"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
            />
          </Field>

          {/* ── Secondary row: short code + max clicks ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field icon={<Hash className="w-3.5 h-3.5" />} accent="amber">
              <input
                type="text"
                placeholder="Custom code (optional)"
                className="field-input"
                value={shortCode}
                onChange={(e) => setShortCode(e.target.value)}
              />
            </Field>

            <Field icon={<MousePointerClick className="w-3.5 h-3.5" />} accent="green">
              <input
                type="number"
                min="1"
                placeholder="Max clicks"
                className="field-input"
                value={maxClicks}
                onChange={(e) => setMaxClicks(e.target.value)}
              />
            </Field>
          </div>

          {/* ── Expiry + toggle in one row ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field icon={<Clock className="w-3.5 h-3.5" />} accent="blue">
              <input
                type="datetime-local"
                className="field-input [color-scheme:dark]"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </Field>

            {/* Status toggle */}
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`
                flex items-center justify-between gap-3 px-3.5 py-2.5
                rounded-xl border transition-all duration-200
                ${isActive
                  ? 'bg-emerald-500/10 border-emerald-400/25 hover:bg-emerald-500/15'
                  : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.07]'}
              `}
            >
              <div className="flex items-center gap-2">
                <Power className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-emerald-400' : 'text-gray-500'}`} />
                <span className="text-xs font-medium text-gray-300">
                  {isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              {/* Pill toggle */}
              <div className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${isActive ? 'bg-emerald-500' : 'bg-white/15'}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${isActive ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
              </div>
            </button>
          </div>

          {/* ── Error / Success feedback ── */}
          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              Link created successfully!
            </div>
          )}

          {/* ── Submit ── */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="
              relative w-full py-2.5 rounded-xl
              bg-gradient-to-r from-cyan-500 to-blue-500
              hover:from-cyan-400 hover:to-blue-400
              active:scale-[0.99]
              disabled:opacity-50 disabled:cursor-not-allowed
              text-white text-sm font-semibold
              shadow-[0_2px_20px_rgba(6,182,212,0.25)]
              hover:shadow-[0_4px_24px_rgba(6,182,212,0.35)]
              transition-all duration-200
              overflow-hidden
            "
          >
            {/* shimmer on hover */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
            <span className="relative">{loading ? 'Creating…' : 'Shorten URL'}</span>
          </button>

        </div>
      </div>

      {/* Shared field styles injected once */}
      <style>{`
        .field-input {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          font-size: 0.8125rem;
          color: #e2e8f0;
          padding: 0;
          line-height: 1.4;
        }
        .field-input::placeholder { color: rgba(255,255,255,0.3); }
        .field-input[type="number"]::-webkit-inner-spin-button,
        .field-input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; }
      `}</style>
    </div>
  );
}

/* ── Field wrapper ───────────────────────────────────────────── */
type Accent = 'cyan' | 'amber' | 'blue' | 'green';

const accentFocus: Record<Accent, string> = {
  cyan:  'focus-within:border-cyan-400/40  focus-within:bg-cyan-400/[0.04]  focus-within:shadow-[0_0_0_3px_rgba(34,211,238,0.07)]',
  amber: 'focus-within:border-amber-400/40 focus-within:bg-amber-400/[0.04] focus-within:shadow-[0_0_0_3px_rgba(251,191,36,0.07)]',
  blue:  'focus-within:border-blue-400/40  focus-within:bg-blue-400/[0.04]  focus-within:shadow-[0_0_0_3px_rgba(96,165,250,0.07)]',
  green: 'focus-within:border-green-400/40 focus-within:bg-green-400/[0.04] focus-within:shadow-[0_0_0_3px_rgba(74,222,128,0.07)]',
};

const accentIcon: Record<Accent, string> = {
  cyan:  'text-cyan-400/60',
  amber: 'text-amber-400/60',
  blue:  'text-blue-400/60',
  green: 'text-green-400/60',
};

function Field({ icon, accent, children }: { icon: React.ReactNode; accent: Accent; children: React.ReactNode }) {
  return (
    <div className={`
      flex items-center gap-2.5 px-3.5 py-2.5
      rounded-xl border border-white/10 bg-white/[0.04]
      transition-all duration-150
      ${accentFocus[accent]}
    `}>
      <span className={`shrink-0 transition-colors ${accentIcon[accent]}`}>{icon}</span>
      {children}
    </div>
  );
}