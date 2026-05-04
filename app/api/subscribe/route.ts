import { z } from "zod";
import { db } from "@/lib/db";
import { subscribers } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { randomToken } from "@/lib/tokens";
import { sendEmail, emailEnabled } from "@/lib/email";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

const Schema = z.object({
  email: z.email().max(254),
});

export async function POST(req: Request) {
  let payload: { email: string };
  try {
    const data = await req.json();
    payload = Schema.parse(data);
  } catch {
    return Response.json({ error: "Invalid email" }, { status: 400 });
  }

  const email = payload.email.toLowerCase().trim();
  const token = randomToken(24);

  const [existing] = await db.select().from(subscribers).where(eq(subscribers.email, email)).limit(1);

  if (existing?.confirmedAt && !existing.unsubscribedAt) {
    return Response.json({ ok: true, alreadyConfirmed: true });
  }

  if (existing) {
    await db
      .update(subscribers)
      .set({ confirmToken: token, unsubscribedAt: null })
      .where(eq(subscribers.id, existing.id));
  } else {
    await db.insert(subscribers).values({ email, confirmToken: token });
  }

  const confirmUrl = absoluteUrl(`/api/subscribe/confirm/${token}`);
  const unsubUrl = absoluteUrl(`/api/subscribe/unsubscribe/${token}`);

  if (emailEnabled()) {
    await sendEmail({
      to: email,
      subject: `Confirm your subscription to ${SITE_NAME}`,
      html: `
        <p>Hi,</p>
        <p>Click the link below to confirm your subscription:</p>
        <p><a href="${confirmUrl}">Confirm subscription</a></p>
        <p>If you didn't sign up, you can safely ignore this email or
        <a href="${unsubUrl}">unsubscribe</a> with one click.</p>
        <p>— ${SITE_NAME}</p>
      `,
      text: `Confirm subscription: ${confirmUrl}\nUnsubscribe: ${unsubUrl}`,
    });
  }

  return Response.json({ ok: true, sent: emailEnabled() });
}
