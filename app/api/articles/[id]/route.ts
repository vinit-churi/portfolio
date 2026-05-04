import { db } from "@/lib/db";
import { journalArticles } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { isAuthenticated, unauthorizedResponse } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { deleteContent, updateContent } from "@/lib/content-admin";
import { recordAudit } from "@/lib/audit";

type Params = Promise<{ id: string }>;

export async function PATCH(request: Request, { params }: { params: Params }) {
  if (!(await isAuthenticated())) return unauthorizedResponse();
  const { id } = await params;
  try {
    const body = await request.json();
    const updated = await updateContent("journal", Number(id), body);
    await recordAudit(request, {
      action: "update",
      entityType: "journal",
      entityId: id,
    });
    revalidatePath("/");
    revalidatePath("/journal");
    if (updated && (updated as { slug: string }).slug) {
      revalidatePath(`/journal/${(updated as { slug: string }).slug}`);
    }
    return Response.json(updated);
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Invalid input" },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Params }) {
  if (!(await isAuthenticated())) return unauthorizedResponse();
  const { id } = await params;
  const [row] = await db
    .select({ slug: journalArticles.slug })
    .from(journalArticles)
    .where(eq(journalArticles.id, Number(id)));
  await deleteContent("journal", Number(id));
  await recordAudit(request, {
    action: "delete",
    entityType: "journal",
    entityId: id,
  });
  revalidatePath("/");
  revalidatePath("/journal");
  if (row?.slug) revalidatePath(`/journal/${row.slug}`);
  return Response.json({ ok: true });
}
