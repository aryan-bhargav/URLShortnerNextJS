import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import redis from "@/lib/redis";
import { auth } from "@/middleware/auth";
import { nanoid } from "nanoid";

const CACHE_TTL = 5;

/* =========================
   GET: recent URLs
   ========================= */
export const GET = auth(async (req) => {
  const userId = req.userId!;
  const CACHE_KEY = `recent_urls:${userId}`;

  const cached = await redis.get(CACHE_KEY);
  if (cached) {
    return NextResponse.json(JSON.parse(cached));
  }

  const urls = await prisma.url.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  await redis.set(CACHE_KEY, JSON.stringify(urls), "EX", CACHE_TTL);
  return NextResponse.json(urls);
});

/* =========================
   POST: create URL
   ========================= */
export const POST = auth(async (req) => {
  try {
    const userId = req.userId!;
    const body = await req.json();

    const {
      originalUrl,
      shortCode,
      expiresAt,
      maxClicks,
      isActive = true,
    } = body;

    if (!originalUrl) {
      return NextResponse.json(
        { message: "originalUrl is required" },
        { status: 400 }
      );
    }

    try {
      new URL(originalUrl);
    } catch {
      return NextResponse.json(
        { message: "Invalid URL format" },
        { status: 400 }
      );
    }

    const finalShortCode = shortCode?.trim() || nanoid(8);

    const url = await prisma.url.create({
      data: {
        originalUrl,
        shortCode: finalShortCode,
        userId,
        isActive,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        maxClicks: maxClicks ? Number(maxClicks) : null,
      },
    });

    // invalidate cache
    await redis.del(`recent_urls:${userId}`);

    // pre-warm redirect cache
    await redis.set(
      `url:${finalShortCode}`,
      JSON.stringify(url),
      "EX",
      60 * 5
    );

    return NextResponse.json(url, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { message: "Short code already in use" },
        { status: 409 }
      );
    }

    console.error("POST /urls error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
});
