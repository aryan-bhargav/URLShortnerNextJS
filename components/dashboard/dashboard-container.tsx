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
            const res = await fetch("/api/urls", {
                cache: "no-store",
            });

            if (!res.ok) {
                throw new Error("Failed to load links");
            }

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
        <div className="space-y-10">
            <div className="flex flex-row">
                <CreateLinkForm onSuccess={fetchLinks} />
                <StatsBar links={links} />
            </div>
            <LinksTable links={links} loading={loading} />
        </div>

    );


}
