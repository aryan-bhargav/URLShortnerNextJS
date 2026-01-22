"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Registration failed");
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
          Create your account
        </h1>

        {/* Name */}
        <label className="text-sm text-gray-400">
          Name (optional)
        </label>
        <input
          type="text"
          className="w-full mt-1 mb-4 p-3 rounded bg-black/40 border border-white/10 focus:border-orange-500 outline-none transition"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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

        {/* Error */}
        {error && (
          <p className="text-red-400 text-sm mb-4">
            {error}
          </p>
        )}

        {/* Button */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className="
              w-full py-3 rounded
              bg-orange-500 hover:bg-orange-400
              transition
              font-medium
              disabled:opacity-50
            "
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        {/* Footer */}
        <p className="text-sm text-gray-400 mt-6 text-center">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-orange-400 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>

    </main>
  );
}
