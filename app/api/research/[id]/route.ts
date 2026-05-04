import { db } from "@/lib/db";
import { research } from "@/lib/schema";
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
  await db.update(research).set(body).where(eq(research.id, Number(id)));
  const [updated] = await db.select().from(research).where(eq(research.id, Number(id)));
  revalidatePath("/");
  return Response.json(updated);
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) return unauthorizedResponse();

  const { id } = await params;
  await db.delete(research).where(eq(research.id, Number(id)));
  revalidatePath("/");
  return Response.json({ ok: true });
}
