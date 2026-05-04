import { db } from "@/lib/db";
import { heroConfig } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { isAuthenticated, unauthorizedResponse } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET() {
  const [hero] = await db.select().from(heroConfig).where(eq(heroConfig.id, 1));
  return Response.json(hero ?? null);
}

export async function PATCH(request: Request) {
  if (!(await isAuthenticated())) return unauthorizedResponse();

  const body = await request.json();
  await db.update(heroConfig).set(body).where(eq(heroConfig.id, 1));
  const [updated] = await db.select().from(heroConfig).where(eq(heroConfig.id, 1));
  revalidatePath("/");
  return Response.json(updated);
}
