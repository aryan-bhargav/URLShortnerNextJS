import prisma from "@/lib/db";
import redis from "@/lib/redis";
import { redirect, notFound } from "next/navigation";

interface RedirectPageProps {
  params: { shortCode: string };
}

const RedirectPage = async ({ params }: RedirectPageProps) => {
  const { shortCode } = params;

  // 1️⃣ Try fetching URL metadata from Redis
  let cachedUrl: string | null = null;
  try {
    cachedUrl = await redis.get(shortCode);
  } catch (err) {
    console.error("[REDIS GET ERROR]", err);
  }

  // 2️⃣ If cached, increment visits counter and redirect
  if (cachedUrl) {
    try {
      await redis.incr(`visits:${shortCode}`);
    } catch (err) {
      console.error("[REDIS INCR ERROR]", err);
    }

    const urlData = JSON.parse(cachedUrl);
    redirect(urlData.originalUrl);
  }

  // 3️⃣ Cache miss → fetch from DB
  const url = await prisma.url.findUnique({ where: { shortCode } });
  if (!url) notFound();

  // 4️⃣ Increment visits counter in Redis
  try {
    await redis.incr(`visits:${shortCode}`);
  } catch (err) {
    console.error("[REDIS INCR ERROR]", err);
  }

  // 5️⃣ Cache URL metadata for next time
  try {
    await redis.set(
      shortCode,
      JSON.stringify({
        id: url.id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        createdAt: url.createdAt,
      }), "EX" , 60*60 // 1 hour TTL
    );
  } catch (err) {
    console.error("[REDIS SET ERROR]", err);
  }

  redirect(url.originalUrl);
};

export default RedirectPage;
