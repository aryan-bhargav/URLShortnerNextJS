import Navbar from "@/components/navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your short links and monitor performance.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-[#010204] to-[#000000] px-6 py-10">
        {children}
      </main>
    </>
  );
}
