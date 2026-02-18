type AiSuggestionBadgeProps = {
  code: string;
  onClick: (code: string) => void;
};

export default function AiSuggestionBadge({ code, onClick }: AiSuggestionBadgeProps) {
  return (
    <button
      onClick={() => onClick(code)}
      className="group relative px-3.5 py-1.5 text-xs font-mono font-medium rounded-xl
        bg-gradient-to-b from-white/[0.08] to-white/[0.03]
        border border-white/[0.10] hover:border-cyan-400/40
        text-white/40 hover:text-cyan-300
        backdrop-blur-sm
        shadow-[0_1px_0_rgba(255,255,255,0.04),inset_0_1px_0_rgba(255,255,255,0.06)]
        hover:shadow-[0_0_12px_rgba(34,211,238,0.12)]
        transition-all duration-200 ease-out
        hover:scale-[1.04] active:scale-[0.97]"
    >
      <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/0 via-cyan-400/[0.06] to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <span className="relative"># {code}</span>
    </button>
  );
}