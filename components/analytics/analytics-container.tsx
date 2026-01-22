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
  Legend,
} from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

/* ---------------- UI helpers ---------------- */

function GlassCard({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`glass rounded-2xl p-5 ${className}`}>
      {title && (
        <p className="text-sm text-gray-400 mb-2">{title}</p>
      )}
      {children}
    </div>
  );
}

/* ---------------- Types ---------------- */

interface AnalyticsResponse {
  totalLinks: number;
  totalClicks: number;
  clicksByDay: {
    createdAt: string;
    _count: number;
  }[];
}

/* ---------------- Component ---------------- */

export default function AnalyticsContainer() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/analytics", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch analytics");
        }

        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <GlassCard>
        <p className="text-gray-400">Loading analytics…</p>
      </GlassCard>
    );
  }

  if (error || !data) {
    return (
      <GlassCard>
        <p className="text-red-400">
          {error || "Something went wrong"}
        </p>
      </GlassCard>
    );
  }

  /* ---------------- Transform API → Charts ---------------- */

  const clicksOverTime = {
    labels: data.clicksByDay.map((d) =>
      new Date(d.createdAt).toLocaleDateString("en-US", {
        weekday: "short",
      })
    ),
    datasets: [
      {
        label: "Clicks",
        data: data.clicksByDay.map((d) => d._count),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.15)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const statusData = {
    labels: ["Total Clicks"],
    datasets: [
      {
        data: [data.totalClicks],
        backgroundColor: ["#22c55e"],
        borderWidth: 0,
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#94a3b8" },
      },
      y: {
        grid: { color: "rgba(255,255,255,0.05)" },
        ticks: { color: "#94a3b8" },
      },
    },
  };

  /* ---------------- Render ---------------- */

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Links */}
      <GlassCard>
        <p className="text-sm text-gray-400">Total Links</p>
        <p className="text-4xl font-semibold mt-2">
          {data.totalLinks}
        </p>
      </GlassCard>

      {/* Total Clicks */}
      <GlassCard>
        <p className="text-sm text-gray-400">Total Clicks</p>
        <p className="text-4xl font-semibold mt-2">
          {data.totalClicks}
        </p>
      </GlassCard>

      {/* Donut */}
      <GlassCard title="Click Distribution">
        <div className="h-[180px] flex items-center justify-center">
          <Doughnut
            data={statusData}
            options={{
              cutout: "70%",
              plugins: { legend: { display: false } },
            }}
          />
        </div>
      </GlassCard>

      {/* Line Chart */}
      <GlassCard
        title="Clicks Over Time (Last 7 Days)"
        className="md:col-span-2"
      >
        <div className="h-[220px]">
          <Line data={clicksOverTime} options={commonOptions} />
        </div>
      </GlassCard>

      {/* Placeholder for future */}
      <GlassCard
        title="Top Links (Coming Soon)"
        className="md:col-span-3"
      >
        <p className="text-gray-400">
          Per-link analytics will appear here.
        </p>
      </GlassCard>
    </div>
  );
}
