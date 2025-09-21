"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { CheckIcon, CopyIcon, EyeIcon } from "lucide-react";

interface UrlI {
  id: string;
  shortCode: string;
  originalUrl: string; 
  shortUrl: string;    
  visits: number;   
}

const UrlList = () => {
  const [urls, setUrls] = useState<UrlI[]>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const handleCopyUrl = (shortUrl:string) => {
    navigator.clipboard.writeText(shortenUrlLinkGenerator(shortUrl)).then(()=>{
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    })
  }

  const shortenUrlLinkGenerator=(shortCode:string)=>{
    return `${process.env.NEXT_PUBLIC_BASE_URL}/${shortCode}`;
  }

  const fetchUrls = async () => {
    try {
      const response = await fetch("/api/urls");
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
    <div className="w-full max-w-2xl mx-auto mt-8 p-6 rounded-xl">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent URLs</h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : urls.length === 0 ? (
        <p className="text-gray-500">No URLs found.</p>
      ) : (
        <ul className="space-y-4">
          {urls.map((url) => (
            <li
              key={url.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition"
            >
              <Link
                href={shortenUrlLinkGenerator(url.shortCode)}
                className="text-blue-600 hover:underline break-all"
                target="_blank"
              >
                {shortenUrlLinkGenerator(url.shortCode) || url.originalUrl}
              </Link>

              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:text-blue-600"
                  onClick={() => handleCopyUrl(url.shortCode)}
                >
                  {(copied)? <CheckIcon/> : <CopyIcon className="w-4 h-4" />}
                </Button>
                <span className="flex items-center text-sm text-gray-500">
                  <EyeIcon className="w-4 h-4 mr-1" /> {url.visits ?? 0} views
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
