export default function CopyButton({
  copied,
  onClick,
}: {
  copied: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={copied}
      className="relative text-xs font-medium px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200 ease-in-out active:scale-95 disabled:cursor-default whitespace-nowrap"
    >
      <span
        className={`transition-opacity duration-200 ${
          copied ? "opacity-0" : "opacity-100"
        }`}
      >
        Copy
      </span>
      <span
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
          copied ? "opacity-100 text-green-400" : "opacity-0"
        }`}
      >
        ✓ Copied
      </span>
    </button>
  );
}
