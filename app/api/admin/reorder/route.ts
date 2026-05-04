import { isAuthenticated, unauthorizedResponse } from "@/lib/auth";
import { reorderContent } from "@/lib/content-admin";
import { recordAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const Schema = z.object({
  kind: z.enum(["journal", "research", "projects"]),
  order: z.array(z.object({ id: z.number().int(), sortOrder: z.number().int() })).max(500),
});

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return unauthorizedResponse();
  try {
    const body = await request.json();
    const { kind, order } = Schema.parse(body);
    await reorderContent(kind, order);
    await recordAudit(request, {
      action: "reorder",
      entityType: kind,
      payload: { count: order.length },
    });
    revalidatePath("/");
    revalidatePath(`/${kind}`);
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Invalid input" },
      { status: 400 }
    );
  }
}
