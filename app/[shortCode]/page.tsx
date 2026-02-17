"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Status = "loading" | "redirecting" | "error";

export default function RedirectPage() {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [status, setStatus] = useState<Status>("loading");
  const [latency, setLatency] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (!shortCode) return;

    const run = async () => {
      try {
        const res = await fetch(`/api/redirect/${shortCode}`);

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || `Error ${res.status}`);
        }

        const data: { originalUrl: string; latency: string } = await res.json();

        setLatency(data.latency);
        setStatus("redirecting");

        // Brief pause so user sees the "Redirecting" state + latency
        setTimeout(() => {
          window.location.href = data.originalUrl;
        }, 900);
      } catch (err: unknown) {
        setErrorMsg(err instanceof Error ? err.message : "Link not found");
        setStatus("error");
      }
    };

    run();
  }, [shortCode]);

  return (
    <div className="min-h-screen bg-[#070a10] flex items-center justify-center px-4 overflow-hidden relative">

      {/* Ambient blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-600/8 blur-[130px]" />
        <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] rounded-full bg-cyan-500/8 blur-[110px]" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-[340px] sm:max-w-sm">
        <div className="relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.5)] overflow-hidden px-7 py-8 flex flex-col items-center gap-6 text-center">

          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

          {status === "loading" && <LoadingState shortCode={shortCode} />}
          {status === "redirecting" && <RedirectingState latency={latency} />}
          {status === "error" && <ErrorState message={errorMsg} />}

        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fadeUp 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}

/* ── Loading state ────────────────────────────────────────── */
function LoadingState({ shortCode }: { shortCode: string }) {
  return (
    <>
      {/* Dual-ring spinner */}
      <div className="relative w-14 h-14 shrink-0">
        <span className="absolute inset-0 rounded-full border-2 border-white/[0.06]" />
        <span className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 border-r-cyan-400/20 animate-spin" style={{ animationDuration: "1s" }} />
        <span className="absolute inset-[5px] rounded-full border border-transparent border-b-blue-400/60 border-l-blue-400/20 animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.7s" }} />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_2px_rgba(34,211,238,0.5)]" />
        </span>
      </div>

      <div className="space-y-1.5 animate-fade-up">
        <p className="text-white font-medium text-sm">Looking up link</p>
        <p className="text-gray-500 text-xs font-mono">/{shortCode}</p>
      </div>

      {/* Shimmer bar */}
      <div className="w-36 h-px rounded-full overflow-hidden bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent bg-[length:200%_100%]"
          style={{ animation: "shimmer 1.6s ease-in-out infinite" }}
        />
      </div>
    </>
  );
}

/* ── Redirecting state ────────────────────────────────────── */
function RedirectingState({ latency }: { latency: string | null }) {
  return (
    <>
      {/* Checkmark */}
      <div className="relative w-14 h-14 shrink-0">
        <span className="absolute inset-0 rounded-full bg-emerald-500/10 border border-emerald-400/20" />
        <span className="absolute inset-0 flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      </div>

      <div className="space-y-1.5 animate-fade-up">
        <p className="text-white font-medium text-sm">Redirecting you…</p>
        {latency && (
          <p className="text-gray-500 text-xs">
            Resolved in{" "}
            <span className="text-emerald-400 font-mono font-medium">{latency}</span>
          </p>
        )}
      </div>

      {/* Fill bar */}
      <div className="w-36 h-px rounded-full overflow-hidden bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-[850ms] ease-out"
          style={{ width: "100%" }}
        />
      </div>
    </>
  );
}

/* ── Error state ──────────────────────────────────────────── */
function ErrorState({ message }: { message: string }) {
  return (
    <>
      {/* Error icon */}
      <div className="relative w-14 h-14 shrink-0">
        <span className="absolute inset-0 rounded-full bg-red-500/10 border border-red-400/20" />
        <span className="absolute inset-0 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
            <circle cx="12" cy="12" r="9" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </span>
      </div>

      <div className="space-y-1.5 animate-fade-up">
        <p className="text-white font-medium text-sm">Link not found</p>
        <p className="text-gray-500 text-xs">{message}</p>
      </div>

      <a
        href="/"
        className="text-xs text-gray-400 hover:text-white border border-white/10 hover:border-white/20 bg-white/[0.04] hover:bg-white/[0.07] px-4 py-2 rounded-xl transition-all duration-150"
      >
        Go home
      </a>
    </>
  );
}