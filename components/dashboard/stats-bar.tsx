import { DashboardLink } from "./dashboard-container";

interface StatsBarProps {
  links: DashboardLink[];
}

export default function StatsBar({ links }: StatsBarProps) {
  const totalLinks = links.length;
  const totalClicks = links.reduce((sum, link) => sum + link.visits, 0);
  const activeLinks = links.filter((link) => link.isActive).length;
  const inactiveLinks = totalLinks - activeLinks;
  const activeRate = totalLinks > 0 ? Math.round((activeLinks / totalLinks) * 100) : 0;
  const avgClicks = totalLinks > 0 ? (totalClicks / totalLinks).toFixed(1) : "0";

  return (
    /*
     * Bento grid layout:
     *
     * Mobile  (< sm):  single column, all cards stacked
     * SM      (≥ 640): 2-column grid
     * LG      (≥ 1024): 3-column grid, "Total Clicks" spans 2 rows (tall card)
     *
     *  LG layout:
     *  ┌──────────┬──────────┬────────────────┐
     *  │  Total   │  Active  │                │
     *  │  Links   │  Links   │  Total Clicks  │
     *  ├──────────┼──────────┤  (tall)        │
     *  │ Inactive │  Active  │                │
     *  │  Links   │   Rate   │                │
     *  └──────────┴──────────┴────────────────┘
     */
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xl:gap-4">

      {/* Total Links */}
      <BentoCard accent="cyan" label="Total Links" value={totalLinks} sub="links created" icon={<GridIcon />} />

      {/* Active Links */}
      <BentoCard accent="emerald" label="Active Links" value={activeLinks} sub="currently live" icon={<PulseIcon />} />

      {/* Total Clicks — tall on LG: spans 2 rows */}
      <div className="sm:col-span-2 lg:col-span-1 lg:row-span-2">
        <BentoCard
          accent="blue"
          label="Total Clicks"
          value={totalClicks}
          sub={`avg ${avgClicks} per link`}
          icon={<CursorIcon />}
          tall
        />
      </div>

      {/* Inactive Links */}
      <BentoCard accent="rose" label="Inactive Links" value={inactiveLinks} sub="disabled or expired" icon={<SlashIcon />} />

      {/* Active Rate */}
      <BentoCard accent="violet" label="Active Rate" value={`${activeRate}%`} sub="of links are live" icon={<ChartIcon />} />
    </div>
  );
}

/* ─── Bento Card ─────────────────────────────────────────────── */

type Accent = "cyan" | "emerald" | "blue" | "rose" | "violet";

const accentStyles: Record<Accent, { glow: string; badge: string; icon: string; border: string }> = {
  cyan:    { glow: "from-cyan-500/20 via-transparent",    badge: "bg-cyan-500/10 text-cyan-400 ring-cyan-500/20",    icon: "text-cyan-400",    border: "group-hover:border-cyan-500/40"    },
  emerald: { glow: "from-emerald-500/20 via-transparent", badge: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20", icon: "text-emerald-400", border: "group-hover:border-emerald-500/40" },
  blue:    { glow: "from-blue-500/20 via-transparent",    badge: "bg-blue-500/10 text-blue-400 ring-blue-500/20",    icon: "text-blue-400",    border: "group-hover:border-blue-500/40"    },
  rose:    { glow: "from-rose-500/20 via-transparent",    badge: "bg-rose-500/10 text-rose-400 ring-rose-500/20",    icon: "text-rose-400",    border: "group-hover:border-rose-500/40"    },
  violet:  { glow: "from-violet-500/20 via-transparent",  badge: "bg-violet-500/10 text-violet-400 ring-violet-500/20", icon: "text-violet-400",  border: "group-hover:border-violet-500/40"  },
};

function BentoCard({
  label,
  value,
  sub,
  accent,
  icon,
  tall = false,
}: {
  label: string;
  value: number | string;
  sub: string;
  accent: Accent;
  icon: React.ReactNode;
  tall?: boolean;
}) {
  const s = accentStyles[accent];

  return (
    <div
      className={`
        group relative overflow-hidden rounded-2xl
        bg-white/5 border border-white/10
        ${s.border}
        hover:bg-white/[0.07]
        transition-all duration-300
        p-5 xl:p-6
        flex flex-col justify-between gap-4
        ${tall ? "lg:h-full min-h-[9rem]" : "min-h-[7.5rem]"}
      `}
    >
      {/* Gradient glow on hover */}
      <div
        className={`
          absolute inset-0 bg-gradient-to-br ${s.glow} to-transparent
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300 pointer-events-none
        `}
      />

      {/* Top row: label badge + icon */}
      <div className="flex items-start justify-between">
        <span
          className={`
            text-xs font-medium px-2.5 py-1 rounded-full ring-1
            ${s.badge}
          `}
        >
          {label}
        </span>
        <span className={`${s.icon} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}>
          {icon}
        </span>
      </div>

      {/* Value + sub */}
      <div>
        <p
          className={`
            font-semibold leading-none tracking-tight text-white
            ${tall ? "text-5xl xl:text-6xl" : "text-3xl xl:text-4xl"}
          `}
        >
          {value}
        </p>
        <p className="mt-2 text-xs text-gray-500">{sub}</p>
      </div>
    </div>
  );
}

/* ─── Icons (inline SVG, no dep) ────────────────────────────── */

const GridIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const PulseIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CursorIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13 13l6 6" strokeLinecap="round" />
  </svg>
);

const SlashIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" /><path d="M4.93 4.93l14.14 14.14" strokeLinecap="round" />
  </svg>
);

const ChartIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M18 20V10M12 20V4M6 20v-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);