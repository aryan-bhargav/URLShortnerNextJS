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
      {/* Desktop Header - Hidden on mobile, visible from md and above */}
      <div className="hidden md:grid grid-cols-4 px-4 py-3 text-xs md:text-sm lg:text-base text-gray-400 border-b border-white/10 bg-white/5">
        <span className="font-semibold">Short Link</span>
        <span className="font-semibold">Original URL</span>
        <span className="font-semibold">Clicks</span>
        <span className="font-semibold">Status</span>
      </div>

      {/* Mobile: Card-based layout | Desktop: Grid layout */}
      <div className="divide-y divide-white/10">
        {links.map((link) => (
          <LinkRow key={link.id} link={link} />
        ))}
      </div>
    </div>
  );
}
