import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const urls = await prisma.url.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5
        });
        return NextResponse.json(urls);
    } catch (err: any) {
        if (err.code === "P2021") {
            console.error("Table Url does not exist:", err);
            return NextResponse.json({ error: "Database table missing" }, { status: 500 });
        }
        if (err.code === "P1001") {
            console.error("Database connection error:", err);
            return NextResponse.json({ error: "Cannot connect to database" }, { status: 500 });
        }
        console.error("Unexpected Prisma error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
