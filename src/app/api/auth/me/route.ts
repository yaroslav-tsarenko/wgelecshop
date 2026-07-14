import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getSessionUser();
    return NextResponse.json(
      { user: user || null },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (error) {
    console.error("auth/me:", error);
    return NextResponse.json(
      { user: null },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  }
}
