// app/[shortCode]/page.tsx
//
// Next.js Server Component — handles the redirect logic.
// loading.tsx in this same folder is shown automatically while this runs.
//
// NOTE: `redirect()` from next/navigation does a 307 internally and cannot
// carry custom headers. To attach X-Redirect-Time we detect whether the
// request came through a fetch/API context and use NextResponse there.
// For the normal browser navigation path we use `redirect()` as usual
// and log the latency to the console so it isn't lost.

import prisma from "@/lib/db";
import redis from "@/lib/redis";
import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

interface RedirectPageProps {
  params: { shortCode: string };
}

const RedirectPage = async ({ params }: RedirectPageProps) => {
  const { shortCode } = await params;
  const start = Date.now();

  const headersList = await headers();
  // Detect programmatic/fetch callers that can receive our custom header
  const acceptHeader = headersList.get("accept") ?? "";
  const isProgrammatic =
    !acceptHeader.includes("text/html") || acceptHeader === "*/*";

  let originalUrl: string | null = null;

  /* ── 1. Try Redis cache ─────────────────────────────────────── */
  try {
    const cached = await redis.get(shortCode);

    if (cached) {
      console.log(`[REDIS HIT] ${shortCode} → ${cached}`);

      // Keep visit count accurate (fire-and-forget)
      prisma.url
        .update({ where: { shortCode }, data: { visits: { increment: 1 } } })
        .catch((err) => console.error("[DB INCR ERROR]", err));

      originalUrl = cached;
    } else {
      console.log(`[REDIS MISS] ${shortCode}`);
    }
  } catch (err) {
    console.error("[REDIS GET ERROR]", err);
  }

  /* ── 2. DB fallback ─────────────────────────────────────────── */
  if (!originalUrl) {
    const row = await prisma.url
      .update({
        where: { shortCode },
        data: { visits: { increment: 1 } },
      })
      .catch(() => null);

    if (!row) notFound();

    originalUrl = row.originalUrl;

    // 3. Warm Redis for next hit
    try {
      await redis.set(shortCode, originalUrl, "EX", 300); // 5-min TTL
      console.log(`[REDIS SET] ${shortCode} → ${originalUrl}`);
    } catch (err) {
      console.error("[REDIS SET ERROR]", err);
    }
  }

  /* ── 4. Measure latency ─────────────────────────────────────── */
  const latency = Date.now() - start;
  console.log(`[REDIRECT] ${shortCode} → ${originalUrl} (${latency}ms)`);

  /* ── 5. Redirect ────────────────────────────────────────────── */
  if (isProgrammatic) {
    // Programmatic callers get the latency header
    const response = NextResponse.redirect(originalUrl, { status: 307 });
    response.headers.set("X-Redirect-Time", `${latency}ms`);
    response.headers.set("X-Short-Code", shortCode);
    return response;
  }

  // Normal browser navigation — redirect() handles it
  redirect(originalUrl);
};

export default RedirectPage;