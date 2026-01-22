"use client";

import { useEffect, useState } from "react";
import { DashboardLink } from "./dashboard-container";

export default function LinkRow({ link }: { link: DashboardLink }) {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  // ✅ SSR-safe origin
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const shortUrl = `${origin}/${link.shortCode}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 sm:gap-3 md:gap-0 px-4 sm:px-5 md:px-4 py-4 sm:py-5 md:py-4 lg:py-5 xl:py-6 border-b border-white/10 hover:bg-white/5 transition-colors text-xs sm:text-sm md:text-sm lg:text-base">
      {/* Mobile Label - Hidden on desktop */}
      {/* Short link */}
      <div className="md:contents">
        <div className="flex flex-col md:block">
          <span className="md:hidden text-gray-400 text-xs font-semibold mb-1">Short Link</span>
          <a
            href={`/api/redirect/${link.shortCode}`}
            target="_blank"
            className="text-blue-400 hover:underline truncate font-mono"
          >
            {link.shortCode}
          </a>
        </div>
      </div>

      {/* Original URL */}
      <div className="md:contents min-w-0">
        <div className="flex flex-col md:block min-w-0">
          <span className="md:hidden text-gray-400 text-xs font-semibold mb-1">
            URL
          </span>

          <span className="block truncate text-gray-300">
            {link.originalUrl}
          </span>
        </div>
      </div>


      {/* Clicks */}
      <div className="md:contents">
        <div className="flex flex-col  md:block">
          <span className="md:hidden text-gray-400 text-xs font-semibold mb-1">Clicks</span>
          <span className="text-gray-300  font-medium">
            {link.visits}
          </span>
        </div>
      </div>

      {/* Status + actions */}
      <div className="md:contents">
        <div className="flex items-center justify-between md:justify-start gap-2 sm:gap-3 md:gap-3 flex-wrap">
          <span
            className={`text-xs px-2 sm:px-3 py-1 rounded font-medium ${link.isActive
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
              }`}
          >
            {link.isActive ? "Active" : "Inactive"}
          </span>

          <button
            onClick={handleCopy}
            className="text-xs glass sm:text-sm hover:text-white transition whitespace-nowrap px-2 py-1 rounded"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}
