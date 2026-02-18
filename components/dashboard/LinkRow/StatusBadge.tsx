type StatusBadgeProps = {
  active: boolean;
  onClick: () => void;
  linkData: any; // replace with proper type later
};

export default function StatusBadge({
  linkData,
  active,
  onClick,
}: StatusBadgeProps) {
  return (
    <button
      onClick={onClick}
      className={`
    relative
    text-xs px-4 py-1.5
    rounded-full
    font-medium whitespace-nowrap
    backdrop-blur-md border shadow-sm
    transition-all duration-200 ease-in-out
    transform
    hover:scale-105
    active:scale-95
    focus:outline-none focus:ring-2 focus:ring-offset-2
    ${active
          ? "bg-green-500/10 text-green-400 border-green-400/20 hover:bg-green-500/20 focus:ring-green-400/40"
          : "bg-red-500/10 text-red-400 border-red-400/20 hover:bg-red-500/20 focus:ring-red-400/40"
        }
  `}
    >
      {active ? "Active" : "Inactive"}
    </button>

  );
}
