"use client";

import { useEffect, useState } from "react";
import { DashboardLink } from "./dashboard-container";
import OriginalUrlPopover from "./LinkRow/OriginalUrlPopover"
import ShortLink from "./LinkRow/ShortLink"
import StatusBadge from "./LinkRow/StatusBadge";
import CopyButton from "./LinkRow/CopyButton";
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
      <div className="
      grid
      grid-cols-1
      gap-y-3
      px-4 py-4
      md:grid-cols-[1fr_2fr_0.5fr_1.5fr_1fr]
      md:items-center
      md:gap-x-4
      md:py-3
    ">

        {/* Short Link */}
        <ShortLink shortCode={link.shortCode} shortUrl={shortUrl} />

        {/* Original URL */}
        <OriginalUrlPopover
          originalUrl={link.originalUrl}
          urlCopied={urlCopied}
          onCopy={handleUrlCopy}
        />

        {/* Visits */}
        <span className="text-gray-300 font-medium tabular-nums text-sm">
          {link.visits}
        </span>

        {/* Expiry */}
        <span className="text-gray-300 text-sm">
          {link.expiresAt
            ? new Date(link.expiresAt).toLocaleString()
            : "Never"}
        </span>

        {/* Status + Copy */}
        <div className="flex items-center justify-between md:justify-end gap-3">
          <StatusBadge active={linkIsActive} />
          <CopyButton copied={copied} onClick={handleCopy} />
        </div>

      </div>
    </div>
  );

}