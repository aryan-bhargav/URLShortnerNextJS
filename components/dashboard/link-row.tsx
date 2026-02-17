"use client";

import { useEffect, useState } from "react";
import { DashboardLink } from "./dashboard-container";

export default function LinkRow({ link }: { link: DashboardLink }) {
  const [copied, setCopied] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const shortUrl = `${origin}/${link.shortCode}`;

  const linkIsActive =
    link.isActive && (!link.expiresAt || new Date(link.expiresAt).getTime() > Date.now());

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUrlCopy = async () => {
    await navigator.clipboard.writeText(link.originalUrl);
    setUrlCopied(true);
    setTimeout(() => setUrlCopied(false), 2000);
  };

  // Strip protocol for cleaner pill display
  const displayUrl = link.originalUrl.replace(/^https?:\/\//, "");
  const isHttps = link.originalUrl.startsWith("https://");

  return (
    <div className="w-full hover:bg-white/5 transition-colors">

      {/* ── Mobile card (< md) ── */}
      <div className="md:hidden px-4 py-4 space-y-3">
        {/* Top row: short link + badge + copy */}
        <div className="flex items-center justify-between gap-2">
          <a
            href={`/api/redirect/${link.shortCode}`}
            target="_blank"
            className="text-blue-400 hover:underline font-mono text-sm truncate"
          >
            {shortUrl}
          </a>
          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`text-xs px-2 py-0.5 rounded font-medium ${
                link.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
              }`}
            >
              {link.isActive ? "Active" : "Inactive"}
            </span>
            <button
              onClick={handleCopy}
              className="text-xs hover:text-white transition px-2 py-1 rounded glass whitespace-nowrap"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* Original URL — mobile tooltip */}
        <div className="relative group w-fit max-w-full">
          <p className="text-gray-400 text-xs truncate cursor-pointer">{link.originalUrl}</p>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-full text-xs text-white bg-white/10 backdrop-blur-md border border-white/10 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
            {link.originalUrl}
          </div>
        </div>

        {/* Meta row: clicks + expiry */}
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span>
            <span className="font-semibold text-gray-300">{link.visits}</span> clicks
          </span>
          <span>
            Expires:{" "}
            <span className="text-gray-300">
              {link.expiresAt ? new Date(link.expiresAt).toLocaleDateString() : "Never"}
            </span>
          </span>
        </div>
      </div>

      {/* ── Desktop row (≥ md) ── */}
      <div className="hidden md:grid grid-cols-[1fr_2fr_0.5fr_1.5fr_1fr] items-center px-4 py-3 text-sm gap-x-4">

        {/* Short Link */}
        <a
          href={`/${link.shortCode}`}
          target="_blank"
          className="text-blue-400 hover:underline truncate font-mono"
        >
          {link.shortCode}
        </a>

        {/* ── Original URL — glassmorphism pill + hover popover ── */}
        <div className="group relative min-w-0">

          {/* Truncated pill trigger */}
          <div className="flex items-center gap-1.5 w-fit max-w-full px-3 py-1.5 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-200 cursor-default">
            {/* Lock icon */}
            <span className={`shrink-0 ${isHttps ? "text-emerald-400" : "text-yellow-500"}`}>
              {isHttps ? <LockIcon /> : <UnlockIcon />}
            </span>
            <span className="truncate text-gray-300 text-xs font-mono leading-none">
              {displayUrl}
            </span>
          </div>

          {/* ── Glassmorphism popover ── */}
          <div
            className="
              absolute left-0 top-full mt-3 z-50
              w-max max-w-[340px]
              opacity-0 translate-y-1.5 scale-[0.97] pointer-events-none
              group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 group-hover:pointer-events-auto
              transition-all duration-200 ease-out
            "
          >
            {/* Caret */}
            <div className="absolute -top-[5px] left-5 w-2.5 h-2.5 rotate-45 rounded-tl-[2px] bg-white/[0.08] border-l border-t border-white/15" />

            {/* Glass card */}
            <div className="relative rounded-2xl overflow-hidden bg-white/[0.07] backdrop-blur-2xl border border-white/15 shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
              {/* Inner shimmer */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent pointer-events-none" />

              <div className="relative p-3.5 flex flex-col gap-3">

                {/* Full URL */}
                <div className="flex items-start gap-2">
                  <span className={`mt-0.5 shrink-0 ${isHttps ? "text-emerald-400" : "text-yellow-500"}`}>
                    {isHttps ? <LockIcon size={13} /> : <UnlockIcon size={13} />}
                  </span>
                  <p className="text-gray-200 text-xs font-mono break-all leading-relaxed">
                    {link.originalUrl}
                  </p>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  <a
                    href={link.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-150"
                  >
                    <ExternalLinkIcon />
                    Open
                  </a>
                  <button
                    onClick={handleUrlCopy}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-150"
                  >
                    {urlCopied ? (
                      <>
                        <CheckIcon className="text-green-400" />
                        <span className="text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <CopyIcon />
                        Copy URL
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clicks */}
        <span className="text-gray-300 font-medium tabular-nums">{link.visits}</span>

        {/* Expires At */}
        <span className="text-gray-300">
          {link.expiresAt ? new Date(link.expiresAt).toLocaleString() : "Never"}
        </span>

        {/* Status + Actions */}
        <div className="flex items-center justify-end gap-3">
          <span
            className={`text-xs px-4 py-1.5 rounded-full font-medium whitespace-nowrap backdrop-blur-md border shadow-sm ${
              linkIsActive
                ? "bg-green-500/10 text-green-400 border-green-400/20"
                : "bg-red-500/10 text-red-400 border-red-400/20"
            }`}
          >
            {linkIsActive ? "Active" : "Inactive"}
          </span>
          <button
            onClick={handleCopy}
            disabled={copied}
            className="relative text-xs font-medium px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200 ease-in-out active:scale-95 disabled:cursor-default whitespace-nowrap"
          >
            <span className={`transition-opacity duration-200 ${copied ? "opacity-0" : "opacity-100"}`}>
              Copy
            </span>
            <span
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
                copied ? "opacity-100 text-green-400" : "opacity-0"
              }`}
            >
              ✓ Copied
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Inline SVG icons ──────────────────────────────────────── */

function LockIcon({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function UnlockIcon({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}