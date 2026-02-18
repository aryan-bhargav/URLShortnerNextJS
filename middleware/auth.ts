import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

type AuthHandler = (
  req: NextRequest & { userId?: string },
  context: { params: any }
) => Promise<NextResponse>;


export function auth(handler: AuthHandler) {
  return async (
    req: NextRequest,
    context: { params: any }
  ) => {
    try {
      const token = req.cookies.get("token")?.value;

      if (!token) {
        return NextResponse.json(
          { message: "Unauthorized" },
          { status: 401 }
        );
      }

      const decoded = verifyToken(token);

      // Create a new typed request object
      const authReq = Object.assign(req, {
        userId: decoded.userId,
      });

      return handler(authReq, context);
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }
  };
}