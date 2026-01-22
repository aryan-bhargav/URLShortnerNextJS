import Navbar from "@/components/navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Analyze link performance and user engagement.",
};

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-[#050b18] to-[#0a1f44] px-6 py-10">
        {children}
      </main>
    </>
  );
}
