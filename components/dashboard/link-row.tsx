"use client";

import { useState } from "react";
import { DashboardLink } from "./dashboard-container";

export default function LinkRow({
  link,
}: {
  link: DashboardLink;
}) {
  const [copied, setCopied] = useState(false);

  const shortUrl = `${window.location.origin}/api/redirect/${link.shortCode}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-4 px-4 py-3 items-center border-b border-white/10 text-sm">
      {/* Short link */}
      <a
        href={`/api/redirect/${link.shortCode}`}
        target="_blank"
        className="text-blue-400 hover:underline truncate"
      >
        {link.shortCode}
      </a>

      {/* Original URL */}
      <span className="truncate text-gray-300">
        {link.originalUrl}
      </span>

      {/* Clicks */}
      <span className="text-gray-300">
        {link.visits}
      </span>

      {/* Status + actions */}
      <div className="flex items-center gap-3">
        <span
          className={`text-xs px-2 py-1 rounded ${link.isActive
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
            }`}
        >
          {link.isActive ? "Active" : "Inactive"}
        </span>

        <button
          onClick={handleCopy}
          className="
    text-xs
    transition
    hover:text-white
    disabled:opacity-60
  "
        >

          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
