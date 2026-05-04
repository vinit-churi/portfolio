import { cookies } from "next/headers";
import { rateLimit, ipFromRequest } from "@/lib/rate-limit";
import { recordAudit } from "@/lib/audit";

const LOGIN_LIMIT = 5;
const WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  const ip = ipFromRequest(request);
  const rl = rateLimit(`auth:${ip}`, LOGIN_LIMIT, WINDOW_MS);
  if (!rl.allowed) {
    return Response.json(
      { error: "Too many attempts. Try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(rl.resetMs / 1000)),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  let password = "";
  try {
    const body = await request.json();
    password = String(body?.password ?? "");
  } catch {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!process.env.ADMIN_SECRET) {
    return Response.json({ error: "Server misconfigured" }, { status: 500 });
  }

  if (password !== process.env.ADMIN_SECRET) {
    await recordAudit(request, {
      action: "login.fail",
      entityType: "auth",
    });
    return Response.json({ error: "Invalid password" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set("admin_token", process.env.ADMIN_SECRET, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  await recordAudit(request, {
    action: "login.ok",
    entityType: "auth",
  });

  return Response.json({ ok: true });
}

export async function DELETE(request: Request) {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
  await recordAudit(request, { action: "logout", entityType: "auth" });
  return Response.json({ ok: true });
}
