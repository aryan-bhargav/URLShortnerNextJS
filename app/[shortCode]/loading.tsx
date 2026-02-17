
export default function RedirectLoading() {
  return (
    <div className="min-h-screen bg-[#080b11] flex items-center justify-center px-4 overflow-hidden relative">

      {/* ── Ambient background orbs ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-blue-600/10 blur-[120px] animate-pulse" />
        <div
          className="absolute -bottom-32 -right-32 w-[380px] h-[380px] rounded-full bg-cyan-500/10 blur-[100px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* ── Card ── */}
      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-sm sm:max-w-md text-center">

        {/* Orbit loader */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24">
          {/* Outer ring */}
          <span className="absolute inset-0 rounded-full border-2 border-white/5" />
          {/* Spinning track */}
          <span className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-400 border-r-blue-400/30 animate-spin" />
          {/* Inner ring — counter spin */}
          <span
            className="absolute inset-3 rounded-full border border-transparent border-b-cyan-400 border-l-cyan-400/30 animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "0.8s" }}
          />
          {/* Centre dot */}
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_2px_rgba(96,165,250,0.6)]" />
          </span>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-white text-xl sm:text-2xl font-semibold tracking-tight">
            Redirecting you
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Looking up your link — hang tight…
          </p>
        </div>

        {/* Animated progress bar */}
        <div className="w-full max-w-[220px] h-px bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 rounded-full animate-[shimmer_1.8s_ease-in-out_infinite] bg-[length:200%_100%]" />
        </div>

        {/* Subtle branding */}
        <p className="text-gray-700 text-xs tracking-widest uppercase select-none">
          Powered by Snip
        </p>
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}