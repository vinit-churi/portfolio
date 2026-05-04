import { db } from "@/lib/db";
import { activityStats } from "@/lib/schema";
import { asc } from "drizzle-orm";
import { isAuthenticated, unauthorizedResponse } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET() {
  const stats = await db
    .select()
    .from(activityStats)
    .orderBy(asc(activityStats.sortOrder));
  return Response.json(stats);
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return unauthorizedResponse();

  const body = await request.json();
  const [stat] = await db.insert(activityStats).values(body).returning();
  revalidatePath("/");
  return Response.json(stat, { status: 201 });
}
