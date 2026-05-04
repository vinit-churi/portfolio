import { db } from "@/lib/db";
import { research } from "@/lib/schema";
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
    const updated = await updateContent("research", Number(id), body);
    await recordAudit(request, {
      action: "update",
      entityType: "research",
      entityId: id,
    });
    revalidatePath("/");
    revalidatePath("/research");
    if (updated && (updated as { slug: string }).slug) {
      revalidatePath(`/research/${(updated as { slug: string }).slug}`);
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
    .select({ slug: research.slug })
    .from(research)
    .where(eq(research.id, Number(id)));
  await deleteContent("research", Number(id));
  await recordAudit(request, {
    action: "delete",
    entityType: "research",
    entityId: id,
  });
  revalidatePath("/");
  revalidatePath("/research");
  if (row?.slug) revalidatePath(`/research/${row.slug}`);
  return Response.json({ ok: true });
}
