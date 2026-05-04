import { db } from "@/lib/db";
import { research } from "@/lib/schema";
import { asc } from "drizzle-orm";
import { isAuthenticated, unauthorizedResponse } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET() {
  const all = await db
    .select()
    .from(research)
    .orderBy(asc(research.sortOrder));
  return Response.json(all);
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return unauthorizedResponse();

  const body = await request.json();
  const [entry] = await db.insert(research).values(body).returning();
  revalidatePath("/");
  return Response.json(entry, { status: 201 });
}
