import { db } from "@/lib/db";
import { projects } from "@/lib/schema";
import { asc, desc } from "drizzle-orm";
import { isAuthenticated, unauthorizedResponse } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { createContent } from "@/lib/content-admin";
import { recordAudit } from "@/lib/audit";

export async function GET() {
  const all = await db
    .select()
    .from(projects)
    .orderBy(asc(projects.sortOrder), desc(projects.createdAt));
  return Response.json(all);
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return unauthorizedResponse();
  try {
    const body = await request.json();
    const project = await createContent("projects", body);
    await recordAudit(request, {
      action: "create",
      entityType: "projects",
      entityId: (project as { id: number }).id,
    });
    revalidatePath("/");
    revalidatePath("/projects");
    return Response.json(project, { status: 201 });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Invalid input" },
      { status: 400 }
    );
  }
}
