import { DashboardLink } from "./dashboard-container";

interface StatsBarProps {
  links: DashboardLink[];
}

export default function StatsBar({ links }: StatsBarProps) {
  const totalLinks = links.length;
  const totalClicks = links.reduce((sum, link) => sum + link.visits, 0);
  const activeLinks = links.filter((link) => link.isActive).length;

  return (
    <div
      className="
        glass rounded-2xl p-5
        grid grid-cols-1 sm:grid-cols-3 gap-4
      "
    >
      <StatItem
        label="Total Links"
        value={totalLinks}
        accent="cyan"
      />
      <StatItem
        label="Active Links"
        value={activeLinks}
        accent="green"
      />
      <StatItem
        label="Total Clicks"
        value={totalClicks}
        accent="blue"
      />
    </div>
  );
}

function StatItem({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: "cyan" | "green" | "blue";
}) {
  const accentMap = {
    cyan: "from-cyan-500/20 to-cyan-400/5 text-cyan-400",
    green: "from-green-500/20 to-green-400/5 text-green-400",
    blue: "from-blue-500/20 to-blue-400/5 text-blue-400",
  };

  return (
    <div
      className="
        relative rounded-xl p-4
        bg-white/5 border border-white/10
        hover:bg-white/[0.08]
        transition-all duration-300
        group
      "
    >
      {/* Accent glow */}
      <div
        className={`
          absolute inset-0 rounded-xl
          bg-gradient-to-br ${accentMap[accent]}
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
          pointer-events-none
        `}
      />

      <div className="relative">
        <p className="text-sm text-gray-400">
          {label}
        </p>
        <p className="text-3xl font-semibold mt-1">
          {value}
        </p>
      </div>
    </div>
  );
}
