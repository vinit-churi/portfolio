import { db } from "@/lib/db";
import { expertiseItems } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { isAuthenticated, unauthorizedResponse } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) return unauthorizedResponse();

  const { id } = await params;
  const body = await request.json();
  await db.update(expertiseItems).set(body).where(eq(expertiseItems.id, Number(id)));
  const [updated] = await db.select().from(expertiseItems).where(eq(expertiseItems.id, Number(id)));
  revalidatePath("/");
  return Response.json(updated);
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) return unauthorizedResponse();

  const { id } = await params;
  await db.delete(expertiseItems).where(eq(expertiseItems.id, Number(id)));
  revalidatePath("/");
  return Response.json({ ok: true });
}
