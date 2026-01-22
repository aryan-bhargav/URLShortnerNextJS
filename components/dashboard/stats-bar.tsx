import { DashboardLink } from "./dashboard-container";

interface StatsBarProps {
  links: DashboardLink[];
}

export default function StatsBar({ links }: StatsBarProps) {
  const totalLinks = links.length;
  const totalClicks = links.reduce((sum, link) => sum + link.visits, 0);
  const activeLinks = links.filter((link) => link.isActive).length;

  return (
    <div className="glass rounded-2xl p-5 flex flex-col gap-4 sm:flex-row sm:gap-3 md:flex-col md:gap-3 lg:flex-row lg:gap-4 xl:gap-6">
      {/* Mobile & SM: Stacked | MD: Vertical | LG+: Horizontal arrangement */}
      <div className="flex flex-row gap-2 sm:flex-col sm:gap-3 md:flex-row md:gap-2 lg:flex-col lg:gap-3 xl:gap-4 flex-1">
        <StatItem label="Total Links" value={totalLinks} accent="cyan" />
        <StatItem label="Active Links" value={activeLinks} accent="green" />
      </div>

      {/* Flexible right stat item */}
      <div className="flex-1 md:flex-none">
        <StatItem label="Total Clicks" value={totalClicks} accent="blue" />
      </div>
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
        relative rounded-xl p-4 sm:p-3 md:p-4 lg:p-5 xl:p-6
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
        <p className="text-xs sm:text-sm md:text-sm lg:text-base text-gray-400">
          {label}
        </p>
        <p className="text-2xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold mt-1">
          {value}
        </p>
      </div>
    </div>
  );
}
