import { NextResponse } from "next/server";
import { generateShortCodes } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    const result = await generateShortCodes(url);

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: 400 }
    );
  }
}
