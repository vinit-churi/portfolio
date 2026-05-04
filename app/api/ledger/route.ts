import { db } from "@/lib/db";
import { activityLedger } from "@/lib/schema";
import { asc } from "drizzle-orm";
import { isAuthenticated, unauthorizedResponse } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET() {
  const entries = await db
    .select()
    .from(activityLedger)
    .orderBy(asc(activityLedger.sortOrder));
  return Response.json(entries);
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return unauthorizedResponse();

  const body = await request.json();
  const [entry] = await db.insert(activityLedger).values(body).returning();
  revalidatePath("/");
  return Response.json(entry, { status: 201 });
}
