"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Filler
);

interface AnalyticsResponse {
  totalLinks: number;
  totalClicks: number;
  clicksByDay: { createdAt: string; _count: number }[];
}

/* ─── Tiny icons ──────────────────────────────────────────────── */

const LinkIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const CursorIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
    <path d="M13 13l6 6" />
  </svg>
);

const TrendIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

const PulseIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4l3 3" />
  </svg>
);

/* ─── Stat Card ───────────────────────────────────────────────── */

function StatCard({
  label,
  value,
  sub,
  icon,
  accent,
  large = false,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  accent: "cyan" | "blue" | "violet" | "emerald";
  large?: boolean;
}) {
  const accents = {
    cyan:    { pill: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",    glow: "from-cyan-500/10",    num: "text-cyan-50"  },
    blue:    { pill: "bg-blue-500/10 text-blue-400 border-blue-500/20",    glow: "from-blue-500/10",    num: "text-blue-50"  },
    violet:  { pill: "bg-violet-500/10 text-violet-400 border-violet-500/20", glow: "from-violet-500/10", num: "text-violet-50" },
    emerald: { pill: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", glow: "from-emerald-500/10", num: "text-emerald-50" },
  };
  const a = accents[accent];

  return (
    <div className="group relative rounded-2xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.055] hover:border-white/15 transition-all duration-300 overflow-hidden p-5 flex flex-col justify-between gap-4 min-h-[130px]">
      {/* ambient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${a.glow} via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
      <div className="flex items-center justify-between">
        <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${a.pill}`}>
          {icon}
          {label}
        </span>
      </div>
      <div>
        <p className={`font-semibold leading-none tracking-tight ${a.num} ${large ? "text-5xl" : "text-4xl"}`}>
          {value}
        </p>
        {sub && <p className="mt-1.5 text-[11px] text-white/30">{sub}</p>}
      </div>
    </div>
  );
}

/* ─── Chart Card wrapper ──────────────────────────────────────── */

function ChartCard({
  label,
  icon,
  children,
  className = "",
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative rounded-2xl border border-white/8 bg-white/[0.03] overflow-hidden p-5 ${className}`}>
      {/* shimmer top edge */}
      <div className="absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="flex items-center gap-2 mb-4">
        <span className="text-white/30">{icon}</span>
        <p className="text-xs font-medium text-white/40 tracking-wide uppercase">{label}</p>
      </div>
      {children}
    </div>
  );
}

/* ─── Skeleton ────────────────────────────────────────────────── */

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-2xl bg-white/[0.04] animate-pulse ${className}`} />
  );
}

/* ─── Main Component ──────────────────────────────────────────── */

export default function AnalyticsContainer() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/analytics", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch analytics");
        setData(await res.json());
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* Loading skeleton */
  if (loading) return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 auto-rows-auto">
      <Skeleton className="col-span-1 h-[130px]" />
      <Skeleton className="col-span-1 h-[130px]" />
      <Skeleton className="col-span-2 h-[130px]" />
      <Skeleton className="col-span-2 md:col-span-3 xl:col-span-4 h-[240px]" />
      <Skeleton className="col-span-2 h-[220px]" />
      <Skeleton className="col-span-2 h-[220px]" />
    </div>
  );

  /* Error */
  if (error || !data) return (
    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
      <p className="text-red-400 text-sm">{error || "Something went wrong"}</p>
    </div>
  );

  /* Derived */
  const avgClicks = data.totalLinks > 0 ? (data.totalClicks / data.totalLinks).toFixed(1) : "0";
  const peak = data.clicksByDay.length > 0 ? Math.max(...data.clicksByDay.map(d => d._count)) : 0;

  const days = data.clicksByDay.map((d) =>
    new Date(d.createdAt).toLocaleDateString("en-US", { weekday: "short" })
  );
  const counts = data.clicksByDay.map((d) => d._count);

  /* ── Line chart ── */
  const lineData = {
    labels: days,
    datasets: [{
      label: "Clicks",
      data: counts,
      borderColor: "rgba(34,211,238,0.8)",
      backgroundColor: (ctx: any) => {
        const canvas = ctx.chart.ctx;
        const gradient = canvas.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, "rgba(34,211,238,0.18)");
        gradient.addColorStop(1, "rgba(34,211,238,0)");
        return gradient;
      },
      tension: 0.45,
      fill: true,
      pointRadius: 3,
      pointBackgroundColor: "rgba(34,211,238,1)",
      pointBorderColor: "transparent",
      borderWidth: 2,
    }],
  };

  const lineOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: {
      backgroundColor: "rgba(15,23,42,0.95)",
      borderColor: "rgba(255,255,255,0.1)",
      borderWidth: 1,
      titleColor: "#94a3b8",
      bodyColor: "#e2e8f0",
      padding: 10,
      cornerRadius: 10,
    }},
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: "rgba(148,163,184,0.6)", font: { size: 11 } },
      },
      y: {
        grid: { color: "rgba(255,255,255,0.04)" },
        border: { display: false },
        ticks: { color: "rgba(148,163,184,0.6)", font: { size: 11 } },
      },
    },
  };

  /* ── Doughnut ── */
  const doughnutData = {
    labels: ["Links", "Clicks"],
    datasets: [{
      data: [data.totalLinks, data.totalClicks],
      backgroundColor: ["rgba(99,102,241,0.7)", "rgba(34,211,238,0.7)"],
      borderColor: ["rgba(99,102,241,0.3)", "rgba(34,211,238,0.3)"],
      borderWidth: 1,
      hoverOffset: 4,
    }],
  };

  const doughnutOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "72%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(15,23,42,0.95)",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        titleColor: "#94a3b8",
        bodyColor: "#e2e8f0",
        padding: 10,
        cornerRadius: 10,
      },
    },
  };

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .bento-item {
          animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }
      `}</style>

      {/*
        Bento grid:
        Mobile  : 2 cols
        MD      : 3 cols
        XL      : 4 cols
      */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">

        {/* 1 — Total Links */}
        <div className="bento-item col-span-1" style={{ animationDelay: "0ms" }}>
          <StatCard label="Total Links" value={data.totalLinks} sub="links created" icon={<LinkIcon />} accent="cyan" />
        </div>

        {/* 2 — Total Clicks */}
        <div className="bento-item col-span-1" style={{ animationDelay: "60ms" }}>
          <StatCard label="Total Clicks" value={data.totalClicks} sub="all-time visits" icon={<CursorIcon />} accent="blue" large />
        </div>

        {/* 3 — Avg Clicks — spans 2 cols on xl */}
        <div className="bento-item col-span-2 md:col-span-1 xl:col-span-1" style={{ animationDelay: "120ms" }}>
          <StatCard label="Avg / Link" value={avgClicks} sub="clicks per link" icon={<TrendIcon />} accent="violet" />
        </div>

        {/* 4 — Peak day — only shows xl+ */}
        <div className="bento-item hidden xl:block col-span-1" style={{ animationDelay: "180ms" }}>
          <StatCard label="Peak Day" value={peak} sub="max clicks in a day" icon={<PulseIcon />} accent="emerald" />
        </div>

        {/* 5 — Line chart — full width */}
        <div className="bento-item col-span-2 md:col-span-3 xl:col-span-4" style={{ animationDelay: "200ms" }}>
          <ChartCard label="Clicks over time · last 7 days" icon={<TrendIcon />}>
            <div className="h-[200px] sm:h-[230px]">
              <Line data={lineData} options={lineOptions} />
            </div>
          </ChartCard>
        </div>

        {/* 6 — Doughnut */}
        <div className="bento-item col-span-2 md:col-span-1 xl:col-span-2" style={{ animationDelay: "260ms" }}>
          <ChartCard label="Distribution" icon={<CursorIcon />} className="h-full">
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
              <div className="relative w-[130px] h-[130px] shrink-0">
                <Doughnut data={doughnutData} options={doughnutOptions} />
                {/* Center label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-[10px] text-white/30 uppercase tracking-wide">ratio</p>
                  <p className="text-lg font-semibold text-white">
                    {data.totalLinks > 0 ? (data.totalClicks / data.totalLinks).toFixed(1) : "—"}
                  </p>
                </div>
              </div>
              {/* Legend */}
              <div className="flex flex-col gap-2.5 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-400/80 shrink-0" />
                  <span className="text-white/50 text-xs">Links</span>
                  <span className="ml-auto text-white font-medium text-xs pl-4">{data.totalLinks}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400/80 shrink-0" />
                  <span className="text-white/50 text-xs">Clicks</span>
                  <span className="ml-auto text-white font-medium text-xs pl-4">{data.totalClicks}</span>
                </div>
              </div>
            </div>
          </ChartCard>
        </div>

        {/* 7 — Coming soon panel */}
        <div className="bento-item col-span-2 md:col-span-2 xl:col-span-2" style={{ animationDelay: "320ms" }}>
          <div className="relative rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-5 h-full min-h-[140px] flex flex-col items-center justify-center gap-2 overflow-hidden group">
            {/* subtle gradient hint */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="w-8 h-8 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/20">
              <LinkIcon />
            </div>
            <p className="text-xs font-medium text-white/25 tracking-wide">Per-link analytics</p>
            <span className="text-[10px] uppercase tracking-widest text-white/15 border border-white/8 px-2.5 py-0.5 rounded-full">Coming soon</span>
          </div>
        </div>

      </div>
    </>
  );
}