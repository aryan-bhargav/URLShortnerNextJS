"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Login failed");
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      {/* RIGHT LOGIN CARD */}
      <div className="w-full max-w-md bg-zinc-900/90 backdrop-blur-xl rounded-t-sm p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.7)]">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center font-bold">
            🔗
          </div>
          <span className="text-lg font-semibold">
            URL Shortener
          </span>
        </div>

        <h1 className="text-2xl font-semibold mb-6">
          Sign in to your account
        </h1>

        {/* Email */}
        <label className="text-sm text-gray-400">
          Email
        </label>
        <input
          type="email"
          className="w-full mt-1 mb-4 p-3 rounded bg-black/40 border border-white/10 focus:border-orange-500 outline-none transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <label className="text-sm text-gray-400">
          Password
        </label>
        <input
          type="password"
          className="w-full mt-1 mb-4 p-3 rounded bg-black/40 border border-white/10 focus:border-orange-500 outline-none transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between text-sm mb-4">
          <label className="flex items-center gap-2 text-gray-400">
            <input type="checkbox" className="accent-orange-500" />
            Remember me
          </label>

          <Link
            href="#"
            className="text-orange-400 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-400 text-sm mb-4">
            {error}
          </p>
        )}

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="
              w-full py-3 rounded
              bg-orange-500 hover:bg-orange-400
              transition
              font-medium
              disabled:opacity-50
            "
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {/* Footer */}
        <p className="text-sm text-gray-400 mt-6 text-center">
          New user?{" "}
          <Link
            href="/register"
            className="text-orange-400 hover:underline"
          >
            Register
          </Link>
        </p>

      </div>

    </main>
  );
}
