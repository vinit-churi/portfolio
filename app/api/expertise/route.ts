import { db } from "@/lib/db";
import { expertiseItems } from "@/lib/schema";
import { asc } from "drizzle-orm";
import { isAuthenticated, unauthorizedResponse } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET() {
  const items = await db
    .select()
    .from(expertiseItems)
    .orderBy(asc(expertiseItems.sortOrder));
  return Response.json(items);
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return unauthorizedResponse();

  const body = await request.json();
  const [item] = await db.insert(expertiseItems).values(body).returning();
  revalidatePath("/");
  return Response.json(item, { status: 201 });
}
