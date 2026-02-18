import "./globals.css";
import Navbar from "@/components/navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "URL Shortener | Fast, Secure & Trackable Links",
    template: "%s | URL Shortener",
  },
  description:
    "Create short links, track clicks, manage expiration, and analyze performance with a modern URL shortening platform.",
  keywords: [
    "URL shortener",
    "link shortener",
    "short links",
    "track links",
    "analytics",
    "link management",
  ],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  metadataBase: new URL("https://yourdomain.com"),

  openGraph: {
    title: "URL Shortener",
    description:
      "Create short links, track clicks, and manage links with a modern dashboard.",
    url: "https://yourdomain.com",
    siteName: "URL Shortener",
    images: [
      {
        url: "/og-image.png", // add later
        width: 1200,
        height: 630,
        alt: "URL Shortener Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "URL Shortener",
    description:
      "Shorten links and track analytics with a modern URL shortening tool.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        <main>
          <div className="h-10 md:h-5"></div>
          {children}
          </main>
      </body>
    </html>
  );
}
