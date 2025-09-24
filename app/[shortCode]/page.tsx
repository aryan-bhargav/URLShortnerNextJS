import prisma from "@/lib/db";
import redis from "@/lib/redis";
import { redirect, notFound } from "next/navigation";

interface RedirectPageProps {
  params: { shortCode: string };
}

const RedirectPage = async ({ params }: RedirectPageProps) => {
  const { shortCode } = params;

  let cachedUrl: string | null = null;

  // 1️⃣ Try fetching from Redis
  try {
    cachedUrl = await redis.get(shortCode);
    if (cachedUrl) {
      console.log(`[REDIS HIT] ShortCode: ${shortCode} -> ${cachedUrl}`);
    } else {
      console.log(`[REDIS MISS] ShortCode: ${shortCode}`);
    }
  } catch (err) {
    console.error("[REDIS GET ERROR]", err);
  }

  if (cachedUrl) {
    // Increment visits asynchronously
    try {
      await redis.incr(`visits:${shortCode}`);
    } catch (err) {
      console.error("[REDIS INCR ERROR]", err);
    }
    redirect(cachedUrl);
  }

  // 2️⃣ Cache miss → Update DB
  const url = await prisma.url.update({
    where: { shortCode },
    data: { visits: { increment: 1 } },
  }).catch(() => null);

  if (!url) {
    notFound();
  }

  // 3️⃣ Store in Redis for future requests
  try {
    await redis.set(shortCode, url.originalUrl, "EX", 60 * 60); // 1 hour TTL
    console.log(`[REDIS SET] ShortCode: ${shortCode} -> ${url.originalUrl}`);
  } catch (err) {
    console.error("[REDIS SET ERROR]", err);
  }

  // 4️⃣ Redirect
  redirect(url.originalUrl);
};

export default RedirectPage;
