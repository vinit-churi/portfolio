import { db } from "@/lib/db";
import { workRoles } from "@/lib/schema";
import { asc } from "drizzle-orm";
import { isAuthenticated, unauthorizedResponse } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET() {
  const roles = await db
    .select()
    .from(workRoles)
    .orderBy(asc(workRoles.sortOrder));
  return Response.json(roles);
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return unauthorizedResponse();

  const body = await request.json();
  const [role] = await db.insert(workRoles).values(body).returning();
  revalidatePath("/");
  return Response.json(role, { status: 201 });
}
