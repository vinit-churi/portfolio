import { db } from "./db";
import { auditLog } from "./schema";
import { ipFromRequest } from "./rate-limit";

export async function recordAudit(
  req: Request,
  opts: {
    action: string;
    entityType: string;
    entityId?: string | number | null;
    payload?: unknown;
  }
) {
  try {
    await db.insert(auditLog).values({
      action: opts.action,
      entityType: opts.entityType,
      entityId: opts.entityId == null ? null : String(opts.entityId),
      payload: opts.payload ? JSON.stringify(opts.payload) : null,
      ip: ipFromRequest(req),
      userAgent: req.headers.get("user-agent") ?? null,
    });
  } catch (err) {
    console.error("[audit] failed", err);
  }
}
