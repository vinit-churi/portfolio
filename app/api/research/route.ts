import { db } from "@/lib/db";
import { research } from "@/lib/schema";
import { asc, desc } from "drizzle-orm";
import { isAuthenticated, unauthorizedResponse } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { createContent } from "@/lib/content-admin";
import { recordAudit } from "@/lib/audit";

export async function GET() {
  const all = await db
    .select()
    .from(research)
    .orderBy(asc(research.sortOrder), desc(research.createdAt));
  return Response.json(all);
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return unauthorizedResponse();
  try {
    const body = await request.json();
    const entry = await createContent("research", body);
    await recordAudit(request, {
      action: "create",
      entityType: "research",
      entityId: (entry as { id: number }).id,
    });
    revalidatePath("/");
    revalidatePath("/research");
    return Response.json(entry, { status: 201 });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Invalid input" },
      { status: 400 }
    );
  }
}
