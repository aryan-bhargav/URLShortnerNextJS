import prisma from "@/lib/db";
import redis from "@/lib/redis";
import { NextResponse } from "next/server";

const CACHE_KEY = "recent_urls";
const CACHE_TTL = 30 ; // 30 seconds

export async function GET() {
  try {
    // 1️⃣ Check Redis cache first
    const cached = await redis.get(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return NextResponse.json(parsed);
      }
    }

    // 2️⃣ Fetch from Prisma if cache miss or empty cache
    const urls = await prisma.url.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // 3️⃣ Store in Redis only if we have data
    if (urls.length > 0) {
      await redis.set(CACHE_KEY, JSON.stringify(urls),"EX",CACHE_TTL);
    }

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
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
