import prisma from "@/lib/db";
import redis from "@/lib/redis";
import { redirect, notFound } from "next/navigation";

interface RedirectPageProps {
  params: { shortCode: string };
}

const RedirectPage = async ({ params }: RedirectPageProps) => {
  const { shortCode } = await params;

  let cachedUrl: string | null = null;

  // 1️⃣ Try fetching from Redis
  try {
    cachedUrl = await redis.get(shortCode);
    if (cachedUrl) {
      console.log(`[REDIS HIT] ShortCode: ${shortCode} -> ${cachedUrl}`);

      // Increment visits in DB (keep source of truth consistent)
      await prisma.url.update({
        where: { shortCode },
        data: { visits: { increment: 1 } },
      }).catch(err => console.error("[DB INCR ERROR]", err));

      redirect(cachedUrl);
    } else {
      console.log(`[REDIS MISS] ShortCode: ${shortCode}`);
    }
  } catch (err) {
    console.error("[REDIS GET ERROR]", err);
  }

  // 2️⃣ Cache miss → Update DB and increment visits
  const url = await prisma.url.update({
    where: { shortCode },
    data: { visits: { increment: 1 } },
  }).catch(() => null);

  if (!url) {
    notFound();
  }

  // 3️⃣ Store in Redis for future requests
  try {
    await redis.set(shortCode, url.originalUrl, "EX", 60); // 0.5 minute TTL
    console.log(`[REDIS SET] ShortCode: ${shortCode} -> ${url.originalUrl}`);
  } catch (err) {
    console.error("[REDIS SET ERROR]", err);
  }

  // 4️⃣ Redirect
  redirect(url.originalUrl);
};

export default RedirectPage;
