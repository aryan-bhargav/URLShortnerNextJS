//GET /api/analytics

import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/middleware/auth";

export const GET = auth(async (req) => {
  const userId = req.userId!;

  // Total links + clicks
  const [totalLinks, totalClicks] = await Promise.all([
    prisma.url.count({
      where: { userId },
    }),
    prisma.url.aggregate({
      where: { userId },
      _sum: { visits: true },
    }),
  ]);

  // Clicks per day (last 7 days)
  const clicksByDay = await prisma.clickEvent.groupBy({
    by: ["createdAt"],
    where: {
      url: { userId },
      createdAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    },
    _count: true,
  });

  return NextResponse.json({
    totalLinks,
    totalClicks: totalClicks._sum.visits ?? 0,
    clicksByDay,
  });
});
