import { DashboardLink } from "./dashboard-container";

interface StatsBarProps {
  links: DashboardLink[];
}

export default function StatsBar({ links }: StatsBarProps) {
  const totalLinks = links.length;
  const totalClicks = links.reduce(
    (sum, link) => sum + link.visits,
    0
  );

  const activeLinks = links.filter(
    (link) => link.isActive
  ).length;

  return (
    <div className="glass rounded-xl p-5 flex flex-col sm:flex-row gap-6">
      <StatItem label="Total Links" value={totalLinks} />
      <StatItem label="Active Links" value={activeLinks} />
      <StatItem label="Total Clicks" value={totalClicks} />
    </div>
  );
}

function StatItem({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex-1">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-2xl font-semibold mt-1">
        {value}
      </p>
    </div>
  );
}
