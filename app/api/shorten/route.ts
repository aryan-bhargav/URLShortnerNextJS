import prisma from "@/lib/db";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { url } = await request.json();

        // validate URL
        try {
            new URL(url);
        } catch {
            return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
        }

        let shortenedUrl;
        while (!shortenedUrl) {
            const shortCode = nanoid(8);
            try {
                shortenedUrl = await prisma.url.create({
                    data: { originalUrl: url, shortCode }
                });
            } catch (err: any) {
                if (err.code === "P2002") continue;
                if (err.code === "P2021") {
                    console.error("Table Url does not exist:", err);
                    return NextResponse.json({ error: "Database table missing" }, { status: 500 });
                }
                if (err.code === "P1001") {
                    console.error("Database connection error:", err);
                    return NextResponse.json({ error: "Cannot connect to database" }, { status: 500 });
                }
                throw err;
            }
        }

        return NextResponse.json({ shortCode: shortenedUrl.shortCode });

    } catch (err) {
        console.error("Unexpected server error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
