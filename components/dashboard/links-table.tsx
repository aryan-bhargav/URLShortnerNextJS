import { DashboardLink } from "./dashboard-container";
import LinkRow from "./link-row";
import Skeleton from "@/components/ui/skeleton";

interface LinksTableProps {
  links: DashboardLink[];
  loading: boolean;
}

export default function LinksTable({ links, loading }: LinksTableProps) {
  if (loading) {
    return (
      <div className="glass rounded-xl p-6 space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <div className="glass rounded-xl p-6">
        <p className="text-gray-400">No links created yet.</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl overflow-hidden">
      {/* Desktop header */}
      <div className="hidden md:grid grid-cols-4 px-4 py-3 text-sm text-gray-400 border-b border-white/10">
        <span>Short Link</span>
        <span>Original URL</span>
        <span>Clicks</span>
        <span>Status</span>
      </div>

      <div>
        {links.map((link) => (
          <LinkRow key={link.id} link={link} />
        ))}
      </div>
    </div>
  );
}
