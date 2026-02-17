export default function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`text-xs px-4 py-1.5 rounded-full font-medium whitespace-nowrap backdrop-blur-md border shadow-sm ${
        active
          ? "bg-green-500/10 text-green-400 border-green-400/20"
          : "bg-red-500/10 text-red-400 border-red-400/20"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}
