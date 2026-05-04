import { db } from "@/lib/db";
import { journalArticles } from "@/lib/schema";
import { asc, desc } from "drizzle-orm";
import { isAuthenticated, unauthorizedResponse } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { createContent } from "@/lib/content-admin";
import { recordAudit } from "@/lib/audit";

export async function GET() {
  const articles = await db
    .select()
    .from(journalArticles)
    .orderBy(asc(journalArticles.sortOrder), desc(journalArticles.createdAt));
  return Response.json(articles);
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return unauthorizedResponse();
  try {
    const body = await request.json();
    const article = await createContent("journal", body);
    await recordAudit(request, {
      action: "create",
      entityType: "journal",
      entityId: (article as { id: number }).id,
    });
    revalidatePath("/");
    revalidatePath("/journal");
    return Response.json(article, { status: 201 });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Invalid input" },
      { status: 400 }
    );
  }
}
