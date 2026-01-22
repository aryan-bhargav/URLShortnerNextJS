"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    // 🔄 Refresh server components (Navbar!)
    router.refresh();

    // 🚪 Redirect
    router.push("/login");
  };

  return (
    <button onClick={handleLogout} className="w-full px-4 py-3 flex items-center gap-2 text-red-400 hover:bg-red-500/20 transition-colors duration-200 text-sm font-medium">
      <LogOut  className="w-4 h-4" />
      Logout
    </button>
  );
}
