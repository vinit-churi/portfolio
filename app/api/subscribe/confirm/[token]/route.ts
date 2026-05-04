import { db } from "@/lib/db";
import { subscribers } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

type Params = Promise<{ token: string }>;

export async function GET(_: Request, { params }: { params: Params }) {
  const { token } = await params;
  const [row] = await db
    .select()
    .from(subscribers)
    .where(eq(subscribers.confirmToken, token))
    .limit(1);

  if (!row) {
    redirect("/subscribe?status=invalid");
  }

  await db
    .update(subscribers)
    .set({
      confirmedAt: new Date(),
      confirmToken: null,
      unsubscribedAt: null,
    })
    .where(eq(subscribers.id, row.id));

  redirect("/subscribe?status=confirmed");
}
