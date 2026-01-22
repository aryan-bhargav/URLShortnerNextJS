import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { nanoid } from "nanoid";
import { auth } from "@/middleware/auth";

export const POST = auth(async (req) => {
  try {
    const { originalUrl } = await req.json();
    const userId = req.userId!;

    if (!originalUrl) {
      return NextResponse.json(
        { message: "Original URL is required" },
        { status: 400 }
      );
    }

    const shortCode = nanoid(8);

    const shortenedUrl = await prisma.url.create({
      data: {
        originalUrl,
        shortCode,
        userId, // ✅ REQUIRED FIX
      },
    });

    return NextResponse.json(shortenedUrl, { status: 201 });
  } catch (error) {
    console.error("Shorten error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
});
