import prisma from "@/lib/db";
import redis from "@/lib/redis";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    // 1️⃣ Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    let shortenedUrl;
    while (!shortenedUrl) {
      const shortCode = nanoid(8); // 8-char unique code

      try {
        // 2️⃣ Save in Prisma
        shortenedUrl = await prisma.url.create({
          data: { originalUrl: url, shortCode },
        });

        // 3️⃣ Cache in Redis immediately
        await redis.set(shortCode, url, "EX", 60 * 60 * 24); // 1 day TTL

      } catch (err: any) {
        // Handle Prisma unique constraint error
        if (err.code === "P2002") continue; // collision, retry
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
