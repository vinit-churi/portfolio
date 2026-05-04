import { NextRequest } from "next/server";
import { searchAll } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  if (q.trim().length < 2) {
    return Response.json({ results: [] });
  }
  const results = await searchAll(q, 30);
  return Response.json({ results });
}
