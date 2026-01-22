"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { CheckIcon, CopyIcon, EyeIcon } from "lucide-react";

interface UrlI {
  id: string;
  shortCode: string;
  originalUrl: string;
  visits: number;
}

const UrlList = () => {
  const [urls, setUrls] = useState<UrlI[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ||
    window.location.origin;

  const shortLink = (shortCode: string) =>
    `${baseUrl}/api/redirect/${shortCode}`;

  const handleCopyUrl = async (shortCode: string, id: string) => {
    await navigator.clipboard.writeText(shortLink(shortCode));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const fetchUrls = async () => {
    try {
      const response = await fetch("/api/urls", {
        cache: "no-store",
      });
      const data = await response.json();
      setUrls(data);
    } catch (error) {
      console.error("Failed to fetch URLs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 p-6 rounded-xl glass">
      <h2 className="text-xl font-semibold mb-4">Recent URLs</h2>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : urls.length === 0 ? (
        <p className="text-gray-400">No URLs found.</p>
      ) : (
        <ul className="space-y-4">
          {urls.map((url) => (
            <li
              key={url.id}
              className="flex items-center justify-between p-4 rounded-lg border border-white/10 hover:border-white/20 transition"
            >
              <Link
                href={`/api/redirect/${url.shortCode}`}
                className="text-blue-400 hover:underline break-all"
                target="_blank"
              >
                {url.shortCode}
              </Link>

              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopyUrl(url.shortCode, url.id)}
                >
                  {copiedId === url.id ? (
                    <CheckIcon className="text-green-400" />
                  ) : (
                    <CopyIcon className="w-4 h-4" />
                  )}
                </Button>

                <span className="flex items-center text-sm text-gray-400">
                  <EyeIcon className="w-4 h-4 mr-1" />
                  {url.visits ?? 0}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UrlList;
