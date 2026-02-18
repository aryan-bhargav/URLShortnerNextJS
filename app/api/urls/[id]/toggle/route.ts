import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import redis from "@/lib/redis";
import { auth } from "@/middleware/auth";

export const PATCH = auth(async (req, { params }) => {
    console.log("reached")

    const userId = req.userId!;
    const { id } = await params;
    const body = await req.json();

    const { isActive } = body;

    const url = await prisma.url.findUnique({
        where: { id },
    });

    if (!url || url.userId !== userId) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 403 }
        );
    }

    const updated = await prisma.url.update({
        where: { id },
        data: { isActive },
    });

    await redis.del(`url:${url.shortCode}`);

    return NextResponse.json(updated);
});