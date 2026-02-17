import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import redis from "@/lib/redis";
import { rateLimit } from "@/lib/rateLimit";
import type { Url } from "@/lib/generated/prisma";


const CACHE_TTL = 60 * 5; // 5 minutes
const REDIRECT_LIMIT = 100; // requests
const REDIRECT_WINDOW = 60; // seconds

function isUrlValid(url: {
  isActive: boolean;
  expiresAt: Date | null;
  maxClicks: number | null;
  visits: number;
}) {
  if (!url.isActive) return false;

  if (url.expiresAt && new Date(url.expiresAt) < new Date()) {
    return false;
  }

  if (url.maxClicks !== null && url.visits >= url.maxClicks) {
    return false;
  }

  return true;
}

async function incrementVisits(shortCode: string) {
  try {
    await prisma.url.update({
      where: { shortCode },
      data: {
        visits: { increment: 1 },
        clickEvents: {
          create: {},
        },
      },
    });
  } catch (err) {
    console.error("Failed to increment visits:", err);
  }
}


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  const requestStart = performance.now(); // better than Date.now()
  const { shortCode } = await params;

  try {
    const CACHE_KEY = `url:${shortCode}`;

    const cached = await redis.get(CACHE_KEY);

    let url: Url | null = null;
    let source = "cache";

    if (cached) {
      url = JSON.parse(cached);
    } else {
      source = "database";
      url = await prisma.url.findUnique({
        where: { shortCode },
      });

      if (url) {
        await redis.set(CACHE_KEY, JSON.stringify(url), "EX", CACHE_TTL);
      }
    }

    if (!url || !isUrlValid(url)) {
      return NextResponse.json(
        { message: "Short URL not found or inactive" },
        { status: 404 }
      );
    }

    // non-blocking visit increment
    prisma.url.update({
      where: { shortCode },
      data: { visits: { increment: 1 } },
    }).catch(() => {});

    const requestEnd = performance.now();
    const latency = Math.round(requestEnd - requestStart);

    console.log(`Redirect (${source}) took ${latency}ms`);

    const response = NextResponse.redirect(url.originalUrl);

    // Optional: send latency in header for debugging
    response.headers.set("X-Redirect-Time", `${latency}ms`);

    return response;

  } catch (error) {
    console.error("Redirect error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
