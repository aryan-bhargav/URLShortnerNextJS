"use client";

import { useEffect, useState } from "react";
import CreateLinkForm from "./create-link-form";
import StatsBar from "./stats-bar";
import LinksTable from "./links-table";

/**
 * Shape of a link returned by /api/urls
 * Keep this minimal and stable
 */
export interface DashboardLink {
    id: string;
    shortCode: string;
    originalUrl: string;
    visits: number;
    isActive: boolean;
    expiresAt: string | null;
}

export default function DashboardContainer() {
    const [links, setLinks] = useState<DashboardLink[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const fetchLinks = async () => {
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/urls", {cache: "no-store",});

            if (!res.ok) throw new Error("Failed to load links");

            const data = await res.json();
            setLinks(data);
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // Fetch once on mount
    useEffect(() => {
        fetchLinks();
    }, []);

    return (
        <div className="space-y-8 sm:space-y-9 md:space-y-10 lg:space-y-10 xl:space-y-12">
            {/* Header Section: Form + Stats */}
            {/* Mobile: Stacked vertically | SM: Stacked | MD: Stacked | LG+: Side-by-side */}
            <div className="flex flex-col gap-4 sm:gap-4 md:gap-4 lg:flex-row lg:gap-6 xl:gap-8">
                <div className="flex-1">
                    <CreateLinkForm onSuccess={fetchLinks} />
                </div>
                <div className="w-full lg:w-auto lg:flex-1">
                    <StatsBar links={links} />
                </div>
            </div>

            {/* Links Table Section */}
            <div className="w-full">
                <LinksTable links={links} loading={loading} />
            </div>
        </div>
    );
}
