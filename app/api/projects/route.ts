import { db } from "@/lib/db";
import { projects } from "@/lib/schema";
import { asc } from "drizzle-orm";
import { isAuthenticated, unauthorizedResponse } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET() {
  const all = await db
    .select()
    .from(projects)
    .orderBy(asc(projects.sortOrder));
  return Response.json(all);
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return unauthorizedResponse();

  const body = await request.json();
  const [project] = await db.insert(projects).values(body).returning();
  revalidatePath("/");
  return Response.json(project, { status: 201 });
}
