import { db } from "@/lib/db";
import { journalArticles } from "@/lib/schema";
import { asc } from "drizzle-orm";
import { isAuthenticated, unauthorizedResponse } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET() {
  const articles = await db
    .select()
    .from(journalArticles)
    .orderBy(asc(journalArticles.sortOrder));
  return Response.json(articles);
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return unauthorizedResponse();

  const body = await request.json();
  const [article] = await db.insert(journalArticles).values(body).returning();
  revalidatePath("/");
  return Response.json(article, { status: 201 });
}
